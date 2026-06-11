const fs = require('fs')
const path = require('path')
const Media = require('../models/Media')
const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary')

const uploadDir = path.resolve(__dirname, '..', 'uploads')

async function uploadMedia(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file provided' })
    }

    const file = req.file
    let url = ''
    let publicId = ''

    if (isCloudinaryConfigured) {
      // multer-storage-cloudinary already uploaded; path = URL, filename = public_id
      url = file.path
      publicId = file.filename
    } else {
      url = `/uploads/${file.filename}`
      // Clean up local temp file if cloudinary upload failed
      try { fs.unlinkSync(file.path) } catch { /* ok */ }
    }

    const media = await Media.create({
      filename: publicId || file.filename,
      originalName: file.originalname,
      publicId,
      url,
      fileType: file.mimetype.startsWith('image/') ? 'image' : 'document',
      mimeType: file.mimetype,
      fileSize: file.size,
      folder: req.body.folder || 'general',
      uploadedBy: req.user?._id || null,
    })

    res.status(201).json({ success: true, media })
  } catch (error) {
    console.error('[media] upload error:', error)
    res.status(500).json({ success: false, message: 'Failed to upload media' })
  }
}

async function getMedia(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1)
    const limit = Math.min(Math.max(1, parseInt(req.query.limit) || 20), 50)
    const search = req.query.search || ''
    const fileType = req.query.fileType || ''
    const folder = req.query.folder || ''

    const skip = (page - 1) * limit
    const query = {}

    if (search) {
      query.originalName = { $regex: search, $options: 'i' }
    }
    if (fileType) {
      query.fileType = fileType
    }
    if (folder) {
      query.folder = folder
    }

    const [totalCount, media] = await Promise.all([
      Media.countDocuments(query),
      Media.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    ])

    res.json({
      success: true,
      totalCount,
      media,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit) || 1,
        hasMore: skip + limit < totalCount,
      },
    })
  } catch (error) {
    console.error('[media] get error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch media' })
  }
}

async function getMediaItem(req, res) {
  try {
    const media = await Media.findById(req.params.id).lean()
    if (!media) {
      return res.status(404).json({ success: false, message: 'Media not found' })
    }
    res.json({ success: true, media })
  } catch (error) {
    console.error('[media] getById error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch media' })
  }
}

async function updateMedia(req, res) {
  try {
    const media = await Media.findById(req.params.id)
    if (!media) {
      return res.status(404).json({ success: false, message: 'Media not found' })
    }

    if (req.body.originalName !== undefined) {
      media.originalName = req.body.originalName
    }
    if (req.body.folder !== undefined) {
      media.folder = req.body.folder
    }

    await media.save()
    res.json({ success: true, media })
  } catch (error) {
    console.error('[media] update error:', error)
    res.status(500).json({ success: false, message: 'Failed to update media' })
  }
}

async function deleteMedia(req, res) {
  try {
    const media = await Media.findById(req.params.id)
    if (!media) {
      return res.status(404).json({ success: false, message: 'Media not found' })
    }

    if (media.publicId && isCloudinaryConfigured) {
      try {
        await cloudinary.uploader.destroy(media.publicId)
      } catch (cloudErr) {
        console.error('[media] Cloudinary delete failed:', cloudErr.message)
      }
    }

    if (!media.publicId && media.url.startsWith('/uploads/')) {
      const filePath = path.resolve(__dirname, '..', media.url)
      try { fs.unlinkSync(filePath) } catch { /* file may not exist */ }
    }

    await Media.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'Media deleted successfully' })
  } catch (error) {
    console.error('[media] delete error:', error)
    res.status(500).json({ success: false, message: 'Failed to delete media' })
  }
}

async function uploadDocument(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file provided' })
    }

    const file = req.file
    let url = ''
    let publicId = ''

    if (isCloudinaryConfigured) {
      url = file.path
      publicId = file.filename
    } else {
      url = `/uploads/${file.filename}`
      try { fs.unlinkSync(file.path) } catch { /* ok */ }
    }

    res.status(201).json({ success: true, url, publicId, originalName: file.originalname })
  } catch (error) {
    console.error('[media] uploadDocument error:', error)
    res.status(500).json({ success: false, message: 'Failed to upload document' })
  }
}

module.exports = { uploadMedia, getMedia, getMediaItem, updateMedia, deleteMedia, uploadDocument }
