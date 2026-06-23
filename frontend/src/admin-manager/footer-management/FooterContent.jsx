import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Save, RefreshCw, Plus, Trash2, GripVertical, Globe, Mail, Phone, Hash, ExternalLink } from 'lucide-react'
import PageHeader from '../shared/PageHeader'
import Toast from '../shared/Toast'
import { getFooterContent, updateFooterContent } from '../../shared/services/footerService'
import { updateSiteSettings } from '../../shared/services/siteSettingsService'
import { updateNavbarSettings } from '../../shared/services/navigationService'
import { updateHomeContent } from '../../shared/services/homeContentService'
import { useAuth } from '../authentication/AuthContext'
import { useSiteSettings } from '../../shared/context/SiteSettingsContext'

const emptySocialLink = { platform: '', url: '', displayOrder: 0, active: true }
const emptyNavItem = { label: '', url: '', order: 0 }

const PHONE_PROTOCOLS = [
  { value: 'tel', label: 'Standard Call (tel:)' },
  { value: 'whatsapp', label: 'WhatsApp (wa.me)' },
  { value: 'telegram', label: 'Telegram (t.me)' },
  { value: 'custom', label: 'Custom URL' },
]

function Card({ children, className = '' }) {
  return (
    <div className={`bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 space-y-4 transition-all duration-200 focus-within:ring-1 focus-within:ring-zinc-300 dark:focus-within:ring-zinc-600 ${className}`}>
      {children}
    </div>
  )
}

