import axios from 'axios'

const isProduction = import.meta.env.PROD || window.location.hostname !== 'localhost'

const api = axios.create({
  baseURL: isProduction
    ? 'https://portfolio-backend-lgvk.onrender.com/api'
    : import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
})

axios.defaults.withCredentials = true

export default api

export async function logPortfolioVisit({ viewerName = 'Anonymous', page = '/', referrer = '', visitorId = '' } = {}) {
  try {
    await api.post('/analytics/log-visit', { viewerName, page, referrer, visitorId })
  } catch (error) {
    console.warn('[tracking] Failed to log visit:', error.message)
  }
}
