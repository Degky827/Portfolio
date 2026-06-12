const jwt = require('jsonwebtoken')
const config = require('../../infrastructure/config')
const User = require('../models/User')

async function authenticateToken(req, res, next) {
  let token
  if (req.cookies?.token) {
    token = req.cookies.token
  } else if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' })
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret)
    const user = await User.findById(decoded.id).select('+password +failedLoginAttempts +lockedUntil +refreshTokens')
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found.' })
    }
    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account has been disabled.' })
    }
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      return res.status(423).json({ success: false, message: 'Account is temporarily locked. Try again later.' })
    }
    req.user = user
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired.', code: 'TOKEN_EXPIRED' })
    }
    return res.status(403).json({ success: false, message: 'Invalid or expired token.' })
  }
}

function authorizeSuperAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication required.' })
  }
  if (req.user.role !== 'super_admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Only super administrators can perform this action.',
    })
  }
  next()
}

module.exports = { authenticateToken, authorizeSuperAdmin }
