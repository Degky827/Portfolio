const mongoose = require('mongoose')

const socialLinkSchema = new mongoose.Schema({
  platform: { type: String, default: '' },
  url: { type: String, default: '' },
  displayOrder: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
}, { _id: true })

const navigationItemSchema = new mongoose.Schema({
  label: { type: String, default: '' },
  url: { type: String, default: '' },
  order: { type: Number, default: 0 },
}, { _id: true })

const footerContentSchema = new mongoose.Schema({
  // ── Column 1: Brand & Identity ──
  brandName: { type: String, default: '' },
  brandNameAm: { type: String, default: '' },
  brandDescription: { type: String, default: '' },
  brandDescriptionAm: { type: String, default: '' },
  footerLogo: { type: String, default: '' },
  socialLinks: { type: [socialLinkSchema], default: [] },

  // ── Column 2: Navigation Links ──
  navigation: { type: [navigationItemSchema], default: [] },

  // ── Column 3: Contact & Location ──
  locationHeadline: { type: String, default: '' },
  subLocation: { type: String, default: '' },
  locationMapUrl: { type: String, default: '' },
  emailAddress: { type: String, default: '' },
  emailProtocol: { type: String, default: 'mailto' },
  phoneNumber: { type: String, default: '' },
  phoneProtocol: { type: String, enum: ['tel', 'whatsapp', 'telegram', 'custom'], default: 'tel' },
  phoneCustomUrl: { type: String, default: '' },

  // ── Footer Bottom Bar ──
  copyrightText: { type: String, default: '' },
  visualSeparator: { type: String, default: '' },
  attributionText: { type: String, default: '' },

  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true })

module.exports = mongoose.model('FooterContent', footerContentSchema)
