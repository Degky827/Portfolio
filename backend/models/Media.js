const mongoose = require('mongoose')

const mediaSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  publicId: { type: String, default: '' },
  url: { type: String, required: true },
  fileType: { type: String, required: true },
  mimeType: { type: String, default: '' },
  fileSize: { type: Number, default: 0 },
  folder: { type: String, default: 'general' },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true })

mediaSchema.index({ fileType: 1, createdAt: -1 })
mediaSchema.index({ originalName: 'text' })

module.exports = mongoose.model('Media', mediaSchema)
