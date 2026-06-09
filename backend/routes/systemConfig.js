const { Router } = require('express')
const { authenticateToken } = require('../middleware/auth')
const { getConfig, updateConfig } = require('../controllers/systemConfigController')

const router = Router()

router.get('/', authenticateToken, getConfig)
router.put('/', authenticateToken, updateConfig)

module.exports = router
