const { Router } = require('express')
const { authenticateToken, authorizeSuperAdmin } = require('../middleware/auth')
const { uploadSingle, uploadSingleDocument } = require('../config/cloudinaryUpload')
const {
  uploadMedia,
  getMedia,
  getMediaItem,
  updateMedia,
  deleteMedia,
  uploadDocument,
} = require('../controllers/mediaController')

const router = Router()

router.post('/upload', authenticateToken, authorizeSuperAdmin, uploadSingle('file'), uploadMedia)
router.post('/upload-document', authenticateToken, authorizeSuperAdmin, uploadSingleDocument('file'), uploadDocument)
router.get('/', getMedia)
router.get('/:id', getMediaItem)
router.put('/:id', authenticateToken, authorizeSuperAdmin, updateMedia)
router.delete('/:id', authenticateToken, authorizeSuperAdmin, deleteMedia)

module.exports = router
