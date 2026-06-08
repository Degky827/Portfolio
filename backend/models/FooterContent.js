const mongoose = require('mongoose')

const quickLinkSchema = new mongoose.Schema({
  label: { type: String, default: '' },
  url: { type: String, default: '' },
}, { _id: true })

const socialLinkSchema = new mongoose.Schema({
  platform: { type: String, default: '' },
  url: { type: String, default: '' },
}, { _id: true })

const footerContentSchema = new mongoose.Schema({
  footerDescription: { type: String, default: '' },
  copyrightText: { type: String, default: '' },
  quickLinks: { type: [quickLinkSchema], default: [] },
  socialLinks: { type: [socialLinkSchema], default: [] },
  footerLogo: { type: String, default: '' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true })

module.exports = mongoose.model('FooterContent', footerContentSchema)
