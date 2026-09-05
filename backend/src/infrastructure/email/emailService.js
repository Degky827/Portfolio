const nodemailer = require('nodemailer')

let transporter = null

function getTransporter() {
  if (transporter) return transporter

  const host = process.env.SMTP_HOST
  const port = parseInt(process.env.SMTP_PORT, 10) || 587
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) {
    console.warn('[email] SMTP not configured — replies will not be sent')
    return null
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })

  return transporter
}

async function sendReplyEmail({ to, subject, html, fromName, fromEmail }) {
  const transport = getTransporter()
  if (!transport) {
    console.warn('[email] SMTP not configured, skipping email send')
    return { sent: false, reason: 'SMTP not configured' }
  }

  const senderName = fromName || process.env.SMTP_FROM_NAME || 'Portfolio'
  const senderEmail = fromEmail || process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER

  const info = await transport.sendMail({
    from: `"${senderName}" <${senderEmail}>`,
    to,
    subject,
    html,
  })

  return { sent: true, messageId: info.messageId }
}

module.exports = { sendReplyEmail, getTransporter }
