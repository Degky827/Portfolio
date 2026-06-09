const { Router } = require('express')
const multer = require('multer')
const { authenticateToken } = require('../middleware/auth')
const {
  listBackups,
  createBackup,
  getBackup,
  downloadBackup,
  deleteBackup,
  uploadBackup,
  restoreBackup,
} = require('../controllers/backupController')

const backupUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
})

const router = Router()

router.get('/', authenticateToken, listBackups)
router.post('/', authenticateToken, createBackup)
router.post('/upload', authenticateToken, backupUpload.single('file'), uploadBackup)
router.get('/:id', authenticateToken, getBackup)
router.get('/:id/download', authenticateToken, downloadBackup)
router.post('/:id/restore', authenticateToken, restoreBackup)
router.delete('/:id', authenticateToken, deleteBackup)

module.exports = router
