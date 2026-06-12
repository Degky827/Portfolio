const Backup = require('../../shared/models/Backup')
const Project = require('../../shared/models/Project')
const Skill = require('../../shared/models/Skill')
const HomeContent = require('../../shared/models/HomeContent')
const AboutContent = require('../../shared/models/AboutContent')
const ContactContent = require('../../shared/models/ContactContent')
const FooterContent = require('../../shared/models/FooterContent')
const Settings = require('../../shared/models/Settings')
const { createNotification } = require('../notifications/notifications.controller')
const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')

const BACKUPS_DIR = path.resolve(__dirname, '..', '..', '..', 'backups')

const COLLECTIONS = [
  { model: Project, key: 'projects' },
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
    console.error('Backup Error:', error)
    res.status(500).json({ success: false, error: error.message || 'Failed to list backups' })
  }
}

async function createBackup(req, res) {
  try {
    if (!mongoose.connection || mongoose.connection.readyState !== 1) {
      const msg = 'MongoDB connection failed'
      console.error('Backup Error:', msg)
      return res.status(500).json({ success: false, error: msg })
    }

    const { data, summary } = await gatherAllData()
    const body = req && req.body ? req.body : {}
    const name = (typeof body.name === 'string' && body.name.trim()) ? body.name.trim() : `Manual Backup - ${new Date().toLocaleString()}`

    try {
      await fs.promises.mkdir(BACKUPS_DIR, { recursive: true })
    } catch (err) {
      console.error('Backup Error: failed to create backups directory', err)
      return res.status(500).json({ success: false, error: 'Permission denied while creating backups directory' })
    }

    const d = new Date()
    const pad = (n) => String(n).padStart(2, '0')
    const ts = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}-${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`
    const filename = `backup-${ts}.json`
    const filepath = path.join(BACKUPS_DIR, filename)

    const fileData = JSON.stringify(data, null, 2)

    try {
      await fs.promises.writeFile(filepath, fileData, 'utf8')
    } catch (err) {
      console.error('Backup Error: failed to write backup file', err)
      return res.status(500).json({ success: false, error: 'Permission denied while writing backup file' })
    }

    const fileSize = Buffer.byteLength(fileData, 'utf8')

    let backup
    try {
      backup = await Backup.create({
        name,
        type: 'manual',
        fileSize,
        summary,
        data,
      })
    } catch (createErr) {
      console.error('Backup Error: Backup.create failed:', createErr && createErr.stack ? createErr.stack : createErr)
      return res.status(500).json({ success: false, error: 'Failed to persist backup to database' })
    }

    try {
      const obj = backup.toObject()
      delete obj.data

      createNotification({ type: 'backup_completed', title: 'Backup Completed', message: `Manual backup "${name}" created successfully.`, link: '/admin/backup' })

      return res.status(201).json({
        success: true,
        message: 'Backup created successfully',
        filename,
        fileSize,
        backup: obj,
      })
    } catch (respErr) {
      console.error('Backup Error: Preparing response failed:', respErr && respErr.stack ? respErr.stack : respErr)
      return res.status(500).json({ success: false, error: 'Failed to prepare backup response' })
    }
  } catch (error) {
    console.error('Backup Error:', error)
    res.status(500).json({ success: false, error: error.message || 'Failed to create backup' })
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
    console.error('Backup Error:', error)
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch backup' })
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
    console.error('Backup Error:', error)
    res.status(500).json({ success: false, error: error.message || 'Failed to download backup' })
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
    console.error('Backup Error:', error)
    res.status(500).json({ success: false, error: error.message || 'Failed to delete backup' })
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
    console.error('Backup Error:', error)
    res.status(500).json({ success: false, error: error.message || 'Failed to process uploaded backup' })
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

    createNotification({ type: 'restore_completed', title: 'Restore Completed', message: `Backup "${backup.name}" was restored successfully.`, link: '/admin/backup' })

    res.json({
      success: true,
      message: 'Backup restored successfully',
      restorePointId: autoRP._id,
    })
  } catch (error) {
    console.error('Backup Error:', error)
    res.status(500).json({ success: false, error: error.message || 'Failed to restore backup' })
  }
}

module.exports = {
  listBackups, createBackup, getBackup, downloadBackup, deleteBackup, uploadBackup, restoreBackup,
}
