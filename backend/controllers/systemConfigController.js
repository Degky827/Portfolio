const os = require('os')
const SystemConfig = require('../models/SystemConfig')
const config = require('../config/index')

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

    await settings.save()
    res.json({ success: true, config: settings, environment: getEnvironmentInfo() })
  } catch (error) {
    console.error('[systemConfig] update error:', error)
    res.status(500).json({ success: false, message: 'Failed to update system config' })
  }
}

module.exports = { getConfig, updateConfig }
