import api from './api'

export async function exportData(params) {
  const { data } = await api.get('/import-export/export', {
    params,
    responseType: 'blob',
  })
  return data
}

export async function previewImport(file, type) {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('type', type)
  const { data } = await api.post('/import-export/preview', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function executeImport(type, items) {
  const { data } = await api.post('/import-export/import', { type, items })
  return data
}
