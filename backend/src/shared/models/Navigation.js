const mongoose = require('mongoose')

const navigationSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 100 },
  url: { type: String, default: '#', maxlength: 500 },
  sectionId: { type: String, default: '', maxlength: 100 },
  icon: { type: String, default: '', maxlength: 50 },
  order: { type: Number, default: 0 },
  visible: { type: Boolean, default: true },
  active: { type: Boolean, default: true },
  isExternal: { type: Boolean, default: false },
  openNewTab: { type: Boolean, default: false },
}, { timestamps: true })

module.exports = mongoose.model('Navigation', navigationSchema)
