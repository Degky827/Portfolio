const https = require('https')
const http = require('http')

const COLORS = {
  error: 0xFF4444,
  warning: 0xFFAA44,
  info: 0x4488FF,
  success: 0x44FF88,
}

function buildDiscordPayload(title, message, level = 'error', fields = []) {
  return {
    embeds: [{
      title,
      description: message,
      color: COLORS[level] || COLORS.info,
      timestamp: new Date().toISOString(),
      fields: fields.length > 0 ? fields : undefined,
      footer: { text: `Portfolio Health Monitor · ${process.env.NODE_ENV || 'production'}` },
    }],
  }
}

function buildSlackPayload(title, message, level = 'error') {
  const emoji = level === 'error' ? '🚨' : level === 'warning' ? '⚠️' : 'ℹ️'
  return {
    text: `${emoji} *${title}*`,
    blocks: [
      { type: 'header', text: { type: 'plain_text', text: `${emoji} ${title}` } },
      { type: 'section', text: { type: 'mrkdwn', text: message } },
      {
        type: 'context',
        elements: [
          { type: 'mrkdwn', text: `Environment: \`${process.env.NODE_ENV || 'production'}\` · ${new Date().toISOString()}` },
        ],
      },
    ],
  }
}

function buildCustomPayload(title, message, level = 'error') {
  return {
    event: 'health_alert',
    level,
    title,
    message,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
  }
}

async function sendWebhook(webhookUrl, webhookType, title, message, level = 'error', fields = []) {
  if (!webhookUrl) {
    console.warn('[webhookNotifier] No webhook URL configured; skipping alert')
    return { sent: false, reason: 'no_url' }
  }

  let payload
  switch (webhookType) {
    case 'discord':
      payload = buildDiscordPayload(title, message, level, fields)
      break
    case 'slack':
      payload = buildSlackPayload(title, message, level)
      break
    default:
      payload = buildCustomPayload(title, message, level)
  }

  try {
    const body = JSON.stringify(payload)
    const url = new URL(webhookUrl)
    const transport = url.protocol === 'https:' ? https : http

    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    }

    return new Promise((resolve, reject) => {
      const req = transport.request(options, (res) => {
        let responseBody = ''
        res.on('data', (chunk) => { responseBody += chunk })
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log(`[webhookNotifier] Alert sent to ${webhookType} (${res.statusCode})`)
            resolve({ sent: true, statusCode: res.statusCode })
          } else {
            console.warn(`[webhookNotifier] Webhook returned ${res.statusCode}: ${responseBody}`)
            resolve({ sent: false, statusCode: res.statusCode, response: responseBody })
          }
        })
      })
      req.on('error', (err) => {
        console.error(`[webhookNotifier] Request failed: ${err.message}`)
        reject(err)
      })
      req.write(body)
      req.end()
    })
  } catch (error) {
    console.error(`[webhookNotifier] Failed to send webhook: ${error.message}`)
    return { sent: false, error: error.message }
  }
}

module.exports = { sendWebhook }
