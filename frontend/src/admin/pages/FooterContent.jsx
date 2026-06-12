import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, RefreshCw, Plus, Trash2, GripVertical, Globe, Mail, Phone, Hash, Link } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import ImageUpload from '../components/ImageUpload'
import Toast from '../components/Toast'
import { getFooterContent, updateFooterContent } from '../../services/footerService'

const emptySocialLink = { platform: '', url: '', displayOrder: 0, active: true }
const emptyQuickLink = { label: '', url: '', displayOrder: 0 }

const EMOJI_PICKER = ['❤️', '🔥', '⭐', '✨', '🚀', '💻', '🎯', '🌟', '💡', '🎨', '🌍', '💪', '⚡', '💎', '🏆', '🎉']

const PHONE_PROTOCOLS = [
  { value: 'tel', label: 'Standard Call (tel:)' },
  { value: 'whatsapp', label: 'WhatsApp (wa.me)' },
  { value: 'telegram', label: 'Telegram (t.me)' },
  { value: 'custom', label: 'Custom URL' },
]

function Card({ children, className = '' }) {
  return (
    <div className={`bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 space-y-5 ${className}`}>
      {children}
    </div>
  )
}

function SectionHeader({ title, subtitle }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
      {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
    </div>
  )
}

function EmptyState({ message }) {
  return <p className="text-sm text-gray-400 italic">{message}</p>
}

