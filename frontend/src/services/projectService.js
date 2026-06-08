import api from './api'

export async function getProjects(params = {}) {
  const query = new URLSearchParams()
  if (params.page) query.set('page', params.page)
  if (params.limit) query.set('limit', params.limit)
  if (params.search) query.set('search', params.search)
  if (params.category) query.set('category', params.category)
  if (params.featured) query.set('featured', params.featured)
  if (params.status) query.set('status', params.status)
  if (params.public) query.set('public', 'true')

  const { data } = await api.get(`/projects?${query.toString()}`)
  return data
}

export async function getProject(id) {
  const { data } = await api.get(`/projects/${id}`)
  return data
}

export async function createProject(formData) {
  const { data } = await api.post('/projects', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function updateProject(id, formData) {
  const { data } = await api.put(`/projects/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function deleteProject(id) {
  const { data } = await api.delete(`/projects/${id}`)
  return data
}
