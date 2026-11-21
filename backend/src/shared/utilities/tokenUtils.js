const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const config = require('../../infrastructure/config')

function hashToken(token) {
  if (!token) return ''
  return crypto.createHash('sha256').update(String(token)).digest('hex')
}

function generateAccessToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    config.jwtSecret,
    { expiresIn: '24h' },
  )
}

function generateRefreshToken(user) {
  return jwt.sign(
    { id: user._id, type: 'refresh' },
    config.jwtSecret,
    { expiresIn: '7d' },
  )
}

module.exports = { generateAccessToken, generateRefreshToken, hashToken }
