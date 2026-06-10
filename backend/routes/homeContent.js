const { Router } = require('express')
const { authenticateToken } = require('../middleware/auth')
const { uploadFields } = require('../config/cloudinaryUpload')
const { getHomeContent, updateHomeContent } = require('../controllers/homeContentController')

const router = Router()

router.get('/', getHomeContent)

router.put(
  '/',
  authenticateToken,
  uploadFields([
    { name: 'heroProfilePhoto', maxCount: 1 },
    { name: 'logoImage', maxCount: 1 },
    { name: 'ctaBackgroundImage', maxCount: 1 },
    { name: 'seoOgImage', maxCount: 1 },
  ]),
  updateHomeContent,
)

module.exports = router
