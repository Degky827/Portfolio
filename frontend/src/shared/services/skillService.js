import api from './api'

export async function getSkills(params = {}) {
  const query = new URLSearchParams()
  if (params.page) query.set('page', params.page)
  if (params.limit) query.set('limit', params.limit)
  if (params.search) query.set('search', params.search)
  if (params.category) query.set('category', params.category)
  if (params.featured) query.set('featured', params.featured)
  if (params.status) query.set('status', params.status)

  const { data } = await api.get(`/skills?${query.toString()}`)
  return data
}

export async function getSkill(id) {
  const { data } = await api.get(`/skills/${id}`)
  return data
}

export async function createSkill(body) {
  const { data } = await api.post('/skills', body)
  return data
}

export async function updateSkill(id, body) {
  const { data } = await api.put(`/skills/${id}`, body)
  return data
}

export async function deleteSkill(id) {
  const { data } = await api.delete(`/skills/${id}`)
  return data
}
