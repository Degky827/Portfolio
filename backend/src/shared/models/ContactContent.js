const mongoose = require('mongoose')

const socialChannelSchema = new mongoose.Schema({
  channelName: { type: String, required: true },
  linkUrl: { type: String, required: true },
  iconVector: { type: String, default: '' },
  displayWeight: { type: Number, default: 0 },
}, { _id: true })

const contactContentSchema = new mongoose.Schema({
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  mapLink: { type: String, default: '' },
  contactFormEnabled: { type: Boolean, default: true },
  socialChannels: { type: [socialChannelSchema], default: [] },
}, { timestamps: true })

module.exports = mongoose.model('ContactContent', contactContentSchema)
