const path = require('path')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') })
}

const REQUIRED_VARS = ['JWT_SECRET']

const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri:
    process.env.MONGO_URI || 'mongodb://localhost:27017/portkiro',
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  frontendUrl: process.env.FRONTEND_URL,
  corsOrigins: parseCorsOrigins(
    process.env.CORS_ORIGINS ||
      process.env.CORS_ORIGIN ||
      'http://localhost:5173',
  ),
}

const missing = REQUIRED_VARS.filter((name) => !process.env[name])
if (missing.length > 0) {
  console.error(
    `[config] Missing required environment variables: ${missing.join(', ')}` +
      '\n  Set them in backend/.env or in your deployment environment.' +
      '\n  See backend/.env.example for documentation.',
  )
  if (process.env.NODE_ENV === 'production') {
    process.exit(1)
  }
}

/**
 * Parses a comma-separated origin string into a trimmed array.
 * Ensures CORS_ORIGINS can hold dev + production URLs in a single env var.
 */
function parseCorsOrigins(raw) {
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

module.exports = config
