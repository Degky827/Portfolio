import api from './api'

export async function listBackups() {
  const { data } = await api.get('/backups')
  return data
}

export async function createBackup() {
  const { data } = await api.post('/backups')
  return data
}

export async function getBackup(id) {
  const { data } = await api.get(`/backups/${id}`)
  return data
}

export async function downloadBackup(id) {
  const { data } = await api.get(`/backups/${id}/download`, {
    responseType: 'blob',
  })
  return data
}

export async function deleteBackup(id) {
  const { data } = await api.delete(`/backups/${id}`)
  return data
}

export async function uploadBackup(file) {
  const fd = new FormData()
  fd.append('file', file)
  const { data } = await api.post('/backups/upload', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function restoreBackup(id) {
  const { data } = await api.post(`/backups/${id}/restore`)
  return data
}

export async function triggerBackup() {
  const { data } = await api.post('/system-config/trigger-backup')
  return data
}
