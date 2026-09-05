const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { portfolioStorage } = require('./cloudinary')
const MinioStorage = require('./minioStorage')
const { getStorageProvider, getFileUrl } = require('./storage.service')

const uploadDir = path.resolve(__dirname, '..', '..', '..', 'uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const localImageStorage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, uploadDir)
  },
  filename(_req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    const ext = path.extname(file.originalname)
    cb(null, `${uniqueSuffix}${ext}`)
  },
})

const imageFilter = (_req, file, cb) => {
  const allowed = /\.(jpg|jpeg|png|gif|webp|svg|avif)$/i
  if (allowed.test(file.originalname)) {
    cb(null, true)
  } else {
    cb(new Error('Only image files (jpg, jpeg, png, gif, webp, svg, avif) are allowed'), false)
  }
}

function createUploadMiddleware(type = 'image') {
  const provider = getStorageProvider()
  const limit = type === 'document' ? 20 * 1024 * 1024 : 10 * 1024 * 1024

  if (provider === 'minio') {
    return multer({
      storage: new MinioStorage({ folder: 'portfolio_assets' }),
      limits: { fileSize: limit },
      fileFilter: type === 'image' ? imageFilter : undefined,
    })
  }

  if (provider === 'cloudinary') {
    return multer({
      storage: portfolioStorage,
      limits: { fileSize: limit },
      fileFilter: type === 'image' ? imageFilter : undefined,
    })
  }

  return multer({
    storage: localImageStorage,
    limits: { fileSize: limit },
    fileFilter: type === 'image' ? imageFilter : undefined,
  })
}

function wrapMulter(fieldName, type = 'image') {
  return (req, res, next) => {
    const upload = createUploadMiddleware(type)
    upload.single(fieldName)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ success: false, message: 'File exceeds size limit' })
        }
        return res.status(400).json({ success: false, message: err.message })
      }
      if (err) {
        return res.status(400).json({ success: false, message: err.message })
      }

      if (req.file) {
        req.file.path = getFileUrl(req.file)
      }
      if (req.files) {
        Object.values(req.files).flat().forEach((f) => {
          f.path = getFileUrl(f)
        })
      }

      next()
    })
  }
}

function wrapMulterFields(fieldConfig, type = 'image') {
  return (req, res, next) => {
    const upload = createUploadMiddleware(type)
    upload.fields(fieldConfig)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ success: false, message: 'File exceeds size limit' })
        }
        return res.status(400).json({ success: false, message: err.message })
      }
      if (err) {
        return res.status(400).json({ success: false, message: err.message })
      }

      if (req.file) {
        req.file.path = getFileUrl(req.file)
      }
      if (req.files) {
        Object.values(req.files).flat().forEach((f) => {
          f.path = getFileUrl(f)
        })
      }

      next()
    })
  }
}

function uploadSingle(fieldName) {
  return wrapMulter(fieldName, 'image')
}

function uploadFields(fieldConfig) {
  return wrapMulterFields(fieldConfig, 'image')
}

function uploadSingleDocument(fieldName) {
  return wrapMulter(fieldName, 'document')
}

module.exports = { uploadSingle, uploadFields, uploadSingleDocument, getStorageProvider }
