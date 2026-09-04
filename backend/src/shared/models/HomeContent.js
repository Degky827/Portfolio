const mongoose = require('mongoose')

const technologySchema = new mongoose.Schema({
  name: { type: String, default: '' },
  icon: { type: String, default: '' },
  color: { type: String, default: '' },
  url: { type: String, default: '' },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  _id: false,
})

const homeStatSchema = new mongoose.Schema({
  value: { type: String, default: '' },
  label: { type: String, default: '' },
  icon: { type: String, default: 'Award' },
  color: { type: String, default: '#6366f1' },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  context: { type: String, default: '' },
  _id: false,
})

const socialLinkItemSchema = new mongoose.Schema({
  platform: { type: String, default: '' },
  url: { type: String, default: '' },
  icon: { type: String, default: '' },
  tooltip: { type: String, default: '' },
  order: { type: Number, default: 0 },
  visible: { type: Boolean, default: true },
  active: { type: Boolean, default: true },
  _id: false,
})

const sceneObjectSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  visible: { type: Boolean, default: true },
  position: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    z: { type: Number, default: 0 },
  },
  rotation: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    z: { type: Number, default: 0 },
  },
  scale: { type: Number, default: 1 },
  animate: { type: Boolean, default: true },
  _id: false,
})

const homeContentSchema = new mongoose.Schema(
  {
    hero: {
      eyebrow: { type: String, default: 'WELCOME TO MY DIGITAL SPACE' },
      greeting: { type: String, default: "Hi, I'm" },
      greetingAm: { type: String, default: '' },
      fullName: { type: String, default: 'Desalegn' },
      fullNameAm: { type: String, default: '' },
      nameAmharic: { type: String, default: 'ደካ' },
      professionalBadge: { type: String, default: 'Student Developer' },
      professionalBadgeAm: { type: String, default: '' },
      typingWords: [{ type: String }],
      typingWordsAm: [{ type: String }],
      description: { type: String, default: '' },
      shortIntroduction: { type: String, default: '' },
      shortIntroductionAm: { type: String, default: '' },
      profilePhoto: {
        url: { type: String, default: '' },
        alt: { type: String, default: '' },
      },
      primaryCtaText: { type: String, default: 'Explore My Work' },
      primaryCtaUrl: { type: String, default: '#projects' },
      secondaryCtaText: { type: String, default: 'Get In Touch' },
      secondaryCtaUrl: { type: String, default: '#contact' },
      showEyebrow: { type: Boolean, default: true },
      showGreeting: { type: Boolean, default: true },
      showName: { type: Boolean, default: true },
      showTitle: { type: Boolean, default: true },
      showDescription: { type: Boolean, default: true },
      showPrimaryCta: { type: Boolean, default: true },
      showSecondaryCta: { type: Boolean, default: true },
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

    technologies: [technologySchema],

    statistics: [homeStatSchema],

    availability: {
      enabled: { type: Boolean, default: true },
      status: { type: String, enum: ['available', 'busy', 'not_available'], default: 'available' },
      title: { type: String, default: 'Available for Freelance' },
      description: { type: String, default: "Let's build something amazing together." },
      ctaText: { type: String, default: 'Hire Me' },
      ctaUrl: { type: String, default: '/contact' },
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
      cv: { type: String, default: '' },
    },
    socialLinksOrder: [socialLinkItemSchema],

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

    logoImage: { type: String, default: '' },
    logoText: { type: String, default: '' },

    contactButtonText: { type: String, default: 'Get In Touch' },
    contactButtonTextAm: { type: String, default: '' },
    contactButtonLink: { type: String, default: '#contact' },

    theme: {
      primaryColor: { type: String, default: '#6366f1' },
      secondaryColor: { type: String, default: '#10b981' },
      accentColor: { type: String, default: '#f59e0b' },
    },

    appearance: {
      textColor: { type: String, default: '' },
      backgroundColor: { type: String, default: '' },
      backgroundType: { type: String, enum: ['solid', 'gradient', 'image', '3d'], default: 'solid' },
      animations: { type: Boolean, default: true },
      glassmorphism: { type: Boolean, default: true },
      particles: { type: Boolean, default: true },
      cursorEffect: { type: Boolean, default: true },
      glowEffects: { type: Boolean, default: true },
    },

    scene3D: {
      enabled: { type: Boolean, default: true },
      interaction: { type: Boolean, default: true },
      autoRotate: { type: Boolean, default: false },
      objectRotation: { type: Boolean, default: false },
      particles: { type: Boolean, default: false },
      shadows: { type: Boolean, default: true },
      postProcessing: { type: Boolean, default: false },
      cursorInteraction: { type: Boolean, default: true },
      performance: {
        desktop: { type: Boolean, default: true },
        tablet: { type: Boolean, default: true },
        mobile: { type: Boolean, default: true },
        lightweightMobile: { type: Boolean, default: false },
        maxDpr: { type: Number, default: 2 },
        shadowQuality: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
        particleCount: { type: Number, default: 50 },
      },
      camera: {
        positionX: { type: Number, default: 0.35 },
        positionY: { type: Number, default: 1.6 },
        positionZ: { type: Number, default: 5.1 },
        rotationX: { type: Number, default: 0 },
        rotationY: { type: Number, default: 0 },
        rotationZ: { type: Number, default: 0 },
        fov: { type: Number, default: 36 },
        zoom: { type: Number, default: 1 },
      },
      objects: [sceneObjectSchema],
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
