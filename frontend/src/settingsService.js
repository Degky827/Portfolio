import api from './services/api'

export async function getSettings() {
  const { data } = await api.get('/settings')
  return data
}

export async function updateSettings(formData) {
  const { data } = await api.put('/settings', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function getGlobalAppearance() {
  const { data } = await api.get('/settings/appearance')
  return data
}

export async function updateGlobalAppearance(body) {
  const { data } = await api.patch('/settings/appearance', body)
  return data
}
