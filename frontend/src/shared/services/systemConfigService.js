import api from './api'

export async function getSystemConfig() {
  const { data } = await api.get('/system-config')
  return data
}

export async function updateSystemConfig(body) {
  const { data } = await api.put('/system-config', body)
  return data
}

export async function triggerBackup() {
  const { data } = await api.post('/system-config/trigger-backup')
  return data
}

export async function triggerHealthCheck() {
  const { data } = await api.post('/system-config/trigger-health-check')
  return data
}
