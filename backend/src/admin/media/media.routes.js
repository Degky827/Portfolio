const { Router } = require('express')
const { authenticateToken, authorizeSuperAdmin } = require('../../shared/middleware/auth')
const { uploadSingle, uploadSingleDocument } = require('../../infrastructure/storage/cloudinaryUpload')
const {
  uploadMedia, getMedia, getMediaItem, updateMedia, deleteMedia, uploadDocument,
} = require('./media.controller')

const router = Router()

router.post('/upload', authenticateToken, authorizeSuperAdmin, uploadSingle('file'), uploadMedia)
router.post('/upload-document', authenticateToken, authorizeSuperAdmin, uploadSingleDocument('file'), uploadDocument)
router.get('/', getMedia)
router.get('/:id', getMediaItem)
router.put('/:id', authenticateToken, authorizeSuperAdmin, updateMedia)
router.delete('/:id', authenticateToken, authorizeSuperAdmin, deleteMedia)

module.exports = router
