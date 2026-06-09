const { Router } = require('express')
const { authenticateToken } = require('../middleware/auth')
const {
  listNotifications,
  getUnreadCount,
  markRead,
  markAllRead,
  deleteNotification,
} = require('../controllers/notificationController')

const router = Router()

router.get('/', authenticateToken, listNotifications)
router.get('/unread-count', authenticateToken, getUnreadCount)
router.patch('/:id/read', authenticateToken, markRead)
router.post('/mark-all-read', authenticateToken, markAllRead)
router.delete('/:id', authenticateToken, deleteNotification)

module.exports = router
