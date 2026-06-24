const mongoose = require('mongoose')
const ContactMessage = require('../ContactMessage')

describe('ContactMessage Model', () => {
  it('should create a valid contact message', () => {
    const msg = new ContactMessage({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Hello there!',
    })

    expect(msg.name).toBe('John Doe')
    expect(msg.email).toBe('john@example.com')
    expect(msg.message).toBe('Hello there!')
    expect(msg.read).toBe(false)
  })

  it('should trim whitespace from fields', () => {
    const msg = new ContactMessage({
      name: '  John Doe  ',
      email: '  john@example.com  ',
      message: '  Hello!  ',
    })

    expect(msg.name).toBe('John Doe')
    expect(msg.email).toBe('john@example.com')
    expect(msg.message).toBe('Hello!')
  })

  it('should enforce maxlength on name', () => {
    const msg = new ContactMessage({
      name: 'a'.repeat(101),
      email: 'test@example.com',
      message: 'test',
    })

    const validationError = msg.validateSync()
    expect(validationError).toBeDefined()
    expect(validationError.errors.name).toBeDefined()
  })

  it('should enforce maxlength on message', () => {
    const msg = new ContactMessage({
      name: 'Test',
      email: 'test@example.com',
      message: 'a'.repeat(5001),
    })

    const validationError = msg.validateSync()
    expect(validationError).toBeDefined()
    expect(validationError.errors.message).toBeDefined()
  })

  it('should require name field', () => {
    const msg = new ContactMessage({
      email: 'test@example.com',
      message: 'test',
    })

    const validationError = msg.validateSync()
    expect(validationError).toBeDefined()
    expect(validationError.errors.name).toBeDefined()
  })

  it('should require email field', () => {
    const msg = new ContactMessage({
      name: 'Test',
      message: 'test',
    })

    const validationError = msg.validateSync()
    expect(validationError).toBeDefined()
    expect(validationError.errors.email).toBeDefined()
  })

  it('should require message field', () => {
    const msg = new ContactMessage({
      name: 'Test',
      email: 'test@example.com',
    })

    const validationError = msg.validateSync()
    expect(validationError).toBeDefined()
    expect(validationError.errors.message).toBeDefined()
  })

  it('should set default values', () => {
    const msg = new ContactMessage({
      name: 'Test',
      email: 'test@example.com',
      message: 'Hello',
    })

    expect(msg.phone).toBe('')
    expect(msg.subject).toBe('')
    expect(msg.read).toBe(false)
  })

  it('should enforce maxlength on phone', () => {
    const msg = new ContactMessage({
      name: 'Test',
      email: 'test@example.com',
      message: 'Hello',
      phone: '1'.repeat(31),
    })

    const validationError = msg.validateSync()
    expect(validationError).toBeDefined()
    expect(validationError.errors.phone).toBeDefined()
  })
})
