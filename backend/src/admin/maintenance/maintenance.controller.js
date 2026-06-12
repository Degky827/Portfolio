const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')
const Project = require('../../shared/models/Project')
const Skill = require('../../shared/models/Skill')
const HomeContent = require('../../shared/models/HomeContent')
const AboutContent = require('../../shared/models/AboutContent')
const ContactContent = require('../../shared/models/ContactContent')
const FooterContent = require('../../shared/models/FooterContent')
const Settings = require('../../shared/models/Settings')
const Media = require('../../shared/models/Media')

const MODELS_WITH_IMAGES = [Project, Media]

async function healthCheck(_req, res) {
  try {
    const start = Date.now()
    await mongoose.connection.db.admin().ping()
    const responseTime = Date.now() - start

    res.json({
      success: true,
      health: {
        status: mongoose.connection.readyState === 1 ? 'healthy' : 'unhealthy',
        readyState: mongoose.connection.readyState,
        responseTime: `${responseTime}ms`,
        host: mongoose.connection.host || 'unknown',
        name: mongoose.connection.name || 'unknown',
      },
    })
  } catch (error) {
    console.error('[maintenance] health check error:', error)
    res.status(500).json({ success: false, message: 'Health check failed' })
  }
}

async function storageUsage(_req, res) {
  try {
    const dbStats = await mongoose.connection.db.stats()
    res.json({
      success: true,
      storage: {
        dataSize: dbStats.dataSize,
        dataSizeFormatted: fmtBytes(dbStats.dataSize),
        storageSize: dbStats.storageSize,
        storageSizeFormatted: fmtBytes(dbStats.storageSize),
        indexSize: dbStats.indexSize,
        indexSizeFormatted: fmtBytes(dbStats.indexSize),
        totalSize: dbStats.dataSize + dbStats.indexSize,
        totalSizeFormatted: fmtBytes(dbStats.dataSize + dbStats.indexSize),
        collections: dbStats.collections,
        objects: dbStats.objects,
        avgObjSize: dbStats.avgObjSize ? `${(dbStats.avgObjSize / 1024).toFixed(2)} KB` : '0 B',
        fsUsedSize: dbStats.fsUsedSize,
        fsTotalSize: dbStats.fsTotalSize,
      },
    })
  } catch (error) {
    console.error('[maintenance] storage error:', error)
    res.status(500).json({ success: false, message: 'Failed to get storage stats' })
  }
}

async function collectionStats(_req, res) {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray()
    const results = []

    for (const col of collections) {
      try {
        const stats = await mongoose.connection.db.collection(col.name).stats()
        results.push({
          name: col.name,
          documentCount: stats.count,
          size: stats.size,
          sizeFormatted: fmtBytes(stats.size),
          avgObjSize: stats.avgObjSize ? `${(stats.avgObjSize / 1024).toFixed(2)} KB` : '0 B',
          storageSize: stats.storageSize,
          storageSizeFormatted: fmtBytes(stats.storageSize),
          indexes: stats.nindexes,
          totalIndexSize: stats.totalIndexSize,
          totalIndexSizeFormatted: fmtBytes(stats.totalIndexSize),
        })
      } catch { /* skip system collections */ }
    }

    res.json({ success: true, collections: results })
  } catch (error) {
    console.error('[maintenance] collection stats error:', error)
    res.status(500).json({ success: false, message: 'Failed to get collection stats' })
  }
}

async function indexStatus(_req, res) {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray()
    const results = []

    for (const col of collections) {
      try {
        const indexes = await mongoose.connection.db.collection(col.name).indexes()
        results.push({
          collection: col.name,
          indexes: indexes.map((idx) => ({
            name: idx.name,
            key: JSON.stringify(idx.key),
            unique: idx.unique || false,
            sparse: idx.sparse || false,
            background: idx.background || false,
          })),
        })
      } catch { /* skip */ }
    }

    res.json({ success: true, collections: results })
  } catch (error) {
    console.error('[maintenance] index error:', error)
    res.status(500).json({ success: false, message: 'Failed to get index status' })
  }
}

async function orphanFiles(_req, res) {
  try {
    const uploadDir = path.resolve(__dirname, '..', '..', '..', 'uploads')
    if (!fs.existsSync(uploadDir)) {
      return res.json({ success: true, orphanFiles: [], totalSize: 0 })
    }

    const files = fs.readdirSync(uploadDir)
    const referenced = new Set()

    for (const Model of MODELS_WITH_IMAGES) {
      const docs = await Model.find({ image: { $ne: '', $regex: '^/uploads/' } })
        .select('image')
        .lean()
      docs.forEach((d) => {
        const filename = path.basename(d.image)
        referenced.add(filename)
      })
    }

    const homeContentDocs = await HomeContent.find({
      $or: [
        { profileImage: { $ne: '', $regex: '^/uploads/' } },
        { resumeFile: { $ne: '', $regex: '^/uploads/' } },
      ],
    }).select('profileImage resumeFile').lean()
    homeContentDocs.forEach((d) => {
      if (d.profileImage) referenced.add(path.basename(d.profileImage))
      if (d.resumeFile) referenced.add(path.basename(d.resumeFile))
    })

    const orphanFiles = []
    let totalSize = 0

    for (const file of files) {
      if (!referenced.has(file)) {
        const filePath = path.join(uploadDir, file)
        try {
          const stat = fs.statSync(filePath)
          if (stat.isFile()) {
            orphanFiles.push({
              name: file,
              size: stat.size,
              sizeFormatted: fmtBytes(stat.size),
              modified: stat.mtime,
            })
            totalSize += stat.size
          }
        } catch { /* skip */ }
      }
    }

    orphanFiles.sort((a, b) => b.size - a.size)

    res.json({
      success: true,
      orphanFiles,
      totalSize,
      totalSizeFormatted: fmtBytes(totalSize),
      totalCount: orphanFiles.length,
    })
  } catch (error) {
    console.error('[maintenance] orphan files error:', error)
    res.status(500).json({ success: false, message: 'Failed to detect orphan files' })
  }
}

function fmtBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`
}

module.exports = { healthCheck, storageUsage, collectionStats, indexStatus, orphanFiles }
