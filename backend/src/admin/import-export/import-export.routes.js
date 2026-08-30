const { Router } = require('express')
const { authenticateToken, authorizeSuperAdmin } = require('../../shared/middleware/auth')
const importUpload = require('./import-upload')
const { exportData, previewImport, executeImport, importUPSSnapshot } = require('./import-export.controller')

const router = Router()

router.use(authenticateToken)
router.use(authorizeSuperAdmin)

router.get('/export', exportData)
router.post('/preview', importUpload.single('file'), previewImport)
router.post('/import', executeImport)
router.post('/import-ups', importUpload.single('file'), importUPSSnapshot)

module.exports = router
