import api from './api'

export async function getSecuritySettings() {
  const res = await api.get('/security/settings')
  return res.data
}

export async function updateSecuritySettings(settings) {
  const res = await api.put('/security/settings', settings)
  return res.data
}

export async function getActiveSessions() {
  const res = await api.get('/security/sessions')
  return res.data
}

export async function revokeSession(sessionIndex) {
  const res = await api.delete(`/security/sessions/${sessionIndex}`)
  return res.data
}

export async function revokeAllSessions() {
  const res = await api.delete('/security/sessions')
  return res.data
}

export async function getSecurityAudit() {
  const res = await api.get('/security/audit')
  return res.data
}
