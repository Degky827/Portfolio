const { validationResult } = require('express-validator')

describe('Validation Middleware', () => {
  it('calls next when no validation errors', () => {
    const { handleValidation } = require('../validate')
    const req = {}
    const res = { statusCode: null, body: null }
    res.status = (code) => { res.statusCode = code; return res }
    res.json = (data) => { res.body = data; return res }
    const next = jest.fn()

    handleValidation(req, res, next)

    expect(next).toHaveBeenCalled()
  })

  it('returns 400 with error messages when validation fails', () => {
    jest.resetModules()
    jest.mock('express-validator', () => ({
      validationResult: jest.fn().mockReturnValue({
        isEmpty: () => false,
        array: () => [
          { msg: 'Name is required' },
          { msg: 'Invalid email' },
        ],
      }),
    }))

    const { handleValidation } = require('../validate')
    const req = {}
    const res = { statusCode: null, body: null }
    res.status = (code) => { res.statusCode = code; return res }
    res.json = (data) => { res.body = data; return res }
    const next = jest.fn()

    handleValidation(req, res, next)

    expect(next).not.toHaveBeenCalled()
    expect(res.statusCode).toBe(400)
    expect(res.body.success).toBe(false)
    expect(res.body.message).toContain('Name is required')
    expect(res.body.message).toContain('Invalid email')

    jest.restoreAllMocks()
  })
})
