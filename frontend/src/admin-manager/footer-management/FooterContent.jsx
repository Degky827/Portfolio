import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, RefreshCw, Globe, Mail, Phone, MapPin } from 'lucide-react'
import PageHeader from '../shared/PageHeader'
import Toast from '../shared/Toast'
import { getFooterContent, updateFooterContent } from '../../shared/services/footerService'

const PHONE_PROTOCOLS = [
  { value: 'tel', label: 'Standard Call (tel:)' },
  { value: 'whatsapp', label: 'WhatsApp (wa.me)' },
  { value: 'telegram', label: 'Telegram (t.me)' },
  { value: 'custom', label: 'Custom URL' },
]

export default function FooterContent() {
  const [form, setForm] = useState({
    brandDescription: '',
    locationHeadline: '',
    subLocation: '',
    locationMapUrl: '',
    emailAddress: '',
    phoneNumber: '',
    phoneProtocol: 'tel',
    phoneCustomUrl: '',
  })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    ;(async () => {
      try {
        const { content } = await getFooterContent()
        if (content) {
          setForm({
            brandDescription: content.brandDescription || '',
            locationHeadline: content.locationHeadline || '',
            subLocation: content.subLocation || '',
            locationMapUrl: content.locationMapUrl || '',
            emailAddress: content.emailAddress || '',
            phoneNumber: content.phoneNumber || '',
            phoneProtocol: content.phoneProtocol || 'tel',
            phoneCustomUrl: content.phoneCustomUrl || '',
          })
        }
      } catch {
        setToast({ message: 'Failed to load footer content', type: 'error' })
      } finally {
        setFetching(false)
      }
    })()
  }, [])

  const set = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData()
    Object.entries(form).forEach(([key, val]) => {
      fd.append(key, val)
    })
    try {
      await updateFooterContent(fd)
      setToast({ message: 'Footer content updated successfully', type: 'success' })
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to update footer content', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-zinc-300 dark:border-zinc-600 border-t-zinc-800 dark:border-t-zinc-200 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Footer Management" subtitle="Manage contact info and logo description shown in the footer." />
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl">

          {/* Logo Description */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 space-y-4">
              <div>
                <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-100">Logo Description</h3>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Brief description displayed near the logo in the footer.</p>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">Description</label>
                <textarea
                  value={form.brandDescription}
                  onChange={set('brandDescription')}
                  rows={4}
                  placeholder="Building robust digital experiences through modern web development..."
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400/50 dark:focus:ring-zinc-500/50 transition-all text-sm resize-none"
                />
              </div>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 space-y-4">
              <div>
                <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-100">Contact Information</h3>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Location, email, and phone displayed in the footer.</p>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1 flex items-center gap-1.5">
                  <MapPin size={12} /> Location
                </label>
                <input
                  type="text"
                  value={form.locationHeadline}
                  onChange={set('locationHeadline')}
                  placeholder="Bahirdar, Ethiopia"
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400/50 dark:focus:ring-zinc-500/50 transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1 flex items-center gap-1.5">
                  <Globe size={12} /> Sub Location
                </label>
                <input
                  type="text"
                  value={form.subLocation}
                  onChange={set('subLocation')}
                  placeholder="Amhara Region"
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400/50 dark:focus:ring-zinc-500/50 transition-all text-sm"
                />
                <p className="text-[11px] text-zinc-400 mt-1">Secondary line — use "Open to Remote" for availability.</p>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1 flex items-center gap-1.5">
                  <MapPin size={12} /> Map URL
                </label>
                <input
                  type="url"
                  value={form.locationMapUrl}
                  onChange={set('locationMapUrl')}
                  placeholder="https://maps.google.com/?q=..."
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400/50 dark:focus:ring-zinc-500/50 transition-all text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1 flex items-center gap-1.5">
                    <Mail size={12} /> Email
                  </label>
                  <input
                    type="email"
                    value={form.emailAddress}
                    onChange={set('emailAddress')}
                    placeholder="email@example.com"
                    className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400/50 dark:focus:ring-zinc-500/50 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1 flex items-center gap-1.5">
                    <Phone size={12} /> Phone
                  </label>
                  <input
                    type="text"
                    value={form.phoneNumber}
                    onChange={set('phoneNumber')}
                    placeholder="+251 908 720 092"
                    className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400/50 dark:focus:ring-zinc-500/50 transition-all text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">Phone Click Action</label>
                <select
                  value={form.phoneProtocol}
                  onChange={set('phoneProtocol')}
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400/50 dark:focus:ring-zinc-500/50 transition-all text-sm"
                >
                  {PHONE_PROTOCOLS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                {form.phoneProtocol === 'custom' && (
                  <input
                    type="url"
                    value={form.phoneCustomUrl}
                    onChange={set('phoneCustomUrl')}
                    placeholder="https://..."
                    className="mt-2 w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400/50 dark:focus:ring-zinc-500/50 transition-all text-sm"
                  />
                )}
              </div>
            </div>
          </motion.div>

        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6 flex justify-end"
        >
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-lg text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <><RefreshCw size={18} className="animate-spin" /> Saving...</> : <><Save size={18} /> Save Changes</>}
          </button>
        </motion.div>
      </form>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
