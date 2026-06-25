const { Router } = require('express')
const { authenticateToken, authorizeSuperAdmin } = require('../../shared/middleware/auth')
const {
  getSecuritySettings,
  updateSecuritySettings,
  getActiveSessions,
  revokeSession,
  revokeAllSessions,
  getSecurityAudit,
} = require('./security.controller')

const router = Router()

router.get('/settings', authenticateToken, authorizeSuperAdmin, getSecuritySettings)
router.put('/settings', authenticateToken, authorizeSuperAdmin, updateSecuritySettings)
router.get('/sessions', authenticateToken, getActiveSessions)
router.delete('/sessions/:sessionIndex', authenticateToken, revokeSession)
router.delete('/sessions', authenticateToken, revokeAllSessions)
router.get('/audit', authenticateToken, authorizeSuperAdmin, getSecurityAudit)

module.exports = router
