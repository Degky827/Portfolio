const path = require('path')
const { minioClient, BUCKET } = require('./minio')

class MinioStorage {
  constructor(opts = {}) {
    this.client = opts.client || minioClient
    this.bucket = opts.bucket || BUCKET
    this.folder = opts.folder || ''
  }

  _handleFile(req, file, cb) {
    const chunks = []

    file.stream.on('data', (chunk) => chunks.push(chunk))

    file.stream.on('error', (err) => {
      cb(new Error(`MinIO upload failed: ${err.message}`))
    })

    file.stream.on('end', () => {
      const buffer = Buffer.concat(chunks)
      const objectKey = this._generateObjectKey(file)

      const metadata = {
        'Content-Type': file.mimetype || 'application/octet-stream',
      }

      this.client.putObject(this.bucket, objectKey, buffer, buffer.length, metadata, (err) => {
        if (err) {
          return cb(new Error(`MinIO upload failed: ${err.message}`))
        }

        file.filename = objectKey
        file.path = `/minio/${this.bucket}/${objectKey}`
        file.size = buffer.length

        cb(null, file)
      })
    })
  }

  _removeFile(req, file, cb) {
    if (!file.filename) {
      return cb(null)
    }

    this.client.removeObject(this.bucket, file.filename, (err) => {
      if (err) {
        console.error(`[minio] Failed to delete ${file.filename}:`, err.message)
      }
      cb(null)
    })
  }

  _generateObjectKey(file) {
    const folder = this.folder ? `${this.folder}/` : ''
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    const ext = path.extname(file.originalname)
    return `${folder}${uniqueSuffix}${ext}`
  }
}

module.exports = MinioStorage
