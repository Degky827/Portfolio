import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Save, RefreshCw, Plus, Trash2, GripVertical } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Toast from '../components/Toast'
import { getContactContent, updateContactContent } from '../../services/contactService'
import { listLogs } from '../../services/activityLogService'

const emptyChannel = { channelName: '', linkUrl: '', iconVector: '', displayWeight: 0 }

const actionBadge = {
  CREATE: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400',
  UPDATE: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400',
  DELETE: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400',
}

function Card({ children, className = '' }) {
  return (
    <div className={`bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 space-y-5 ${className}`}>
      {children}
    </div>
  )
}

function EmptyState({ message }) {
  return <p className="text-sm text-gray-400 italic">{message}</p>
}

export default function ContactContent() {
  const [form, setForm] = useState({
    email: '',
    phone: '',
    address: '',
    mapLink: '',
    contactFormEnabled: true,
    socialChannels: [],
  })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [toast, setToast] = useState(null)
  const [auditLogs, setAuditLogs] = useState([])

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
            contactFormEnabled: content.contactFormEnabled !== false,
            socialChannels: content.socialChannels || [],
          })
        }
      } catch {
        setToast({ message: 'Failed to load contact content', type: 'error' })
      } finally {
        setFetching(false)
      }
    })()
    ;(async () => {
      try {
        const data = await listLogs({ resource: 'Contact', limit: 3 })
        setAuditLogs(data.logs || [])
      } catch { /* silent */ }
    })()
  }, [])

  const set = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const addChannel = useCallback(() => {
    setForm((prev) => ({
      ...prev,
      socialChannels: [...prev.socialChannels, { ...emptyChannel, displayWeight: prev.socialChannels.length }],
    }))
  }, [])

  const removeChannel = useCallback((idx) => {
    setForm((prev) => ({
      ...prev,
      socialChannels: prev.socialChannels.filter((_, i) => i !== idx),
    }))
  }, [])

  const updateChannel = useCallback((idx, field) => (e) => {
    const value = e.target.value
    setForm((prev) => {
      const channels = [...prev.socialChannels]
      channels[idx] = { ...channels[idx], [field]: field === 'displayWeight' ? Number(value) : value }
      return { ...prev, socialChannels: channels }
    })
  }, [])

  const moveChannel = useCallback((idx, direction) => {
    setForm((prev) => {
      const channels = [...prev.socialChannels]
      const target = idx + direction
      if (target < 0 || target >= channels.length) return prev
      ;[channels[idx], channels[target]] = [channels[target], channels[idx]]
      channels.forEach((c, i) => { c.displayWeight = i })
      return { ...prev, socialChannels: channels }
    })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const body = {
      ...form,
      socialChannels: JSON.stringify(form.socialChannels),
    }
    try {
      await updateContactContent(body)
      setToast({ message: 'Contact settings updated successfully', type: 'success' })
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to update contact settings', type: 'error' })
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
      <PageHeader title="Contact Settings & Channels" subtitle="Manage contact information, social channel links, and review recent activity." />
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ═══════ COLUMN 1: Contact Info + Settings ═══════ */}
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Contact Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Email</label>
                    <input type="email" value={form.email} onChange={set('email')} placeholder="email@example.com" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Phone</label>
                    <input type="text" value={form.phone} onChange={set('phone')} placeholder="+251 900 000 000" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Address</label>
                  <input type="text" value={form.address} onChange={set('address')} placeholder="City, Country" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Map Link</label>
                  <input type="url" value={form.mapLink} onChange={set('mapLink')} placeholder="https://maps.google.com/?q=..." className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Settings</h2>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input type="checkbox" checked={form.contactFormEnabled} onChange={set('contactFormEnabled')} className="sr-only peer" />
                    <div className="w-10 h-6 bg-gray-300 dark:bg-slate-700 rounded-full peer-checked:bg-primary transition-colors" />
                    <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-4 transition-transform" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Contact Form Enabled</span>
                </label>
                <p className="text-xs text-gray-400 -mt-2">When disabled, the public form fields are hidden and contact details expand full-width.</p>
              </Card>
            </motion.div>
          </div>

          {/* ═══════ COLUMN 2: Social Channels (Polymorphic Array) ═══════ */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Social Channels</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Drag to reorder. Supports custom inline SVG icons.</p>
                  </div>
                  <button type="button" onClick={addChannel} className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                    <Plus size={16} /> Add Channel
                  </button>
                </div>
                {form.socialChannels.length === 0 && <EmptyState message="No social channels added yet." />}
                <div className="space-y-2">
                  {form.socialChannels.map((ch, idx) => (
                    <div key={idx} className="p-3 rounded-xl border border-gray-200 dark:border-slate-700 space-y-2">
                      <div className="flex items-center gap-2">
                        <GripVertical size={14} className="text-gray-400 shrink-0 cursor-grab" />
                        <input type="text" value={ch.channelName} onChange={updateChannel(idx, 'channelName')} placeholder="GitHub" className="flex-1 px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                        <div className="flex items-center gap-0.5 shrink-0">
                          <button type="button" onClick={() => moveChannel(idx, -1)} disabled={idx === 0} className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 text-xs">▲</button>
                          <button type="button" onClick={() => moveChannel(idx, 1)} disabled={idx === form.socialChannels.length - 1} className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 text-xs">▼</button>
                        </div>
                        <button type="button" onClick={() => removeChannel(idx)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors shrink-0"><Trash2 size={13} /></button>
                      </div>
                      <input type="url" value={ch.linkUrl} onChange={updateChannel(idx, 'linkUrl')} placeholder="https://github.com/username" className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="block text-[10px] font-medium text-gray-400 mb-0.5">Inline SVG Icon (optional)</label>
                          <input type="text" value={ch.iconVector} onChange={updateChannel(idx, 'iconVector')} placeholder='<svg>...</svg>' className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono" />
                        </div>
                        <div className="w-16">
                          <label className="block text-[10px] font-medium text-gray-400 mb-0.5">Weight</label>
                          <input type="number" value={ch.displayWeight} onChange={updateChannel(idx, 'displayWeight')} className="w-full px-2 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* ═══════ COLUMN 3: Recent Audit Activity ═══════ */}
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <Card>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Contact Activity</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 -mt-3">Last 3 audit log entries where resource contains "Contact".</p>
                {auditLogs.length === 0 ? (
                  <EmptyState message="No Contact-module activity recorded yet." />
                ) : (
                  <div className="space-y-2">
                    {auditLogs.map((log) => (
                      <div key={log._id} className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 dark:border-slate-800">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${actionBadge[log.action] || 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400'}`}>
                              {log.action}
                            </span>
                            <span className="text-[10px] text-gray-400">{new Date(log.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                            {log.resource}{log.details?.field ? ` — ${log.details.field}` : ''}
                          </p>
                          {log.user?.name && (
                            <p className="text-[11px] text-gray-400 mt-0.5">by {log.user.name}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
