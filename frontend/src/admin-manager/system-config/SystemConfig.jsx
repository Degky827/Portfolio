import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Save, RefreshCw, Server, Globe, HardDrive, Clock, Database, Shield,
} from 'lucide-react'
import PageHeader from '../shared/PageHeader'
import Toast from '../shared/Toast'
import { getSystemConfig, updateSystemConfig } from '../../shared/services/systemConfigService'

const sectionConfig = [
  { id: 'environment', label: 'Environment', icon: Server },
  { id: 'api', label: 'API & URLs', icon: Globe },
  { id: 'uploads', label: 'Upload Limits', icon: HardDrive },
  { id: 'session', label: 'Session & Cache', icon: Clock },
  { id: 'maintenance', label: 'Maintenance', icon: Shield },
  { id: 'backup-schedule', label: 'Backup Schedule', icon: Database },
  { id: 'health-monitor', label: 'Health Monitor', icon: Shield },
]

export default function SystemConfig() {
  const [config, setConfig] = useState({
    apiUrl: '',
    uploadMaxFileSize: 5,
    uploadAllowedExtensions: [],
    sessionTimeoutMinutes: 60,
    cacheEnabled: true,
    cacheDurationSeconds: 300,
    maintenanceMode: false,
    maintenanceMessage: '',
    backupSchedule: {
      frequency: 'disabled',
      retention: 7,
      cloudUpload: {
        enabled: false,
        provider: 's3',
        bucket: '',
        region: '',
        accessKeyId: '',
        secretAccessKey: '',
        endpoint: '',
      },
    },
    healthMonitor: {
      enabled: false,
      pingIntervalSeconds: 60,
      latencyThresholdMs: 500,
      webhookUrl: '',
      webhookType: 'discord',
      notifyOnRecovery: true,
    },
  })
  const [environment, setEnvironment] = useState(null)
  const [activeSection, setActiveSection] = useState('environment')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await getSystemConfig()
        if (res.success) {
          setConfig((prev) => ({
            ...prev,
            ...res.config,
            backupSchedule: { ...prev.backupSchedule, ...(res.config.backupSchedule || {}) },
            healthMonitor: { ...prev.healthMonitor, ...(res.config.healthMonitor || {}) },
          }))
          setEnvironment(res.environment)
        }
      } catch {
        setToast({ message: 'Failed to load system config', type: 'error' })
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const handleChange = (field) => (e) => {
    const val = e.target.value
    setConfig((prev) => ({ ...prev, [field]: val }))
  }

  const handleNumber = (field) => (e) => {
    const val = parseInt(e.target.value, 10)
    setConfig((prev) => ({ ...prev, [field]: isNaN(val) ? '' : val }))
  }

  const handleBool = (field) => (e) => {
    setConfig((prev) => ({ ...prev, [field]: e.target.checked }))
  }

  const handleExtensions = (e) => {
    const val = e.target.value
    setConfig((prev) => ({
      ...prev,
      uploadAllowedExtensions: val.split(',').map((s) => s.trim()).filter(Boolean),
    }))
  }

  const handleScheduleChange = (field) => (e) => {
    const val = e.target.value
    setConfig((prev) => ({
      ...prev,
      backupSchedule: { ...prev.backupSchedule, [field]: val },
    }))
  }

  const handleScheduleNumber = (field) => (e) => {
    const val = parseInt(e.target.value, 10)
    setConfig((prev) => ({
      ...prev,
      backupSchedule: { ...prev.backupSchedule, [field]: isNaN(val) ? '' : val },
    }))
  }

  const handleCloudChange = (field) => (e) => {
    const val = e.target.value
    setConfig((prev) => ({
      ...prev,
      backupSchedule: {
        ...prev.backupSchedule,
        cloudUpload: { ...prev.backupSchedule.cloudUpload, [field]: val },
      },
    }))
  }

  const handleCloudBool = (field) => (e) => {
    setConfig((prev) => ({
      ...prev,
      backupSchedule: {
        ...prev.backupSchedule,
        cloudUpload: { ...prev.backupSchedule.cloudUpload, [field]: e.target.checked },
      },
    }))
  }

  const handleHealthChange = (field) => (e) => {
    const val = e.target.value
    setConfig((prev) => ({
      ...prev,
      healthMonitor: { ...prev.healthMonitor, [field]: val },
    }))
  }

  const handleHealthNumber = (field) => (e) => {
    const val = parseInt(e.target.value, 10)
    setConfig((prev) => ({
      ...prev,
      healthMonitor: { ...prev.healthMonitor, [field]: isNaN(val) ? '' : val },
    }))
  }

  const handleHealthBool = (field) => (e) => {
    setConfig((prev) => ({
      ...prev,
      healthMonitor: { ...prev.healthMonitor, [field]: e.target.checked },
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await updateSystemConfig(config)
      if (res.success) {
        setConfig((prev) => ({
          ...prev,
          ...res.config,
          backupSchedule: { ...prev.backupSchedule, ...(res.config.backupSchedule || {}) },
          healthMonitor: { ...prev.healthMonitor, ...(res.config.healthMonitor || {}) },
        }))
        setEnvironment(res.environment)
        setToast({ message: 'Configuration saved successfully', type: 'success' })
      }
    } catch {
      setToast({ message: 'Failed to save configuration', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="System Configuration"
        subtitle="Manage system-wide settings and view environment information."
      />

      <form onSubmit={handleSubmit}>
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {sectionConfig.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveSection(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                activeSection === id
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'bg-white dark:bg-slate-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-slate-800 hover:bg-gray-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </div>

        {activeSection === 'environment' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6"
          >
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Environment Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {environment && Object.entries(environment).map(([key, val]) => (
                <div key={key} className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white break-all">{String(val)}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeSection === 'api' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 space-y-5 max-w-2xl"
          >
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">API & URL Management</h2>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                API Base URL
              </label>
              <input
                type="text"
                value={config.apiUrl}
                onChange={handleChange('apiUrl')}
                placeholder="https://api.example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono text-sm"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                Base URL for the backend API. Leave empty to use the default.
              </p>
            </div>
          </motion.div>
        )}

        {activeSection === 'uploads' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 space-y-5 max-w-2xl"
          >
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Upload Limits</h2>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                Maximum File Size (MB)
              </label>
              <input
                type="number"
                value={config.uploadMaxFileSize}
                onChange={handleNumber('uploadMaxFileSize')}
                min={1}
                max={100}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                Allowed File Extensions
              </label>
              <input
                type="text"
                value={config.uploadAllowedExtensions?.join(', ') || ''}
                onChange={handleExtensions}
                placeholder="jpg, jpeg, png, gif, webp, svg"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono text-sm"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                Comma-separated list of allowed file extensions.
              </p>
            </div>
          </motion.div>
        )}

        {activeSection === 'session' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 space-y-5 max-w-2xl"
          >
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Session & Cache Settings</h2>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                value={config.sessionTimeoutMinutes}
                onChange={handleNumber('sessionTimeoutMinutes')}
                min={5}
                max={1440}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>

            <div className="pt-2 border-t border-gray-100 dark:border-slate-800">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={config.cacheEnabled}
                  onChange={handleBool('cacheEnabled')}
                  className="w-5 h-5 rounded border-gray-300 dark:border-slate-600 text-primary focus:ring-primary/50"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Enable Caching</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Cache API responses for improved performance</p>
                </div>
              </label>
            </div>

            {config.cacheEnabled && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                  Cache Duration (seconds)
                </label>
                <input
                  type="number"
                  value={config.cacheDurationSeconds}
                  onChange={handleNumber('cacheDurationSeconds')}
                  min={0}
                  max={86400}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
            )}
          </motion.div>
        )}

        {activeSection === 'maintenance' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 space-y-5 max-w-2xl"
          >
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Maintenance Mode</h2>

            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={config.maintenanceMode}
                  onChange={handleBool('maintenanceMode')}
                  className="w-5 h-5 rounded border-gray-300 dark:border-slate-600 text-primary focus:ring-primary/50"
                />
                <div>
                  <span className="text-sm font-medium text-amber-800 dark:text-amber-300">Enable Maintenance Mode</span>
                  <p className="text-xs text-amber-600 dark:text-amber-400">
                    When enabled, visitors will see a maintenance page instead of the portfolio.
                  </p>
                </div>
              </label>
            </div>

            {config.maintenanceMode && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                  Maintenance Message
                </label>
                <textarea
                  value={config.maintenanceMessage}
                  onChange={handleChange('maintenanceMessage')}
                  rows={3}
                  placeholder="Site is under maintenance. Please check back later."
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                />
              </div>
            )}
          </motion.div>
        )}

        {activeSection === 'backup-schedule' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 space-y-5 max-w-2xl"
          >
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Backup Schedule</h2>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                Frequency
              </label>
              <select
                value={config.backupSchedule.frequency}
                onChange={handleScheduleChange('frequency')}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              >
                <option value="disabled">Disabled</option>
                <option value="every-12-hours">Every 12 Hours</option>
                <option value="daily-midnight">Daily at Midnight</option>
                <option value="weekly-sunday">Weekly on Sunday</option>
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                Automatic backups will be created on this schedule. Manual backups are always available.
              </p>
            </div>

            {config.backupSchedule.frequency !== 'disabled' && (
              <>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                    Retention (backups to keep)
                  </label>
                  <input
                    type="number"
                    value={config.backupSchedule.retention}
                    onChange={handleScheduleNumber('retention')}
                    min={1}
                    max={90}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                    Older auto-backups beyond this count will be deleted.
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-slate-800">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={config.backupSchedule.cloudUpload?.enabled}
                      onChange={handleCloudBool('enabled')}
                      className="w-5 h-5 rounded border-gray-300 dark:border-slate-600 text-primary focus:ring-primary/50"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Cloud Upload</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Push backups to S3/GCS-compatible storage</p>
                    </div>
                  </label>
                </div>

                {config.backupSchedule.cloudUpload?.enabled && (
                  <div className="space-y-4 pl-7">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                        Provider
                      </label>
                      <select
                        value={config.backupSchedule.cloudUpload.provider}
                        onChange={handleCloudChange('provider')}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      >
                        <option value="s3">AWS S3</option>
                        <option value="gcs">Google Cloud Storage</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                        Bucket
                      </label>
                      <input
                        type="text"
                        value={config.backupSchedule.cloudUpload.bucket}
                        onChange={handleCloudChange('bucket')}
                        placeholder="my-portfolio-backups"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                        Region
                      </label>
                      <input
                        type="text"
                        value={config.backupSchedule.cloudUpload.region}
                        onChange={handleCloudChange('region')}
                        placeholder="us-east-1"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                        Access Key ID
                      </label>
                      <input
                        type="text"
                        value={config.backupSchedule.cloudUpload.accessKeyId}
                        onChange={handleCloudChange('accessKeyId')}
                        placeholder="AKIA..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                        Secret Access Key
                      </label>
                      <input
                        type="password"
                        value={config.backupSchedule.cloudUpload.secretAccessKey}
                        onChange={handleCloudChange('secretAccessKey')}
                        placeholder="••••••••••••"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                        Endpoint (optional, for S3-compatible providers)
                      </label>
                      <input
                        type="text"
                        value={config.backupSchedule.cloudUpload.endpoint}
                        onChange={handleCloudChange('endpoint')}
                        placeholder="https://s3.custom-endpoint.com"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}

        {activeSection === 'health-monitor' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 space-y-5 max-w-2xl"
          >
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Health Monitor</h2>

            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={config.healthMonitor.enabled}
                  onChange={handleHealthBool('enabled')}
                  className="w-5 h-5 rounded border-gray-300 dark:border-slate-600 text-primary focus:ring-primary/50"
                />
                <div>
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-300">Enable Health Monitor</span>
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    Pings MongoDB at a configurable interval and sends alerts on failure.
                  </p>
                </div>
              </label>
            </div>

            {config.healthMonitor.enabled && (
              <>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                    Ping Interval (seconds)
                  </label>
                  <input
                    type="number"
                    value={config.healthMonitor.pingIntervalSeconds}
                    onChange={handleHealthNumber('pingIntervalSeconds')}
                    min={10}
                    max={3600}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                    Latency Threshold (ms)
                  </label>
                  <input
                    type="number"
                    value={config.healthMonitor.latencyThresholdMs}
                    onChange={handleHealthNumber('latencyThresholdMs')}
                    min={50}
                    max={10000}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                    Webhook alert fires when latency exceeds this value.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                    Webhook Type
                  </label>
                  <select
                    value={config.healthMonitor.webhookType}
                    onChange={handleHealthChange('webhookType')}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  >
                    <option value="discord">Discord</option>
                    <option value="slack">Slack</option>
                    <option value="custom">Custom HTTP</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                    Webhook URL
                  </label>
                  <input
                    type="url"
                    value={config.healthMonitor.webhookUrl}
                    onChange={handleHealthChange('webhookUrl')}
                    placeholder="https://hooks.discord.com/api/webhooks/..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>

                <div className="pt-2 border-t border-gray-100 dark:border-slate-800">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={config.healthMonitor.notifyOnRecovery}
                      onChange={handleHealthBool('notifyOnRecovery')}
                      className="w-5 h-5 rounded border-gray-300 dark:border-slate-600 text-primary focus:ring-primary/50"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Notify on Recovery</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Send an alert when the database recovers after a failure.</p>
                    </div>
                  </label>
                </div>
              </>
            )}
          </motion.div>
        )}

        {activeSection !== 'environment' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 flex justify-end"
          >
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Configuration
                </>
              )}
            </button>
          </motion.div>
        )}
      </form>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  )
}
