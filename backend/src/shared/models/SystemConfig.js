const mongoose = require('mongoose')

const backupScheduleSchema = new mongoose.Schema({
  enabled: { type: Boolean, default: false },
  frequency: { type: String, enum: ['every_12_hours', 'daily_midnight', 'weekly_sunday'], default: 'daily_midnight' },
  lastRun: { type: Date },
  nextRun: { type: Date },
  retentionCount: { type: Number, default: 10 },
  cloudUpload: {
    enabled: { type: Boolean, default: false },
    provider: { type: String, enum: ['s3', 'gcs', 'local'], default: 's3' },
    bucketName: { type: String, default: '' },
    region: { type: String, default: '' },
    accessKeyId: { type: String, default: '' },
    secretAccessKey: { type: String, default: '' },
    endpointUrl: { type: String, default: '' },
  },
}, { _id: false })

const healthMonitorSchema = new mongoose.Schema({
  enabled: { type: Boolean, default: false },
  pingIntervalSeconds: { type: Number, default: 60 },
  latencyThresholdMs: { type: Number, default: 500 },
  webhookUrl: { type: String, default: '' },
  webhookType: { type: String, enum: ['discord', 'slack', 'custom'], default: 'discord' },
  notifyOnRecovery: { type: Boolean, default: true },
}, { _id: false })

const systemConfigSchema = new mongoose.Schema({
  apiUrl: { type: String, default: '', trim: true },
  uploadMaxFileSize: { type: Number, default: 5 },
  uploadAllowedExtensions: { type: [String], default: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'] },
  sessionTimeoutMinutes: { type: Number, default: 60 },
  cacheEnabled: { type: Boolean, default: true },
  cacheDurationSeconds: { type: Number, default: 300 },
  maintenanceMode: { type: Boolean, default: false },
  maintenanceMessage: { type: String, default: 'Site is under maintenance. Please check back later.' },

  backupSchedule: { type: backupScheduleSchema, default: () => ({}) },
  healthMonitor: { type: healthMonitorSchema, default: () => ({}) },
}, { timestamps: true })

module.exports = mongoose.model('SystemConfig', systemConfigSchema)
