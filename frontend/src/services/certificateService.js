import api from './api'

export async function getCertificates(params = {}) {
  const query = new URLSearchParams()
  if (params.page) query.set('page', params.page)
  if (params.limit) query.set('limit', params.limit)
  if (params.search) query.set('search', params.search)
  if (params.featured) query.set('featured', params.featured)
  if (params.status) query.set('status', params.status)

  const { data } = await api.get(`/certificates?${query.toString()}`)
  return data
}

export async function getCertificate(id) {
  const { data } = await api.get(`/certificates/${id}`)
  return data
}

export async function createCertificate(formData) {
  const { data } = await api.post('/certificates', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function updateCertificate(id, formData) {
  const { data } = await api.put(`/certificates/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function deleteCertificate(id) {
  const { data } = await api.delete(`/certificates/${id}`)
  return data
}
