const { Router } = require('express')
const { authenticateToken } = require('../../shared/middleware/auth')
const upload = require('../../infrastructure/storage/upload')
const { getFooterContent, updateFooterContent } = require('./footer.controller')

const router = Router()

router.get('/', getFooterContent)
router.put('/', authenticateToken, upload.single('footerLogo'), updateFooterContent)

module.exports = router
