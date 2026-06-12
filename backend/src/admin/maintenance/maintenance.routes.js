const { Router } = require('express')
const { authenticateToken } = require('../../shared/middleware/auth')
const {
  healthCheck, storageUsage, collectionStats, indexStatus, orphanFiles,
} = require('./maintenance.controller')

const router = Router()

router.get('/health', authenticateToken, healthCheck)
router.get('/storage', authenticateToken, storageUsage)
router.get('/collections', authenticateToken, collectionStats)
router.get('/indexes', authenticateToken, indexStatus)
router.get('/orphan-files', authenticateToken, orphanFiles)

module.exports = router
