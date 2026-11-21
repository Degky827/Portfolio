const mongoose = require('mongoose')
const Message = require('../Message')

describe('Message Model', () => {
  it('should create a valid contact message', () => {
    const msg = new Message({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Hello there!',
    })

    expect(msg.name).toBe('John Doe')
    expect(msg.email).toBe('john@example.com')
    expect(msg.message).toBe('Hello there!')
    expect(msg.read).toBe(false)
    expect(msg.isRead).toBe(false)
  })

  it('should trim whitespace from fields', () => {
    const msg = new Message({
      name: '  John Doe  ',
      email: '  john@example.com  ',
      message: '  Hello!  ',
    })

    expect(msg.name).toBe('John Doe')
    expect(msg.email).toBe('john@example.com')
    expect(msg.message).toBe('Hello!')
  })

  it('should enforce maxlength on name', () => {
    const msg = new Message({
      name: 'a'.repeat(101),
      email: 'test@example.com',
      message: 'test',
    })

    const validationError = msg.validateSync()
    expect(validationError).toBeDefined()
    expect(validationError.errors.name).toBeDefined()
  })

  it('should enforce maxlength on message', () => {
    const msg = new Message({
      name: 'Test',
      email: 'test@example.com',
      message: 'a'.repeat(5001),
    })

    const validationError = msg.validateSync()
    expect(validationError).toBeDefined()
    expect(validationError.errors.message).toBeDefined()
  })

  it('should enforce maxlength on email', () => {
    const msg = new Message({
      name: 'Test',
      email: 'a'.repeat(250) + '@b.com',
      message: 'test',
    })

    const validationError = msg.validateSync()
    expect(validationError).toBeDefined()
    expect(validationError.errors.email).toBeDefined()
  })

  it('should enforce maxlength on phone', () => {
    const msg = new Message({
      name: 'Test',
      email: 'test@example.com',
      phone: '1'.repeat(31),
      message: 'test',
    })

    const validationError = msg.validateSync()
    expect(validationError).toBeDefined()
    expect(validationError.errors.phone).toBeDefined()
  })

  it('should enforce maxlength on subject', () => {
    const msg = new Message({
      name: 'Test',
      email: 'test@example.com',
      subject: 'a'.repeat(201),
      message: 'test',
    })

    const validationError = msg.validateSync()
    expect(validationError).toBeDefined()
    expect(validationError.errors.subject).toBeDefined()
  })

  it('should require name', () => {
    const msg = new Message({
      email: 'test@example.com',
      message: 'test',
    })

    const validationError = msg.validateSync()
    expect(validationError).toBeDefined()
    expect(validationError.errors.name).toBeDefined()
  })

  it('should require email', () => {
    const msg = new Message({
      name: 'Test',
      message: 'test',
    })

    const validationError = msg.validateSync()
    expect(validationError).toBeDefined()
    expect(validationError.errors.email).toBeDefined()
  })

  it('should require message', () => {
    const msg = new Message({
      name: 'Test',
      email: 'test@example.com',
    })

    const validationError = msg.validateSync()
    expect(validationError).toBeDefined()
    expect(validationError.errors.message).toBeDefined()
  })
})
