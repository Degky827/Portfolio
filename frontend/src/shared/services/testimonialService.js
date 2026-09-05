import api from './api'

export async function getTestimonials(params = {}) {
  const query = new URLSearchParams()
  if (params.status) query.set('status', params.status)
  if (params.featured) query.set('featured', params.featured)
  if (params.limit) query.set('limit', params.limit)
  if (params.skip) query.set('skip', params.skip)

  const { data } = await api.get(`/testimonials?${query.toString()}`)
  return data
}

export async function getTestimonial(id) {
  const { data } = await api.get(`/testimonials/${id}`)
  return data
}

export async function createTestimonial(body) {
  const { data } = await api.post('/testimonials', body)
  return data
}

export async function updateTestimonial(id, body) {
  const { data } = await api.put(`/testimonials/${id}`, body)
  return data
}

export async function deleteTestimonial(id) {
  const { data } = await api.delete(`/testimonials/${id}`)
  return data
}

export async function reorderTestimonials(orders) {
  const { data } = await api.put('/testimonials/reorder/all', { orders })
  return data
}
