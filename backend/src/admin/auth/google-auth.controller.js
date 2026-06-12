const jwt = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library')
const User = require('../../shared/models/User')
const AuditLog = require('../../shared/models/AuditLog')
const config = require('../../infrastructure/config')

const googleClient = new OAuth2Client(config.googleClientId)

function generateAccessToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    config.jwtSecret,
    { expiresIn: '24h' },
  )
}

function generateRefreshToken(user) {
  return jwt.sign(
    { id: user._id, type: 'refresh' },
    config.jwtSecret,
    { expiresIn: '7d' },
  )
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

async function googleLogin(req, res) {
  try {
    const { idToken } = req.body

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'Missing Google ID token.',
      })
    }

    let payload
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: config.googleClientId,
      })
      payload = ticket.getPayload()
    } catch (verifyError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Google ID token. Signature verification failed.',
      })
    }

    const rawEmail = payload.email || ''
    const incomingGoogleEmail = rawEmail.trim().toLowerCase()
    const googleId = payload.sub || ''
    const name = payload.name || ''
    const picture = payload.picture || ''

    if (!incomingGoogleEmail) {
      return res.status(400).json({
        success: false,
        message: 'Google account has no email address.',
      })
    }

    if (config.adminEmail && incomingGoogleEmail !== config.adminEmail) {
      return res.status(403).json({
        success: false,
        message: 'This Google account is not authorized to access the admin panel.',
      })
    }

    let user = await User.findOne({
      email: { $regex: new RegExp(`^${incomingGoogleEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
    })

    if (!user) {
      return res.status(403).json({
        success: false,
        message: 'No account found with this email. Contact an administrator to create your account.',
      })
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been disabled.',
      })
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked. Try again later.',
      })
    }

    user.googleId = googleId
    user.provider = 'google'
    user.email = incomingGoogleEmail
    user.avatar = picture || user.avatar
    user.displayName = user.displayName || name
    user.lastLogin = new Date()
    user.failedLoginAttempts = 0
    user.lockedUntil = null

    const refreshToken = generateRefreshToken(user)
    user.refreshTokens = user.refreshTokens || []
    user.refreshTokens.push({ token: refreshToken })
    if (user.refreshTokens.length > 5) {
      user.refreshTokens = user.refreshTokens.slice(-5)
    }

    await user.save()

    const accessToken = generateAccessToken(user)

    const isProduction = config.nodeEnv === 'production'

    res.cookie('token', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    const userPayload = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      displayName: user.displayName,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }

    await createAuditLog({
      user,
      action: 'GOOGLE_LOGIN',
      details: { provider: 'google', email: incomingGoogleEmail },
      req,
      success: true,
    })

    return res.status(200).json({
      success: true,
      user: userPayload,
      message: 'Google authentication successful.',
    })
  } catch (error) {
    console.error('Google auth error:', error)
    return res.status(500).json({
      success: false,
      message: 'Server error during Google authentication.',
    })
  }
}

module.exports = { googleLogin }
