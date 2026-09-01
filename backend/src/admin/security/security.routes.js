const { Router } = require('express')
const { authenticateToken } = require('../../shared/middleware/auth')
const {
  getSecuritySettings,
  updateSecuritySettings,
  getActiveSessions,
  revokeSession,
  revokeAllSessions,
  getSecurityAudit,
} = require('./security.controller')

const router = Router()

router.get('/settings', authenticateToken, getSecuritySettings)
router.put('/settings', authenticateToken, updateSecuritySettings)
router.get('/sessions', authenticateToken, getActiveSessions)
router.delete('/sessions/:sessionIndex', authenticateToken, revokeSession)
router.delete('/sessions', authenticateToken, revokeAllSessions)
router.get('/audit', authenticateToken, getSecurityAudit)

module.exports = router
