const mongoose = require('mongoose')

const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, trim: true, maxlength: 254 },
  phone: { type: String, default: '', trim: true, maxlength: 30 },
  subject: { type: String, default: '', trim: true, maxlength: 200 },
  message: { type: String, required: true, trim: true, maxlength: 5000 },
  read: { type: Boolean, default: false },
}, { timestamps: true })

module.exports = mongoose.model('ContactMessage', contactMessageSchema)
