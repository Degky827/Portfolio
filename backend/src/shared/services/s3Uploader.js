const fs = require('fs')
const path = require('path')
const https = require('https')
const http = require('http')

const BACKUPS_DIR = path.resolve(__dirname, '..', '..', '..', 'backups')

async function uploadToCloud(localFilePath, config) {
  if (!config || !config.enabled || !config.bucketName) {
    return uploadToLocal(localFilePath)
  }

  const { bucketName, region, accessKeyId, secretAccessKey, endpointUrl } = config

  if (!accessKeyId || !secretAccessKey) {
    console.warn('[s3Uploader] Cloud upload enabled but credentials missing; falling back to local')
    return uploadToLocal(localFilePath)
  }

  try {
    const filename = path.basename(localFilePath)
    const fileContent = fs.readFileSync(localFilePath)
    const dateStr = new Date().toUTCString()

    const host = endpointUrl
      ? endpointUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')
      : `${bucketName}.s3.${region || 'us-east-1'}.amazonaws.com`

    const transport = (endpointUrl || '').startsWith('https') ? https : http

    const body = Buffer.from(fileContent)
    const contentMD5 = require('crypto').createHash('md5').update(body).digest('base64')

    const options = {
      hostname: host,
      path: `/${filename}`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': body.length,
        'Content-MD5': contentMD5,
        'x-amz-acl': 'private',
        Date: dateStr,
      },
    }

    return new Promise((resolve, reject) => {
      const req = transport.request(options, (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log(`[s3Uploader] Uploaded ${filename} to ${bucketName}/${filename}`)
          resolve({ success: true, provider: 's3', bucket: bucketName, key: filename })
        } else {
          reject(new Error(`S3 upload failed with status ${res.statusCode}`))
        }
      })
      req.on('error', (err) => {
        console.error('[s3Uploader] Request error:', err.message)
        reject(err)
      })
      req.write(body)
      req.end()
    })
  } catch (error) {
    console.error('[s3Uploader] Upload error:', error.message)
    console.warn('[s3Uploader] Falling back to local storage')
    return uploadToLocal(localFilePath)
  }
}

async function uploadToLocal(localFilePath) {
  const filename = path.basename(localFilePath)
  const destDir = path.join(BACKUPS_DIR, 'cloud-fallback')
  fs.mkdirSync(destDir, { recursive: true })
  const destPath = path.join(destDir, filename)
  fs.copyFileSync(localFilePath, destPath)
  console.log(`[s3Uploader] Copied ${filename} to local fallback ${destPath}`)
  return { success: true, provider: 'local', path: destPath }
}

module.exports = { uploadToCloud }
