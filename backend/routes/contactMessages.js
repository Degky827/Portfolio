const { Router } = require('express')
const { authenticateToken } = require('../middleware/auth')
const {
  getMessages,
  getMessage,
  createMessage,
  markRead,
  getUnreadCount,
  deleteMessage,
} = require('../controllers/contactMessageController')

const router = Router()

router.get('/unread-count', authenticateToken, getUnreadCount)
router.get('/:id', authenticateToken, getMessage)
router.get('/', authenticateToken, getMessages)
router.post('/', createMessage)
router.patch('/:id/read', authenticateToken, markRead)
router.delete('/:id', authenticateToken, deleteMessage)

module.exports = router
