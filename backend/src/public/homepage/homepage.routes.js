const { Router } = require('express')
const { authenticateToken } = require('../../shared/middleware/auth')
const { getHomeContent, updateHomeContent } = require('./homepage.controller')

const router = Router()

router.get('/', getHomeContent)
router.put('/', authenticateToken, updateHomeContent)

module.exports = router
