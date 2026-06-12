const mongoose = require('mongoose')

const socialLinkSchema = new mongoose.Schema({
  platform: { type: String, default: '' },
  url: { type: String, default: '' },
  displayOrder: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
}, { _id: true })

const quickLinkSchema = new mongoose.Schema({
  label: { type: String, default: '' },
  url: { type: String, default: '' },
  displayOrder: { type: Number, default: 0 },
}, { _id: true })

const footerContentSchema = new mongoose.Schema({
  // ── Column 1: Branding & Channels ──
  brandName: { type: String, default: '' },
  footerDescription: { type: String, default: '' },
  footerLogo: { type: String, default: '' },
  socialLinks: { type: [socialLinkSchema], default: [] },

  // ── Column 2: Quick Links Navigation ──
  quickLinks: { type: [quickLinkSchema], default: [] },

  // ── Column 3: Humanized Contact Hub ──
  locationLine1: { type: String, default: '' },
  locationLine2: { type: String, default: '' },
  email: { type: String, default: '' },
  emailProtocol: { type: String, default: 'mailto' },
  phone: { type: String, default: '' },
  phoneProtocol: { type: String, enum: ['tel', 'whatsapp', 'telegram', 'custom'], default: 'tel' },
  phoneCustomUrl: { type: String, default: '' },

  // ── Bottom Bar Utilities ──
  copyrightText: { type: String, default: '' },
  visualSeparator: { type: String, default: '' },
  techAttribution: { type: String, default: '' },

  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true })

module.exports = mongoose.model('FooterContent', footerContentSchema)
