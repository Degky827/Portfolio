const { Router } = require('express')
const { authenticateToken } = require('../middleware/auth')
const upload = require('../config/upload')
const { getHomeContent, updateHomeContent } = require('../controllers/homeContentController')

const router = Router()

router.get('/', getHomeContent)

router.put(
  '/',
  authenticateToken,
  upload.fields([
    { name: 'heroProfilePhoto', maxCount: 1 },
    { name: 'ctaBackgroundImage', maxCount: 1 },
    { name: 'seoOgImage', maxCount: 1 },
  ]),
  updateHomeContent,
)

module.exports = router
