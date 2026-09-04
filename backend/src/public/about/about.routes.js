const { Router } = require('express')
const { authenticateToken } = require('../../shared/middleware/auth')
const { uploadSingle } = require('../../infrastructure/storage/cloudinaryUpload')
const { getAboutContent, updateAboutContent } = require('./about.controller')

const router = Router()

router.get('/', getAboutContent)
router.put('/', authenticateToken, uploadSingle('profileImage'), updateAboutContent)

module.exports = router
