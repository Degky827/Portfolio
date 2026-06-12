const { Router } = require('express')
const { authenticateToken } = require('../../shared/middleware/auth')
const { getConfig, updateConfig, triggerBackup, triggerHealthCheck } = require('./system.controller')

const router = Router()

router.get('/', authenticateToken, getConfig)
router.put('/', authenticateToken, updateConfig)
router.post('/trigger-backup', authenticateToken, triggerBackup)
router.post('/trigger-health-check', authenticateToken, triggerHealthCheck)

module.exports = router
