const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const config = require('./config/index')
const connectDB = require('./config/db')
const analyticsRoutes = require('./routes/analytics')
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/users')
const projectRoutes = require('./routes/projects')
const certificateRoutes = require('./routes/certificates')
const skillRoutes = require('./routes/skills')
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
// CORS — accept multiple origins from env (comma-separated)
// ---------------------------------------------------------------------------
const corsOptions = {
  origin(origin, callback) {
    // Allow requests with no origin (server-to-server, curl, etc.)
    if (!origin || config.corsOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(null, false)
    }
  },
  credentials: true,
}

app.use(cors(corsOptions))
app.use(express.json({ strict: true }))
app.use(cookieParser())

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
app.use('/api/certificates', certificateRoutes)
app.use('/api/skills', skillRoutes)
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
// Start
// ---------------------------------------------------------------------------
async function start() {
  await connectDB()

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
