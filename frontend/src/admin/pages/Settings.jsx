import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Save, RefreshCw, Globe, Palette, Mail, Share2,
} from 'lucide-react'
import PageHeader from '../components/PageHeader'
import ImageUpload from '../components/ImageUpload'
import Toast from '../components/Toast'
import { getSettings, updateSettings } from '../../services/settingsService'

const socialFields = [
  { key: 'github', label: 'GitHub', placeholder: 'https://github.com/username' },
  { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/username' },
  { key: 'telegram', label: 'Telegram', placeholder: 'https://t.me/username' },
  { key: 'twitter', label: 'Twitter / X', placeholder: 'https://twitter.com/username' },
  { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/username' },
  { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/username' },
]

const sectionConfig = [
  { id: 'general', label: 'General Settings', icon: Globe },
  { id: 'portfolio', label: 'Portfolio Settings', icon: Palette },
  { id: 'contact', label: 'Contact Settings', icon: Mail },
  { id: 'social', label: 'Social Media Settings', icon: Share2 },
]

export default function Settings() {
  const [form, setForm] = useState({
    ownerName: '',
    title: '',
    description: '',
    defaultTheme: 'dark',
    projectsPerPage: 6,
    certificatesPerPage: 6,
    enableAnalytics: true,
    enableContactForm: true,
    publicEmail: '',
    publicPhone: '',
    publicAddress: '',
    socialLinks: {
      github: '',
      linkedin: '',
      telegram: '',
      twitter: '',
      facebook: '',
      instagram: '',
    },
  })
  const [logoFile, setLogoFile] = useState(null)
  const [logoUrl, setLogoUrl] = useState('')
  const [existingLogo, setExistingLogo] = useState('')
  const [faviconFile, setFaviconFile] = useState(null)
  const [faviconUrl, setFaviconUrl] = useState('')
  const [existingFavicon, setExistingFavicon] = useState('')
  const [activeSection, setActiveSection] = useState('general')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [toast, setToast] = useState(null)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    ;(async () => {
      try {
        const { settings } = await getSettings()
        if (settings) {
          setForm({
            ownerName: settings.ownerName || '',
            title: settings.title || '',
            description: settings.description || '',
            defaultTheme: settings.defaultTheme || 'dark',
            projectsPerPage: settings.projectsPerPage ?? 6,
            certificatesPerPage: settings.certificatesPerPage ?? 6,
            enableAnalytics: settings.enableAnalytics ?? true,
            enableContactForm: settings.enableContactForm ?? true,
            publicEmail: settings.publicEmail || '',
            publicPhone: settings.publicPhone || '',
            publicAddress: settings.publicAddress || '',
            socialLinks: {
              github: settings.socialLinks?.github || '',
              linkedin: settings.socialLinks?.linkedin || '',
              telegram: settings.socialLinks?.telegram || '',
              twitter: settings.socialLinks?.twitter || '',
              facebook: settings.socialLinks?.facebook || '',
              instagram: settings.socialLinks?.instagram || '',
            },
          })
          setExistingLogo(settings.logo || '')
          setExistingFavicon(settings.favicon || '')
        }
      } catch {
        setToast({ message: 'Failed to load settings', type: 'error' })
      } finally {
        setFetching(false)
      }
    })()
  }, [])

  function validate() {
    const errs = {}
    if (form.ownerName && form.ownerName.length > 100) errs.ownerName = 'Max 100 characters'
    if (form.title && form.title.length > 200) errs.title = 'Max 200 characters'
    if (form.publicEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.publicEmail)) {
      errs.publicEmail = 'Invalid email format'
    }
    if (form.projectsPerPage < 1 || form.projectsPerPage > 50) errs.projectsPerPage = 'Must be 1-50'
    if (form.certificatesPerPage < 1 || form.certificatesPerPage > 50) errs.certificatesPerPage = 'Must be 1-50'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleChange = (field) => (e) => {
    const val = e.target.value
    setForm((prev) => ({ ...prev, [field]: val }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const handleNumberChange = (field) => (e) => {
    const val = parseInt(e.target.value, 10)
    setForm((prev) => ({ ...prev, [field]: isNaN(val) ? '' : val }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const handleBoolChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.checked }))
  }

  const handleSocialChange = (key) => (e) => {
    setForm((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [key]: e.target.value },
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)

    const fd = new FormData()
    Object.entries(form).forEach(([key, val]) => {
      if (key === 'socialLinks') {
        fd.append('socialLinks', JSON.stringify(val))
      } else {
        fd.append(key, val)
      }
    })
    if (logoFile) fd.append('logo', logoFile)
    else if (logoUrl) fd.append('logoUrl', logoUrl)
    if (faviconFile) fd.append('favicon', faviconFile)
    else if (faviconUrl) fd.append('faviconUrl', faviconUrl)

    try {
      await updateSettings(fd)
      setToast({ message: 'Settings updated successfully', type: 'success' })
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to update settings', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Manage your portfolio configuration, contact details, and social links."
      />

      <form onSubmit={handleSubmit}>
        {/* Section tabs */}
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

        {activeSection === 'general' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 space-y-5">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">General Settings</h2>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                    Portfolio Owner Name
                  </label>
                  <input
                    type="text"
                    value={form.ownerName}
                    onChange={handleChange('ownerName')}
                    placeholder="e.g. John Doe"
                    className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${errors.ownerName ? 'border-red-500' : 'border-gray-300 dark:border-slate-700'}`}
                  />
                  {errors.ownerName && <p className="text-xs text-red-500 mt-1">{errors.ownerName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                    Portfolio Title
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={handleChange('title')}
                    placeholder="e.g. Full-Stack Developer Portfolio"
                    className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${errors.title ? 'border-red-500' : 'border-gray-300 dark:border-slate-700'}`}
                  />
                  {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                    Portfolio Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={handleChange('description')}
                    rows={3}
                    placeholder="A short description of your portfolio..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6">
                <ImageUpload
                  value={existingLogo}
                  label="Portfolio Logo"
                  onChange={(val) => {
                    if (typeof val === 'string') { setLogoUrl(val); setLogoFile(null) }
                    else { setLogoFile(val); setLogoUrl('') }
                  }}
                />
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6">
                <ImageUpload
                  value={existingFavicon}
                  label="Portfolio Favicon"
                  onChange={(val) => {
                    if (typeof val === 'string') { setFaviconUrl(val); setFaviconFile(null) }
                    else { setFaviconFile(val); setFaviconUrl('') }
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {activeSection === 'portfolio' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 space-y-5 max-w-2xl"
          >
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Portfolio Settings</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                  Default Theme
                </label>
                <select
                  value={form.defaultTheme}
                  onChange={handleChange('defaultTheme')}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                  Projects Per Page
                </label>
                <input
                  type="number"
                  value={form.projectsPerPage}
                  onChange={handleNumberChange('projectsPerPage')}
                  min={1}
                  max={50}
                  className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${errors.projectsPerPage ? 'border-red-500' : 'border-gray-300 dark:border-slate-700'}`}
                />
                {errors.projectsPerPage && <p className="text-xs text-red-500 mt-1">{errors.projectsPerPage}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                  Certificates Per Page
                </label>
                <input
                  type="number"
                  value={form.certificatesPerPage}
                  onChange={handleNumberChange('certificatesPerPage')}
                  min={1}
                  max={50}
                  className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${errors.certificatesPerPage ? 'border-red-500' : 'border-gray-300 dark:border-slate-700'}`}
                />
                {errors.certificatesPerPage && <p className="text-xs text-red-500 mt-1">{errors.certificatesPerPage}</p>}
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.enableAnalytics}
                  onChange={handleBoolChange('enableAnalytics')}
                  className="w-5 h-5 rounded border-gray-300 dark:border-slate-600 text-primary focus:ring-primary/50"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Enable Portfolio Analytics</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Track page views and visitor statistics</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.enableContactForm}
                  onChange={handleBoolChange('enableContactForm')}
                  className="w-5 h-5 rounded border-gray-300 dark:border-slate-600 text-primary focus:ring-primary/50"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Enable Contact Form</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Allow visitors to send you messages</p>
                </div>
              </label>
            </div>
          </motion.div>
        )}

        {activeSection === 'contact' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 space-y-5 max-w-2xl"
          >
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Contact Settings</h2>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                Public Email
              </label>
              <input
                type="email"
                value={form.publicEmail}
                onChange={handleChange('publicEmail')}
                placeholder="hello@example.com"
                className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${errors.publicEmail ? 'border-red-500' : 'border-gray-300 dark:border-slate-700'}`}
              />
              {errors.publicEmail && <p className="text-xs text-red-500 mt-1">{errors.publicEmail}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                Public Phone
              </label>
              <input
                type="tel"
                value={form.publicPhone}
                onChange={handleChange('publicPhone')}
                placeholder="+1 (555) 123-4567"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                Public Address
              </label>
              <input
                type="text"
                value={form.publicAddress}
                onChange={handleChange('publicAddress')}
                placeholder="Addis Ababa, Ethiopia"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
          </motion.div>
        )}

        {activeSection === 'social' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 space-y-5 max-w-2xl"
          >
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Social Media Settings</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {socialFields.map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                    {label}
                  </label>
                  <input
                    type="url"
                    value={form.socialLinks[key]}
                    onChange={handleSocialChange(key)}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Save button (always visible) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 flex justify-end"
        >
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </button>
        </motion.div>
      </form>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  )
}
