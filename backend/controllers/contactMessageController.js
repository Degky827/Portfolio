const ContactMessage = require('../models/ContactMessage')

async function getMessages(req, res) {
  try {
    const { page = 1, limit = 20, read } = req.query
    const filter = {}
    if (read === 'true') filter.read = true
    else if (read === 'false') filter.read = false

    const totalCount = await ContactMessage.countDocuments(filter)
    const messages = await ContactMessage.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))

    res.json({
      success: true,
      messages,
      totalCount,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalCount / limit),
      },
    })
  } catch (error) {
    console.error('[contact-messages] getMessages error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch messages' })
  }
}

async function getMessage(req, res) {
  try {
    const msg = await ContactMessage.findById(req.params.id)
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found' })
    res.json({ success: true, message: msg })
  } catch (error) {
    console.error('[contact-messages] getMessage error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch message' })
  }
}

async function createMessage(req, res) {
  try {
    const { name, email, phone, message } = req.body
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required' })
    }
    const msg = await ContactMessage.create({ name, email, phone, message })
    res.status(201).json({ success: true, message: msg })
  } catch (error) {
    console.error('[contact-messages] createMessage error:', error)
    res.status(500).json({ success: false, message: 'Failed to send message' })
  }
}

async function markRead(req, res) {
  try {
    const msg = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true },
    )
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found' })
    res.json({ success: true, message: msg })
  } catch (error) {
    console.error('[contact-messages] markRead error:', error)
    res.status(500).json({ success: false, message: 'Failed to mark as read' })
  }
}

async function getUnreadCount(req, res) {
  try {
    const count = await ContactMessage.countDocuments({ read: false })
    res.json({ success: true, count })
  } catch (error) {
    console.error('[contact-messages] getUnreadCount error:', error)
    res.status(500).json({ success: false, message: 'Failed to get unread count' })
  }
}

async function deleteMessage(req, res) {
  try {
    const msg = await ContactMessage.findByIdAndDelete(req.params.id)
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found' })
    res.json({ success: true, message: 'Message deleted' })
  } catch (error) {
    console.error('[contact-messages] deleteMessage error:', error)
    res.status(500).json({ success: false, message: 'Failed to delete message' })
  }
}

module.exports = { getMessages, getMessage, createMessage, markRead, getUnreadCount, deleteMessage }
