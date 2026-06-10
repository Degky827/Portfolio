const jwt = require('jsonwebtoken')
const speakeasy = require('speakeasy')
const qrcode = require('qrcode')
const User = require('../models/User')
const AuditLog = require('../models/AuditLog')
const config = require('../config')

const MAX_FAILED_ATTEMPTS = 5
const LOCK_DURATION_MINUTES = 15

function generateAccessToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    config.jwtSecret,
    { expiresIn: '1h' },
  )
}

function generateRefreshToken(user) {
  return jwt.sign(
    { id: user._id, type: 'refresh' },
    config.jwtSecret,
    { expiresIn: '7d' },
  )
}

function generate2FASecret(email) {
  const secret = speakeasy.generateSecret({
    name: `Portfolio (${email})`,
  })
  return {
    base32: secret.base32,
    otpauthUrl: secret.otpauth_url,
  }
}

async function generateQRCodeDataURL(otpauthUrl) {
  try {
    return await qrcode.toDataURL(otpauthUrl)
  } catch {
    return ''
  }
}

async function createAuditLog({ user, action, resource, resourceId, details, req, success }) {
  try {
    await AuditLog.create({
      user: user?._id || user,
      action,
      resource: resource || '',
      resourceId: resourceId || '',
      details: details || {},
      ipAddress: req?.ip || req?.headers?.['x-forwarded-for'] || '',
      userAgent: req?.headers?.['user-agent'] || '',
      success: success !== false,
    })
  } catch (err) {
    console.error('[audit] Failed to create audit log:', err.message)
  }
}

/** Step 1: verify email + password only. NEVER issues a final JWT.
 *
 *  ── Backslash-safe ──────────────────────────────────────────────────
 *  Passwords containing `\` arrive correctly through the JSON pipeline
 *  (axios → JSON.stringify → express.json()).  bcrypt.compare() treats
 *  `\` as a literal byte — no escaping issues at this layer.
 *
 *  If the password was wrong, check that the ORIGINAL hash was created
 *  from the same raw string (see seed.js documentation).
 *
 *  ── Crash-safe ──────────────────────────────────────────────────────
 *  On success the response is sent IMMEDIATELY.  The failed-attempts
 *  reset is fire-and-forget via updateOne() — it will never block or
 *  crash the login flow.
 */
async function loginStep1(req, res) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      })
    }

    console.log('[auth] loginStep1 — password length:', password.length)
    console.log('[auth] loginStep1 — password char codes:', [...password].map((c) => c.charCodeAt(0)))

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+password +failedLoginAttempts +lockedUntil',
    )
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      })
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'This account has been disabled. Contact an administrator.',
      })
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const remainingMinutes = Math.ceil((user.lockedUntil - new Date()) / 60000)
      return res.status(423).json({
        success: false,
        message: `Account is locked. Try again in ${remainingMinutes} minute(s).`,
      })
    }

    const isMatch = await user.comparePassword(password)

    /* ── Wrong password: increment counter, maybe lock ─────────────── */
    if (!isMatch) {
      const newFailed = (user.failedLoginAttempts || 0) + 1
      const shouldLock = newFailed >= MAX_FAILED_ATTEMPTS

      await User.updateOne(
        { _id: user._id },
        {
          $set: {
            failedLoginAttempts: newFailed,
            lockedUntil: shouldLock
              ? new Date(Date.now() + LOCK_DURATION_MINUTES * 60 * 1000)
              : user.lockedUntil || null,
          },
        },
      )

      if (shouldLock) {
        return res.status(423).json({
          success: false,
          message: `Account locked due to ${MAX_FAILED_ATTEMPTS} failed attempts. Try again in ${LOCK_DURATION_MINUTES} minutes.`,
        })
      }

      const remaining = MAX_FAILED_ATTEMPTS - newFailed
      return res.status(401).json({
        success: false,
        message: `Invalid email or password. ${remaining} attempt(s) remaining.`,
      })
    }

    /* ── Correct password ────────────────────────────────────────────
     * 1. Reject non-super-admin immediately.
     * 2. Wipe the failed-attempt counter (non-blocking).
     * 3. Tell the frontend to show the 2FA screen.
     * 4. Do NOT issue a JWT.  Do NOT verify a TOTP code.
     */
    if (user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only super administrators can access this system.',
      })
    }

    await User.updateOne(
      { _id: user._id },
      { $set: { failedLoginAttempts: 0, lockedUntil: null } },
    )

    return res.status(200).json({
      success: true,
      require2FA: true,
      email: user.email,
      message: 'Password verified. Please provide 2FA TOTP code.',
    })
  } catch (error) {
    console.error('CRITICAL LOGIN ERROR:', error)
    return res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message,
    })
  }
}

