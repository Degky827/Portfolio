import api from './api'

export async function getMedia(params = {}) {
  const query = new URLSearchParams()
  if (params.page) query.set('page', params.page)
  if (params.limit) query.set('limit', params.limit)
  if (params.search) query.set('search', params.search)
  if (params.fileType) query.set('fileType', params.fileType)
  if (params.folder) query.set('folder', params.folder)
  const { data } = await api.get(`/media?${query.toString()}`)
  return data
}

export async function getMediaItem(id) {
  const { data } = await api.get(`/media/${id}`)
  return data
}

export async function uploadMedia(formData, onProgress) {
  const { data } = await api.post('/media/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: onProgress,
  })
  return data
}

export async function uploadDocument(formData, onProgress) {
  const { data } = await api.post('/media/upload-document', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: onProgress,
  })
  return data
}

export async function updateMedia(id, body) {
  const { data } = await api.put(`/media/${id}`, body)
  return data
}

export async function deleteMedia(id) {
  const { data } = await api.delete(`/media/${id}`)
  return data
}