export default function FooterContent() {
  const [form, setForm] = useState({
    brandName: '',
    footerDescription: '',
    socialLinks: [],
    quickLinks: [],
    locationLine1: '',
    locationLine2: '',
    email: '',
    emailProtocol: 'mailto',
    phone: '',
    phoneProtocol: 'tel',
    phoneCustomUrl: '',
    copyrightText: '',
    visualSeparator: '',
    techAttribution: '',
    status: 'active',
  })
  const [logoFile, setLogoFile] = useState(null)
  const [logoUrl, setLogoUrl] = useState('')
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
            brandName: content.brandName || '',
            footerDescription: content.footerDescription || '',
            socialLinks: content.socialLinks || [],
            quickLinks: content.quickLinks || [],
            locationLine1: content.locationLine1 || '',
            locationLine2: content.locationLine2 || '',
            email: content.email || '',
            emailProtocol: content.emailProtocol || 'mailto',
            phone: content.phone || '',
            phoneProtocol: content.phoneProtocol || 'tel',
            phoneCustomUrl: content.phoneCustomUrl || '',
            copyrightText: content.copyrightText || '',
            visualSeparator: content.visualSeparator || '',
            techAttribution: content.techAttribution || '',
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
    setForm((prev) => ({ ...prev, [key]: [...prev[key], { ...empty, displayOrder: prev[key].length }] }))
  }

  const removeItem = (key, idx) => {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== idx),
    }))
  }

  const updateItem = (key, idx, field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((prev) => {
      const items = [...prev[key]]
      items[idx] = { ...items[idx], [field]: value }
      return { ...prev, [key]: items }
    })
  }

  const moveItem = (key, idx, direction) => {
    setForm((prev) => {
      const items = [...prev[key]]
      const targetIdx = idx + direction
      if (targetIdx < 0 || targetIdx >= items.length) return prev
      ;[items[idx], items[targetIdx]] = [items[targetIdx], items[idx]]
      items.forEach((item, i) => { item.displayOrder = i })
      return { ...prev, [key]: items }
    })
  }

  const insertEmoji = (emoji) => {
    setForm((prev) => ({ ...prev, visualSeparator: prev.visualSeparator + emoji }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData()
    Object.entries(form).forEach(([key, val]) => {
      if (key === 'quickLinks' || key === 'socialLinks') {
        fd.append(key, JSON.stringify(val))
      } else {
        fd.append(key, val)
      }
    })
    if (logoFile) fd.append('footerLogo', logoFile)
    else if (logoUrl) fd.append('footerLogoUrl', logoUrl)
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
      <PageHeader title="Footer Management" subtitle="Manage your footer section — branding, navigation, contact, and bottom bar." />
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ═══════════════════ COLUMN 1: BRANDING & CHANNELS ═══════════════════ */}
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <SectionHeader title="Branding & Channels" subtitle="Brand identity, description, logo, and social profile links." />

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Brand Name</label>
                  <input type="text" value={form.brandName} onChange={set('brandName')} placeholder="DESALEGN" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Description</label>
                  <textarea value={form.footerDescription} onChange={set('footerDescription')} rows={3} placeholder="Building robust digital experiences..." className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none" />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Footer Logo</label>
                  <ImageUpload value={existingLogo} onChange={(val) => {
                    if (typeof val === 'string') { setLogoUrl(val); setLogoFile(null) }
                    else { setLogoFile(val); setLogoUrl('') }
                  }} />
                </div>

                <div className="border-t border-gray-200 dark:border-slate-700 pt-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Social Profile Links</span>
                    <button type="button" onClick={() => addItem('socialLinks', emptySocialLink)} className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                      <Plus size={16} /> Add
                    </button>
                  </div>
                  {form.socialLinks.length === 0 && <EmptyState message="No social links added yet." />}
                  <div className="space-y-2">
                    {form.socialLinks.map((link, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-3 rounded-xl border border-gray-200 dark:border-slate-700">
                        <GripVertical size={14} className="text-gray-400 shrink-0 cursor-grab" />
                        <input type="text" value={link.platform} onChange={updateItem('socialLinks', idx, 'platform')} placeholder="GitHub" className="w-24 sm:w-28 px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                        <input type="url" value={link.url} onChange={updateItem('socialLinks', idx, 'url')} placeholder="https://github.com/..." className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                        <label className="flex items-center gap-1 text-[10px] text-gray-500 shrink-0">
                          <input type="checkbox" checked={link.active !== false} onChange={updateItem('socialLinks', idx, 'active')} className="rounded" />
                          On
                        </label>
                        <div className="flex items-center gap-0.5 shrink-0">
                          <button type="button" onClick={() => moveItem('socialLinks', idx, -1)} disabled={idx === 0} className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 text-xs">▲</button>
                          <button type="button" onClick={() => moveItem('socialLinks', idx, 1)} disabled={idx === form.socialLinks.length - 1} className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 text-xs">▼</button>
                        </div>
                        <button type="button" onClick={() => removeItem('socialLinks', idx)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors shrink-0"><Trash2 size={13} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* ═══════════════════ COLUMN 2: QUICK LINKS ═══════════════════ */}
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <Card>
                <div className="flex items-center justify-between">
                  <SectionHeader title="Quick Links Navigation" subtitle="Reorderable anchor tags for your local page sections." />
                  <button type="button" onClick={() => addItem('quickLinks', emptyQuickLink)} className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                    <Plus size={16} /> Add Link
                  </button>
                </div>
                {form.quickLinks.length === 0 && <EmptyState message="No quick links yet." />}
                <div className="space-y-2">
                  {form.quickLinks.map((link, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-3 rounded-xl border border-gray-200 dark:border-slate-700">
                      <GripVertical size={14} className="text-gray-400 shrink-0 cursor-grab" />
                      <input type="text" value={link.label} onChange={updateItem('quickLinks', idx, 'label')} placeholder="Home" className="w-24 px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                      <input type="text" value={link.url} onChange={updateItem('quickLinks', idx, 'url')} placeholder="#home" className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                      <div className="flex items-center gap-0.5 shrink-0">
                        <button type="button" onClick={() => moveItem('quickLinks', idx, -1)} disabled={idx === 0} className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 text-xs">▲</button>
                        <button type="button" onClick={() => moveItem('quickLinks', idx, 1)} disabled={idx === form.quickLinks.length - 1} className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 text-xs">▼</button>
                      </div>
                      <button type="button" onClick={() => removeItem('quickLinks', idx)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors shrink-0"><Trash2 size={13} /></button>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* ═══════════════════ COLUMN 3: CONTACT HUB + BOTTOM BAR ═══════════════════ */}
          <div className="space-y-6">
            {/* ── Contact Hub ── */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card>
                <SectionHeader title="Humanized Contact Hub" subtitle="Location narrative, email with auto mailto, and phone with protocol selection." />

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5 flex items-center gap-1.5">
                    <Globe size={12} /> Location — Line 1 <span className="text-gray-400 font-normal normal-case tracking-normal">(Primary header)</span>
                  </label>
                  <input type="text" value={form.locationLine1} onChange={set('locationLine1')} placeholder="Bahirdar, Ethiopia" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                  <p className="text-[11px] text-gray-400 mt-1">Displayed as the main location line on the public footer.</p>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5 flex items-center gap-1.5">
                    <Globe size={12} /> Location — Line 2 <span className="text-gray-400 font-normal normal-case tracking-normal">(Sub-regional context / availability)</span>
                  </label>
                  <input type="text" value={form.locationLine2} onChange={set('locationLine2')} placeholder="Amhara Region" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                  <p className="text-[11px] text-gray-400 mt-1">Shown as secondary text. Use "Open to Remote Worldwide" for availability.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5 flex items-center gap-1.5">
                      <Mail size={12} /> Email
                    </label>
                    <div className="relative">
                      <input type="email" value={form.email} onChange={set('email')} placeholder="email@example.com" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">
                        mailto:
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5 flex items-center gap-1.5">
                      <Phone size={12} /> Phone
                    </label>
                    <input type="text" value={form.phone} onChange={set('phone')} placeholder="+251 908 720 092" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Phone Click Protocol</label>
                  <select value={form.phoneProtocol} onChange={set('phoneProtocol')} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all">
                    {PHONE_PROTOCOLS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  {form.phoneProtocol === 'custom' && (
                    <div className="mt-3">
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5 flex items-center gap-1.5">
                        <Link size={12} /> Custom Phone URL
                      </label>
                      <input type="url" value={form.phoneCustomUrl} onChange={set('phoneCustomUrl')} placeholder="https://..." className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                    </div>
                  )}
                  <p className="text-[11px] text-gray-400 mt-1">
                    {form.phoneProtocol === 'tel' && 'Generates a standard tel: link.'}
                    {form.phoneProtocol === 'whatsapp' && 'Generates a wa.me link — use full phone number with country code.'}
                    {form.phoneProtocol === 'telegram' && 'Generates a t.me link — enter the username (with or without @).'}
                    {form.phoneProtocol === 'custom' && 'Provide a fully custom URL for the phone link.'}
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* ── Bottom Bar Utilities ── */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <Card>
                <SectionHeader title="Bottom Bar Utilities" subtitle="Three horizontally aligned fields that map to the lower footer wrapper." />
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5 flex items-center gap-1.5">
                    <Hash size={12} /> Copyright String
                  </label>
                  <input type="text" value={form.copyrightText} onChange={set('copyrightText')} placeholder="© 2026 DESALEGN. ALL RIGHTS RESERVED." className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5 flex items-center gap-1.5">
                    Visual Middle Separator
                  </label>
                  <input type="text" value={form.visualSeparator} onChange={set('visualSeparator')} placeholder="MADE WITH ❤️ USING" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mr-1">Emoji Insert:</span>
                    {EMOJI_PICKER.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => insertEmoji(emoji)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-sm transition-colors"
                        title={`Insert ${emoji}`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5 flex items-center gap-1.5">
                    Technology Attribution Tag
                  </label>
                  <input type="text" value={form.techAttribution} onChange={set('techAttribution')} placeholder="REACT & TAILWIND" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                </div>
              </Card>
            </motion.div>

            {/* ── Settings ── */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card>
                <SectionHeader title="Settings" />
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Status</label>
                  <select value={form.status} onChange={set('status')} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </Card>
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
