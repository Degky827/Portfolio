const { Router } = require('express')
const { authenticateToken } = require('../../shared/middleware/auth')
const upload = require('../../infrastructure/storage/upload')
const { getSettings, updateSettings, getGlobalAppearance, updateGlobalAppearance } = require('./settings.controller')

const router = Router()

router.get('/', getSettings)
router.put(
  '/',
  authenticateToken,
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'favicon', maxCount: 1 },
  ]),
  updateSettings,
)

router.get('/appearance', getGlobalAppearance)
router.patch('/appearance', updateGlobalAppearance)

module.exports = router
