import api from './api'

export async function getProjects(params = {}) {
  const query = new URLSearchParams()
  if (params.page) query.set('page', params.page)
  if (params.limit) query.set('limit', params.limit)
  if (params.search) query.set('search', params.search)
  if (params.category) query.set('category', params.category)
  if (params.featured) query.set('featured', params.featured)
  if (params.status) query.set('status', params.status)
  if (params.technology) query.set('technology', params.technology)
  if (params.public) query.set('public', 'true')
  if (params.archived) query.set('archived', 'true')

  const { data } = await api.get(`/projects?${query.toString()}`)
  return data
}

export async function getProject(id) {
  const { data } = await api.get(`/projects/${id}`)
  return data
}

export async function getProjectBySlug(slug) {
  const { data } = await api.get(`/projects/slug/${slug}`)
  return data
}

export async function createProject(body) {
  console.log('[projectService] createProject payload:', JSON.stringify(body).slice(0, 1000))
  const { data } = await api.post('/projects', body)
  console.log('[projectService] createProject response:', data)
  return data
}

export async function updateProject(id, body) {
  const { data } = await api.put(`/projects/${id}`, body)
  return data
}

export async function deleteProject(id) {
  const { data } = await api.delete(`/projects/${id}`)
  return data
}

export async function duplicateProject(id) {
  const { data } = await api.post(`/projects/${id}/duplicate`)
  return data
}

export async function toggleFeatured(id) {
  const { data } = await api.patch(`/projects/${id}/featured`)
  return data
}

export async function togglePublish(id) {
  const { data } = await api.patch(`/projects/${id}/publish`)
  return data
}

export async function toggleArchive(id) {
  const { data } = await api.patch(`/projects/${id}/archive`)
  return data
}

export async function reorderProjects(orders) {
  const { data } = await api.put('/projects/reorder', { orders })
  return data
}

export async function updateProjectImages(id, body) {
  const { data } = await api.patch(`/projects/${id}/images`, body)
  return data
}
