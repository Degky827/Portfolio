const AuditLog = require('../models/AuditLog')

async function auditLog({ user, userId, action, resource, resourceId, details, req, success = true }) {
  try {
    await AuditLog.create({
      user: user?._id || user || userId || null,
      action,
      resource: resource || '',
      resourceId: String(resourceId || ''),
      details: details || {},
      ipAddress: req?.ip || req?.headers?.['x-forwarded-for'] || '',
      userAgent: req?.headers?.['user-agent'] || '',
      success: success !== false,
    })
  } catch (err) {
    console.error('[audit] Failed to create audit log:', err.message)
  }
}

module.exports = { auditLog }
