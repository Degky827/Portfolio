const jwt = require('jsonwebtoken')
const config = require('../config')
const User = require('../models/User')

async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

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

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' })
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not have the required role for this action.',
      })
    }
    next()
  }
}

module.exports = { authenticateToken, authorizeRoles }
