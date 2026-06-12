const ContactMessage = require('../../shared/models/ContactMessage')

async function getMessages(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1)
    const limit = Math.min(Math.max(1, parseInt(req.query.limit) || 20), 50)
    const skip = (page - 1) * limit

    const [totalCount, messages] = await Promise.all([
      ContactMessage.countDocuments(),
      ContactMessage.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    ])

    res.json({
      success: true,
      totalCount,
      messages,
      pagination: {
        page, limit,
        totalPages: Math.ceil(totalCount / limit) || 1,
        hasMore: skip + limit < totalCount,
      },
    })
  } catch (error) {
    console.error('[contact-messages] getMessages error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch messages' })
  }
}

async function getMessage(req, res) {
  try {
    const message = await ContactMessage.findById(req.params.id).lean()
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' })
    }
    res.json({ success: true, message })
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

    const newMessage = await ContactMessage.create({ name, email, phone, message })
    res.status(201).json({ success: true, message: newMessage })
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
    if (!msg) {
      return res.status(404).json({ success: false, message: 'Message not found' })
    }
    res.json({ success: true, message: msg })
  } catch (error) {
    console.error('[contact-messages] markRead error:', error)
    res.status(500).json({ success: false, message: 'Failed to mark message as read' })
  }
}

async function getUnreadCount(_req, res) {
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
    if (!msg) {
      return res.status(404).json({ success: false, message: 'Message not found' })
    }
    res.json({ success: true, message: 'Message deleted successfully' })
  } catch (error) {
    console.error('[contact-messages] deleteMessage error:', error)
    res.status(500).json({ success: false, message: 'Failed to delete message' })
  }
}

module.exports = { getMessages, getMessage, createMessage, markRead, getUnreadCount, deleteMessage }
