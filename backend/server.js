const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const config = require('./config/index')
const connectDB = require('./config/db')
const analyticsRoutes = require('./routes/analytics')
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/users')
const projectRoutes = require('./routes/projects')
const skillRoutes = require('./routes/skills')
const categoryRoutes = require('./routes/categories')
const homeContentRoutes = require('./routes/homeContent')
const aboutRoutes = require('./routes/about')
const contactRoutes = require('./routes/contact')
const footerRoutes = require('./routes/footer')
const mediaRoutes = require('./routes/media')
const settingsRoutes = require('./routes/settings')
const backupRoutes = require('./routes/backups')
const activityLogRoutes = require('./routes/activityLogs')
const importExportRoutes = require('./routes/importExport')
const systemConfigRoutes = require('./routes/systemConfig')
const maintenanceRoutes = require('./routes/maintenance')
const notificationRoutes = require('./routes/notifications')

const app = express()

// ---------------------------------------------------------------------------
// Cookie parser — must be registered before any route that reads cookies
// ---------------------------------------------------------------------------
app.use(cookieParser())

// ---------------------------------------------------------------------------
// CORS — authorize Vercel frontend + local dev
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
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
app.use('/api/footer', footerRoutes)
app.use('/api/media', mediaRoutes)
app.use('/api/settings', settingsRoutes)
app.use('/api/backups', backupRoutes)
app.use('/api/activity-logs', activityLogRoutes)
app.use('/api/import-export', importExportRoutes)
app.use('/api/system-config', systemConfigRoutes)
app.use('/api/maintenance', maintenanceRoutes)
app.use('/api/notifications', notificationRoutes)

// Serve uploaded files
app.use('/uploads', express.static('uploads'))

// ---------------------------------------------------------------------------
// 404 fallback
// ---------------------------------------------------------------------------
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// ---------------------------------------------------------------------------
// Global error handler — catches body-parser / multer / unexpected errors
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
async function start() {
  await connectDB()

  // Migrate old category values to new enum-compatible values
  const { migrateOldCategories } = require('./controllers/skillController')
  await migrateOldCategories()

  const server = app.listen(config.port, () => {
    console.log(
      `Server running on port ${config.port} [${config.nodeEnv}]`,
    )
  })

  // Graceful shutdown
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
