const { Router } = require('express')
const { authenticateToken } = require('../../shared/middleware/auth')
const { uploadFields } = require('../../infrastructure/storage/cloudinaryUpload')
const { getSettings, updateSettings, getGlobalAppearance, updateGlobalAppearance } = require('./settings.controller')

const router = Router()

router.get('/', getSettings)
router.put(
  '/',
  authenticateToken,
  uploadFields([
    { name: 'logo', maxCount: 1 },
    { name: 'favicon', maxCount: 1 },
  ]),
  updateSettings,
)

router.get('/appearance', getGlobalAppearance)
router.patch('/appearance', authenticateToken, updateGlobalAppearance)

module.exports = router
