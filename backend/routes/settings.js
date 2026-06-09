const { Router } = require('express')
const { authenticateToken } = require('../middleware/auth')
const upload = require('../config/upload')
const { getSettings, updateSettings } = require('../controllers/settingsController')

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

module.exports = router
