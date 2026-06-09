import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
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
