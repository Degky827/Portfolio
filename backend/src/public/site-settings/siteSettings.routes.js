const { Router } = require('express')
const { authenticateToken } = require('../../shared/middleware/auth')
const { getSiteSettings, updateSiteSettings } = require('./siteSettings.controller')

const router = Router()

router.get('/', getSiteSettings)
router.put('/', authenticateToken, updateSiteSettings)

module.exports = router
