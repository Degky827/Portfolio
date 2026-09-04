const fs = require('fs')
const path = require('path')
const { cloudinary, isCloudinaryConfigured } = require('./cloudinary')
const { minioClient, isMinioConfigured, BUCKET } = require('./minio')

function getStorageProvider() {
  const provider = (process.env.STORAGE_PROVIDER || '').toLowerCase()

  if (provider === 'minio' && isMinioConfigured) return 'minio'
  if (provider === 'cloudinary') return 'cloudinary'
  if (provider === 'local') return 'local'

  if (isCloudinaryConfigured) return 'cloudinary'
  return 'local'
}

async function deleteFile(fileUrl) {
  if (!fileUrl) return

  const provider = getStorageProvider()

  if (fileUrl.includes('cloudinary.com')) {
    if (!isCloudinaryConfigured) return
    try {
      const parts = fileUrl.split('/')
      const uploadIndex = parts.indexOf('upload')
      if (uploadIndex > -1) {
        const publicIdWithVersion = parts.slice(uploadIndex + 1).join('/')
        const publicId = publicIdWithVersion.replace(/^v\d+\//, '')
        await cloudinary.uploader.destroy(publicId)
      }
    } catch (err) {
      console.error('[storage] Cloudinary delete error:', err.message)
    }
    return
  }

  if (fileUrl.startsWith('/minio/')) {
    if (!isMinioConfigured) return
    try {
      const objectKey = fileUrl.replace(`/minio/${BUCKET}/`, '')
      await minioClient.removeObject(BUCKET, objectKey)
    } catch (err) {
      console.error('[storage] MinIO delete error:', err.message)
    }
    return
  }

  if (fileUrl.startsWith('/uploads/')) {
    try {
      const filePath = path.resolve(__dirname, '..', '..', fileUrl)
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    } catch (err) {
      console.error('[storage] Local delete error:', err.message)
    }
  }
}

function getFileUrl(file) {
  const provider = getStorageProvider()

  if (provider === 'local') {
    return `/uploads/${file.filename}`
  }

  return file.path
}

module.exports = { getStorageProvider, deleteFile, getFileUrl }
