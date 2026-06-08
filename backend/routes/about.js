const { Router } = require('express')
const { authenticateToken } = require('../middleware/auth')
const upload = require('../config/upload')
const { getAboutContent, updateAboutContent } = require('../controllers/aboutController')

const router = Router()

router.get('/', getAboutContent)
router.put('/', authenticateToken, upload.single('profileImage'), updateAboutContent)

module.exports = router
