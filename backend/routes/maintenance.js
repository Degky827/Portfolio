const { Router } = require('express')
const { authenticateToken } = require('../middleware/auth')
const {
  healthCheck, storageUsage, collectionStats, indexStatus, orphanFiles,
} = require('../controllers/maintenanceController')

const router = Router()

router.get('/health', authenticateToken, healthCheck)
router.get('/storage', authenticateToken, storageUsage)
router.get('/collections', authenticateToken, collectionStats)
router.get('/indexes', authenticateToken, indexStatus)
router.get('/orphan-files', authenticateToken, orphanFiles)

module.exports = router
