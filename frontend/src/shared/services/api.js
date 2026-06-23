import axios from 'axios'

const localHosts = ['localhost', '127.0.0.1', '[::1]']
const isProduction = import.meta.env.PROD || !localHosts.includes(window.location.hostname)

const api = axios.create({
  baseURL: isProduction
    ? 'https://portfolio-backend-lgvk.onrender.com/api'
    : import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // ይህ ከኩኪዎች ጋር ለመስራት ወሳኝ ነው
})

// ለሁሉም የ axios ጥያቄዎች እንዲያገለግል
axios.defaults.withCredentials = true 

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, config, data } = error.response
      if (status === 0 || status >= 500) {
        console.error(`[api] Server error (${status}): ${config?.url}`, data?.message || '')
      }
    } else if (error.code === 'ERR_NETWORK') {
      console.error('[api] Network error: Cannot reach server at', api.defaults.baseURL)
    }
    return Promise.reject(error)
  },
)

export default api

export function getMediaUrl(url) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  const base = api.defaults.baseURL.replace(/\/api$/, '')
  return `${base}${url}`
}

// የተስተካከሉ ተግባራት
export async function logPortfolioVisit({ viewerName = 'Anonymous', page = '/', referrer = '', visitorId = '', src } = {}) {
  try {
    // እዚህ ላይ { withCredentials: true } በማካተት የኩኪ መላክ ጥያቄውን እናረጋግጣለን
    await api.post('/analytics/log-visit', 
      { viewerName, page, referrer, visitorId, src },
      { withCredentials: true } 
    )
  } catch (error) {
    console.warn('[tracking] Failed to log visit:', error.message)
  }
}

export async function logPortfolioEngagement({ action, page, visitorId, referrer, src } = {}) {
  try {
    await api.post('/analytics/log-engagement', 
      { action, page, visitorId, referrer, src },
      { withCredentials: true }
    )
  } catch (error) {
    console.warn('[tracking] Failed to log engagement:', error.message)
  }
}

export async function clearAnalyticsData() {
  try {
    const response = await api.delete('/analytics/clear', { withCredentials: true })
    return response.data
  } catch (error) {
    console.warn('[analytics] Failed to clear analytics:', error.message)
    throw error
  }
}