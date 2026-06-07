const { Router } = require('express')
const { logVisit, getMetrics } = require('../controllers/analyticsController')
const { authenticateToken } = require('../middleware/auth')

const router = Router()

router.post('/log-visit', logVisit)
router.get('/metrics', authenticateToken, getMetrics)

module.exports = router
