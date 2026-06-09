const Backup = require('../models/Backup')
const Project = require('../models/Project')
const Certificate = require('../models/Certificate')
const Skill = require('../models/Skill')
const HomeContent = require('../models/HomeContent')
const AboutContent = require('../models/AboutContent')
const ContactContent = require('../models/ContactContent')
const FooterContent = require('../models/FooterContent')
const Settings = require('../models/Settings')

const COLLECTIONS = [
  { model: Project, key: 'projects' },
  { model: Certificate, key: 'certificates' },
  { model: Skill, key: 'skills' },
  { model: HomeContent, key: 'homeContent' },
  { model: AboutContent, key: 'aboutContent' },
  { model: ContactContent, key: 'contactContent' },
  { model: FooterContent, key: 'footerContent' },
  { model: Settings, key: 'settings' },
]

async function gatherAllData() {
  const results = await Promise.all(
    COLLECTIONS.map(({ model }) => model.find().lean()),
  )

  const data = {}
  const summary = {}

  COLLECTIONS.forEach(({ key }, i) => {
    data[key] = results[i]
    summary[key] = results[i].length
  })

  return { data, summary }
}

async function restoreCollection(model, docs) {
  if (!docs || docs.length === 0) return
  await model.collection.deleteMany({})
  await model.collection.insertMany(docs)
}

async function createAutoRestorePoint() {
  const { data, summary } = await gatherAllData()
  return Backup.create({
    name: `Auto Restore Point - ${new Date().toLocaleString()}`,
    type: 'auto',
    fileSize: Buffer.byteLength(JSON.stringify(data), 'utf8'),
    summary,
    data,
  })
}

async function listBackups(req, res) {
  try {
    const backups = await Backup.find()
      .select('-data')
      .sort({ createdAt: -1 })
      .lean()
    res.json({ success: true, backups })
  } catch (error) {
    console.error('[backup] list error:', error)
    res.status(500).json({ success: false, message: 'Failed to list backups' })
  }
}

async function createBackup(req, res) {
  try {
    const { data, summary } = await gatherAllData()
    const name = req.body.name || `Manual Backup - ${new Date().toLocaleString()}`
    const backup = await Backup.create({
      name,
      type: 'manual',
      fileSize: Buffer.byteLength(JSON.stringify(data), 'utf8'),
      summary,
      data,
    })
    const obj = backup.toObject()
    delete obj.data
    res.status(201).json({ success: true, backup: obj })
  } catch (error) {
    console.error('[backup] create error:', error)
    res.status(500).json({ success: false, message: 'Failed to create backup' })
  }
}

async function getBackup(req, res) {
  try {
    const backup = await Backup.findById(req.params.id).lean()
    if (!backup) {
      return res.status(404).json({ success: false, message: 'Backup not found' })
    }
    res.json({ success: true, backup })
  } catch (error) {
    console.error('[backup] get error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch backup' })
  }
}

async function downloadBackup(req, res) {
  try {
    const backup = await Backup.findById(req.params.id).lean()
    if (!backup) {
      return res.status(404).json({ success: false, message: 'Backup not found' })
    }
    const safeName = backup.name.replace(/[^a-zA-Z0-9_\- ]/g, '_')
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Content-Disposition', `attachment; filename="${safeName}.json"`)
    res.json(backup.data)
  } catch (error) {
    console.error('[backup] download error:', error)
    res.status(500).json({ success: false, message: 'Failed to download backup' })
  }
}

async function deleteBackup(req, res) {
  try {
    const backup = await Backup.findByIdAndDelete(req.params.id)
    if (!backup) {
      return res.status(404).json({ success: false, message: 'Backup not found' })
    }
    res.json({ success: true, message: 'Backup deleted successfully' })
  } catch (error) {
    console.error('[backup] delete error:', error)
    res.status(500).json({ success: false, message: 'Failed to delete backup' })
  }
}

async function uploadBackup(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' })
    }

    let parsed
    try {
      parsed = JSON.parse(req.file.buffer.toString('utf8'))
    } catch {
      return res.status(400).json({ success: false, message: 'Invalid JSON file' })
    }

    const requiredKeys = COLLECTIONS.map((c) => c.key)
    const missing = requiredKeys.filter((k) => !(k in parsed))
    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid backup file. Missing sections: ${missing.join(', ')}`,
      })
    }

    const summary = {}
    requiredKeys.forEach((key) => {
      summary[key] = Array.isArray(parsed[key]) ? parsed[key].length : 0
    })

    const backup = await Backup.create({
      name: `Uploaded - ${new Date().toLocaleString()}`,
      type: 'uploaded',
      fileSize: req.file.size,
      summary,
      data: parsed,
    })

    res.status(201).json({ success: true, backup })
  } catch (error) {
    console.error('[backup] upload error:', error)
    res.status(500).json({ success: false, message: 'Failed to process uploaded backup' })
  }
}

async function restoreBackup(req, res) {
  try {
    const backup = await Backup.findById(req.params.id)
    if (!backup) {
      return res.status(404).json({ success: false, message: 'Backup not found' })
    }

    const autoRP = await createAutoRestorePoint()

    for (const { model, key } of COLLECTIONS) {
      const docs = backup.data[key]
      if (Array.isArray(docs)) {
        await restoreCollection(model, docs)
      }
    }

    res.json({
      success: true,
      message: 'Backup restored successfully',
      restorePointId: autoRP._id,
    })
  } catch (error) {
    console.error('[backup] restore error:', error)
    res.status(500).json({ success: false, message: 'Failed to restore backup' })
  }
}

module.exports = {
  listBackups,
  createBackup,
  getBackup,
  downloadBackup,
  deleteBackup,
  uploadBackup,
  restoreBackup,
}
