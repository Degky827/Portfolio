const mongoose = require('mongoose')

const storyPillarSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  titleAm: { type: String, default: '' },
  content: { type: String, default: '' },
  contentAm: { type: String, default: '' },
}, { _id: true })

const educationSchema = new mongoose.Schema({
  degree: { type: String, default: '' },
  institution: { type: String, default: '' },
  year: { type: String, default: '' },
}, { _id: true })

const experienceSchema = new mongoose.Schema({
  role: { type: String, default: '' },
  company: { type: String, default: '' },
  duration: { type: String, default: '' },
  description: { type: String, default: '' },
}, { _id: true })

const certificationSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  verificationUrl: { type: String, default: '' },
  displayOrder: { type: Number, default: 0 },
}, { _id: true })

const metricSchema = new mongoose.Schema({
  icon: { type: String, default: '' },
  title: { type: String, default: '' },
  titleAm: { type: String, default: '' },
  value: { type: String, default: '' },
}, { _id: true })

const aboutContentSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  titleAm: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  subtitleAm: { type: String, default: '' },
  profileImage: { type: String, default: '' },
  yearsOfExperience: { type: Number, default: 0 },
  location: { type: String, default: '' },
  education: { type: [educationSchema], default: [] },
  experience: { type: [experienceSchema], default: [] },
  certifications: { type: [certificationSchema], default: [] },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },

  // Structured narrative blocks mapped to the 4 public cards
  storyPillars: { type: [storyPillarSchema], default: [
    { title: 'Education & Background', content: '' },
    { title: 'Professional Focus', content: '' },
    { title: 'Expertise Areas', content: '' },
    { title: 'Mission & Approach', content: '' },
  ] },

  // Controls the simulated IDE / code terminal
  idePresentation: {
    type: {
      skills: { type: [String], default: ['React', 'Node'] },
      available: { type: Boolean, default: true },
      location: { type: String, default: '' },
    },
    default: { skills: ['React', 'Node'], available: true, location: '' },
  },

  // 3 highlight metrics displayed below the code terminal
  highlightMetrics: { type: [metricSchema], default: [
    { icon: 'Award', title: 'Network Designer', value: '' },
    { icon: 'Users', title: 'Happy Clients', value: '50+' },
    { icon: 'TrendingUp', title: 'Years Experience', value: '5+' },
  ] },
}, { timestamps: true })

module.exports = mongoose.model('AboutContent', aboutContentSchema)
