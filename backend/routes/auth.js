const { Router } = require('express')
const bcrypt = require('bcryptjs')
const speakeasy = require('speakeasy')
const qrcode = require('qrcode')
const jwt = require('jsonwebtoken')
const Admin = require('../models/Admin')
const config = require('../config')

const router = Router()

// POST /api/auth/register-admin
// One-time endpoint to create the admin account with a hashed password.
router.post('/register-admin', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' })
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' })
    }

    const existing = await Admin.findOne({ email: email.toLowerCase() })
    if (existing) {
      return res.status(409).json({ success: false, message: 'An admin with this email already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    await Admin.create({ email: email.toLowerCase(), password: hashedPassword })

    res.status(201).json({ success: true, message: 'Admin registered. Call GET /api/auth/setup-2fa to configure 2FA.' })
  } catch (err) {
    console.error('[auth] register-admin error:', err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

// GET /api/auth/setup-2fa?email=admin@example.com
// Generates a TOTP secret for the admin, persists it, and returns a QR code
// as a base64 data URL that can be scanned into Google Authenticator.
router.get('/setup-2fa', async (req, res) => {
  try {
    const { email } = req.query
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email query parameter is required' })
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() })
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found. Register first.' })
    }

    const secret = speakeasy.generateSecret({
      name: `Portkiro (${admin.email})`,
    })

    admin.twoFactorSecret = secret.base32
    await admin.save()

    const qrCode = await qrcode.toDataURL(secret.otpauth_url)

    res.json({ success: true, secret: secret.base32, qrCode })
  } catch (err) {
    console.error('[auth] setup-2fa error:', err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

// POST /api/auth/admin-login
// Two-phase login:
//   Phase 1 – send { email, password }
//     If credentials are valid and 2FA is configured, responds with { requiresTwoFactor: true }.
//   Phase 2 – send { email, password, twoFactorToken }
//     Verifies password + TOTP token. On success returns a signed JWT.
router.post('/admin-login', async (req, res) => {
  try {
    const { email, password, twoFactorToken } = req.body
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' })
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() })
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    const passwordValid = await bcrypt.compare(password, admin.password)
    if (!passwordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    const twoFactorConfigured = !!admin.twoFactorSecret

    // Phase 1 — password correct, 2FA is set up, but no token provided yet
    if (twoFactorConfigured && !twoFactorToken) {
      return res.json({ success: true, requiresTwoFactor: true })
    }

    // Phase 2 — verify the TOTP code
    if (twoFactorConfigured) {
      const tokenValid = speakeasy.totp.verify({
        secret: admin.twoFactorSecret,
        encoding: 'base32',
        token: twoFactorToken,
        window: 1,
      })
      if (!tokenValid) {
        return res.status(401).json({ success: false, message: 'Invalid 2FA code' })
      }
    }

    const jwtToken = jwt.sign(
      { id: admin._id, email: admin.email },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn },
    )

    res.json({ success: true, token: jwtToken, user: { email: admin.email } })
  } catch (err) {
    console.error('[auth] admin-login error:', err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

module.exports = router
