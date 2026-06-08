const { Router } = require('express')
const { logVisit, getMetrics, getDashboardStats } = require('../controllers/analyticsController')
const { authenticateToken } = require('../middleware/auth')

const router = Router()

router.post('/log-visit', logVisit)
router.get('/metrics', authenticateToken, getMetrics)
router.get('/stats', authenticateToken, getDashboardStats)

module.exports = router
