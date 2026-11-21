const mongoose = require('mongoose')

const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, maxlength: 254 },
    phone: { type: String, default: '', trim: true, maxlength: 30 },
    subject: { type: String, default: '', trim: true, maxlength: 200 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    isRead: { type: Boolean, default: false },
    replied: { type: Boolean, default: false },
    replyText: { type: String, default: '' },
    replyDate: { type: Date },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

messageSchema.index({ isRead: 1 })
messageSchema.index({ createdAt: -1 })

// Virtual `read` alias for compatibility
messageSchema.virtual('read')
  .get(function () {
    return this.isRead
  })
  .set(function (val) {
    this.isRead = Boolean(val)
  })

module.exports = mongoose.model('Message', messageSchema)

module.exports = mongoose.model('Message', messageSchema)
