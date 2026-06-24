const mongoose = require('mongoose')

describe('User Model', () => {
  let User

  beforeAll(() => {
    User = require('../User')
  })

  it('should create a valid user', () => {
    const user = new User({
      name: 'Test Admin',
      email: 'admin@test.com',
      password: 'securepass123',
    })

    expect(user.name).toBe('Test Admin')
    expect(user.email).toBe('admin@test.com')
    expect(user.role).toBe('editor')
    expect(user.isActive).toBe(true)
    expect(user.theme).toBe('system')
  })

  it('should strip sensitive fields from JSON output', () => {
    const user = new User({
      name: 'Test',
      email: 'test@test.com',
      password: 'password123',
      refreshTokens: [{ token: 'abc' }],
      failedLoginAttempts: 3,
      lockedUntil: new Date(),
      twoFactorSecret: 'SECRET123',
      googleId: 'google-123',
    })

    const json = user.toJSON()

    expect(json.password).toBeUndefined()
    expect(json.refreshTokens).toBeUndefined()
    expect(json.failedLoginAttempts).toBeUndefined()
    expect(json.lockedUntil).toBeUndefined()
    expect(json.twoFactorSecret).toBeUndefined()
    expect(json.googleId).toBeUndefined()
    expect(json.name).toBe('Test')
    expect(json.email).toBe('test@test.com')
  })

  it('should enforce maxlength on name', () => {
    const user = new User({
      name: 'a'.repeat(101),
      email: 'test@test.com',
      password: 'password123',
    })

    const validationError = user.validateSync()
    expect(validationError).toBeDefined()
    expect(validationError.errors.name).toBeDefined()
  })

  it('should require name field', () => {
    const user = new User({
      email: 'test@test.com',
      password: 'password123',
    })

    const validationError = user.validateSync()
    expect(validationError).toBeDefined()
    expect(validationError.errors.name).toBeDefined()
  })

  it('should require email field', () => {
    const user = new User({
      name: 'Test',
      password: 'password123',
    })

    const validationError = user.validateSync()
    expect(validationError).toBeDefined()
    expect(validationError.errors.email).toBeDefined()
  })

  it('should enforce minlength on password', () => {
    const user = new User({
      name: 'Test',
      email: 'test@test.com',
      password: 'short',
    })

    const validationError = user.validateSync()
    expect(validationError).toBeDefined()
    expect(validationError.errors.password).toBeDefined()
  })

  it('should default role to editor', () => {
    const user = new User({
      name: 'Test',
      email: 'test@test.com',
      password: 'password123',
    })

    expect(user.role).toBe('editor')
  })

  it('should accept valid roles', () => {
    const user = new User({
      name: 'Test',
      email: 'test@test.com',
      password: 'password123',
      role: 'super_admin',
    })

    expect(user.role).toBe('super_admin')
  })

  it('should default provider to local', () => {
    const user = new User({
      name: 'Test',
      email: 'test@test.com',
      password: 'password123',
    })

    expect(user.provider).toBe('local')
  })
})
