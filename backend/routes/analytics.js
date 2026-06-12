const { Router } = require('express')
const { logVisit, logEngagement, getMetrics, getDashboardStats, getAnalyticsDashboard } = require('../controllers/analyticsController')
const { authenticateToken } = require('../middleware/auth')

const router = Router()

router.post('/log-visit', logVisit)
router.post('/log-engagement', logEngagement)
router.get('/metrics', authenticateToken, getMetrics)
router.get('/stats', authenticateToken, getDashboardStats)
router.get('/analytics-dashboard', authenticateToken, getAnalyticsDashboard)

module.exports = router
