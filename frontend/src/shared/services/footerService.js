import api from './api'

export async function getFooterContent() {
  const { data } = await api.get('/footer')
  return data
}

export async function updateFooterContent(formData) {
  const { data } = await api.put('/footer', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}
