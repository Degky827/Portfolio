const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, trim: true, maxlength: 254 },
  phone: { type: String, default: '', trim: true, maxlength: 30 },
  subject: { type: String, default: '', trim: true, maxlength: 200 },
  message: { type: String, required: true, trim: true, maxlength: 5000 },
  isRead: { type: Boolean, default: false },
  replied: { type: Boolean, default: false },
  replyText: { type: String, default: '' },
  replyDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
}, { versionKey: false })

messageSchema.index({ isRead: 1 })
messageSchema.index({ createdAt: -1 })

messageSchema.virtual('read').get(function getRead() {
  return this.isRead
})

messageSchema.set('toJSON', { virtuals: true })

module.exports = mongoose.model('Message', messageSchema)
