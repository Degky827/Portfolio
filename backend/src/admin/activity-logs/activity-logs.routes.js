const { Router } = require('express')
const { authenticateToken } = require('../../shared/middleware/auth')
const { listLogs, getLog, exportLogs, getActions, clearLogs } = require('./activity-logs.controller')

const router = Router()

router.use(authenticateToken)

router.get('/', listLogs)
router.get('/actions', getActions)
router.get('/export', exportLogs)
router.get('/:id', getLog)
router.delete('/', clearLogs)

module.exports = router
