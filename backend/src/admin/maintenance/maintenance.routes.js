const { Router } = require('express')
const { authenticateToken } = require('../../shared/middleware/auth')
const {
  healthCheck, storageUsage, collectionStats, indexStatus, orphanFiles,
} = require('./maintenance.controller')

const router = Router()

router.use(authenticateToken)

router.get('/health', healthCheck)
router.get('/storage', storageUsage)
router.get('/collections', collectionStats)
router.get('/indexes', indexStatus)
router.get('/orphan-files', orphanFiles)

module.exports = router
