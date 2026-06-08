import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, RefreshCw } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Toast from '../components/Toast'
import { getContactContent, updateContactContent } from '../../services/contactService'

export default function ContactContent() {
  const [form, setForm] = useState({
    email: '',
    phone: '',
    address: '',
    mapLink: '',
    whatsapp: '',
    telegram: '',
    linkedin: '',
    github: '',
    twitter: '',
    facebook: '',
    instagram: '',
    contactFormEnabled: true,
  })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    ;(async () => {
      try {
        const { content } = await getContactContent()
        if (content) {
          setForm({
            email: content.email || '',
            phone: content.phone || '',
            address: content.address || '',
            mapLink: content.mapLink || '',
            whatsapp: content.whatsapp || '',
            telegram: content.telegram || '',
            linkedin: content.linkedin || '',
            github: content.github || '',
            twitter: content.twitter || '',
            facebook: content.facebook || '',
            instagram: content.instagram || '',
            contactFormEnabled: content.contactFormEnabled !== false,
          })
        }
      } catch {
        setToast({ message: 'Failed to load contact content', type: 'error' })
      } finally {
        setFetching(false)
      }
    })()
  }, [])

  const set = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await updateContactContent(form)
      setToast({ message: 'Contact content updated successfully', type: 'success' })
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to update contact content', type: 'error' })
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
      <PageHeader title="Contact Content" subtitle="Manage your contact information and social links." />
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 space-y-5"
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Contact Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Email</label>
                  <input type="email" value={form.email} onChange={set('email')} placeholder="email@example.com" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Phone</label>
                  <input type="text" value={form.phone} onChange={set('phone')} placeholder="+251 900 000 000" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Address</label>
                <input type="text" value={form.address} onChange={set('address')} placeholder="City, Country" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Map Link</label>
                <input type="url" value={form.mapLink} onChange={set('mapLink')} placeholder="https://maps.google.com/?q=..." className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 space-y-5"
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Social Links</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: 'whatsapp', label: 'WhatsApp', placeholder: 'https://wa.me/251...' },
                  { key: 'telegram', label: 'Telegram', placeholder: 'https://t.me/username' },
                  { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/username' },
                  { key: 'github', label: 'GitHub', placeholder: 'https://github.com/username' },
                  { key: 'twitter', label: 'Twitter / X', placeholder: 'https://twitter.com/username' },
                  { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/username' },
                  { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/username' },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">{label}</label>
                    <input type="url" value={form[key]} onChange={set(key)} placeholder={placeholder} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 space-y-4"
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Settings</h2>
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input type="checkbox" checked={form.contactFormEnabled} onChange={set('contactFormEnabled')} className="sr-only peer" />
                  <div className="w-10 h-6 bg-gray-300 dark:bg-slate-700 rounded-full peer-checked:bg-primary transition-colors" />
                  <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-4 transition-transform" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Contact Form Enabled</span>
              </label>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6 flex justify-end gap-3"
        >
          <button type="submit" disabled={loading} className="px-6 py-3 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2">
            {loading ? <><RefreshCw size={18} className="animate-spin" /> Saving...</> : <><Save size={18} /> Save Changes</>}
          </button>
        </motion.div>
      </form>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
