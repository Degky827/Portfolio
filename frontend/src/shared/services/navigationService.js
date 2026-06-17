import api from './api'

export async function getNavigation() {
  const { data } = await api.get('/navigation')
  return data
}

export async function createNavigation(body) {
  const { data } = await api.post('/navigation', body)
  return data
}

export async function updateNavigation(id, body) {
  const { data } = await api.put(`/navigation/${id}`, body)
  return data
}

export async function deleteNavigation(id) {
  const { data } = await api.delete(`/navigation/${id}`)
  return data
}

export async function reorderNavigation(items) {
  const { data } = await api.put('/navigation-reorder', { items })
  return data
}

export async function getNavbarSettings() {
  const { data } = await api.get('/navbar-settings')
  return data
}

export async function updateNavbarSettings(body) {
  const { data } = await api.put('/navbar-settings', body)
  return data
}
