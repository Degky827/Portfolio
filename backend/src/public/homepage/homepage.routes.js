const { Router } = require('express')
const { authenticateToken } = require('../../shared/middleware/auth')
const { getHomeContent, getHomeContentDraft, publishHomeContent, updateHomeContent } = require('./homepage.controller')

const router = Router()

router.get('/', getHomeContent)
router.get('/admin', authenticateToken, getHomeContentDraft)
router.post('/publish', authenticateToken, publishHomeContent)
router.put('/', authenticateToken, updateHomeContent)

module.exports = router
