const ContactMessage = require('../../shared/models/ContactMessage')
const Message = require('../../shared/models/Message')
const { emitToAdmin } = require('../../infrastructure/socket')

async function createNotification({ type, title, message, link, metadata }) {
  try {
    const Notification = require('../../shared/models/Notification')
    return await Notification.create({ type, title, message, link, metadata })
  } catch (error) {
    console.error('[notifications] create error:', error)
    return null
  }
}

async function getMessages(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1)
    const limit = Math.min(Math.max(1, parseInt(req.query.limit) || 20), 50)
    const skip = (page - 1) * limit

    const query = {}
    // support both read and isRead query params
    if (req.query.read === 'true' || req.query.isRead === 'true') query.isRead = true
    if (req.query.read === 'false' || req.query.isRead === 'false') query.isRead = false

    // prefer new Message model; fallback to ContactMessage for legacy docs
    const Model = Message
    const [totalCount, messages] = await Promise.all([
      Model.countDocuments(query),
      Model.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    ])

    res.json({
      success: true,
      totalCount,
      // include legacy `read` prop for frontend compatibility
      messages: messages.map((m) => ({ ...m, read: m.isRead })),
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
    const message = await Message.findById(req.params.id).lean() || await ContactMessage.findById(req.params.id).lean()
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' })
    }
    res.json({ success: true, message: { ...message, read: message.isRead || message.read } })
  } catch (error) {
    console.error('[contact-messages] getMessage error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch message' })
  }
}

async function createMessage(req, res) {
  try {
    const { name, email, phone, subject, message } = req.body

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required' })
    }

    // create with new Message model
    const newMessage = await Message.create({ name, email, phone, subject, message })

    await createNotification({
      type: 'contact_submission',
      title: `New Message from ${name}`,
      message: subject ? `${subject} — ${message.substring(0, 100)}` : message.substring(0, 100),
      link: '/admin/inbox',
      metadata: { messageId: newMessage._id, name, email },
    })

    emitToAdmin('new_contact_message', {
      _id: newMessage._id,
      name,
      email,
      subject: subject || '',
      message: message.substring(0, 200),
      createdAt: newMessage.createdAt,
    })

    res.status(201).json({ success: true, message: newMessage })
  } catch (error) {
    console.error('[contact-messages] createMessage error:', error)
    res.status(500).json({ success: false, message: 'Failed to send message' })
  }
}

async function markRead(req, res) {
  try {
    const msg = await Message.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true },
    ) || await ContactMessage.findByIdAndUpdate(req.params.id, { read: true }, { new: true })
    if (!msg) {
      return res.status(404).json({ success: false, message: 'Message not found' })
    }
    res.json({ success: true, message: msg })
  } catch (error) {
    console.error('[contact-messages] markRead error:', error)
    res.status(500).json({ success: false, message: 'Failed to mark message as read' })
  }
}

async function markUnread(req, res) {
  try {
    const msg = await Message.findByIdAndUpdate(
      req.params.id,
      { isRead: false },
      { new: true },
    ) || await ContactMessage.findByIdAndUpdate(req.params.id, { read: false }, { new: true })
    if (!msg) {
      return res.status(404).json({ success: false, message: 'Message not found' })
    }
    res.json({ success: true, message: msg })
  } catch (error) {
    console.error('[contact-messages] markUnread error:', error)
    res.status(500).json({ success: false, message: 'Failed to mark message as unread' })
  }
}

async function getUnreadCount(_req, res) {
  try {
    const count = await Message.countDocuments({ isRead: false })
    res.json({ success: true, count })
  } catch (error) {
    console.error('[contact-messages] getUnreadCount error:', error)
    res.status(500).json({ success: false, message: 'Failed to get unread count' })
  }
}

async function deleteMessage(req, res) {
  try {
    const msg = await Message.findByIdAndDelete(req.params.id) || await ContactMessage.findByIdAndDelete(req.params.id)
    if (!msg) {
      return res.status(404).json({ success: false, message: 'Message not found' })
    }
    res.json({ success: true, message: 'Message deleted successfully' })
  } catch (error) {
    console.error('[contact-messages] deleteMessage error:', error)
    res.status(500).json({ success: false, message: 'Failed to delete message' })
  }
}

module.exports = { getMessages, getMessage, createMessage, markRead, markUnread, getUnreadCount, deleteMessage }
