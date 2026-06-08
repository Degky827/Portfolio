import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, RefreshCw, Plus, Trash2 } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import ImageUpload from '../components/ImageUpload'
import Toast from '../components/Toast'
import { getFooterContent, updateFooterContent } from '../../services/footerService'

const emptyQuickLink = { label: '', url: '' }
const emptySocialLink = { platform: '', url: '' }

export default function FooterContent() {
  const [form, setForm] = useState({
    footerDescription: '',
    copyrightText: '',
    quickLinks: [],
    socialLinks: [],
    status: 'active',
  })
  const [logoFile, setLogoFile] = useState(null)
  const [existingLogo, setExistingLogo] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    ;(async () => {
      try {
        const { content } = await getFooterContent()
        if (content) {
          setForm({
            footerDescription: content.footerDescription || '',
            copyrightText: content.copyrightText || '',
            quickLinks: content.quickLinks || [],
            socialLinks: content.socialLinks || [],
            status: content.status || 'active',
          })
          setExistingLogo(content.footerLogo || '')
        }
      } catch {
        setToast({ message: 'Failed to load footer content', type: 'error' })
      } finally {
        setFetching(false)
      }
    })()
  }, [])

  const set = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const addItem = (key, empty) => {
    setForm((prev) => ({ ...prev, [key]: [...prev[key], { ...empty }] }))
  }

  const removeItem = (key, idx) => {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== idx),
    }))
  }

  const updateItem = (key, idx, field) => (e) => {
    setForm((prev) => {
      const items = [...prev[key]]
      items[idx] = { ...items[idx], [field]: e.target.value }
      return { ...prev, [key]: items }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData()
    fd.append('footerDescription', form.footerDescription)
    fd.append('copyrightText', form.copyrightText)
    fd.append('status', form.status)
    fd.append('quickLinks', JSON.stringify(form.quickLinks))
    fd.append('socialLinks', JSON.stringify(form.socialLinks))
    if (logoFile) fd.append('footerLogo', logoFile)
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
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Footer Content" subtitle="Manage your footer section." />
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 space-y-5"
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Footer Text</h2>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Description</label>
                <textarea value={form.footerDescription} onChange={set('footerDescription')} rows={3} placeholder="Footer description..." className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Copyright Text</label>
                <input type="text" value={form.copyrightText} onChange={set('copyrightText')} placeholder="© 2024 Your Name. All rights reserved." className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 space-y-5"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Quick Links</h2>
                <button type="button" onClick={() => addItem('quickLinks', emptyQuickLink)} className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                  <Plus size={16} /> Add Link
                </button>
              </div>
              {form.quickLinks.length === 0 && <p className="text-sm text-gray-400">No quick links yet.</p>}
              {form.quickLinks.map((link, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-gray-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-600 dark:text-gray-400">Link {idx + 1}</span>
                    <button type="button" onClick={() => removeItem('quickLinks', idx)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"><Trash2 size={14} /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" value={link.label} onChange={updateItem('quickLinks', idx, 'label')} placeholder="Label" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                    <input type="text" value={link.url} onChange={updateItem('quickLinks', idx, 'url')} placeholder="URL" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 space-y-5"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Social Links</h2>
                <button type="button" onClick={() => addItem('socialLinks', emptySocialLink)} className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                  <Plus size={16} /> Add Social Link
                </button>
              </div>
              {form.socialLinks.length === 0 && <p className="text-sm text-gray-400">No social links yet.</p>}
              {form.socialLinks.map((link, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-gray-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-600 dark:text-gray-400">Link {idx + 1}</span>
                    <button type="button" onClick={() => removeItem('socialLinks', idx)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"><Trash2 size={14} /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" value={link.platform} onChange={updateItem('socialLinks', idx, 'platform')} placeholder="Platform" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                    <input type="url" value={link.url} onChange={updateItem('socialLinks', idx, 'url')} placeholder="URL" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6"
            >
              <ImageUpload value={existingLogo} onChange={setLogoFile} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 space-y-4"
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Settings</h2>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Status</label>
                <select value={form.status} onChange={set('status')} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
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
