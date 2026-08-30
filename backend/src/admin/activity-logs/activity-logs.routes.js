const { Router } = require('express')
const { authenticateToken, authorizeSuperAdmin } = require('../../shared/middleware/auth')
const { listLogs, getLog, exportLogs, getActions, clearLogs } = require('./activity-logs.controller')

const router = Router()

router.use(authenticateToken)
router.use(authorizeSuperAdmin)

router.get('/', listLogs)
router.get('/actions', getActions)
router.get('/export', exportLogs)
router.get('/:id', getLog)
router.delete('/', clearLogs)

module.exports = router
