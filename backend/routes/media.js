const { Router } = require('express')
const { authenticateToken, authorizeRoles } = require('../middleware/auth')
const { uploadSingle } = require('../config/cloudinaryUpload')
const {
  uploadMedia,
  getMedia,
  getMediaItem,
  updateMedia,
  deleteMedia,
} = require('../controllers/mediaController')

const router = Router()

router.post('/upload', authenticateToken, authorizeRoles('super_admin', 'admin'), uploadSingle('file'), uploadMedia)
router.get('/', getMedia)
router.get('/:id', getMediaItem)
router.put('/:id', authenticateToken, authorizeRoles('super_admin', 'admin'), updateMedia)
router.delete('/:id', authenticateToken, authorizeRoles('super_admin', 'admin'), deleteMedia)

module.exports = router
