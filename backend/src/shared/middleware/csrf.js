const crypto = require('crypto')

const CSRF_HEADER_NAME = 'x-csrf-token'
const CSRF_MAX_AGE_MS = 60 * 60 * 1000

const CSRF_SKIP_PATHS = [
  '/api/auth/login',
  '/api/auth/verify-2fa',
  '/api/auth/google',
  '/api/auth/refresh',
]

function getSecret() {
  const secret = process.env.CSRF_SECRET || process.env.JWT_SECRET
  if (!secret) throw new Error('CSRF_SECRET or JWT_SECRET must be set')
  return secret
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
  if (CSRF_SKIP_PATHS.includes(req.path)) {
    return next()
  }

  let secret
  try {
    secret = getSecret()
  } catch (err) {
    console.error('[csrf]', err.message)
    return res.status(500).json({ success: false, message: 'Server configuration error' })
  }

  const isUnsafeMethod = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)

  if (!isUnsafeMethod) {
    const token = generateToken(secret)
    const signature = sign(token, secret)
    const payload = `${token}.${signature}.${Date.now()}`

    res.setHeader(CSRF_HEADER_NAME, payload)

    return next()
  }

  const headerToken = req.headers[CSRF_HEADER_NAME]

  if (!headerToken) {
    return res.status(403).json({ success: false, message: 'CSRF token missing' })
  }

  const parts = headerToken.split('.')
  if (parts.length !== 3) {
    return res.status(403).json({ success: false, message: 'CSRF token invalid' })
  }

  const [token, signature, timestamp] = parts
  const age = Date.now() - parseInt(timestamp, 10)
  if (isNaN(age) || age > CSRF_MAX_AGE_MS) {
    return res.status(403).json({ success: false, message: 'CSRF token expired' })
  }

  if (!verify(token, secret, signature)) {
    return res.status(403).json({ success: false, message: 'CSRF token signature invalid' })
  }

  next()
}

module.exports = { csrfProtection }
