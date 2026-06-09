import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
})

// Global fallback to guarantee all requests send cookies
axios.defaults.withCredentials = true

export default api

export async function logPortfolioVisit(viewerName = 'Anonymous') {
  try {
    await api.post('/analytics/log-visit', { viewerName })
  } catch (error) {
    console.warn('[tracking] Failed to log visit:', error.message)
  }
}
