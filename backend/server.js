const express = require('express')
const cors = require('cors')
const config = require('./config/index')
const connectDB = require('./config/db')
const analyticsRoutes = require('./routes/analytics')
const authRoutes = require('./routes/auth')

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
