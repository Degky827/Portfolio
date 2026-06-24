const crypto = require('crypto')

const CSRF_COOKIE_NAME = '_csrf'
const CSRF_HEADER_NAME = 'x-csrf-token'
const CSRF_SECRET_LENGTH = 32
const CSRF_TOKEN_LENGTH = 64
const CSRF_MAX_AGE_MS = 60 * 60 * 1000

function generateSecret() {
  return crypto.randomBytes(CSRF_SECRET_LENGTH).toString('hex')
}

function generateToken(secret) {
  return crypto.createHmac('sha256', secret).update(crypto.randomBytes(16).toString('hex')).digest('hex')
}

function sign(token, secret) {
  return crypto.createHmac('sha256', secret).update(token).digest('hex')
}

function verify(token, secret, signature) {
  const expected = sign(token, secret)
  try {
    return crypto.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(signature, 'hex'))
  } catch {
    return false
  }
}

function csrfProtection(req, res, next) {
  const isUnsafeMethod = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)

  if (!isUnsafeMethod) {
    const secret = generateSecret()
    const token = generateToken(secret)
    const signature = sign(token, secret)

    res.cookie(CSRF_COOKIE_NAME, `${token}.${signature}.${Date.now()}`, {
      httpOnly: false,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: CSRF_MAX_AGE_MS,
    })

    return next()
  }

  const cookieValue = req.cookies[CSRF_COOKIE_NAME]
  const headerToken = req.headers[CSRF_HEADER_NAME]

  if (!cookieValue || !headerToken) {
    return res.status(403).json({ success: false, message: 'CSRF token missing' })
  }

  const parts = cookieValue.split('.')
  if (parts.length !== 3) {
    return res.status(403).json({ success: false, message: 'CSRF token invalid' })
  }

  const [token, signature, timestamp] = parts
  const age = Date.now() - parseInt(timestamp, 10)
  if (isNaN(age) || age > CSRF_MAX_AGE_MS) {
    return res.status(403).json({ success: false, message: 'CSRF token expired' })
  }

  if (headerToken !== token) {
    return res.status(403).json({ success: false, message: 'CSRF token mismatch' })
  }

  const secret = process.env.CSRF_SECRET || process.env.JWT_SECRET || 'csrf-fallback-secret'
  if (!verify(token, secret, signature)) {
    return res.status(403).json({ success: false, message: 'CSRF token signature invalid' })
  }

  next()
}

module.exports = { csrfProtection }