/** Step 2: verify TOTP code and issue the final JWT.
 *
 *  ── Crash-safe ──────────────────────────────────────────────────────
 *  Uses User.updateOne() instead of user.save() to bypass Mongoose
 *  validation and hooks.  The JWT is generated from config.jwtSecret
 *  (loaded via the config module).  The response includes both `token`
 *  and `user` so that the frontend's setAuth() can store them.
 */
async function verify2FA(req, res) {
  try {
    const { email, totpCode, rememberMe } = req.body

    if (!email || !totpCode) {
      return res.status(400).json({
        success: false,
        message: 'Email and TOTP code are required.',
      })
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+twoFactorSecret +twoFactorEnabled +failedLoginAttempts +lockedUntil',
    )
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found.',
      })
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'This account has been disabled.',
      })
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const remainingMinutes = Math.ceil((user.lockedUntil - new Date()) / 60000)
      return res.status(423).json({
        success: false,
        message: `Account is locked. Try again in ${remainingMinutes} minute(s).`,
      })
    }

    if (user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only super administrators can access this system.',
      })
    }

    if (!user.twoFactorSecret) {
      return res.status(400).json({
        success: false,
        message: '2FA is not configured for this account. Contact an administrator.',
      })
    }

    /* ── Verify TOTP token ─────────────────────────────────────────── */
    const isVerified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: totpCode,
      window: 1,
    })

    if (!isVerified) {
      const newFailed = (user.failedLoginAttempts || 0) + 1
      const shouldLock = newFailed >= MAX_FAILED_ATTEMPTS

      await User.updateOne(
        { _id: user._id },
        {
          $set: {
            failedLoginAttempts: newFailed,
            lockedUntil: shouldLock
              ? new Date(Date.now() + LOCK_DURATION_MINUTES * 60 * 1000)
              : user.lockedUntil || null,
          },
        },
      )

      if (shouldLock) {
        return res.status(423).json({
          success: false,
          message: `Account locked due to ${MAX_FAILED_ATTEMPTS} failed attempts. Try again in ${LOCK_DURATION_MINUTES} minutes.`,
        })
      }

      return res.status(400).json({
        success: false,
        message: 'Invalid or expired 2FA code. Please try again.',
      })
    }

    /* ── TOTP verified — issue final JWT as httpOnly cookie ────────── */
    const accessToken = generateAccessToken(user)

    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          failedLoginAttempts: 0,
          lockedUntil: null,
          lastLogin: new Date(),
        },
      },
    )

    /* ── Build the user payload (mirrors User.toJSON()) ─────────────── */
    const userPayload = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }

    const isProduction = config.nodeEnv === 'production'

    res.cookie('token', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000,
    })

    return res.status(200).json({
      success: true,
      user: userPayload,
      message: 'Authentication successful. Welcome back!',
    })
  } catch (error) {
    console.error('CRITICAL 2FA VERIFICATION ERROR:', error)
    return res.status(500).json({
      success: false,
      message: 'Server error during 2FA verification.',
      error: error.message,
    })
  }
}

async function logout(req, res) {
  try {
    if (req.body.refreshToken && req.user) {
      req.user.refreshTokens = (req.user.refreshTokens || []).filter(
        (rt) => rt.token !== req.body.refreshToken,
      )
      await req.user.save()
    }

    await createAuditLog({ user: req.user?._id, action: 'LOGOUT', details: {}, req })

    const isProduction = config.nodeEnv === 'production'

    res.cookie('token', '', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      expires: new Date(0),
    })

    res.json({ success: true, message: 'Logged out successfully. Cookie cleared.' })
  } catch (error) {
    console.error('[auth] logout error:', error)
    res.status(500).json({ success: false, message: 'Server error during logout.' })
  }
}

