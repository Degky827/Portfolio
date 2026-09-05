import api from './api'

export async function getCVContent() {
  const { data } = await api.get('/cv')
  return data
}

export async function updateCVContent(body) {
  const { data } = await api.put('/cv', body)
  return data
}
