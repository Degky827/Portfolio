const mongoose = require('mongoose')

const homeContentSchema = new mongoose.Schema(
  {
    hero: {
      greeting: { type: String, default: "Hi, I'm" },
      fullName: { type: String, default: 'Desalegn' },
      nameAmharic: { type: String, default: 'ደካ' },
      professionalBadge: { type: String, default: 'Student Developer' },
      typingWords: [{ type: String }],
      shortIntroduction: { type: String, default: '' },
      profilePhoto: {
        url: { type: String, default: '' },
        alt: { type: String, default: '' },
      },
      statistics: [
        {
          label: { type: String, default: '' },
          value: { type: String, default: '' },
          icon: { type: String, default: 'Award' },
          color: { type: String, default: '#6366f1' },
          _id: false,
        },
      ],
      ctaButtons: [
        {
          text: { type: String, default: '' },
          link: { type: String, default: '' },
          openNewTab: { type: Boolean, default: false },
          icon: { type: String, default: 'ArrowRight' },
          _id: false,
        },
      ],
    },

    about: {
      title: { type: String, default: 'Get to Know Me' },
      subtitle: { type: String, default: '' },
      sections: [
        {
          title: { type: String, default: '' },
          content: { type: String, default: '' },
          _id: false,
        },
      ],
      achievements: [
        {
          title: { type: String, default: '' },
          _id: false,
        },
      ],
      location: { type: String, default: 'Bahirdar' },
      yearsOfExperience: { type: Number, default: 5 },
      statClients: { type: String, default: '50+ Clients' },
      statNetwork: { type: String, default: 'Network Designer' },
    },

    cta: {
      title: { type: String, default: '' },
      subtitle: { type: String, default: '' },
      buttonText: { type: String, default: 'Get In Touch' },
      buttonLink: { type: String, default: '#contact' },
      backgroundImage: { type: String, default: '' },
    },

    socialLinks: {
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      telegram: { type: String, default: '' },
      twitter: { type: String, default: '' },
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      youtube: { type: String, default: '' },
      email: { type: String, default: '' },
    },

    logoImage: { type: String, default: '' },
    logoText: { type: String, default: '' },

    contactButtonText: { type: String, default: 'Get In Touch' },
    contactButtonLink: { type: String, default: '#contact' },

    theme: {
      primaryColor: { type: String, default: '#6366f1' },
      secondaryColor: { type: String, default: '#10b981' },
      accentColor: { type: String, default: '#f59e0b' },
    },

    seo: {
      metaTitle: { type: String, default: '' },
      metaDescription: { type: String, default: '' },
      metaKeywords: [{ type: String }],
    },

    published: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model('HomeContent', homeContentSchema)
