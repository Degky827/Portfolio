import api from '../../shared/services/api'

export async function sendChatMessage(message, history = []) {
  const { data } = await api.post('/chat', { message, history })
  return data
}
