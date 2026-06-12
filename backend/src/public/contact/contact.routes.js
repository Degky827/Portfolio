const { Router } = require('express')
const { authenticateToken } = require('../../shared/middleware/auth')
const { getContactContent, updateContactContent } = require('./contact.controller')

const router = Router()

router.get('/', getContactContent)
router.put('/', authenticateToken, updateContactContent)

module.exports = router
