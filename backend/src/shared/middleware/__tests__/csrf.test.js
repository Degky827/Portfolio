const crypto = require('crypto')

function createMockReq(method = 'GET', headers = {}) {
  return { method, headers, cookies: {}, path: '/api/test' }
}

function createMockRes() {
  const res = { statusCode: null, body: null, headers: {} }
  res.status = (code) => { res.statusCode = code; return res }
  res.json = (data) => { res.body = data; return res }
  res.setHeader = (name, value) => { res.headers[name] = value }
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

  it('sets CSRF token header on GET requests', () => {
    const { csrfProtection } = require('../csrf')
    const req = createMockReq('GET')
    const res = createMockRes()
    const next = jest.fn()

    csrfProtection(req, res, next)

    expect(next).toHaveBeenCalled()
    const csrfHeader = res.headers['x-csrf-token']
    expect(csrfHeader).toBeDefined()
    expect(csrfHeader.split('.').length).toBe(3)
  })

  it('skips CSRF for whitelisted paths', () => {
    const { csrfProtection } = require('../csrf')
    const req = createMockReq('POST', { 'x-csrf-token': 'anything' })
    req.path = '/api/auth/login'
    const res = createMockRes()
    const next = jest.fn()

    csrfProtection(req, res, next)

    expect(next).toHaveBeenCalled()
  })

  it('rejects POST without CSRF header', () => {
    const { csrfProtection } = require('../csrf')
    const req = createMockReq('POST')
    const res = createMockRes()
    const next = jest.fn()

    csrfProtection(req, res, next)

    expect(next).not.toHaveBeenCalled()
    expect(res.statusCode).toBe(403)
    expect(res.body.message).toContain('missing')
  })

  it('rejects POST with malformed header (not 3 parts)', () => {
    const { csrfProtection } = require('../csrf')
    const req = createMockReq('POST', { 'x-csrf-token': 'invalid' })
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
    const payload = `${token}.${signature}.${Date.now()}`

    const req = createMockReq('POST', { 'x-csrf-token': payload })
    const res = createMockRes()
    const next = jest.fn()

    csrfProtection(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(res.statusCode).toBeNull()
  })

  it('rejects POST with invalid signature', () => {
    const { csrfProtection } = require('../csrf')

    const token = crypto.createHmac('sha256', SECRET).update(crypto.randomBytes(16).toString('hex')).digest('hex')
    const badSig = crypto.createHmac('sha256', 'wrong-secret').update(token).digest('hex')
    const payload = `${token}.${badSig}.${Date.now()}`

    const req = createMockReq('POST', { 'x-csrf-token': payload })
    const res = createMockRes()
    const next = jest.fn()

    csrfProtection(req, res, next)

    expect(next).not.toHaveBeenCalled()
    expect(res.statusCode).toBe(403)
    expect(res.body.message).toContain('invalid')
  })

  it('rejects POST with expired token', () => {
    const { csrfProtection } = require('../csrf')

    const token = crypto.createHmac('sha256', SECRET).update(crypto.randomBytes(16).toString('hex')).digest('hex')
    const signature = crypto.createHmac('sha256', SECRET).update(token).digest('hex')
    const oldTimestamp = (Date.now() - 2 * 60 * 60 * 1000).toString()
    const payload = `${token}.${signature}.${oldTimestamp}`

    const req = createMockReq('POST', { 'x-csrf-token': payload })
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
    const req = createMockReq('POST', { 'x-csrf-token': 'a.b.123' })
    const res = createMockRes()
    const next = jest.fn()

    csrfProtection(req, res, next)

    expect(next).not.toHaveBeenCalled()
    expect(res.statusCode).toBe(500)
  })
})
