import api from './api'

export async function getSiteSettings() {
  const { data } = await api.get('/site-settings')
  return data
}

export async function updateSiteSettings(body) {
  const { data } = await api.put('/site-settings', body)
  return data
}
