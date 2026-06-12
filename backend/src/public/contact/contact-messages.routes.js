const { Router } = require('express')
const { authenticateToken } = require('../../shared/middleware/auth')
const {
  getMessages, getMessage, createMessage, markRead, getUnreadCount, deleteMessage,
} = require('./contact-messages.controller')

const router = Router()

router.get('/', authenticateToken, getMessages)
router.get('/unread-count', authenticateToken, getUnreadCount)
router.get('/:id', authenticateToken, getMessage)
router.post('/', createMessage)
router.patch('/:id/read', authenticateToken, markRead)
router.delete('/:id', authenticateToken, deleteMessage)

module.exports = router
