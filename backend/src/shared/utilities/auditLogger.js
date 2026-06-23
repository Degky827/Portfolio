const AuditLog = require('../models/AuditLog')

async function auditLog({ userId, action, resource, resourceId, details, req, success = true }) {
  try {
    await AuditLog.create({
      user: userId || null,
      action,
      resource: resource || '',
      resourceId: String(resourceId || ''),
      details: details || {},
      ipAddress: req?.ip || req?.headers?.['x-forwarded-for'] || '',
      userAgent: req?.headers?.['user-agent'] || '',
      success,
    })
  } catch (err) {
    console.error('[audit] Failed to create audit log:', err.message)
  }
}

module.exports = { auditLog }
