const multer = require('multer')

const importUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter(_req, file, cb) {
    const allowed = /\.(json|csv|ups)$/i
    if (allowed.test(require('path').extname(file.originalname))) {
      cb(null, true)
    } else {
      cb(new Error('Only JSON, CSV, and UPS files are allowed'), false)
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 },
})

module.exports = importUpload
