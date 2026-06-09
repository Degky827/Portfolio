const { Router } = require('express')
const { authenticateToken } = require('../middleware/auth')
const upload = require('../config/upload')
const {
  uploadMedia,
  getMedia,
  getMediaItem,
  updateMedia,
  deleteMedia,
} = require('../controllers/mediaController')

const router = Router()

router.post('/upload', authenticateToken, upload.single('file'), uploadMedia)
router.get('/', getMedia)
router.get('/:id', getMediaItem)
router.put('/:id', authenticateToken, updateMedia)
router.delete('/:id', authenticateToken, deleteMedia)

module.exports = router