function SectionHeader({ title, subtitle }) {
  return (
    <div>
      <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-100">{title}</h3>
      {subtitle && <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">{subtitle}</p>}
    </div>
  )
}

function EmptyState({ message }) {
  return <p className="text-sm text-zinc-400 italic">{message}</p>
}

export default function FooterContent() {
  const { refreshSettings } = useSiteSettings()
  const { setUserData, user: authUser } = useAuth()
  const [form, setForm] = useState({
    brandName: '',
    brandDescription: '',
    socialLinks: [],
    navigation: [],
    locationHeadline: '',
    subLocation: '',
    locationMapUrl: '',
    emailAddress: '',
    emailProtocol: 'mailto',
    phoneNumber: '',
    phoneProtocol: 'tel',
    phoneCustomUrl: '',
    copyrightText: '',
    visualSeparator: '',
    attributionText: '',
    status: 'active',
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
            brandName: content.brandName || '',
            brandDescription: content.brandDescription || '',
            socialLinks: content.socialLinks || [],
            navigation: content.navigation || [],
            locationHeadline: content.locationHeadline || '',
            subLocation: content.subLocation || '',
            locationMapUrl: content.locationMapUrl || '',
            emailAddress: content.emailAddress || '',
            emailProtocol: content.emailProtocol || 'mailto',
            phoneNumber: content.phoneNumber || '',
            phoneProtocol: content.phoneProtocol || 'tel',
            phoneCustomUrl: content.phoneCustomUrl || '',
            copyrightText: content.copyrightText || '',
            visualSeparator: content.visualSeparator || '',
            attributionText: content.attributionText || '',
            status: content.status || 'active',
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
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const addItem = (key, empty) => {
    setForm((prev) => ({
      ...prev,
      [key]: [...prev[key], { ...empty, displayOrder: prev[key].length }],
    }))
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
      items.forEach((item, i) => {
        if (key === 'navigation') item.order = i
        else item.displayOrder = i
      })
      return { ...prev, [key]: items }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData()
    Object.entries(form).forEach(([key, val]) => {
      if (key === 'navigation' || key === 'socialLinks') {
        fd.append(key, JSON.stringify(val))
      } else {
        fd.append(key, val)
      }
    })
    try {
      await updateFooterContent(fd)
      try {
        await updateSiteSettings({
          brandName: form.brandName,
          brandDescription: form.brandDescription,
          copyrightText: form.copyrightText,
          email: form.emailAddress,
          phone: form.phoneNumber,
        })
      } catch {}
      try {
        await updateNavbarSettings({
          brandName: form.brandName,
        })
      } catch {}
      try {
        await updateHomeContent({
          hero: {
            fullName: form.brandName,
          },
        })
      } catch {}
      if (authUser) {
        setUserData({ ...authUser, displayName: form.brandName })
      }
      refreshSettings()
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

  const colScroll = 'max-h-[calc(100vh-12rem)] overflow-y-auto overflow-x-hidden space-y-6 pr-1'

  return (
    <div>
      <PageHeader title="Footer Management" subtitle="Manage your footer section — branding, navigation, contact, and copyright." />
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className={colScroll}>
            <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <SectionHeader title="Brand & Identity" subtitle="Brand name, description, logo, and social profile links." />

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">Brand Name</label>
                  <input type="text" value={form.brandName} onChange={set('brandName')} placeholder="DESALEGN" className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400/50 dark:focus:ring-zinc-500/50 transition-all text-sm" />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">Description</label>
                  <textarea value={form.brandDescription} onChange={set('brandDescription')} rows={3} placeholder="Building robust digital experiences..." className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400/50 dark:focus:ring-zinc-500/50 transition-all text-sm resize-none" />
                </div>

                <div className="border-t border-zinc-200 dark:border-zinc-700 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Social Profile Links</span>
                    <button type="button" onClick={() => addItem('socialLinks', emptySocialLink)} className="flex items-center gap-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">
                      <Plus size={16} /> Add
                    </button>
                  </div>
                  {form.socialLinks.length === 0 && <EmptyState message="No social links added yet." />}
                  <div className="space-y-2">
                    <AnimatePresence mode="popLayout">
                      {form.socialLinks.map((link, idx) => (
                        <motion.div
                          key={idx}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
                          className="flex items-center gap-2 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700/50"
                        >
                          <GripVertical size={14} className="text-zinc-400 shrink-0 cursor-grab" />
                          <input type="text" value={link.platform} onChange={updateItem('socialLinks', idx, 'platform')} placeholder="GitHub" className="w-24 px-2.5 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/60 text-sm text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400/50 transition-all" />
                          <input type="url" value={link.url} onChange={updateItem('socialLinks', idx, 'url')} placeholder="https://github.com/..." className="flex-1 px-2.5 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/60 text-sm text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400/50 transition-all" />
                          <label className="flex items-center gap-1 text-[10px] text-zinc-500 shrink-0">
                            <input type="checkbox" checked={link.active !== false} onChange={updateItem('socialLinks', idx, 'active')} className="rounded border-zinc-300 dark:border-zinc-600" />
                            On
                          </label>
                          <div className="flex items-center gap-0.5 shrink-0">
                            <button type="button" onClick={() => moveItem('socialLinks', idx, -1)} disabled={idx === 0} className="p-1 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 disabled:opacity-30 text-xs">▲</button>
                            <button type="button" onClick={() => moveItem('socialLinks', idx, 1)} disabled={idx === form.socialLinks.length - 1} className="p-1 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 disabled:opacity-30 text-xs">▼</button>
                          </div>
                          <button type="button" onClick={() => removeItem('socialLinks', idx)} className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-500/5 transition-colors shrink-0"><Trash2 size={13} /></button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          <div className={colScroll}>
            <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <Card>
                <div className="flex items-center justify-between">
                  <SectionHeader title="Navigation Links" subtitle="Reorderable anchor links for your page sections." />
                  <button type="button" onClick={() => addItem('navigation', emptyNavItem)} className="flex items-center gap-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">
                    <Plus size={16} /> Add Link
                  </button>
                </div>
                {form.navigation.length === 0 && <EmptyState message="No navigation links yet." />}
                <div className="space-y-2">
                  <AnimatePresence mode="popLayout">
                    {form.navigation.map((link, idx) => (
                      <motion.div
                        key={idx}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
                        className="flex items-center gap-2 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700/50"
                      >
                        <GripVertical size={14} className="text-zinc-400 shrink-0 cursor-grab" />
                        <input type="text" value={link.label} onChange={updateItem('navigation', idx, 'label')} placeholder="Home" className="w-24 px-2.5 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/60 text-sm text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400/50 transition-all" />
                        <input type="text" value={link.url} onChange={updateItem('navigation', idx, 'url')} placeholder="#home" className="flex-1 px-2.5 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/60 text-sm text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400/50 transition-all" />
                        <div className="flex items-center gap-0.5 shrink-0">
                          <button type="button" onClick={() => moveItem('navigation', idx, -1)} disabled={idx === 0} className="p-1 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 disabled:opacity-30 text-xs">▲</button>
                          <button type="button" onClick={() => moveItem('navigation', idx, 1)} disabled={idx === form.navigation.length - 1} className="p-1 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 disabled:opacity-30 text-xs">▼</button>
                        </div>
                        <button type="button" onClick={() => removeItem('navigation', idx)} className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-500/5 transition-colors shrink-0"><Trash2 size={13} /></button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </Card>
            </motion.div>
          </div>

          <div className={colScroll}>
            <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card>
                <SectionHeader title="Contact & Location" subtitle="Location details, map link, email, and phone with protocol selection." />

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1 flex items-center gap-1.5">
                    <Globe size={12} /> Location Headline
                  </label>
                  <input type="text" value={form.locationHeadline} onChange={set('locationHeadline')} placeholder="Bahirdar, Ethiopia" className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400/50 dark:focus:ring-zinc-500/50 transition-all text-sm" />
                  <p className="text-[11px] text-zinc-400 mt-1">Main location line shown on the public footer.</p>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1 flex items-center gap-1.5">
                    <Globe size={12} /> Sub Location
                  </label>
                  <input type="text" value={form.subLocation} onChange={set('subLocation')} placeholder="Amhara Region" className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400/50 dark:focus:ring-zinc-500/50 transition-all text-sm" />
                  <p className="text-[11px] text-zinc-400 mt-1">Secondary context — use "Open to Remote" for availability.</p>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1 flex items-center gap-1.5">
                    <ExternalLink size={12} /> Location Map URL
                  </label>
                  <div className="flex gap-2">
                    <input type="url" value={form.locationMapUrl} onChange={set('locationMapUrl')} placeholder="https://maps.google.com/?q=..." className="flex-1 px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400/50 dark:focus:ring-zinc-500/50 transition-all text-sm" />
                    {form.locationMapUrl && (
                      <a href={form.locationMapUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shrink-0">
                        <ExternalLink size={13} /> Open Maps
                      </a>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1">Full Google Maps URL (e.g. https://maps.google.com/?q=...).</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1 flex items-center gap-1.5">
                      <Mail size={12} /> Email Address
                    </label>
                    <input type="email" value={form.emailAddress} onChange={set('emailAddress')} placeholder="email@example.com" className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400/50 dark:focus:ring-zinc-500/50 transition-all text-sm" />
                    <p className="text-[11px] text-zinc-400 mt-1">Auto-linked as mailto: on the public site.</p>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1 flex items-center gap-1.5">
                      <Phone size={12} /> Phone Number
                    </label>
                    <input type="text" value={form.phoneNumber} onChange={set('phoneNumber')} placeholder="+251 908 720 092" className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400/50 dark:focus:ring-zinc-500/50 transition-all text-sm" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">Phone Click Protocol</label>
                  <select value={form.phoneProtocol} onChange={set('phoneProtocol')} className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400/50 dark:focus:ring-zinc-500/50 transition-all text-sm">
                    {PHONE_PROTOCOLS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  {form.phoneProtocol === 'custom' && (
                    <div className="mt-3">
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">Custom Phone URL</label>
                      <input type="url" value={form.phoneCustomUrl} onChange={set('phoneCustomUrl')} placeholder="https://..." className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400/50 dark:focus:ring-zinc-500/50 transition-all text-sm" />
                    </div>
                  )}
                  <p className="text-[11px] text-zinc-400 mt-1">
                    {form.phoneProtocol === 'tel' && 'Generates a standard tel: link.'}
                    {form.phoneProtocol === 'whatsapp' && 'Generates a wa.me link — use full phone number with country code.'}
                    {form.phoneProtocol === 'telegram' && 'Generates a t.me link — enter the username (with or without @).'}
                    {form.phoneProtocol === 'custom' && 'Provide a fully custom URL for the phone link.'}
                  </p>
                </div>
              </Card>
            </motion.div>

            <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <Card>
                <SectionHeader title="Copyright" />
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1 flex items-center gap-1.5">
                    <Hash size={12} /> Copyright Text
                  </label>
                  <input type="text" value={form.copyrightText} onChange={set('copyrightText')} placeholder="© 2026 DESALEGN. ALL RIGHTS RESERVED." className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400/50 dark:focus:ring-zinc-500/50 transition-all text-sm" />
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
          <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-lg text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center gap-2">
            {loading ? <><RefreshCw size={18} className="animate-spin" /> Saving...</> : <><Save size={18} /> Save Changes</>}
          </button>
        </motion.div>
      </form>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
