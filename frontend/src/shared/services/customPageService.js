import api from './api'

export async function getCustomPages(params = {}) {
  const query = new URLSearchParams()
  if (params.page) query.set('page', params.page)
  if (params.limit) query.set('limit', params.limit)
  if (params.search) query.set('search', params.search)
  if (params.status) query.set('status', params.status)
  const { data } = await api.get(`/custom-pages?${query.toString()}`)
  return data
}

export async function getCustomPage(id) {
  const { data } = await api.get(`/custom-pages/${id}`)
  return data
}

export async function getCustomPageBySlug(slug) {
  const { data } = await api.get(`/custom-pages/public/${slug}`)
  return data
}

export async function createCustomPage(body) {
  const { data } = await api.post('/custom-pages', body)
  return data
}

export async function updateCustomPage(id, body) {
  const { data } = await api.put(`/custom-pages/${id}`, body)
  return data
}

export async function deleteCustomPage(id) {
  const { data } = await api.delete(`/custom-pages/${id}`)
  return data
}

export async function toggleCustomPageStatus(id) {
  const { data } = await api.patch(`/custom-pages/${id}/status`)
  return data
}
