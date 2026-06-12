import api from './api'

export async function listNotifications(params) {
  const { data } = await api.get('/notifications', { params })
  return data
}

export async function getUnreadCount() {
  const { data } = await api.get('/notifications/unread-count')
  return data
}

export async function markRead(id) {
  const { data } = await api.patch(`/notifications/${id}/read`)
  return data
}

export async function markAllRead() {
  const { data } = await api.post('/notifications/mark-all-read')
  return data
}

export async function deleteNotification(id) {
  const { data } = await api.delete(`/notifications/${id}`)
  return data
}
