import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Globe, Check, RefreshCw, Palette, Save } from 'lucide-react'
import PageHeader from '../shared/PageHeader'
import ThemeToggle from '../layout/ThemeToggle'
import Toast from '../shared/Toast'
import { getGlobalAppearance, updateGlobalAppearance, getSettings, updateSettings } from '../../shared/services/settingsService'

const MODE_LABELS = { light: 'Light', dark: 'Dark', system: 'System' }

const inputClass = (hasError) =>
  `w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-800/80 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm ${
    hasError ? 'border-red-500' : 'border-gray-200 dark:border-slate-700/60'
  }`

const labelClass = 'block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-1.5'

export default function ThemeSettings() {
  const [globalAppearance, setGlobalAppearance] = useState(null)
  const [syncing, setSyncing] = useState(false)
  const [syncMsg, setSyncMsg] = useState('')

  const [form, setForm] = useState({
    projectsPerPage: 6,
    certificatesPerPage: 6,
    enableAnalytics: true,
    enableContactForm: true,
  })
  const [saving, setSaving] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [toast, setToast] = useState(null)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    getGlobalAppearance()
      .then((res) => setGlobalAppearance(res.appearance))
      .catch(() => {})
  }, [])

  useEffect(() => {
    ;(async () => {
      try {
        const { settings } = await getSettings()
        if (settings) {
          setForm({
            projectsPerPage: settings.projectsPerPage ?? 6,
            certificatesPerPage: settings.certificatesPerPage ?? 6,
            enableAnalytics: settings.enableAnalytics ?? true,
            enableContactForm: settings.enableContactForm ?? true,
          })
        }
      } catch {
        setToast({ message: 'Failed to load settings', type: 'error' })
      } finally {
        setFetching(false)
      }
    })()
  }, [])

  const handleSync = async () => {
    setSyncing(true)
    setSyncMsg('')
    try {
      const stored = localStorage.getItem('admin-theme') || 'system'
      const res = await updateGlobalAppearance({ mode: stored })
      setGlobalAppearance(res.appearance)
      setSyncMsg(`Synced to ${MODE_LABELS[stored] || stored}`)
    } catch {
      setSyncMsg('Sync failed')
    } finally {
      setSyncing(false)
    }
  }

  function validate() {
    const errs = {}
    if (form.projectsPerPage < 1 || form.projectsPerPage > 50) errs.projectsPerPage = 'Must be 1–50'
    if (form.certificatesPerPage < 1 || form.certificatesPerPage > 50) errs.certificatesPerPage = 'Must be 1–50'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const setNumber = (field) => (e) => {
    const val = parseInt(e.target.value, 10)
    setForm((prev) => ({ ...prev, [field]: isNaN(val) ? '' : val }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const setBool = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.checked }))
  }

  const handleSavePortfolio = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)

    const fd = new FormData()
    Object.entries(form).forEach(([key, val]) => {
      fd.append(key, val)
    })

    try {
      await updateSettings(fd)
      setToast({ message: 'Portfolio settings saved successfully', type: 'success' })
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to save settings', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Appearance"
        subtitle="Customize your admin dashboard appearance and portfolio settings."
      />

      <div className="max-w-2xl space-y-6">
        {/* Theme Preference */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6"
        >
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Theme Preference</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Choose between light, dark, or system theme. Your preference is saved and persists across sessions.
          </p>
          <ThemeToggle />
        </motion.div>

        {/* Global Appearance Sync */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 space-y-5"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center">
              <Globe size={20} className="text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Global Appearance</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Sync your theme preference to the public-facing site so visitors see the same appearance.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Current global mode</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {globalAppearance
                  ? `${MODE_LABELS[globalAppearance.mode] || globalAppearance.mode}${globalAppearance.syncedAt ? ` — synced ${new Date(globalAppearance.syncedAt).toLocaleDateString()}` : ''}`
                  : 'Loading...'}
              </p>
            </div>
            <button
              onClick={handleSync}
              disabled={syncing}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors disabled:opacity-50"
            >
              {syncing ? <RefreshCw size={16} className="animate-spin" /> : <Check size={16} />}
              {syncing ? 'Syncing...' : 'Sync Now'}
            </button>
          </div>

          {syncMsg && (
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Check size={12} className="text-green-500" />
              {syncMsg}
            </p>
          )}
        </motion.div>

        {/* Portfolio Settings */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Palette size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Portfolio Settings</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Configure portfolio display options and features.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Projects Per Page</label>
              <input type="number" value={form.projectsPerPage} onChange={setNumber('projectsPerPage')}
                min={1} max={50} className={inputClass(errors.projectsPerPage)} />
              {errors.projectsPerPage && <p className="text-xs text-red-500 mt-1">{errors.projectsPerPage}</p>}
            </div>
            <div>
              <label className={labelClass}>Certificates Per Page</label>
              <input type="number" value={form.certificatesPerPage} onChange={setNumber('certificatesPerPage')}
                min={1} max={50} className={inputClass(errors.certificatesPerPage)} />
              {errors.certificatesPerPage && <p className="text-xs text-red-500 mt-1">{errors.certificatesPerPage}</p>}
            </div>
          </div>

          <div className="space-y-4 pt-2 border-t border-gray-200 dark:border-slate-800">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input type="checkbox" checked={form.enableAnalytics} onChange={setBool('enableAnalytics')}
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary/50" />
              <div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Enable Portfolio Analytics</span>
                <p className="text-xs text-slate-500 dark:text-slate-400">Track page views and visitor statistics</p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input type="checkbox" checked={form.enableContactForm} onChange={setBool('enableContactForm')}
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary/50" />
              <div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Enable Contact Form</span>
                <p className="text-xs text-slate-500 dark:text-slate-400">Allow visitors to send you messages</p>
              </div>
            </label>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSavePortfolio}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all duration-200 disabled:opacity-50"
            >
              {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? 'Saving...' : 'Save Portfolio Settings'}
            </button>
          </div>
        </motion.div>
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  )
}
