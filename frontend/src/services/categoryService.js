import api from './api'

export async function getCategories() {
  const { data } = await api.get('/categories')
  return data
}

export async function getCategory(id) {
  const { data } = await api.get(`/categories/${id}`)
  return data
}

export async function createCategory(body) {
  const { data } = await api.post('/categories', body)
  return data
}

export async function updateCategory(id, body) {
  const { data } = await api.put(`/categories/${id}`, body)
  return data
}

export async function deleteCategory(id) {
  const { data } = await api.delete(`/categories/${id}`)
  return data
}

export async function reorderCategories(orderedIds) {
  const { data } = await api.put('/categories/reorder', { orderedIds })
  return data
}
