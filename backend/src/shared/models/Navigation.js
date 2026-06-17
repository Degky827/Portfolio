const mongoose = require('mongoose')

const navigationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, default: '#' },
  sectionId: { type: String, default: '' },
  icon: { type: String, default: '' },
  order: { type: Number, default: 0 },
  visible: { type: Boolean, default: true },
  active: { type: Boolean, default: true },
  isExternal: { type: Boolean, default: false },
  openNewTab: { type: Boolean, default: false },
}, { timestamps: true })

module.exports = mongoose.model('Navigation', navigationSchema)
