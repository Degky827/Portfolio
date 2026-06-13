import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Save, RefreshCw, Globe, Palette, Mail, Share2,
} from 'lucide-react'
import PageHeader from '../shared/PageHeader'
import ImageUpload from '../shared/ImageUpload'
import Toast from '../shared/Toast'
import { getSettings, updateSettings } from '../../shared/services/settingsService'

const sectionConfig = [
  { id: 'general', label: 'General', icon: Globe },
  { id: 'portfolio', label: 'Portfolio', icon: Palette },
  { id: 'contact', label: 'Contact', icon: Mail },
  { id: 'social', label: 'Social Media', icon: Share2 },
]

const socialFields = [
  { key: 'github', label: 'GitHub URL', placeholder: 'https://github.com/username', icon: 'github' },
  { key: 'linkedin', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/in/username', icon: 'linkedin' },
  { key: 'twitter', label: 'Twitter / X URL', placeholder: 'https://twitter.com/username', icon: 'twitter' },
  { key: 'youtube', label: 'YouTube URL', placeholder: 'https://youtube.com/@username', icon: 'youtube' },
  { key: 'facebook', label: 'Facebook URL', placeholder: 'https://facebook.com/username', icon: 'facebook' },
  { key: 'instagram', label: 'Instagram URL', placeholder: 'https://instagram.com/username', icon: 'instagram' },
]

const inputClass = (hasError) =>
  `w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-800/80 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm ${
    hasError ? 'border-red-500' : 'border-gray-200 dark:border-slate-700/60'
  }`

const labelClass = 'block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-1.5'

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
    responseMessageTemplate: '',
    socialLinks: {
      github: '', linkedin: '', twitter: '',
      youtube: '', facebook: '', instagram: '',
    },
  })
  const [logoFile, setLogoFile] = useState(null)
  const [logoUrl, setLogoUrl] = useState('')
  const [existingLogo, setExistingLogo] = useState('')
  const [faviconFile, setFaviconFile] = useState(null)
  const [faviconUrl, setFaviconUrl] = useState('')
  const [existingFavicon, setExistingFavicon] = useState('')
  const [activeTab, setActiveTab] = useState('general')
  const [saving, setSaving] = useState(false)
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
            responseMessageTemplate: settings.responseMessageTemplate || '',
            socialLinks: {
              github: settings.socialLinks?.github || '',
              linkedin: settings.socialLinks?.linkedin || '',
              twitter: settings.socialLinks?.twitter || '',
              youtube: settings.socialLinks?.youtube || '',
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
    if (form.projectsPerPage < 1 || form.projectsPerPage > 50) errs.projectsPerPage = 'Must be 1–50'
    if (form.certificatesPerPage < 1 || form.certificatesPerPage > 50) errs.certificatesPerPage = 'Must be 1–50'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const setField = (field) => (e) => {
    const val = e.target.value
    setForm((prev) => ({ ...prev, [field]: val }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const setNumber = (field) => (e) => {
    const val = parseInt(e.target.value, 10)
    setForm((prev) => ({ ...prev, [field]: isNaN(val) ? '' : val }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const setBool = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.checked }))
  }

  const setSocial = (key) => (e) => {
    setForm((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [key]: e.target.value },
    }))
  }

  const handleFaviconChange = (val) => {
    if (typeof val === 'string') { setFaviconUrl(val); setFaviconFile(null) }
    else if (val instanceof File) { setFaviconFile(val); setFaviconUrl('') }
  }

  const handleLogoChange = (val) => {
    if (typeof val === 'string') { setLogoUrl(val); setLogoFile(null) }
    else if (val instanceof File) { setLogoFile(val); setLogoUrl('') }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)

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
      setToast({ message: 'Settings saved successfully', type: 'success' })
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
    <div className="relative min-h-[calc(100vh-8rem)]">
      <PageHeader
        title="Settings"
        subtitle="Manage your portfolio configuration, contact details, and social links."
      />

      <form onSubmit={handleSubmit}>
        {/* Tab Pills */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
          {sectionConfig.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                activeTab === id
                  ? 'bg-primary text-white shadow-lg shadow-primary/30'
                  : 'bg-white dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/80'
              }`}
            >
              <Icon size={17} />
              {label}
            </button>
          ))}
        </div>

        {/* ── General ── */}
        {activeTab === 'general' && (
          <motion.div
            key="general"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-sm">
                <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Globe size={18} className="text-primary" />
                  General Settings
                </h2>

                <div>
                  <label className={labelClass}>Portfolio Owner Name</label>
                  <input type="text" value={form.ownerName} onChange={setField('ownerName')}
                    placeholder="e.g. John Doe"
                    className={inputClass(errors.ownerName)} />
                  {errors.ownerName && <p className="text-xs text-red-500 mt-1">{errors.ownerName}</p>}
                </div>

                <div>
                  <label className={labelClass}>Portfolio Title</label>
                  <input type="text" value={form.title} onChange={setField('title')}
                    placeholder="e.g. Full-Stack Developer Portfolio"
                    className={inputClass(errors.title)} />
                  {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className={labelClass}>Portfolio Description</label>
                  <textarea value={form.description} onChange={setField('description')}
                    rows={3} placeholder="A short description of your portfolio..."
                    className={`${inputClass()} resize-none`} />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                <ImageUpload value={existingLogo} label="Portfolio Logo" onChange={handleLogoChange} />
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                <ImageUpload value={existingFavicon} label="Portfolio Favicon" onChange={handleFaviconChange} />
                <p className="text-xs text-slate-400 mt-2">Recommended: 1:1 ratio, .ico/.webp, under 50KB</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Portfolio ── */}
        {activeTab === 'portfolio' && (
          <motion.div
            key="portfolio"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
              <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Palette size={18} className="text-primary" />
                Portfolio Settings
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Default Theme</label>
                  <select value={form.defaultTheme} onChange={setField('defaultTheme')}
                    className={inputClass()}>
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                  </select>
                </div>
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

              <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
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
            </div>
          </motion.div>
        )}

        {/* ── Contact ── */}
        {activeTab === 'contact' && (
          <motion.div
            key="contact"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
              <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Mail size={18} className="text-primary" />
                Contact Settings
              </h2>

              <div>
                <label className={labelClass}>Admin Email</label>
                <input type="email" value={form.publicEmail} onChange={setField('publicEmail')}
                  placeholder="admin@example.com"
                  className={inputClass(errors.publicEmail)} />
                {errors.publicEmail && <p className="text-xs text-red-500 mt-1">{errors.publicEmail}</p>}
              </div>

              <div>
                <label className={labelClass}>Contact Phone Number</label>
                <input type="tel" value={form.publicPhone} onChange={setField('publicPhone')}
                  placeholder="+1 (555) 123-4567" className={inputClass()} />
              </div>

              <div>
                <label className={labelClass}>Office Address</label>
                <input type="text" value={form.publicAddress} onChange={setField('publicAddress')}
                  placeholder="Addis Ababa, Ethiopia" className={inputClass()} />
              </div>

              <div>
                <label className={labelClass}>Auto-reply Message Template</label>
                <textarea value={form.responseMessageTemplate} onChange={setField('responseMessageTemplate')}
                  rows={4}
                  placeholder="Thank you for reaching out! I'll get back to you within 24 hours."
                  className={`${inputClass()} resize-none`} />
                <p className="text-xs text-slate-400 mt-1">This message is sent automatically when a visitor submits the contact form.</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Social Media ── */}
        {activeTab === 'social' && (
          <motion.div
            key="social"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
              <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Share2 size={18} className="text-primary" />
                Social Media Settings
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {socialFields.map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className={labelClass}>{label}</label>
                    <input type="url" value={form.socialLinks[key]} onChange={setSocial(key)}
                      placeholder={placeholder} className={inputClass()} />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </form>

      {/* Floating Save Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-sm font-bold text-white bg-primary hover:bg-primary/90 shadow-xl shadow-primary/30 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {saving ? (
            <><RefreshCw size={18} className="animate-spin" /> Saving...</>
          ) : (
            <><Save size={18} /> Save Changes</>
          )}
        </button>
      </motion.div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  )
}
