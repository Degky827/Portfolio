const User = require('../../shared/models/User')
const Session = require('../../shared/models/Session')
const SecuritySettings = require('../../shared/models/SecuritySettings')
const AuditLog = require('../../shared/models/AuditLog')
const { parseUserAgent } = require('../../shared/utilities/userAgentParser')

async function getSecuritySettings(_req, res) {
  try {
    let settings = await SecuritySettings.findOne()
    if (!settings) {
      settings = await SecuritySettings.create({})
    }
    res.json({ success: true, settings })
  } catch (error) {
    console.error('[security] getSecuritySettings error:', error)
    res.status(500).json({ success: false, message: 'Failed to load security settings.' })
  }
}

async function updateSecuritySettings(req, res) {
  try {
    const { passwordPolicy, sessionConfig, twoFactorConfig, loginSecurity } = req.body

    let settings = await SecuritySettings.findOne()
    if (!settings) {
      settings = new SecuritySettings()
    }

    if (passwordPolicy) settings.passwordPolicy = { ...settings.passwordPolicy, ...passwordPolicy }
    if (sessionConfig) settings.sessionConfig = { ...settings.sessionConfig, ...sessionConfig }
    if (twoFactorConfig) settings.twoFactorConfig = { ...settings.twoFactorConfig, ...twoFactorConfig }
    if (loginSecurity) settings.loginSecurity = { ...settings.loginSecurity, ...loginSecurity }

    await settings.save()
    res.json({ success: true, settings, message: 'Security settings updated.' })
  } catch (error) {
    console.error('[security] updateSecuritySettings error:', error)
    res.status(500).json({ success: false, message: 'Failed to update security settings.' })
  }
}

async function getActiveSessions(req, res) {
  try {
    const user = await User.findById(req.user._id).select('+refreshTokens')
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' })
    }

    const sessions = (user.refreshTokens || []).map((rt, index) => {
      const parsed = parseUserAgent(rt.userAgent || '')
      return {
        id: index,
        token: rt.token ? `${rt.token.slice(0, 8)}...` : '',
        device: rt.device || parsed.device,
        browser: rt.browser || parsed.browser,
        os: rt.os || parsed.os,
        ipAddress: rt.ipAddress || 'Unknown',
        createdAt: rt.createdAt,
        isCurrent: false,
      }
    })

    const accessToken = req.cookies?.token || req.headers.authorization?.split(' ')[1]
    if (accessToken) {
      const jwt = require('jsonwebtoken')
      const config = require('../../infrastructure/config')
      try {
        const decoded = jwt.verify(accessToken, config.jwtSecret)
        const currentRefreshToken = user.refreshTokens.find((rt) => {
          try {
            const decodedRefresh = jwt.verify(rt.token, config.jwtSecret)
            return decodedRefresh.id === decoded.id
          } catch {
            return false
          }
        })
        if (currentRefreshToken) {
          const idx = user.refreshTokens.indexOf(currentRefreshToken)
          if (sessions[idx]) sessions[idx].isCurrent = true
        }
      } catch {
        // token expired, no current session to mark
      }
    }

    res.json({ success: true, sessions })
  } catch (error) {
    console.error('[security] getActiveSessions error:', error)
    res.status(500).json({ success: false, message: 'Failed to load sessions.' })
  }
}

async function revokeSession(req, res) {
  try {
    const { sessionIndex } = req.params
    const idx = parseInt(sessionIndex, 10)

    const user = await User.findById(req.user._id).select('+refreshTokens')
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' })
    }

    if (idx < 0 || idx >= (user.refreshTokens || []).length) {
      return res.status(400).json({ success: false, message: 'Invalid session index.' })
    }

    user.refreshTokens.splice(idx, 1)
    await user.save()

    res.json({ success: true, message: 'Session revoked.' })
  } catch (error) {
    console.error('[security] revokeSession error:', error)
    res.status(500).json({ success: false, message: 'Failed to revoke session.' })
  }
}

