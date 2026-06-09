const multer = require('multer')
const { portfolioStorage, isCloudinaryConfigured } = require('./cloudinary')
const localUpload = require('./upload')

const cloudinaryUpload = multer({
  storage: portfolioStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|gif|webp|svg)$/i
    if (allowed.test(file.originalname)) {
      cb(null, true)
    } else {
      cb(new Error('Only image files (jpg, jpeg, png, gif, webp, svg) are allowed'), false)
    }
  },
})

function uploadSingle(fieldName) {
  return (req, res, next) => {
    const upload = isCloudinaryConfigured
      ? cloudinaryUpload.single(fieldName)
      : localUpload.single(fieldName)
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ success: false, message: 'File exceeds 10MB limit' })
        }
        return res.status(400).json({ success: false, message: err.message })
      }
      if (err) {
        return res.status(400).json({ success: false, message: err.message })
      }
      next()
    })
  }
}

module.exports = { uploadSingle }
