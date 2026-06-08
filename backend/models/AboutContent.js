const mongoose = require('mongoose')

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

const achievementSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
}, { _id: true })

const aboutContentSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  description: { type: String, default: '' },
  profileImage: { type: String, default: '' },
  yearsOfExperience: { type: Number, default: 0 },
  location: { type: String, default: '' },
  education: { type: [educationSchema], default: [] },
  experience: { type: [experienceSchema], default: [] },
  achievements: { type: [achievementSchema], default: [] },
  cvUrl: { type: String, default: '' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true })

module.exports = mongoose.model('AboutContent', aboutContentSchema)
