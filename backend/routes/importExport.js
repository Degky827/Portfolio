const { Router } = require('express')
const multer = require('multer')
const { authenticateToken } = require('../middleware/auth')
const { exportData, previewImport, executeImport } = require('../controllers/importExportController')

const importUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
})

const router = Router()

router.get('/export', authenticateToken, exportData)
router.post('/preview', authenticateToken, importUpload.single('file'), previewImport)
router.post('/import', authenticateToken, executeImport)

module.exports = router
