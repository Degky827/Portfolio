const { Router } = require('express')
const { authenticateToken, authorizeSuperAdmin } = require('../middleware/auth')
const { uploadSingle } = require('../config/cloudinaryUpload')
const {
  uploadMedia,
  getMedia,
  getMediaItem,
  updateMedia,
  deleteMedia,
} = require('../controllers/mediaController')

const router = Router()

router.post('/upload', authenticateToken, authorizeSuperAdmin, uploadSingle('file'), uploadMedia)
router.get('/', getMedia)
router.get('/:id', getMediaItem)
router.put('/:id', authenticateToken, authorizeSuperAdmin, updateMedia)
router.delete('/:id', authenticateToken, authorizeSuperAdmin, deleteMedia)

module.exports = router
