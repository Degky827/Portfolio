const express = require('express')
const rateLimit = require('express-rate-limit')
const router = express.Router()
const { authenticateToken } = require('../../shared/middleware/auth')
const userController = require('../users/users.controller')
const {
  loginStep1, verify2FA, logout, refresh, getMe, setup2FA, verify2FASetup, disable2FA,
} = require('./auth.controller')

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many login attempts. Try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
})

const totpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many 2FA attempts. Try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
})

router.post('/login', loginLimiter, loginStep1)
router.post('/verify-2fa', totpLimiter, verify2FA)
router.post('/logout', authenticateToken, logout)
router.post('/refresh', refresh)
router.get('/me', authenticateToken, getMe)
router.patch('/me', authenticateToken, userController.updateMe)
router.post('/setup-2fa', authenticateToken, setup2FA)
router.post('/verify-2fa-setup', authenticateToken, verify2FASetup)
router.post('/disable-2fa', authenticateToken, disable2FA)

module.exports = router
