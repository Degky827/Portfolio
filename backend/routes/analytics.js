const { Router } = require('express')
const { logVisit, getMetrics } = require('../controllers/analyticsController')

const router = Router()

router.post('/log-visit', logVisit)
router.get('/metrics', getMetrics)

module.exports = router
