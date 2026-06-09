import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

let isRefreshing = false
let failedQueue = []

function processQueue(error, token = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (error.response?.data?.code === 'TOKEN_EXPIRED') {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          }).then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return api(originalRequest)
          })
        }

        originalRequest._retry = true
        isRefreshing = true

        const refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          localStorage.removeItem('refreshToken')
          window.location.href = '/#/login'
          return Promise.reject(error)
        }

        try {
          const { data } = await axios.post(
            `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/refresh`,
            { refreshToken },
          )

          localStorage.setItem('token', data.token)
          if (data.refreshToken) {
            localStorage.setItem('refreshToken', data.refreshToken)
          }

          processQueue(null, data.token)

          originalRequest.headers.Authorization = `Bearer ${data.token}`
          return api(originalRequest)
        } catch (refreshError) {
          processQueue(refreshError, null)
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          localStorage.removeItem('refreshToken')
          window.location.href = '/#/login'
          return Promise.reject(refreshError)
        } finally {
          isRefreshing = false
        }
      }

      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('refreshToken')
      window.location.href = '/#/login'
    }
    return Promise.reject(error)
  },
)

export default api

export const endpoints = {
  projects: '/projects',
  messages: '/messages',
  analytics: '/analytics',
  auth: '/auth',
}

export async function logPortfolioVisit(viewerName = 'Anonymous') {
  try {
    await api.post('/analytics/log-visit', { viewerName })
  } catch (error) {
    console.warn('[tracking] Failed to log visit:', error.message)
  }
}
