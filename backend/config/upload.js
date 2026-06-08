const multer = require('multer')
const path = require('path')
const fs = require('fs')

const uploadDir = path.resolve(__dirname, '..', 'uploads')

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, uploadDir)
  },
  filename(_req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    const ext = path.extname(file.originalname)
    cb(null, `${uniqueSuffix}${ext}`)
  },
})

const fileFilter = (_req, file, cb) => {
  const allowed = /\.(jpg|jpeg|png|gif|webp|svg)$/i
  if (allowed.test(path.extname(file.originalname))) {
    cb(null, true)
  } else {
    cb(new Error('Only image files (jpg, jpeg, png, gif, webp, svg) are allowed'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
})

module.exports = upload
