const { Router } = require('express')
const { authenticateToken } = require('../../shared/middleware/auth')
const upload = require('../../infrastructure/storage/upload')
const { getAboutContent, updateAboutContent } = require('./about.controller')

const router = Router()

router.get('/', getAboutContent)
router.put('/', authenticateToken, upload.single('profileImage'), updateAboutContent)

module.exports = router
