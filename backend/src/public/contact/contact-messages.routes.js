const { Router } = require('express')
const { body } = require('express-validator')
const rateLimit = require('express-rate-limit')
const { authenticateToken } = require('../../shared/middleware/auth')
const { handleValidation } = require('../../shared/middleware/validate')
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

const messageValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }).withMessage('Name too long'),
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email').isLength({ max: 254 }).withMessage('Email too long'),
  body('phone').optional().trim().isLength({ max: 30 }).withMessage('Phone too long'),
  body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 5000 }).withMessage('Message too long'),
]

router.get('/', authenticateToken, getMessages)
router.get('/unread-count', authenticateToken, getUnreadCount)
router.get('/:id', authenticateToken, getMessage)
router.post('/', messageCreateLimiter, messageValidation, handleValidation, createMessage)
router.patch('/:id/read', authenticateToken, markRead)
router.patch('/:id/unread', authenticateToken, markUnread)
router.delete('/:id', authenticateToken, deleteMessage)

module.exports = router
