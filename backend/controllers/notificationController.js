const Notification = require('../models/Notification')

async function createNotification({ type, title, message, link, metadata }) {
  try {
    return await Notification.create({ type, title, message, link, metadata })
  } catch (error) {
    console.error('[notifications] create error:', error)
    return null
  }
}

async function listNotifications(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1)
    const limit = Math.min(Math.max(1, parseInt(req.query.limit) || 20), 50)
    const type = req.query.type || ''
    const unreadOnly = req.query.unread === 'true'

    const query = {}
    if (type) query.type = type
    if (unreadOnly) query.read = false

    const skip = (page - 1) * limit

    const [totalCount, notifications] = await Promise.all([
      Notification.countDocuments(query),
      Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ])

    res.json({
      success: true,
      totalCount,
      notifications,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit) || 1,
        hasMore: skip + limit < totalCount,
      },
    })
  } catch (error) {
    console.error('[notifications] list error:', error)
    res.status(500).json({ success: false, message: 'Failed to list notifications' })
  }
}

async function getUnreadCount(_req, res) {
  try {
    const count = await Notification.countDocuments({ read: false })
    res.json({ success: true, count })
  } catch (error) {
    console.error('[notifications] unread count error:', error)
    res.status(500).json({ success: false, message: 'Failed to get unread count' })
  }
}

async function markRead(req, res) {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true },
    )
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' })
    }
    res.json({ success: true, notification })
  } catch (error) {
    console.error('[notifications] mark read error:', error)
    res.status(500).json({ success: false, message: 'Failed to mark notification as read' })
  }
}

async function markAllRead(_req, res) {
  try {
    const result = await Notification.updateMany({ read: false }, { read: true })
    res.json({ success: true, modifiedCount: result.modifiedCount })
  } catch (error) {
    console.error('[notifications] mark all read error:', error)
    res.status(500).json({ success: false, message: 'Failed to mark all as read' })
  }
}

async function deleteNotification(req, res) {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id)
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' })
    }
    res.json({ success: true, message: 'Notification deleted' })
  } catch (error) {
    console.error('[notifications] delete error:', error)
    res.status(500).json({ success: false, message: 'Failed to delete notification' })
  }
}

module.exports = {
  createNotification,
  listNotifications,
  getUnreadCount,
  markRead,
  markAllRead,
  deleteNotification,
}
