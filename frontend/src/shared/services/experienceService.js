import api from './api'

export async function getExperiences(params = {}) {
  const query = new URLSearchParams()
  if (params.status) query.set('status', params.status)
  if (params.limit) query.set('limit', params.limit)
  if (params.skip) query.set('skip', params.skip)

  const { data } = await api.get(`/experiences?${query.toString()}`)
  return data
}

export async function getExperience(id) {
  const { data } = await api.get(`/experiences/${id}`)
  return data
}

export async function createExperience(body) {
  const { data } = await api.post('/experiences', body)
  return data
}

export async function updateExperience(id, body) {
  const { data } = await api.put(`/experiences/${id}`, body)
  return data
}

export async function deleteExperience(id) {
  const { data } = await api.delete(`/experiences/${id}`)
  return data
}

export async function reorderExperiences(orders) {
  const { data } = await api.put('/experiences/reorder/all', { orders })
  return data
}
