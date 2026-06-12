const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  phone: { type: String, default: '', trim: true },
  subject: { type: String, default: '', trim: true },
  message: { type: String, required: true, trim: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
}, { versionKey: false })

// Provide a virtual `read` alias for compatibility with existing frontend
messageSchema.virtual('read').get(function getRead() {
  return this.isRead
})

messageSchema.set('toJSON', { virtuals: true })

module.exports = mongoose.model('Message', messageSchema)
