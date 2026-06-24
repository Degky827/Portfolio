const { Router } = require('express')
const rateLimit = require('express-rate-limit')
const { authenticateToken } = require('../../shared/middleware/auth')
const {
  getMessages, getMessage, createMessage, markRead, markUnread, getUnreadCount, deleteMessage,
} = require('./contact-messages.controller')

const router = Router()

const messageCreateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many messages. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
})

router.get('/', authenticateToken, getMessages)
router.get('/unread-count', authenticateToken, getUnreadCount)
router.get('/:id', authenticateToken, getMessage)
router.post('/', messageCreateLimiter, createMessage)
router.patch('/:id/read', authenticateToken, markRead)
router.patch('/:id/unread', authenticateToken, markUnread)
router.delete('/:id', authenticateToken, deleteMessage)

module.exports = router
