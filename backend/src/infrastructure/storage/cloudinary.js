const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const path = require('path')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '..', '.env') })
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
})

const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET,
)

const portfolioStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'portfolio_assets',
    resource_type: 'auto',
    transformation: [
      { width: 1000, height: 1000, crop: 'limit', quality: 'auto', format: 'auto' },
    ],
  },
})

module.exports = { cloudinary, isCloudinaryConfigured, portfolioStorage }