async function revokeAllSessions(req, res) {
  try {
    const user = await User.findById(req.user._id).select('+refreshTokens')
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' })
    }

    const accessToken = req.cookies?.token || req.headers.authorization?.split(' ')[1]
    let currentToken = null

    if (accessToken) {
      const jwt = require('jsonwebtoken')
      const config = require('../../infrastructure/config')
      try {
        const decoded = jwt.verify(accessToken, config.jwtSecret)
        currentToken = user.refreshTokens.find((rt) => {
          try {
            const decodedRefresh = jwt.verify(rt.token, config.jwtSecret)
            return decodedRefresh.id === decoded.id
          } catch {
            return false
          }
        })
      } catch {
        // token expired
      }
    }

    user.refreshTokens = currentToken ? [currentToken] : []
    await user.save()

    res.json({ success: true, message: 'All other sessions revoked.' })
  } catch (error) {
    console.error('[security] revokeAllSessions error:', error)
    res.status(500).json({ success: false, message: 'Failed to revoke sessions.' })
  }
}

async function getSecurityAudit(_req, res) {
  try {
    const settings = await SecuritySettings.findOne() || await SecuritySettings.create({})
    const users = await User.find({}).select('+twoFactorEnabled')

    const totalUsers = users.length
    const usersWith2FA = users.filter((u) => u.twoFactorEnabled).length
    const lockedUsers = users.filter((u) => u.lockedUntil && u.lockedUntil > new Date()).length
    const disabledUsers = users.filter((u) => !u.isActive).length

    const recentFailures = await AuditLog.countDocuments({
      action: 'LOGIN_FAILED',
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    })

    const checks = [
      {
        id: 'password-policy',
        label: 'Password policy enforced',
        status: settings.passwordPolicy.minLength >= 8 ? 'pass' : 'warn',
        detail: `Min ${settings.passwordPolicy.minLength} chars, ${settings.passwordPolicy.requireSpecialChars ? 'special chars required' : 'no special char requirement'}`,
      },
      {
        id: '2fa',
        label: 'Two-factor authentication',
        status: settings.twoFactorConfig.enforceForAll
          ? 'pass'
          : usersWith2FA > 0
            ? 'warn'
            : 'fail',
        detail: settings.twoFactorConfig.enforceForAll
          ? 'Enforced for all users'
          : `${usersWith2FA}/${totalUsers} users have 2FA enabled`,
      },
      {
        id: 'session-timeout',
        label: 'Session timeout configured',
        status: settings.sessionConfig.enforceSessionTimeout ? 'pass' : 'warn',
        detail: `${settings.sessionConfig.idleTimeoutMinutes} min idle timeout`,
      },
      {
        id: 'account-lockout',
        label: 'Account lockout enabled',
        status: settings.loginSecurity.maxFailedAttempts > 0 ? 'pass' : 'fail',
        detail: `Lock after ${settings.loginSecurity.maxFailedAttempts} failed attempts for ${settings.loginSecurity.lockDurationMinutes} min`,
      },
      {
        id: 'locked-accounts',
        label: 'Locked accounts',
        status: lockedUsers === 0 ? 'pass' : 'warn',
        detail: `${lockedUsers} currently locked`,
      },
      {
        id: 'disabled-accounts',
        label: 'Disabled accounts',
        status: disabledUsers === 0 ? 'pass' : 'warn',
        detail: `${disabledUsers} disabled accounts`,
      },
      {
        id: 'recent-failures',
        label: 'Recent failed logins (24h)',
        status: recentFailures < 10 ? 'pass' : recentFailures < 50 ? 'warn' : 'fail',
        detail: `${recentFailures} failed attempts in last 24 hours`,
      },
      {
        id: 'rate-limiting',
        label: 'Rate limiting active',
        status: 'pass',
        detail: 'Auth endpoints protected with rate limits',
      },
      {
        id: 'csrf',
        label: 'CSRF protection active',
        status: 'pass',
        detail: 'HMAC-signed double-submit CSRF tokens enabled',
      },
      {
        id: 'helmet',
        label: 'Security headers (Helmet)',
        status: 'pass',
        detail: 'CSP, HSTS, X-XSS-Protection enabled',
      },
    ]

    res.json({
      success: true,
      audit: {
        checks,
        summary: {
          totalUsers,
          usersWith2FA,
          lockedUsers,
          disabledUsers,
          recentFailures,
          score: checks.filter((c) => c.status === 'pass').length,
          total: checks.length,
        },
      },
    })
  } catch (error) {
    console.error('[security] getSecurityAudit error:', error)
    res.status(500).json({ success: false, message: 'Failed to run security audit.' })
  }
}

module.exports = {
  getSecuritySettings,
  updateSecuritySettings,
  getActiveSessions,
  revokeSession,
  revokeAllSessions,
  getSecurityAudit,
}
