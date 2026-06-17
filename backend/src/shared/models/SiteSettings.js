const mongoose = require('mongoose')

const siteSettingsSchema = new mongoose.Schema({
  brandName: { type: String, default: '' },
  nameAmharic: { type: String, default: '' },
  professionalBadge: { type: String, default: '' },
  logoText: { type: String, default: '' },
  logoImage: { type: String, default: '' },
  greeting: { type: String, default: "Hi, I'm" },
  typingWords: { type: [String], default: [] },
  shortIntroduction: { type: String, default: '' },

  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  contactButtonText: { type: String, default: '' },
  contactButtonLink: { type: String, default: '' },

  resume: {
    url: { type: String, default: '' },
    fileName: { type: String, default: '' },
    buttonText: { type: String, default: '' },
  },

  socialLinks: {
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    telegram: { type: String, default: '' },
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    youtube: { type: String, default: '' },
  },

  brandDescription: { type: String, default: '' },
  copyrightText: { type: String, default: '' },

  theme: {
    primaryColor: { type: String, default: '#6366f1' },
    secondaryColor: { type: String, default: '#10b981' },
  },
}, { timestamps: true })

module.exports = mongoose.model('SiteSettings', siteSettingsSchema)
