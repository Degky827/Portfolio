import api from './api'

export async function getHomeContent() {
  const { data } = await api.get('/home-content')
  return data
}

export async function updateHomeContent(body) {
  const { data } = await api.put('/home-content', body)
  return data
}
