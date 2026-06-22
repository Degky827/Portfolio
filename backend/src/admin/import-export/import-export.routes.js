const { Router } = require('express')
const { authenticateToken } = require('../../shared/middleware/auth')
const importUpload = require('./import-upload')
const { exportData, previewImport, executeImport, importUPSSnapshot } = require('./import-export.controller')

const router = Router()

router.get('/export', authenticateToken, exportData)
router.post('/preview', authenticateToken, importUpload.single('file'), previewImport)
router.post('/import', authenticateToken, executeImport)
router.post('/import-ups', authenticateToken, importUpload.single('file'), importUPSSnapshot)

module.exports = router
