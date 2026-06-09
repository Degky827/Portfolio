import api from './api'

export async function getHealth() {
  const { data } = await api.get('/maintenance/health')
  return data
}

export async function getStorage() {
  const { data } = await api.get('/maintenance/storage')
  return data
}

export async function getCollections() {
  const { data } = await api.get('/maintenance/collections')
  return data
}

export async function getIndexes() {
  const { data } = await api.get('/maintenance/indexes')
  return data
}

export async function getOrphanFiles() {
  const { data } = await api.get('/maintenance/orphan-files')
  return data
}
