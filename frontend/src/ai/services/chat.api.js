import api from '../../shared/services/api'

export async function sendChatMessage(message) {
  const { data } = await api.post('/chat', { message })
  return data
}
