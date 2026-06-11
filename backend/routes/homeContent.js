const { Router } = require('express')
const { authenticateToken } = require('../middleware/auth')
const { getHomeContent, updateHomeContent } = require('../controllers/homeContentController')

const router = Router()

router.get('/', getHomeContent)

router.put('/', authenticateToken, updateHomeContent)

module.exports = router
