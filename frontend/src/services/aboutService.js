import api from './api'

export async function getAboutContent() {
  const { data } = await api.get('/about')
  return data
}

export async function updateAboutContent(formData) {
  const { data } = await api.put('/about', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}
