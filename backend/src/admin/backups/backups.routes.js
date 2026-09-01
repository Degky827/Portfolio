const { Router } = require('express')
const multer = require('multer')
const { authenticateToken } = require('../../shared/middleware/auth')
const {
  listBackups, createBackup, getBackup, downloadBackup, deleteBackup, uploadBackup, restoreBackup,
} = require('./backups.controller')

const backupUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
})

const router = Router()

router.use(authenticateToken)

router.get('/', listBackups)
router.post('/', createBackup)
router.post('/upload', backupUpload.single('file'), uploadBackup)
router.get('/:id', getBackup)
router.get('/:id/download', downloadBackup)
router.post('/:id/restore', restoreBackup)
router.delete('/:id', deleteBackup)

module.exports = router
