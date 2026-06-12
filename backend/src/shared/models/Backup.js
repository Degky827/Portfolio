const mongoose = require('mongoose')

const backupSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: {
    type: String,
    enum: ['manual', 'uploaded', 'auto'],
    default: 'manual',
  },
  fileSize: { type: Number, default: 0 },
  summary: {
    projects: { type: Number, default: 0 },
    certificates: { type: Number, default: 0 },
    skills: { type: Number, default: 0 },
    homeContent: { type: Number, default: 0 },
    aboutContent: { type: Number, default: 0 },
    contactContent: { type: Number, default: 0 },
    footerContent: { type: Number, default: 0 },
    settings: { type: Number, default: 0 },
  },
  data: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true })

backupSchema.index({ createdAt: -1 })

module.exports = mongoose.model('Backup', backupSchema)
