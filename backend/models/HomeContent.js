const mongoose = require('mongoose')

const homeContentSchema = new mongoose.Schema(
  {
    heroTitle: {
      type: String,
      default: '',
      trim: true,
    },
    heroSubtitle: {
      type: String,
      default: '',
      trim: true,
    },
    heroDescription: {
      type: String,
      default: '',
    },
    profileImage: {
      type: String,
      default: '',
    },
    resumeUrl: {
      type: String,
      default: '',
      trim: true,
    },
    primaryButtonText: {
      type: String,
      default: 'Get Started',
      trim: true,
    },
    primaryButtonLink: {
      type: String,
      default: '#projects',
      trim: true,
    },
    secondaryButtonText: {
      type: String,
      default: 'Contact Me',
      trim: true,
    },
    secondaryButtonLink: {
      type: String,
      default: '#contact',
      trim: true,
    },
    socialLinks: {
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      telegram: { type: String, default: '' },
      twitter: { type: String, default: '' },
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model('HomeContent', homeContentSchema)
