const jwt = require('jsonwebtoken')
const { maintenanceMiddleware, setMaintenanceCache } = require('../maintenance')

function createMockReq(method = 'GET', path = '/api/projects', headers = {}) {
  return { method, path, headers }
}

function createMockRes() {
  const res = { statusCode: null, body: null }
  res.status = (code) => { res.statusCode = code; return res }
  res.json = (data) => { res.body = data; return res }
  return res
}

describe('Maintenance Middleware', () => {
  const JWT_SECRET = 'test-secret-key-12345678901234567890'

  beforeAll(() => {
    process.env.JWT_SECRET = JWT_SECRET
  })

  afterEach(() => {
    setMaintenanceCache(false, '')
  })

  it('allows requests when maintenance is disabled', async () => {
    setMaintenanceCache(false, '')
    const req = createMockReq('GET', '/api/projects')
    const res = createMockRes()
    const next = jest.fn()

    await maintenanceMiddleware(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(res.statusCode).toBeNull()
  })

  it('allows OPTIONS preflight requests even when maintenance is active', async () => {
    setMaintenanceCache(true, 'Under maintenance')
    const req = createMockReq('OPTIONS', '/api/projects')
    const res = createMockRes()
    const next = jest.fn()

    await maintenanceMiddleware(req, res, next)

    expect(next).toHaveBeenCalled()
  })

  it('allows whitelisted paths during maintenance (e.g. /api/auth, /api/health)', async () => {
    setMaintenanceCache(true, 'Under maintenance')
    const req = createMockReq('POST', '/api/auth/login')
    const res = createMockRes()
    const next = jest.fn()

    await maintenanceMiddleware(req, res, next)

    expect(next).toHaveBeenCalled()
  })

  it('blocks unauthenticated public requests with 503 during maintenance', async () => {
    const customMessage = 'System upgrade in progress'
    setMaintenanceCache(true, customMessage)
    const req = createMockReq('GET', '/api/projects')
    const res = createMockRes()
    const next = jest.fn()

    await maintenanceMiddleware(req, res, next)

    expect(next).not.toHaveBeenCalled()
    expect(res.statusCode).toBe(503)
    expect(res.body).toEqual({
      success: false,
      maintenance: true,
      message: customMessage,
    })
  })

  it('allows admin requests with valid token during maintenance', async () => {
    setMaintenanceCache(true, 'Under maintenance')
    const adminToken = jwt.sign({ userId: '123', role: 'admin' }, JWT_SECRET)
    const req = createMockReq('GET', '/api/projects', {
      authorization: `Bearer ${adminToken}`,
    })
    const res = createMockRes()
    const next = jest.fn()

    await maintenanceMiddleware(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(res.statusCode).toBeNull()
  })

  it('allows super_admin requests during maintenance', async () => {
    setMaintenanceCache(true, 'Under maintenance')
    const superAdminToken = jwt.sign({ userId: '123', role: 'super_admin' }, JWT_SECRET)
    const req = createMockReq('GET', '/api/projects', {
      authorization: `Bearer ${superAdminToken}`,
    })
    const res = createMockRes()
    const next = jest.fn()

    await maintenanceMiddleware(req, res, next)

    expect(next).toHaveBeenCalled()
  })
})
