const { Router } = require('express')
const { authenticateToken } = require('../middleware/auth')
const upload = require('../config/upload')
const { getFooterContent, updateFooterContent } = require('../controllers/footerController')

const router = Router()

router.get('/', getFooterContent)
router.put('/', authenticateToken, upload.single('footerLogo'), updateFooterContent)

module.exports = router
