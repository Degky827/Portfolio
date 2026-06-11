const mongoose = require('mongoose')

const quickLinkSchema = new mongoose.Schema({
  label: { type: String, default: '' },
  url: { type: String, default: '' },
  displayOrder: { type: Number, default: 0 },
}, { _id: true })

const socialLinkSchema = new mongoose.Schema({
  platform: { type: String, default: '' },
  url: { type: String, default: '' },
  displayOrder: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
}, { _id: true })

const footerContentSchema = new mongoose.Schema({
  brandName: { type: String, default: '' },
  footerDescription: { type: String, default: '' },
  copyrightText: { type: String, default: '' },
  builtWithText: { type: String, default: '' },
  madeWithText: { type: String, default: '' },
  iconKeyword: { type: String, default: 'heart' },
  location: { type: String, default: '' },
  region: { type: String, default: '' },
  country: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  quickLinks: { type: [quickLinkSchema], default: [] },
  socialLinks: { type: [socialLinkSchema], default: [] },
  footerLogo: { type: String, default: '' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true })

module.exports = mongoose.model('FooterContent', footerContentSchema)
