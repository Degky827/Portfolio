const { Router } = require('express')
const { authenticateToken } = require('../../shared/middleware/auth')
const { uploadSingle } = require('../../infrastructure/storage/cloudinaryUpload')
const { getFooterContent, updateFooterContent } = require('./footer.controller')

const router = Router()

router.get('/', getFooterContent)
router.put('/', authenticateToken, uploadSingle('footerLogo'), updateFooterContent)

module.exports = router
