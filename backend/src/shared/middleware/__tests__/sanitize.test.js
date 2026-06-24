const { sanitizeMongo } = require('../sanitize')

function createMockReq(body = {}, query = {}, params = {}) {
  return { body, query, params }
}

function createMockRes() {
  return {}
}

describe('Sanitize Middleware', () => {
  it('passes through normal objects unchanged', () => {
    const req = createMockReq({ name: 'test', count: 5 }, { page: '1' }, { id: '123' })
    const res = createMockRes()
    const next = jest.fn()

    sanitizeMongo(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(req.body.name).toBe('test')
    expect(req.body.count).toBe(5)
    expect(req.query.page).toBe('1')
    expect(req.params.id).toBe('123')
  })

  it('strips $where operator from body', () => {
    const req = createMockReq({ $where: 'function() { return true; }' })
    const res = createMockRes()
    const next = jest.fn()

    sanitizeMongo(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(req.body.$where).toBeUndefined()
  })

  it('strips $gt operator from query', () => {
    const req = createMockReq({}, { age: { $gt: 0 } })
    const res = createMockRes()
    const next = jest.fn()

    sanitizeMongo(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(req.query.age.$gt).toBeUndefined()
  })

  it('strips $ne operator from params', () => {
    const req = createMockReq({}, {}, { id: { $ne: null } })
    const res = createMockRes()
    const next = jest.fn()

    sanitizeMongo(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(req.params.id.$ne).toBeUndefined()
  })

  it('handles null body gracefully', () => {
    const req = { body: null, query: {}, params: {} }
    const res = createMockRes()
    const next = jest.fn()

    sanitizeMongo(req, res, next)

    expect(next).toHaveBeenCalled()
  })

  it('handles undefined fields gracefully', () => {
    const req = { body: undefined, query: undefined, params: undefined }
    const res = createMockRes()
    const next = jest.fn()

    sanitizeMongo(req, res, next)

    expect(next).toHaveBeenCalled()
  })
})
