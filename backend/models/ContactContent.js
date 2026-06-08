const mongoose = require('mongoose')

const contactContentSchema = new mongoose.Schema({
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  mapLink: { type: String, default: '' },
  whatsapp: { type: String, default: '' },
  telegram: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  github: { type: String, default: '' },
  twitter: { type: String, default: '' },
  facebook: { type: String, default: '' },
  instagram: { type: String, default: '' },
  contactFormEnabled: { type: Boolean, default: true },
}, { timestamps: true })

module.exports = mongoose.model('ContactContent', contactContentSchema)
