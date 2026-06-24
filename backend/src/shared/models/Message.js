const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, trim: true, maxlength: 254 },
  phone: { type: String, default: '', trim: true, maxlength: 30 },
  subject: { type: String, default: '', trim: true, maxlength: 200 },
  message: { type: String, required: true, trim: true, maxlength: 5000 },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
}, { versionKey: false })

// Provide a virtual `read` alias for compatibility with existing frontend
messageSchema.virtual('read').get(function getRead() {
  return this.isRead
})

messageSchema.set('toJSON', { virtuals: true })

module.exports = mongoose.model('Message', messageSchema)
