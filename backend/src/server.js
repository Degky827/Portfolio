const http = require('http')
const express = require('express')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const config = require('./infrastructure/config')
const connectDB = require('./infrastructure/database/db')
const { initSocket } = require('./infrastructure/socket')
const { csrfProtection } = require('./shared/middleware/csrf')
const { sanitizeMongo } = require('./shared/middleware/sanitize')
const { globalLimiter } = require('./shared/middleware/globalRateLimiter')
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
const footerRoutes = require('./public/footer/footer.routes')
const siteSettingsRoutes = require('./public/site-settings/siteSettings.routes')
const chatRoutes = require('./ai/routes/chat.routes')
const mediaRoutes = require('./admin/media/media.routes')
const settingsRoutes = require('./public/settings/settings.routes')
const backupRoutes = require('./admin/backups/backups.routes')
const activityLogRoutes = require('./admin/activity-logs/activity-logs.routes')
const importExportRoutes = require('./admin/import-export/import-export.routes')
const systemConfigRoutes = require('./admin/system/system.routes')
const maintenanceRoutes = require('./admin/maintenance/maintenance.routes')
const notificationRoutes = require('./admin/notifications/notifications.routes')
const navigationRoutes = require('./public/navigation/navigation.routes')
const customPageAdminRoutes = require('./admin/custom-pages/custom-pages.routes')
const customPagePublicRoutes = require('./public/custom-pages/custom-pages-public.routes')

const app = express()

app.set('trust proxy', config.nodeEnv === 'production' ? 1 : 'loopback')

app.use(cookieParser())

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      connectSrc: ["'self'", config.frontendUrl].filter(Boolean),
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'same-site' },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  noSniff: true,
  xssFilter: true,
}))

const allowedOrigins = [
  ...config.corsOrigins,
  config.frontendUrl,
].filter(Boolean)

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      console.warn(`[cors] Blocked origin: ${origin}`)
      console.warn(`[cors] Allowed origins: ${JSON.stringify(allowedOrigins)}`)
      callback(null, false)
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'X-CSRF-Token'],
  exposedHeaders: ['X-CSRF-Token'],
}

app.use(cors(corsOptions))

app.use(express.json({ strict: true, limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

app.use(sanitizeMongo)
app.use(globalLimiter)
app.use(csrfProtection)

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
app.use('/api/footer', footerRoutes)
app.use('/api/site-settings', siteSettingsRoutes)
app.use('/api/media', mediaRoutes)
app.use('/api/settings', settingsRoutes)
app.use('/api/backups', backupRoutes)
app.use('/api/activity-logs', activityLogRoutes)
app.use('/api/import-export', importExportRoutes)
app.use('/api/system-config', systemConfigRoutes)
app.use('/api/maintenance', maintenanceRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api', chatRoutes)
app.use('/api', navigationRoutes)
app.use('/api', customPageAdminRoutes)
app.use('/api', customPagePublicRoutes)

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
  res.status(err.status || 500).json({ success: false, message: 'Internal server error' })
})

async function start() {
  await connectDB()

  const { migrateOldCategories } = require('./public/skills/skills.controller')
  await migrateOldCategories()

  const backupScheduler = require('./shared/services/backupScheduler')
  const healthMonitor = require('./shared/services/healthMonitor')
  await backupScheduler.initializeScheduler()
  await healthMonitor.initializeMonitor()

  let server

  async function attemptStart(port, retries = 3) {
    server = http.createServer(app)
    initSocket(server)

    server.on('error', (err) => {
      if (err && err.code === 'EADDRINUSE') {
        if (retries > 0) {
          const next = port + 1
          console.warn(`[server] Port ${port} in use — retrying on port ${next} (${retries} attempts left)`)
          setTimeout(() => attemptStart(next, retries - 1), 500)
          return
        }
        console.error(`[server] Port ${port} already in use. No retries left.`)
        process.exit(1)
      }
      console.error('[server] Server error:', err)
      process.exit(1)
    })

    server.listen(port, () => {
      console.log(`Server running on port ${port} [${config.nodeEnv}]`)
    })
  }

  // Start server with configured port, allow a few automatic fallbacks
  await attemptStart(config.port, 3)

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
