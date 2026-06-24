const crypto = require('crypto')

function createMockReq(method = 'GET', cookies = {}, headers = {}) {
  return { method, cookies, headers, get: (h) => headers[h.toLowerCase()] || null }
}

function createMockRes() {
  const res = { statusCode: null, body: null, cookies: {} }
  res.status = (code) => { res.statusCode = code; return res }
  res.json = (data) => { res.body = data; return res }
  res.cookie = (name, value, _opts) => { res.cookies[name] = value }
  return res
}

describe('CSRF Middleware', () => {
  const SECRET = crypto.randomBytes(32).toString('hex')

  beforeEach(() => {
    process.env.JWT_SECRET = SECRET
  })

  afterEach(() => {
    delete process.env.JWT_SECRET
    delete process.env.CSRF_SECRET
  })

  it('sets CSRF cookie on GET requests', () => {
    const { csrfProtection } = require('../csrf')
    const req = createMockReq('GET')
    const res = createMockRes()
    const next = jest.fn()

    csrfProtection(req, res, next)

    expect(next).toHaveBeenCalled()
    const cookieVal = res.cookies['_csrf']
    expect(cookieVal).toBeDefined()
    expect(cookieVal.split('.').length).toBe(3)
  })

  it('allows GET requests without token header', () => {
    const { csrfProtection } = require('../csrf')
    const req = createMockReq('GET')
    const res = createMockRes()
    const next = jest.fn()

    csrfProtection(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(res.statusCode).toBeNull()
  })

  it('rejects POST without CSRF cookie', () => {
    const { csrfProtection } = require('../csrf')
    const req = createMockReq('POST', {}, { 'x-csrf-token': 'some-token' })
    const res = createMockRes()
    const next = jest.fn()

    csrfProtection(req, res, next)

    expect(next).not.toHaveBeenCalled()
    expect(res.statusCode).toBe(403)
    expect(res.body.message).toContain('missing')
  })

  it('rejects POST without CSRF header', () => {
    const { csrfProtection } = require('../csrf')
    const req = createMockReq('POST', { _csrf: 'token.sig.123' }, {})
    const res = createMockRes()
    const next = jest.fn()

    csrfProtection(req, res, next)

    expect(next).not.toHaveBeenCalled()
    expect(res.statusCode).toBe(403)
    expect(res.body.message).toContain('missing')
  })

  it('rejects POST with malformed cookie (not 3 parts)', () => {
    const { csrfProtection } = require('../csrf')
    const req = createMockReq('POST', { _csrf: 'invalid' }, { 'x-csrf-token': 'token' })
    const res = createMockRes()
    const next = jest.fn()

    csrfProtection(req, res, next)

    expect(next).not.toHaveBeenCalled()
    expect(res.statusCode).toBe(403)
    expect(res.body.message).toContain('invalid')
  })

  it('accepts valid CSRF token on POST', () => {
    const { csrfProtection } = require('../csrf')

    const token = crypto.createHmac('sha256', SECRET).update(crypto.randomBytes(16).toString('hex')).digest('hex')
    const signature = crypto.createHmac('sha256', SECRET).update(token).digest('hex')
    const timestamp = Date.now().toString()

    const req = createMockReq('POST', { _csrf: `${token}.${signature}.${timestamp}` }, { 'x-csrf-token': token })
    const res = createMockRes()
    const next = jest.fn()

    csrfProtection(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(res.statusCode).toBeNull()
  })

  it('rejects POST with mismatched token', () => {
    const { csrfProtection } = require('../csrf')

    const token = crypto.createHmac('sha256', SECRET).update(crypto.randomBytes(16).toString('hex')).digest('hex')
    const signature = crypto.createHmac('sha256', SECRET).update(token).digest('hex')
    const timestamp = Date.now().toString()

    const req = createMockReq('POST', { _csrf: `${token}.${signature}.${timestamp}` }, { 'x-csrf-token': 'different-token' })
    const res = createMockRes()
    const next = jest.fn()

    csrfProtection(req, res, next)

    expect(next).not.toHaveBeenCalled()
    expect(res.statusCode).toBe(403)
    expect(res.body.message).toContain('mismatch')
  })

  it('rejects POST with expired token', () => {
    const { csrfProtection } = require('../csrf')

    const token = crypto.createHmac('sha256', SECRET).update(crypto.randomBytes(16).toString('hex')).digest('hex')
    const signature = crypto.createHmac('sha256', SECRET).update(token).digest('hex')
    const oldTimestamp = (Date.now() - 2 * 60 * 60 * 1000).toString()

    const req = createMockReq('POST', { _csrf: `${token}.${signature}.${oldTimestamp}` }, { 'x-csrf-token': token })
    const res = createMockRes()
    const next = jest.fn()

    csrfProtection(req, res, next)

    expect(next).not.toHaveBeenCalled()
    expect(res.statusCode).toBe(403)
    expect(res.body.message).toContain('expired')
  })

  it('returns 500 when no secret is configured', () => {
    delete process.env.JWT_SECRET
    delete process.env.CSRF_SECRET

    const { csrfProtection } = require('../csrf')
    const req = createMockReq('POST', { _csrf: 'a.b.123' }, { 'x-csrf-token': 'a' })
    const res = createMockRes()
    const next = jest.fn()

    csrfProtection(req, res, next)

    expect(next).not.toHaveBeenCalled()
    expect(res.statusCode).toBe(500)
  })
})
