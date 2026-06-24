const { csrfProtection } = require('../csrf')

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
  let originalEnv

  beforeEach(() => {
    originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'test'
  })

  afterEach(() => {
    process.env.NODE_ENV = originalEnv
  })

  it('sets CSRF cookie on GET requests', () => {
    const req = createMockReq('GET')
    const res = createMockRes()
    const next = jest.fn()

    csrfProtection(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(res.cookies['_csrf']).toBeDefined()
    const cookieVal = res.cookies['_csrf']
    const parts = cookieVal.split('.')
    expect(parts.length).toBe(3)
  })

  it('allows GET requests without token header', () => {
    const req = createMockReq('GET')
    const res = createMockRes()
    const next = jest.fn()

    csrfProtection(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(res.statusCode).toBeNull()
  })

  it('rejects POST without CSRF cookie', () => {
    const req = createMockReq('POST', {}, { 'x-csrf-token': 'some-token' })
    const res = createMockRes()
    const next = jest.fn()

    csrfProtection(req, res, next)

    expect(next).not.toHaveBeenCalled()
    expect(res.statusCode).toBe(403)
    expect(res.body.message).toContain('missing')
  })

  it('rejects POST without CSRF header', () => {
    const req = createMockReq('POST', { _csrf: 'token.sig.123' }, {})
    const res = createMockRes()
    const next = jest.fn()

    csrfProtection(req, res, next)

    expect(next).not.toHaveBeenCalled()
    expect(res.statusCode).toBe(403)
    expect(res.body.message).toContain('missing')
  })

  it('rejects POST with malformed cookie (not 3 parts)', () => {
    const req = createMockReq('POST', { _csrf: 'invalid' }, { 'x-csrf-token': 'token' })
    const res = createMockRes()
    const next = jest.fn()

    csrfProtection(req, res, next)

    expect(next).not.toHaveBeenCalled()
    expect(res.statusCode).toBe(403)
    expect(res.body.message).toContain('invalid')
  })

  it('rejects POST when header token does not match cookie token', () => {
    const crypto = require('crypto')
    const secret = crypto.randomBytes(32).toString('hex')
    process.env.JWT_SECRET = secret

    const token = crypto.createHmac('sha256', secret).update(crypto.randomBytes(16).toString('hex')).digest('hex')
    const signature = crypto.createHmac('sha256', secret).update(token).digest('hex')
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
    const crypto = require('crypto')
    const secret = crypto.randomBytes(32).toString('hex')
    process.env.JWT_SECRET = secret

    const token = crypto.createHmac('sha256', secret).update(crypto.randomBytes(16).toString('hex')).digest('hex')
    const signature = crypto.createHmac('sha256', secret).update(token).digest('hex')
    const oldTimestamp = (Date.now() - 2 * 60 * 60 * 1000).toString() // 2 hours ago

    const req = createMockReq('POST', { _csrf: `${token}.${signature}.${oldTimestamp}` }, { 'x-csrf-token': token })
    const res = createMockRes()
    const next = jest.fn()

    csrfProtection(req, res, next)

    expect(next).not.toHaveBeenCalled()
    expect(res.statusCode).toBe(403)
    expect(res.body.message).toContain('expired')
  })

  it('returns 500 when neither CSRF_SECRET nor JWT_SECRET is set', () => {
    delete process.env.JWT_SECRET
    delete process.env.CSRF_SECRET

    const crypto = require('crypto')
    const fakeToken = 'a'.repeat(64)
    const fakeSig = 'b'.repeat(64)

    const req = createMockReq('POST', { _csrf: `${fakeToken}.${fakeSig}.${Date.now()}` }, { 'x-csrf-token': fakeToken })
    const res = createMockRes()
    const next = jest.fn()

    csrfProtection(req, res, next)

    expect(next).not.toHaveBeenCalled()
    expect(res.statusCode).toBe(500)
  })
})
