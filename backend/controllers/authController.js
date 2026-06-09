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
 *  Backslash-safe login flow:
 *  --------------------------
 *  Passwords containing `\` (backslash) are handled correctly through the
 *  JSON request pipeline: the frontend's axios JSON-stringifies the body
 *  (escaping `\` as `\\`), Express.json() decodes it back to the raw string,
 *  and bcrypt.compare() receives the exact same bytes that were hashed.
 *
 *  If you encounter "Invalid email or password" for a known-valid account:
 *    1. Check the debug log below for the raw password length and char codes.
 *    2. Verify the password was NOT defined in a JavaScript string literal
 *       where `\` acts as an escape character (e.g. `"pw\\"` not `"pw\"`).
 *    3. If stored in a .env / shell variable, ensure the trailing `\` is
 *       not consuming the newline (use single quotes or double-escape).
 */
async function loginStep1(req, res) {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' })
    }

    /* ── debug: inspect the raw password as received ──────────────────
     * If you see length 6 for a 7-char password like `/35@%Dk\`, the
     * trailing `\` was swallowed by an earlier escaping layer (JS
     * string literal, shell variable, .env parser, etc.).
     * Remove or comment out these lines after confirming the fix.
     * ──────────────────────────────────────────────────────────────── */
    console.log('[auth] loginStep1 — password string length:', password.length)
    console.log('[auth] loginStep1 — password char codes:', [...password].map((c) => c.charCodeAt(0)))

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+password +failedLoginAttempts +lockedUntil +refreshTokens +twoFactorSecret +twoFactorEnabled',
    )
    if (!user) {
      await createAuditLog({ action: 'LOGIN_FAILED', details: { email }, req, success: false })
      return res.status(401).json({ success: false, message: 'Invalid email or password.' })
    }

    if (!user.isActive) {
      await createAuditLog({ user: user._id, action: 'LOGIN_FAILED', details: { reason: 'Account disabled' }, req, success: false })
      return res.status(403).json({ success: false, message: 'This account has been disabled. Contact an administrator.' })
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const remainingMinutes = Math.ceil((user.lockedUntil - new Date()) / 60000)
      await createAuditLog({ user: user._id, action: 'LOGIN_FAILED', details: { reason: 'Account locked' }, req, success: false })
      return res.status(423).json({ success: false, message: `Account is locked. Try again in ${remainingMinutes} minute(s).` })
    }

    /* ── bcrypt.compare ───────────────────────────────────────────────
     * candidatePassword is the raw string from req.body (JSON-decoded).
     * No trimming or transformation is applied — the exact bytes reach
     * bcrypt.compare() as-is. A backslash in the password is a literal
     * character to bcrypt, not an escape sequence.                      */
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1
      if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
        user.lockedUntil = new Date(Date.now() + LOCK_DURATION_MINUTES * 60 * 1000)
        await user.save()
        await createAuditLog({ user: user._id, action: 'ACCOUNT_LOCKED', details: { failedAttempts: user.failedLoginAttempts }, req })
        return res.status(423).json({
          success: false,
          message: `Account locked due to ${MAX_FAILED_ATTEMPTS} failed attempts. Try again in ${LOCK_DURATION_MINUTES} minutes.`,
        })
      }
      await user.save()
      const remaining = MAX_FAILED_ATTEMPTS - user.failedLoginAttempts
      await createAuditLog({ user: user._id, action: 'LOGIN_FAILED', details: { failedAttempts: user.failedLoginAttempts }, req, success: false })
      return res.status(401).json({ success: false, message: `Invalid email or password. ${remaining} attempt(s) remaining.` })
    }

    /* Password is correct — always require the second factor.
       Never issue a JWT at this stage. */
    user.failedLoginAttempts = 0
    user.lockedUntil = null
    await user.save()

    await createAuditLog({ user: user._id, action: 'LOGIN_SUCCESS', details: { step: 'password_verified' }, req })

    res.json({
      success: true,
      require2FA: true,
      email: user.email,
    })
  } catch (error) {
    console.error('[auth] loginStep1 error:', error)
    res.status(500).json({ success: false, message: 'Server error during login.' })
  }
}

/** Step 2: verify TOTP code and issue the final JWT. */
async function verify2FA(req, res) {
  try {
    const { email, totpCode, rememberMe } = req.body
    if (!email || !totpCode) {
      return res.status(400).json({ success: false, message: 'Email and TOTP code are required.' })
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+password +failedLoginAttempts +lockedUntil +refreshTokens +twoFactorSecret +twoFactorEnabled',
    )
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found.' })
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'This account has been disabled.' })
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const remainingMinutes = Math.ceil((user.lockedUntil - new Date()) / 60000)
      return res.status(423).json({ success: false, message: `Account is locked. Try again in ${remainingMinutes} minute(s).` })
    }

    if (!user.twoFactorSecret) {
      return res.status(400).json({ success: false, message: '2FA is not configured for this account. Contact an administrator.' })
    }

    const tokenValid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: totpCode,
      window: 1,
    })

    if (!tokenValid) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1
      if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
        user.lockedUntil = new Date(Date.now() + LOCK_DURATION_MINUTES * 60 * 1000)
        await user.save()
        await createAuditLog({ user: user._id, action: 'ACCOUNT_LOCKED', details: { failedAttempts: user.failedLoginAttempts }, req })
        return res.status(423).json({
          success: false,
          message: `Account locked due to ${MAX_FAILED_ATTEMPTS} failed attempts. Try again in ${LOCK_DURATION_MINUTES} minutes.`,
        })
      }
      await user.save()
      await createAuditLog({ user: user._id, action: 'LOGIN_FAILED', details: { reason: 'Invalid 2FA code' }, req, success: false })
      return res.status(400).json({ success: false, message: 'Invalid TOTP code. Try again.' })
    }

    /* TOTP verified — grant final access. */
    user.failedLoginAttempts = 0
    user.lockedUntil = null
    user.lastLogin = new Date()

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    if (rememberMe) {
      user.refreshTokens = user.refreshTokens || []
      user.refreshTokens.push({ token: refreshToken })
      if (user.refreshTokens.length > 10) {
        user.refreshTokens = user.refreshTokens.slice(-10)
      }
    }

    await user.save()

    await createAuditLog({ user: user._id, action: 'LOGIN_SUCCESS', details: { step: '2fa_complete', rememberMe: !!rememberMe }, req })

    const resPayload = {
      success: true,
      token: accessToken,
      user: user.toJSON(),
    }
    if (rememberMe) {
      resPayload.refreshToken = refreshToken
    }
    res.json(resPayload)
  } catch (error) {
    console.error('[auth] verify2FA error:', error)
    res.status(500).json({ success: false, message: 'Server error during 2FA verification.' })
  }
}

async function logout(req, res) {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (req.body.refreshToken && req.user) {
      req.user.refreshTokens = (req.user.refreshTokens || []).filter(
        (rt) => rt.token !== req.body.refreshToken,
      )
      await req.user.save()
    }

    await createAuditLog({ user: req.user?._id, action: 'LOGOUT', details: { tokenPresent: !!token }, req })

    res.json({ success: true, message: 'Logged out successfully.' })
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
