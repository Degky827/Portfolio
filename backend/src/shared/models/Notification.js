const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['contact_submission', 'failed_login', 'backup_completed', 'restore_completed', 'system_warning', 'project_created', 'project_updated', 'project_deleted', 'project_archived', 'project_published', 'skill_created', 'skill_updated', 'skill_deleted'],
    required: [true, 'Notification type is required'],
  },
  title: { type: String, required: [true, 'Title is required'] },
  message: { type: String, default: '' },
  read: { type: Boolean, default: false },
  link: { type: String, default: '' },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true })

notificationSchema.index({ createdAt: -1 })
notificationSchema.index({ read: 1, createdAt: -1 })

module.exports = mongoose.model('Notification', notificationSchema)
