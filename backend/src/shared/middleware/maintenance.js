const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const SystemConfig = require('../models/SystemConfig')
const config = require('../../infrastructure/config')

let cachedMaintenance = {
  active: false,
  message: 'Site is under maintenance. Please check back later.',
  lastChecked: 0,
}

const CACHE_TTL_MS = 10 * 1000 // 10 seconds

async function checkMaintenanceStatus() {
  const now = Date.now()
  if (now - cachedMaintenance.lastChecked < CACHE_TTL_MS) {
    return cachedMaintenance
  }

  if (mongoose.connection.readyState !== 1) {
    return cachedMaintenance
  }

  try {
    const sys = await SystemConfig.findOne().select('maintenanceMode maintenanceMessage').lean()
    if (sys) {
      cachedMaintenance = {
        active: Boolean(sys.maintenanceMode),
        message: sys.maintenanceMessage || 'Site is under maintenance. Please check back later.',
        lastChecked: now,
      }
    } else {
      cachedMaintenance.lastChecked = now
    }
  } catch {
    cachedMaintenance.lastChecked = now
  }

  return cachedMaintenance
}

function setMaintenanceCache(active, message) {
  cachedMaintenance = {
    active: Boolean(active),
    message: message || 'Site is under maintenance. Please check back later.',
    lastChecked: Date.now(),
  }
}

// Paths allowed even during maintenance mode
const BYPASS_PREFIXES = [
  '/api/auth',
  '/api/system-config',
  '/api/health',
  '/api/maintenance',
  '/api/docs',
  '/uploads',
]

async function maintenanceMiddleware(req, res, next) {
  // Always allow OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return next()
  }

  // Allow bypass paths (auth, system config, health, maintenance status, docs, uploads)
  const isBypass = BYPASS_PREFIXES.some((prefix) => req.path.startsWith(prefix))
  if (isBypass) {
    return next()
  }

  const { active, message } = await checkMaintenanceStatus()
  if (!active) {
    return next()
  }

  // If caller is authenticated admin or super_admin, permit access
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1]
    try {
      const decoded = jwt.verify(token, config.jwtSecret)
      if (decoded && (decoded.role === 'admin' || decoded.role === 'super_admin')) {
        return next()
      }
    } catch {
      // Invalid or expired token; fall through to 503
    }
  }

  return res.status(503).json({
    success: false,
    maintenance: true,
    message,
  })
}

module.exports = {
  maintenanceMiddleware,
  setMaintenanceCache,
}
