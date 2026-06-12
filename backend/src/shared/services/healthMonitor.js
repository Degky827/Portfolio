const mongoose = require('mongoose')
const SystemConfig = require('../models/SystemConfig')
const { sendWebhook } = require('./webhookNotifier')
const { createNotification } = require('../../admin/notifications/notifications.controller')

let monitorInterval = null
let lastHealthy = true
let consecutiveFailures = 0

async function performHealthCheck() {
  try {
    const config = await SystemConfig.findOne().lean()
    const monitor = config?.healthMonitor
    if (!monitor?.enabled) return

    const start = Date.now()
    await mongoose.connection.db.admin().ping()
    const latency = Date.now() - start

    const readyState = mongoose.connection.readyState
    const isHealthy = readyState === 1 && latency <= (monitor.latencyThresholdMs || 500)

    if (!isHealthy) {
      consecutiveFailures++
      const issues = []
      if (readyState !== 1) issues.push(`MongoDB readyState is ${readyState} (expected 1)`)
      if (latency > (monitor.latencyThresholdMs || 500)) {
        issues.push(`Latency ${latency}ms exceeds threshold ${monitor.latencyThresholdMs}ms`)
      }

      const title = 'Health Check Alert'
      const message = `Portfolio backend health check failed.\n${issues.join('\n')}\n\nHost: ${mongoose.connection.host || 'unknown'}\nDatabase: ${mongoose.connection.name || 'unknown'}\nFailures: ${consecutiveFailures}`

      if (lastHealthy || consecutiveFailures === 1) {
        sendWebhook(monitor.webhookUrl, monitor.webhookType || 'discord', title, message, 'error', [
          { name: 'Latency', value: `${latency}ms`, inline: true },
          { name: 'Ready State', value: `${readyState}`, inline: true },
          { name: 'Threshold', value: `${monitor.latencyThresholdMs}ms`, inline: true },
          { name: 'Consecutive Failures', value: `${consecutiveFailures}`, inline: true },
        ]).catch((err) => console.error('[healthMonitor] Webhook send failed:', err.message))

        createNotification({
          type: 'system_warning',
          title: 'Health Check Failed',
          message: `MongoDB latency ${latency}ms / readyState ${readyState} (threshold ${monitor.latencyThresholdMs}ms)`,
          link: '/admin/maintenance',
        })
      }

      lastHealthy = false
    } else {
      if (!lastHealthy && consecutiveFailures > 0 && monitor.notifyOnRecovery) {
        sendWebhook(
          monitor.webhookUrl,
          monitor.webhookType || 'discord',
          'Health Check Recovered',
          `Backend health restored after ${consecutiveFailures} failure(s).\nLatency: ${latency}ms | Ready State: ${readyState}`,
          'success',
        ).catch(() => {})
      }
      consecutiveFailures = 0
      lastHealthy = true
    }
  } catch (error) {
    consecutiveFailures++
    const config = await SystemConfig.findOne().lean().catch(() => null)
    const monitor = config?.healthMonitor

    if (lastHealthy || consecutiveFailures === 1) {
      const title = 'Health Check Error'
      const message = `Health check threw an exception: ${error.message}`
      if (monitor?.webhookUrl) {
        sendWebhook(monitor.webhookUrl, monitor.webhookType || 'discord', title, message, 'error').catch(() => {})
      }
      createNotification({
        type: 'system_warning',
        title: 'Health Monitor Error',
        message: error.message,
        link: '/admin/maintenance',
      })
    }
    lastHealthy = false
  }
}

function startMonitor(intervalSeconds = 60) {
  stopMonitor()
  const intervalMs = (intervalSeconds || 60) * 1000
  console.log(`[healthMonitor] Starting daemon (interval: ${intervalSeconds}s)`)
  lastHealthy = true
  consecutiveFailures = 0
  performHealthCheck()
  monitorInterval = setInterval(performHealthCheck, intervalMs)
}

function stopMonitor() {
  if (monitorInterval) {
    clearInterval(monitorInterval)
    monitorInterval = null
    console.log('[healthMonitor] Daemon stopped')
  }
}

function getMonitorStatus() {
  return {
    running: monitorInterval !== null,
    lastHealthy,
    consecutiveFailures,
  }
}

async function initializeMonitor() {
  try {
    const config = await SystemConfig.findOne()
    const monitor = config?.healthMonitor
    if (monitor?.enabled && monitor.pingIntervalSeconds) {
      startMonitor(monitor.pingIntervalSeconds)
    } else {
      console.log('[healthMonitor] Not enabled in config')
    }
  } catch (error) {
    console.error('[healthMonitor] Init error:', error)
  }
}

module.exports = {
  startMonitor,
  stopMonitor,
  getMonitorStatus,
  initializeMonitor,
  performHealthCheck,
}
