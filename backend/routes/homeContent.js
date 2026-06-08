const { Router } = require('express')
const { authenticateToken } = require('../middleware/auth')
const upload = require('../config/upload')
const { getHomeContent, updateHomeContent } = require('../controllers/homeContentController')

const router = Router()

router.get('/', getHomeContent)

router.put('/', authenticateToken, upload.single('profileImage'), updateHomeContent)

module.exports = router
