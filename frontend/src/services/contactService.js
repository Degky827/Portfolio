import api from './api'

export async function getContactContent() {
  const { data } = await api.get('/contact')
  return data
}

export async function updateContactContent(body) {
  const { data } = await api.put('/contact', body)
  return data
}

/* ───── Contact Messages (Inbox) ───── */

export async function listMessages(params = {}) {
  const { data } = await api.get('/contact-messages', { params })
  return data
}

export async function getMessage(id) {
  const { data } = await api.get(`/contact-messages/${id}`)
  return data
}

export async function createMessage(body) {
  const { data } = await api.post('/contact-messages', body)
  return data
}

export async function markMessageRead(id) {
  const { data } = await api.patch(`/contact-messages/${id}/read`)
  return data
}

export async function deleteMessage(id) {
  const { data } = await api.delete(`/contact-messages/${id}`)
  return data
}

export async function getUnreadMessageCount() {
  const { data } = await api.get('/contact-messages/unread-count')
  return data
}
