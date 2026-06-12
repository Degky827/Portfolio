import api from './api'

export async function login(email, password) {
  const { data } = await api.post('/auth/login', { email, password })
  return data
}

export async function verify2FA(email, totpCode, rememberMe) {
  const { data } = await api.post('/auth/verify-2fa', { email, totpCode, rememberMe })
  return data
}

export async function logout(refreshToken) {
  const { data } = await api.post('/auth/logout', { refreshToken })
  return data
}

export async function refreshToken(refreshToken) {
  const { data } = await api.post('/auth/refresh', { refreshToken })
  return data
}

export async function getMe() {
  const { data } = await api.get('/auth/me')
  return data
}

export async function setup2FA() {
  const { data } = await api.post('/auth/setup-2fa')
  return data
}

export async function verify2FASetup(totpCode) {
  const { data } = await api.post('/auth/verify-2fa-setup', { totpCode })
  return data
}

export async function disable2FA() {
  const { data } = await api.post('/auth/disable-2fa')
  return data
}

export async function googleAuth(idToken) {
  const { data } = await api.post('/auth/google', { idToken })
  return data
}
