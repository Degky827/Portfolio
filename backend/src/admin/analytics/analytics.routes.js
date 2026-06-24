const { Router } = require('express')
const rateLimit = require('express-rate-limit')
const { authenticateToken } = require('../../shared/middleware/auth')
const {
  logVisit, logEngagement, getMetrics, getDashboardStats, getAnalyticsDashboard, clearAnalytics,
} = require('./analytics.controller')

const router = Router()

const trackingLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 60,
  message: { success: false, message: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
})

router.post('/log-visit', trackingLimiter, logVisit)
router.post('/log-engagement', trackingLimiter, logEngagement)
router.get('/metrics', authenticateToken, getMetrics)
router.get('/stats', authenticateToken, getDashboardStats)
router.get('/analytics-dashboard', authenticateToken, getAnalyticsDashboard)
router.delete('/clear', authenticateToken, clearAnalytics)

module.exports = router
