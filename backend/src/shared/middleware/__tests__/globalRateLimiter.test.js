const { globalLimiter } = require('../globalRateLimiter')

describe('Global Rate Limiter', () => {
  it('exports a function', () => {
    expect(typeof globalLimiter).toBe('function')
  })

  it('returns middleware function', () => {
    const middleware = globalLimiter
    expect(typeof middleware).toBe('function')
    expect(middleware.length).toBe(3)
  })
})
