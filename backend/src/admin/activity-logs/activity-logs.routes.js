const { Router } = require('express')
const { authenticateToken } = require('../../shared/middleware/auth')
const { listLogs, getLog, exportLogs, getActions, clearLogs } = require('./activity-logs.controller')

const router = Router()

router.get('/', authenticateToken, listLogs)
router.get('/actions', authenticateToken, getActions)
router.get('/export', authenticateToken, exportLogs)
router.get('/:id', authenticateToken, getLog)
router.delete('/', authenticateToken, clearLogs)

module.exports = router
