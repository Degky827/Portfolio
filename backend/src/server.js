const http = require('http')
const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const config = require('./infrastructure/config')
const connectDB = require('./infrastructure/database/db')
const { initSocket } = require('./infrastructure/socket')
const analyticsRoutes = require('./admin/analytics/analytics.routes')
const authRoutes = require('./admin/auth/auth.routes')
const userRoutes = require('./admin/users/users.routes')
const projectRoutes = require('./public/projects/projects.routes')
const skillRoutes = require('./public/skills/skills.routes')
const categoryRoutes = require('./public/skills/categories.routes')
const homeContentRoutes = require('./public/homepage/homepage.routes')
const aboutRoutes = require('./public/about/about.routes')
const contactRoutes = require('./public/contact/contact.routes')
const contactMessageRoutes = require('./public/contact/contact-messages.routes')
const messagesRoutes = require('./public/contact/messages.routes')
const footerRoutes = require('./public/footer/footer.routes')
const mediaRoutes = require('./admin/media/media.routes')
const settingsRoutes = require('./public/settings/settings.routes')
const backupRoutes = require('./admin/backups/backups.routes')
const activityLogRoutes = require('./admin/activity-logs/activity-logs.routes')
const importExportRoutes = require('./admin/import-export/import-export.routes')
const systemConfigRoutes = require('./admin/system/system.routes')
const maintenanceRoutes = require('./admin/maintenance/maintenance.routes')
const notificationRoutes = require('./admin/notifications/notifications.routes')

const app = express()

app.set('trust proxy', true)

app.use(cookieParser())

const allowedOrigins = [
  'https://modernize-portifo.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  ...config.corsOrigins.filter((o) => !o.startsWith('http://localhost')),
]

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      console.warn(`[cors] Blocked origin: ${origin}`)
      callback(null, false)
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
}

app.use(cors(corsOptions))

app.use(express.json({ strict: true, limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'Server running smoothly',
    timestamp: new Date().toISOString(),
  })
})
app.use('/api/analytics', analyticsRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/skills', skillRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/home-content', homeContentRoutes)
app.use('/api/about', aboutRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/contact-messages', contactMessageRoutes)
app.use('/api/messages', messagesRoutes)
app.use('/api/footer', footerRoutes)
app.use('/api/media', mediaRoutes)
app.use('/api/settings', settingsRoutes)
app.use('/api/backups', backupRoutes)
app.use('/api/activity-logs', activityLogRoutes)
app.use('/api/import-export', importExportRoutes)
app.use('/api/system-config', systemConfigRoutes)
app.use('/api/maintenance', maintenanceRoutes)
app.use('/api/notifications', notificationRoutes)

app.use('/uploads', express.static('uploads'))

app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

app.use((err, _req, res, _next) => {
  console.error('[server] Unhandled error:', err)
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ success: false, message: 'Request body too large. Max 10MB allowed.' })
  }
  if (err.name === 'SyntaxError' && err.status === 400) {
    return res.status(400).json({ success: false, message: 'Invalid JSON in request body.' })
  }
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, message: 'File exceeds size limit.' })
  }
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal server error' })
})

async function start() {
  await connectDB()

  const { migrateOldCategories } = require('./public/skills/skills.controller')
  await migrateOldCategories()

  const backupScheduler = require('./shared/services/backupScheduler')
  const healthMonitor = require('./shared/services/healthMonitor')
  await backupScheduler.initializeScheduler()
  await healthMonitor.initializeMonitor()

  const server = http.createServer(app)
  initSocket(server)

  server.listen(config.port, () => {
    console.log(
      `Server running on port ${config.port} [${config.nodeEnv}]`,
    )
  })

  const shutdown = async (signal) => {
    console.log(`\n${signal} received. Shutting down gracefully...`)
    server.close(() => {
      console.log('HTTP server closed.')
      process.exit(0)
    })
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT', () => shutdown('SIGINT'))
}

start()
