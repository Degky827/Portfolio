const mongoose = require('mongoose')

const cvContentSchema = new mongoose.Schema(
  {
    personal: {
      name: { type: String, default: '' },
      title: { type: String, default: '' },
      photo: { type: String, default: '' },
      location: { type: String, default: '' },
      phone: { type: String, default: '' },
      email: { type: String, default: '' },
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      portfolio: { type: String, default: '' },
    },
    summary: { type: String, default: '' },
    skills: {
      frontend: { type: [String], default: [] },
      backend: { type: [String], default: [] },
      mobile: { type: [String], default: [] },
      databases: { type: [String], default: [] },
      devops: { type: [String], default: [] },
    },
    experience: [
      {
        title: { type: String, default: '' },
        company: { type: String, default: '' },
        location: { type: String, default: '' },
        startDate: { type: String, default: '' },
        endDate: { type: String, default: null },
        current: { type: Boolean, default: false },
        bullets: { type: [String], default: [] },
      },
    ],
    projects: [
      {
        name: { type: String, default: '' },
        description: { type: String, default: '' },
        technologies: { type: [String], default: [] },
        highlights: { type: [String], default: [] },
        url: { type: String, default: null },
        github: { type: String, default: null },
        featured: { type: Boolean, default: false },
      },
    ],
    education: [
      {
        degree: { type: String, default: '' },
        institution: { type: String, default: '' },
        location: { type: String, default: '' },
        startDate: { type: String, default: '' },
        endDate: { type: String, default: '' },
        expected: { type: Boolean, default: false },
        description: { type: String, default: null },
      },
    ],
    certifications: [
      {
        name: { type: String, default: '' },
        organization: { type: String, default: '' },
        track: { type: String, default: '' },
        date: { type: String, default: null },
        url: { type: String, default: null },
      },
    ],
    achievements: [
      {
        title: { type: String, default: '' },
        description: { type: String, default: '' },
      },
    ],
    languages: [
      {
        language: { type: String, default: '' },
        proficiency: { type: String, default: '' },
      },
    ],
  },
  { timestamps: true },
)

module.exports = mongoose.model('CVContent', cvContentSchema)
