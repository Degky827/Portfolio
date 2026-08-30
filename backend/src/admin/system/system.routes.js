const { Router } = require('express')
const { authenticateToken, authorizeSuperAdmin } = require('../../shared/middleware/auth')
const { getConfig, updateConfig, triggerBackup, triggerHealthCheck } = require('./system.controller')

const router = Router()

router.use(authenticateToken)
router.use(authorizeSuperAdmin)

router.get('/', getConfig)
router.put('/', updateConfig)
router.post('/trigger-backup', triggerBackup)
router.post('/trigger-health-check', triggerHealthCheck)

module.exports = router
