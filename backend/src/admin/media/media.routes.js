const { Router } = require('express')
const { authenticateToken } = require('../../shared/middleware/auth')
const { uploadSingle, uploadSingleDocument } = require('../../infrastructure/storage/cloudinaryUpload')
const {
  uploadMedia, getMedia, getMediaItem, updateMedia, deleteMedia, uploadDocument,
} = require('./media.controller')

const router = Router()

router.post('/upload', authenticateToken, uploadSingle('file'), uploadMedia)
router.post('/upload-document', authenticateToken, uploadSingleDocument('file'), uploadDocument)
router.get('/', getMedia)
router.get('/:id', getMediaItem)
router.put('/:id', authenticateToken, updateMedia)
router.delete('/:id', authenticateToken, deleteMedia)

module.exports = router
