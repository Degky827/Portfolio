import api from './api'

export async function getContactContent() {
  const { data } = await api.get('/contact')
  return data
}

export async function updateContactContent(body) {
  const { data } = await api.put('/contact', body)
  return data
}
