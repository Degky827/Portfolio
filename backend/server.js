const express = require('express')
const cors = require('cors')
const config = require('./config/index')
const connectDB = require('./config/db')
const analyticsRoutes = require('./routes/analytics')

const app = express()

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
app.use(cors({ origin: config.corsOrigin, credentials: true }))
app.use(express.json({ strict: true }))

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})
app.use('/api/analytics', analyticsRoutes)

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
async function start() {
  await connectDB()

  app.listen(config.port, () => {
    console.log(
      `Server running on port ${config.port} [${config.nodeEnv}]`,
    )
  })
}

start()
