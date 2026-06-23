const { Router } = require('express')
const { authenticateToken } = require('../../shared/middleware/auth')
const {
  logVisit, logEngagement, getMetrics, getDashboardStats, getAnalyticsDashboard, clearAnalytics,
} = require('./analytics.controller')

const router = Router()

router.post('/log-visit', logVisit)
router.post('/log-engagement', logEngagement)
router.get('/metrics', authenticateToken, getMetrics)
router.get('/stats', authenticateToken, getDashboardStats)
router.get('/analytics-dashboard', authenticateToken, getAnalyticsDashboard)
router.delete('/clear', authenticateToken, clearAnalytics)

module.exports = router
