import api from './api'

export async function listLogs(params) {
  const { data } = await api.get('/activity-logs', { params })
  return data
}

export async function getLog(id) {
  const { data } = await api.get(`/activity-logs/${id}`)
  return data
}

export async function exportLogs(params) {
  const { data } = await api.get('/activity-logs/export', {
    params,
    responseType: 'blob',
  })
  return data
}

export async function getActions() {
  const { data } = await api.get('/activity-logs/actions')
  return data
}