async function refresh(req, res) {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'Refresh token is required.' })
    }

    let decoded
    try {
      decoded = jwt.verify(refreshToken, config.jwtSecret)
    } catch {
      return res.status(401).json({ success: false, message: 'Invalid or expired refresh token.' })
    }

    if (decoded.type !== 'refresh') {
      return res.status(401).json({ success: false, message: 'Invalid token type.' })
    }

    const user = await User.findById(decoded.id).select('+password +failedLoginAttempts +lockedUntil +refreshTokens')
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'User not found or disabled.' })
    }

    const storedToken = (user.refreshTokens || []).find((rt) => rt.token === refreshToken)
    if (!storedToken) {
      return res.status(401).json({ success: false, message: 'Refresh token not recognized.' })
    }

    user.refreshTokens = (user.refreshTokens || []).filter((rt) => rt.token !== refreshToken)

    const newAccessToken = generateAccessToken(user)
    const newRefreshToken = generateRefreshToken(user)

    user.refreshTokens.push({ token: newRefreshToken })
    if (user.refreshTokens.length > 10) {
      user.refreshTokens = user.refreshTokens.slice(-10)
    }

    await user.save()

    await createAuditLog({ user: user._id, action: 'TOKEN_REFRESH', details: {}, req })

    res.json({
      success: true,
      token: newAccessToken,
      refreshToken: newRefreshToken,
    })
  } catch (error) {
    console.error('[auth] refresh error:', error)
    res.status(500).json({ success: false, message: 'Server error during token refresh.' })
  }
}

async function getMe(req, res) {
  try {
    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' })
    }
    res.json({ success: true, user: user.toJSON() })
  } catch (error) {
    console.error('[auth] getMe error:', error)
    res.status(500).json({ success: false, message: 'Server error.' })
  }
}

async function setup2FA(req, res) {
  try {
    const user = await User.findById(req.user._id).select('+twoFactorSecret +twoFactorEnabled')
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' })
    }

    const { base32, otpauthUrl } = generate2FASecret(user.email)
    const qrCodeDataURL = await generateQRCodeDataURL(otpauthUrl)

    user.twoFactorSecret = base32
    user.twoFactorEnabled = false
    await user.save()

    res.json({
      success: true,
      secret: base32,
      otpauthUrl,
      qrCode: qrCodeDataURL,
      message: 'Scan the QR code with your authenticator app, then verify with /auth/verify-2fa-setup.',
    })
  } catch (error) {
    console.error('[auth] setup2FA error:', error)
    res.status(500).json({ success: false, message: 'Server error during 2FA setup.' })
  }
}

async function verify2FASetup(req, res) {
  try {
    const { totpCode } = req.body
    if (!totpCode) {
      return res.status(400).json({ success: false, message: 'TOTP code is required.' })
    }

    const user = await User.findById(req.user._id).select('+twoFactorSecret +twoFactorEnabled')
    if (!user || !user.twoFactorSecret) {
      return res.status(400).json({ success: false, message: '2FA not initialized. Call /auth/setup-2fa first.' })
    }

    const tokenValid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: totpCode,
      window: 1,
    })

    if (!tokenValid) {
      return res.status(400).json({ success: false, message: 'Invalid TOTP code. Make sure your authenticator app is configured correctly.' })
    }

    user.twoFactorEnabled = true
    await user.save()

    await createAuditLog({ user: user._id, action: 'UPDATE', resource: '2FA', details: { action: 'enabled' }, req })

    res.json({ success: true, message: '2FA has been enabled successfully.' })
  } catch (error) {
    console.error('[auth] verify2FASetup error:', error)
    res.status(500).json({ success: false, message: 'Server error during 2FA verification.' })
  }
}

async function disable2FA(req, res) {
  try {
    const user = await User.findById(req.user._id).select('+twoFactorSecret +twoFactorEnabled')
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' })
    }

    user.twoFactorSecret = ''
    user.twoFactorEnabled = false
    await user.save()

    await createAuditLog({ user: user._id, action: 'UPDATE', resource: '2FA', details: { action: 'disabled' }, req })

    res.json({ success: true, message: '2FA has been disabled.' })
  } catch (error) {
    console.error('[auth] disable2FA error:', error)
    res.status(500).json({ success: false, message: 'Server error disabling 2FA.' })
  }
}

module.exports = {
  loginStep1,
  verify2FA,
  logout,
  refresh,
  getMe,
  setup2FA,
  verify2FASetup,
  disable2FA,
  createAuditLog,
  generate2FASecret,
  generateQRCodeDataURL,
}
