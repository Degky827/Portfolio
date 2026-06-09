const mongoose = require('mongoose')

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
  },
  { timestamps: true },
)

module.exports = mongoose.model('Settings', settingsSchema)
