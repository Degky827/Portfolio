const cron = require('node-cron')
const Backup = require('../models/Backup')
const SystemConfig = require('../models/SystemConfig')
const Project = require('../models/Project')
const Skill = require('../models/Skill')
const HomeContent = require('../models/HomeContent')
const AboutContent = require('../models/AboutContent')
const ContactContent = require('../models/ContactContent')
const FooterContent = require('../models/FooterContent')
const Settings = require('../models/Settings')
const { createNotification } = require('../../admin/notifications/notifications.controller')
const { uploadToCloud } = require('./s3Uploader')
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

const FREQUENCY_MAP = {
  every_12_hours: '0 */12 * * *',
  daily_midnight: '0 0 * * *',
  weekly_sunday: '0 0 * * 0',
}

let currentJob = null

function cronExpression(frequency) {
  return FREQUENCY_MAP[frequency] || null
}

async function executeScheduledBackup() {
  try {
    const results = await Promise.all(
      COLLECTIONS.map(({ model }) => model.find().lean()),
    )

    const data = {}
    const summary = {}

    COLLECTIONS.forEach(({ key }, i) => {
      data[key] = results[i]
      summary[key] = results[i].length
    })

    const d = new Date()
    const pad = (n) => String(n).padStart(2, '0')
    const ts = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}-${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`
    const name = `Auto Backup - ${d.toLocaleString()}`
    const filename = `backup-auto-${ts}.json`

    const fileData = JSON.stringify(data, null, 2)
    const fileSize = Buffer.byteLength(fileData, 'utf8')

    fs.mkdirSync(BACKUPS_DIR, { recursive: true })
    const filepath = path.join(BACKUPS_DIR, filename)
    fs.writeFileSync(filepath, fileData, 'utf8')

    const backup = await Backup.create({
      name,
      type: 'auto',
      fileSize,
      summary,
      data,
    })

    const config = await SystemConfig.findOne()
    const cloudConfig = config?.backupSchedule?.cloudUpload
    if (cloudConfig?.enabled) {
      uploadToCloud(filepath, cloudConfig).catch((err) =>
        console.error('[backupScheduler] Cloud upload failed:', err.message),
      )
    }

    if (config?.backupSchedule?.retentionCount) {
      const maxRetain = config.backupSchedule.retentionCount
      const autoBackups = await Backup.find({ type: 'auto' }).sort({ createdAt: -1 }).lean()
      if (autoBackups.length > maxRetain) {
        const toDelete = autoBackups.slice(maxRetain).map((b) => b._id)
        await Backup.deleteMany({ _id: { $in: toDelete } })
      }
    }

    if (config) {
      config.backupSchedule.lastRun = new Date()
      const nextDate = new Date()
      nextDate.setHours(nextDate.getHours() + 12)
      config.backupSchedule.nextRun = nextDate
      await config.save()
    }

    createNotification({
      type: 'backup_completed',
      title: 'Scheduled Backup Completed',
      message: `Auto backup "${name}" created (${(fileSize / 1024).toFixed(1)} KB).`,
      link: '/admin/backup',
    })

    console.log(`[backupScheduler] Auto backup created: ${name}`)
  } catch (error) {
    console.error('[backupScheduler] Backup execution failed:', error)
    createNotification({
      type: 'system_warning',
      title: 'Scheduled Backup Failed',
      message: `Auto backup failed: ${error.message}`,
      link: '/admin/backup',
    })
  }
}

function startScheduler(frequency) {
  stopScheduler()

  const expr = cronExpression(frequency)
  if (!expr) {
    console.warn(`[backupScheduler] Unknown frequency: ${frequency}`)
    return
  }

  currentJob = cron.schedule(expr, () => {
    executeScheduledBackup()
  })

  console.log(`[backupScheduler] Scheduler started (${frequency}) — cron: ${expr}`)
}

function stopScheduler() {
  if (currentJob) {
    currentJob.stop()
    currentJob = null
    console.log('[backupScheduler] Scheduler stopped')
  }
}

function getSchedulerStatus() {
  return {
    running: currentJob !== null,
    frequency: currentJob ? 'active' : 'idle',
  }
}

async function initializeScheduler() {
  try {
    const config = await SystemConfig.findOne()
    const schedule = config?.backupSchedule
    if (schedule?.enabled && schedule.frequency) {
      startScheduler(schedule.frequency)
    } else {
      console.log('[backupScheduler] Scheduler not enabled in config')
    }
  } catch (error) {
    console.error('[backupScheduler] Init error:', error)
  }
}

module.exports = {
  startScheduler,
  stopScheduler,
  getSchedulerStatus,
  initializeScheduler,
  executeScheduledBackup,
}
