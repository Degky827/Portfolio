import api from './api'

export async function getUsers(params) {
  const { data } = await api.get('/users', { params })
  return data
}

export async function getUser(id) {
  const { data } = await api.get(`/users/${id}`)
  return data
}

export async function createUser(userData) {
  const { data } = await api.post('/users', userData)
  return data
}

export async function updateUser(id, userData) {
  const { data } = await api.put(`/users/${id}`, userData)
  return data
}

export async function deleteUser(id) {
  const { data } = await api.delete(`/users/${id}`)
  return data
}

export async function updateMe(userData) {
  const { data } = await api.patch('/auth/me', userData)
  return data
}
