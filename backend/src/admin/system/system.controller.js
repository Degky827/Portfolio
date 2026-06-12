const os = require('os')
const SystemConfig = require('../../shared/models/SystemConfig')
const config = require('../../infrastructure/config')
const backupScheduler = require('../../shared/services/backupScheduler')
const healthMonitor = require('../../shared/services/healthMonitor')
const { createNotification } = require('../notifications/notifications.controller')

function getEnvironmentInfo() {
  return {
    nodeEnv: config.nodeEnv,
    nodeVersion: process.version,
    platform: `${os.type()} ${os.release()}`,
    hostname: os.hostname(),
    cpuCores: os.cpus().length,
    totalMemory: `${(os.totalmem() / (1024 ** 3)).toFixed(1)} GB`,
    freeMemory: `${(os.freemem() / (1024 ** 3)).toFixed(1)} GB`,
    mongoUri: config.mongoUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'),
    port: config.port,
    uptime: `${Math.floor(process.uptime() / 60)}m`,
  }
}

async function getConfig(_req, res) {
  try {
    let settings = await SystemConfig.findOne().lean()
    if (!settings) {
      settings = await SystemConfig.create({})
    }
    res.json({
      success: true,
      config: settings,
      environment: getEnvironmentInfo(),
      schedulerStatus: backupScheduler.getSchedulerStatus(),
      monitorStatus: healthMonitor.getMonitorStatus(),
    })
  } catch (error) {
    console.error('[systemConfig] get error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch system config' })
  }
}

async function updateConfig(req, res) {
  try {
    let settings = await SystemConfig.findOne()
    if (!settings) {
      settings = new SystemConfig()
    }

    const fields = [
      'apiUrl',
      'uploadMaxFileSize',
      'uploadAllowedExtensions',
      'sessionTimeoutMinutes',
      'cacheEnabled',
      'cacheDurationSeconds',
      'maintenanceMode',
      'maintenanceMessage',
    ]

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === 'uploadMaxFileSize' || field === 'sessionTimeoutMinutes' || field === 'cacheDurationSeconds') {
          settings[field] = parseInt(req.body[field], 10) || 0
        } else if (field === 'cacheEnabled' || field === 'maintenanceMode') {
          settings[field] = req.body[field] === true || req.body[field] === 'true'
        } else if (field === 'uploadAllowedExtensions') {
          const val = req.body[field]
          settings[field] = typeof val === 'string'
            ? val.split(',').map((s) => s.trim()).filter(Boolean)
            : Array.isArray(val) ? val : []
        } else {
          settings[field] = req.body[field]
        }
      }
    })

    if (req.body.backupSchedule) {
      let bs = req.body.backupSchedule
      if (typeof bs === 'string') {
        try { bs = JSON.parse(bs) } catch { /* ignore */ }
      }
      if (typeof bs === 'object' && bs !== null) {
        const prev = settings.backupSchedule?.enabled
        if (!settings.backupSchedule) settings.backupSchedule = {}
        Object.assign(settings.backupSchedule, bs)

        if (settings.backupSchedule.enabled && settings.backupSchedule.frequency) {
          backupScheduler.startScheduler(settings.backupSchedule.frequency)
        } else if (!settings.backupSchedule.enabled) {
          backupScheduler.stopScheduler()
        }
      }
    }

    if (req.body.healthMonitor) {
      let hm = req.body.healthMonitor
      if (typeof hm === 'string') {
        try { hm = JSON.parse(hm) } catch { /* ignore */ }
      }
      if (typeof hm === 'object' && hm !== null) {
        if (!settings.healthMonitor) settings.healthMonitor = {}
        Object.assign(settings.healthMonitor, hm)

        if (settings.healthMonitor.enabled && settings.healthMonitor.pingIntervalSeconds) {
          healthMonitor.startMonitor(settings.healthMonitor.pingIntervalSeconds)
        } else if (!settings.healthMonitor.enabled) {
          healthMonitor.stopMonitor()
        }
      }
    }

    await settings.save()

    const updated = await SystemConfig.findOne().lean()

    res.json({
      success: true,
      config: updated,
      environment: getEnvironmentInfo(),
      schedulerStatus: backupScheduler.getSchedulerStatus(),
      monitorStatus: healthMonitor.getMonitorStatus(),
    })
  } catch (error) {
    console.error('[systemConfig] update error:', error)
    res.status(500).json({ success: false, message: 'Failed to update system config' })
  }
}

async function triggerBackup(req, res) {
  try {
    await backupScheduler.executeScheduledBackup()
    res.json({ success: true, message: 'Backup triggered successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

async function triggerHealthCheck(req, res) {
  try {
    await healthMonitor.performHealthCheck()
    res.json({
      success: true,
      message: 'Health check performed',
      ...healthMonitor.getMonitorStatus(),
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

module.exports = { getConfig, updateConfig, triggerBackup, triggerHealthCheck }
