const { Router } = require('express')
const { authenticateToken } = require('../middleware/auth')
const { getContactContent, updateContactContent } = require('../controllers/contactController')

const router = Router()

router.get('/', getContactContent)
router.put('/', authenticateToken, updateContactContent)

module.exports = router
