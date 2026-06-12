const mongoose = require('mongoose')

const brandingSchema = new mongoose.Schema({
  faviconMaxSizeKB: { type: Number, default: 50 },
  faviconAllowedFormats: { type: [String], default: ['ico', 'webp', 'png'] },
  faviconEnforceAspectRatio: { type: Boolean, default: true },
  logoSettings: {
    requireTransparent: { type: Boolean, default: true },
    format: { type: String, default: 'svg' },
  },
  descriptionMeta: {
    minChars: { type: Number, default: 120 },
    maxChars: { type: Number, default: 160 },
    recommendedMin: { type: Number, default: 120 },
    recommendedMax: { type: Number, default: 160 },
  },
}, { _id: false })

const globalAppearanceSchema = new mongoose.Schema({
  mode: { type: String, enum: ['light', 'dark', 'system'], default: 'dark' },
  syncedAt: { type: Date },
}, { _id: false })

const settingsSchema = new mongoose.Schema(
  {
    ownerName: { type: String, default: '', trim: true },
    title: { type: String, default: '', trim: true },
    description: { type: String, default: '' },
    logo: { type: String, default: '' },
    favicon: { type: String, default: '' },

    defaultTheme: { type: String, default: 'dark', trim: true },
    projectsPerPage: { type: Number, default: 6 },
    certificatesPerPage: { type: Number, default: 6 },
    enableAnalytics: { type: Boolean, default: true },
    enableContactForm: { type: Boolean, default: true },

    publicEmail: { type: String, default: '', trim: true },
    publicPhone: { type: String, default: '', trim: true },
    publicAddress: { type: String, default: '', trim: true },

    socialLinks: {
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      telegram: { type: String, default: '' },
      twitter: { type: String, default: '' },
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
    },

    branding: { type: brandingSchema, default: () => ({}) },
    globalAppearance: { type: globalAppearanceSchema, default: () => ({}) },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Settings', settingsSchema)
