import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Upload, Download, RotateCcw, Trash2,
  HardDrive, Database, AlertTriangle, X, RefreshCw,
  Clock, Cloud,
} from 'lucide-react'
import PageHeader from '../components/PageHeader'
import ConfirmModal from '../components/ConfirmModal'
import Toast from '../components/Toast'
import {
  listBackups, createBackup, triggerBackup,
  deleteBackup, uploadBackup, restoreBackup, downloadBackup,
} from '../../services/backupService'
import { getSystemConfig, updateSystemConfig } from '../../services/systemConfigService'

const typeStyles = {
  manual: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  uploaded: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800',
  auto: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
}

const summaryLabels = {
  projects: 'Projects',
  certificates: 'Certificates',
  skills: 'Skills',
  homeContent: 'Home',
  aboutContent: 'About',
  contactContent: 'Contact',
  footerContent: 'Footer',
  settings: 'Settings',
}

const FREQUENCY_OPTIONS = [
  { value: 'disabled', label: 'Disabled' },
  { value: 'every-12-hours', label: 'Every 12 Hours' },
  { value: 'daily-midnight', label: 'Daily at Midnight' },
  { value: 'weekly-sunday', label: 'Weekly on Sunday' },
]

function fmtBytes(bytes) {
  if (!bytes) return '0 B'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(1)} MB`
}

export default function Backup() {
  const fileRef = useRef(null)
  const [backups, setBackups] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [toast, setToast] = useState(null)

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const [restoreTarget, setRestoreTarget] = useState(null)
  const [restoreAck, setRestoreAck] = useState(false)
  const [restoring, setRestoring] = useState(false)

  const [schedule, setSchedule] = useState({
    frequency: 'disabled',
    retention: 7,
    cloudUpload: { enabled: false, provider: 's3', bucket: '', region: '', accessKeyId: '', secretAccessKey: '', endpoint: '' },
  })
  const [scheduleLoading, setScheduleLoading] = useState(true)
  const [savingSchedule, setSavingSchedule] = useState(false)
  const [triggeringNow, setTriggeringNow] = useState(false)

  const loadBackups = async () => {
    setLoading(true)
    try {
      const { backups: list } = await listBackups()
      setBackups(Array.isArray(list) ? list : [])
    } catch (err) {
      setToast({ message: 'Failed to load backups', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const loadSchedule = async () => {
    setScheduleLoading(true)
    try {
      const res = await getSystemConfig()
      if (res.success && res.config?.backupSchedule) {
        setSchedule((prev) => ({ ...prev, ...res.config.backupSchedule }))
      }
    } catch {
      // non-critical
    } finally {
      setScheduleLoading(false)
    }
  }

  useEffect(() => {
    loadBackups()
    loadSchedule()
  }, [])

  const handleCreate = async () => {
    setCreating(true)
    try {
      const res = await createBackup()
      if (res && res.success) {
        const name = res.filename || res.backup?.name || 'Unknown'
        const size = res.fileSize || res.backup?.fileSize
        setToast({ message: `Backup created: ${name} (${fmtBytes(size)})`, type: 'success' })
        loadBackups()
      } else {
        throw new Error(res?.error || res?.message || 'Failed to create backup')
      }
    } catch (err) {
      const errMsg = err?.response?.data?.error || err?.response?.data?.message || err?.message || 'Failed to create backup'
      setToast({ message: errMsg, type: 'error' })
    } finally {
      setCreating(false)
    }
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const { backup } = await uploadBackup(file)
      setToast({ message: 'Backup uploaded successfully', type: 'success' })
      loadBackups()
      setRestoreTarget(backup)
      setRestoreAck(false)
    } catch (err) {
      setToast({
        message: err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to upload backup',
        type: 'error',
      })
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const handleDownload = async (backup) => {
    if (!backup) return
    try {
      const blob = await downloadBackup(backup._id)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${(backup?.name || 'backup').replace(/[^a-zA-Z0-9]/g, '_')}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      setToast({ message: 'Failed to download backup', type: 'error' })
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteBackup(deleteTarget._id)
      setToast({ message: 'Backup deleted', type: 'success' })
      setDeleteTarget(null)
      loadBackups()
    } catch (err) {
      setToast({ message: 'Failed to delete backup', type: 'error' })
    } finally {
      setDeleting(false)
    }
  }

  const handleRestore = async () => {
    if (!restoreTarget || !restoreAck) return
    setRestoring(true)
    try {
      await restoreBackup(restoreTarget._id)
      setToast({ message: 'Backup restored successfully', type: 'success' })
      setRestoreTarget(null)
      setRestoreAck(false)
      loadBackups()
    } catch (err) {
      setToast({ message: 'Failed to restore backup', type: 'error' })
    } finally {
      setRestoring(false)
    }
  }

  const handleSaveSchedule = async () => {
    setSavingSchedule(true)
    try {
      const res = await updateSystemConfig({ backupSchedule: schedule })
      if (res.success) {
        setToast({ message: 'Backup schedule saved successfully', type: 'success' })
      }
    } catch (err) {
      setToast({ message: 'Failed to save backup schedule', type: 'error' })
    } finally {
      setSavingSchedule(false)
    }
  }

  const handleTriggerNow = async () => {
    setTriggeringNow(true)
    try {
      await triggerBackup()
      setToast({ message: 'Manual backup triggered (scheduled type)', type: 'success' })
      loadBackups()
    } catch (err) {
      setToast({ message: 'Failed to trigger backup', type: 'error' })
    } finally {
      setTriggeringNow(false)
    }
  }

  const scheduleActive = schedule.frequency !== 'disabled'

  return (
    <div>
      <PageHeader
        title="Backup & Restore"
        subtitle="Create, upload, download, and restore portfolio backups."
        actions={
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              disabled={creating}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
            >
              {creating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating backup...
                </>
              ) : (
                <>
                  <Plus size={18} />
                  Create Backup
                </>
              )}
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
            >
              {uploading ? (
                <div className="w-4 h-4 border-2 border-gray-400/30 border-t-gray-400 rounded-full animate-spin" />
              ) : (
                <Upload size={18} />
              )}
              Upload Backup
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        }
      />

      {/* Schedule Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 mb-6"
      >
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
              <Clock size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Backup Schedule</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {scheduleActive
                  ? 'Automatic backups are active'
                  : 'No automatic schedule configured'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleTriggerNow}
              disabled={triggeringNow}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 text-sm font-medium transition-colors disabled:opacity-50"
            >
              {triggeringNow ? (
                <div className="w-4 h-4 border-2 border-gray-400/30 border-t-gray-400 rounded-full animate-spin" />
              ) : (
                <RefreshCw size={16} />
              )}
              Trigger Now
            </button>
            <div className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 ${
              scheduleActive
                ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-slate-700'
            }`}>
              <span className={`w-2 h-2 rounded-full ${scheduleActive ? 'bg-emerald-500' : 'bg-gray-400'}`} />
              {scheduleActive ? 'Active' : 'Paused'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
              Frequency
            </label>
            <select
              value={schedule.frequency}
              onChange={(e) => setSchedule((prev) => ({ ...prev, frequency: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            >
              {FREQUENCY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          {scheduleActive && (
            <>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                  Retention (backups)
                </label>
                <input
                  type="number"
                  value={schedule.retention}
                  onChange={(e) => setSchedule((prev) => ({ ...prev, retention: parseInt(e.target.value, 10) || 7 }))}
                  min={1}
                  max={90}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleSaveSchedule}
                  disabled={savingSchedule}
                  className="w-full px-4 py-3 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {savingSchedule ? (
                    <RefreshCw size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  Save Schedule
                </button>
              </div>
            </>
          )}
        </div>

        {scheduleActive && (
          <>
            <div className="mt-5 pt-4 border-t border-gray-100 dark:border-slate-800">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={schedule.cloudUpload.enabled}
                  onChange={(e) => setSchedule((prev) => ({
                    ...prev,
                    cloudUpload: { ...prev.cloudUpload, enabled: e.target.checked },
                  }))}
                  className="w-5 h-5 rounded border-gray-300 dark:border-slate-600 text-primary focus:ring-primary/50"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    <Cloud size={16} />
                    Cloud Upload
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Push backups to cloud storage</p>
                </div>
              </label>
            </div>

            {schedule.cloudUpload.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pl-7">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                    Provider
                  </label>
                  <select
                    value={schedule.cloudUpload.provider}
                    onChange={(e) => setSchedule((prev) => ({
                      ...prev,
                      cloudUpload: { ...prev.cloudUpload, provider: e.target.value },
                    }))}
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
                    value={schedule.cloudUpload.bucket}
                    onChange={(e) => setSchedule((prev) => ({
                      ...prev,
                      cloudUpload: { ...prev.cloudUpload, bucket: e.target.value },
                    }))}
                    placeholder="my-backups"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                    Region
                  </label>
                  <input
                    type="text"
                    value={schedule.cloudUpload.region}
                    onChange={(e) => setSchedule((prev) => ({
                      ...prev,
                      cloudUpload: { ...prev.cloudUpload, region: e.target.value },
                    }))}
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
                    value={schedule.cloudUpload.accessKeyId}
                    onChange={(e) => setSchedule((prev) => ({
                      ...prev,
                      cloudUpload: { ...prev.cloudUpload, accessKeyId: e.target.value },
                    }))}
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
                    value={schedule.cloudUpload.secretAccessKey}
                    onChange={(e) => setSchedule((prev) => ({
                      ...prev,
                      cloudUpload: { ...prev.cloudUpload, secretAccessKey: e.target.value },
                    }))}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                    Endpoint (optional)
                  </label>
                  <input
                    type="text"
                    value={schedule.cloudUpload.endpoint}
                    onChange={(e) => setSchedule((prev) => ({
                      ...prev,
                      cloudUpload: { ...prev.cloudUpload, endpoint: e.target.value },
                    }))}
                    placeholder="https://s3.custom.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
              </div>
            )}

            {scheduleActive && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleSaveSchedule}
                  disabled={savingSchedule}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {savingSchedule ? (
                    <RefreshCw size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  Save Schedule
                </button>
              </div>
            )}
          </>
        )}
      </motion.div>

      {/* Backup List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : backups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <HardDrive size={48} className="text-gray-300 dark:text-slate-700 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No Backups Yet</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
              Create your first backup or upload an existing backup file to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-800">
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600 dark:text-gray-400">Name</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400">Type</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400">Created</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400">Size</th>
                  <th className="text-left px-4 py-3.5 font-semibold text-gray-600 dark:text-gray-400">Summary</th>
                  <th className="text-right px-5 py-3.5 font-semibold text-gray-600 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {backups.map((b) => (
                  <tr key={b?._id || Math.random()} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-5 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap max-w-[200px] truncate">
                      {b?.name || 'Unnamed Backup'}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border ${typeStyles[b?.type] || typeStyles.manual}`}>
                        {b?.type === 'manual' ? 'Manual' : b?.type === 'uploaded' ? 'Uploaded' : 'Auto RP'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {b?.createdAt ? new Date(b.createdAt).toLocaleString() : '—'}
                    </td>
                    <td className="px-4 py-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {fmtBytes(b?.fileSize)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(b?.summary || {}).map(([key, count]) =>
                          count > 0 ? (
                            <span key={key} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 text-xs">
                              {summaryLabels[key] || key}
                              <span className="font-semibold text-gray-900 dark:text-white">{count}</span>
                            </span>
                          ) : null
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleDownload(b)}
                          className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/5 transition-colors"
                          title="Download"
                        >
                          <Download size={16} />
                        </button>
                        <button
                          onClick={() => { setRestoreTarget(b); setRestoreAck(false) }}
                          disabled={b?.type === 'auto'}
                          className="p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Restore"
                        >
                          <RotateCcw size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(b)}
                          disabled={b?.type === 'auto'}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>
        {restoreTarget && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50"
              onClick={() => setRestoreTarget(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-800 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-200 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                      <RotateCcw size={20} className="text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Restore Backup</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{restoreTarget?.name || 'Unknown backup'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setRestoreTarget(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-6 space-y-5">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Backup Contents</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(restoreTarget?.summary || {}).map(([key, count]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 dark:bg-slate-800"
                        >
                          <span className="text-sm text-gray-600 dark:text-gray-400">{summaryLabels[key] || key}</span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <Database size={18} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                        Automatic Restore Point
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
                        A backup of your current data will be created automatically before restoration.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <AlertTriangle size={18} className="text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-800 dark:text-red-300">Warning</p>
                      <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">
                        Restoring will overwrite all existing data in the selected collections. This action cannot be undone.
                      </p>
                    </div>
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={restoreAck}
                      onChange={(e) => setRestoreAck(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-gray-300 dark:border-slate-600 text-primary focus:ring-primary/50"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      I understand that this will overwrite my current data. Create an automatic restore point and proceed.
                    </span>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 p-6 pt-4 border-t border-gray-200 dark:border-slate-800">
                  <button
                    onClick={() => setRestoreTarget(null)}
                    disabled={restoring}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRestore}
                    disabled={!restoreAck || restoring}
                    className="px-5 py-2 rounded-xl text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {restoring ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Restoring...
                      </>
                    ) : (
                      <>
                        <RotateCcw size={16} />
                        Restore Now
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete Backup"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  )
}
