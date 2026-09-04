const { Client: MinioClient } = require('minio')

const minioConfig = {
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT, 10) || 9000,
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin123',
}

const BUCKET = process.env.MINIO_BUCKET || 'portfolio'

const minioClient = new MinioClient(minioConfig)

const isMinioConfigured = Boolean(
  process.env.MINIO_ENDPOINT &&
  process.env.MINIO_ACCESS_KEY &&
  process.env.MINIO_SECRET_KEY,
)

async function ensureBucket() {
  if (!isMinioConfigured) return

  try {
    const exists = await minioClient.bucketExists(BUCKET)
    if (!exists) {
      await minioClient.makeBucket(BUCKET)
      console.log(`[minio] Bucket "${BUCKET}" created`)
    }
  } catch (err) {
    console.error(`[minio] Failed to initialize bucket "${BUCKET}":`, err.message)
  }
}

module.exports = { minioClient, isMinioConfigured, BUCKET, ensureBucket, minioConfig }
