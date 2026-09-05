import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, X, Edit2, Trash2, Star, StarOff,
  BadgeCheck, RefreshCw, GripVertical, Eye, EyeOff,
} from 'lucide-react'
import PageHeader from '../shared/PageHeader'
import ConfirmModal from '../shared/ConfirmModal'
import Toast from '../shared/Toast'
import {
  getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial,
} from '../../shared/services/testimonialService'

const relationshipOptions = ['Supervisor', 'Team Lead', 'Client', 'Colleague', 'Mentor', 'Other']
const statusOptions = [
  { value: 'DRAFT', label: 'Draft', color: 'bg-gray-100 text-gray-700' },
  { value: 'PUBLISHED', label: 'Published', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'ARCHIVED', label: 'Archived', color: 'bg-red-100 text-red-700' },
]

const emptyForm = {
  name: '', role: '', organization: '', organizationUrl: '', linkedinUrl: '',
  relationship: 'Colleague', avatar: '', content: '', highlights: [],
  project: '', projectUrl: '', verified: false, featured: false,
  status: 'DRAFT', displayOrder: 0, rating: 5,
}

export default function TestimonialsList() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState(null)
  const [highlightInput, setHighlightInput] = useState('')

  const fetchTestimonials = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = {}
      if (statusFilter) params.status = statusFilter
      const data = await getTestimonials(params)
      let list = data.testimonials || []
      if (search) {
        const q = search.toLowerCase()
        list = list.filter(t =>
          t.name.toLowerCase().includes(q) ||
          t.role.toLowerCase().includes(q) ||
          t.organization?.toLowerCase().includes(q)
        )
      }
      setTestimonials(list)
    } catch {
      setError('Failed to load testimonials')
    } finally {
      setLoading(false)
    }
  }, [statusFilter, search])

  useEffect(() => { fetchTestimonials() }, [fetchTestimonials])

  const openCreate = () => { setForm(emptyForm); setEditId(null); setShowForm(true) }
  const openEdit = (t) => {
    setForm({
      name: t.name || '', role: t.role || '', organization: t.organization || '',
      organizationUrl: t.organizationUrl || '', linkedinUrl: t.linkedinUrl || '',
      relationship: t.relationship || 'Colleague', avatar: t.avatar || '',
      content: t.content || '', highlights: t.highlights || [],
      project: t.project || '', projectUrl: t.projectUrl || '',
      verified: t.verified || false, featured: t.featured || false,
      status: t.status || 'DRAFT', displayOrder: t.displayOrder || 0,
      rating: t.rating || 5,
    })
    setEditId(t._id)
    setShowForm(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editId) {
        await updateTestimonial(editId, form)
        setToast({ type: 'success', message: 'Testimonial updated' })
      } else {
        await createTestimonial(form)
        setToast({ type: 'success', message: 'Testimonial created' })
      }
      setShowForm(false)
      fetchTestimonials()
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Failed to save' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteTestimonial(deleteTarget._id)
      setToast({ type: 'success', message: 'Deleted' })
      setDeleteTarget(null)
      fetchTestimonials()
    } catch {
      setToast({ type: 'error', message: 'Failed to delete' })
    } finally {
      setDeleting(false)
    }
  }

  const toggleField = async (id, field, value) => {
    try {
      await updateTestimonial(id, { [field]: value })
      fetchTestimonials()
    } catch {
      setToast({ type: 'error', message: 'Failed to update' })
    }
  }

  const addHighlight = () => {
    if (highlightInput.trim()) {
      setForm(prev => ({ ...prev, highlights: [...prev.highlights, highlightInput.trim()] }))
      setHighlightInput('')
    }
  }

  const removeHighlight = (idx) => {
    setForm(prev => ({ ...prev, highlights: prev.highlights.filter((_, i) => i !== idx) }))
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Testimonials"
        subtitle="Manage professional recommendations"
        action={{ label: 'Add Testimonial', icon: Plus, onClick: openCreate }}
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search testimonials..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
        >
          <option value="">All Status</option>
          {statusOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      {/* List */}
      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 rounded-2xl bg-gray-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={fetchTestimonials} className="text-indigo-600 hover:underline text-sm">
            <RefreshCw size={14} className="inline mr-1" /> Retry
          </button>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-16">
          <BadgeCheck size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">No testimonials yet</p>
          <button onClick={openCreate} className="text-indigo-600 hover:underline text-sm">
            Add your first testimonial
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {testimonials.map((t) => (
            <motion.div
              key={t._id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                {t.avatar ? (
                  <img src={t.avatar} alt="" className="w-12 h-12 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                    <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                      {t.name?.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{t.name}</h3>
                    <span className="text-xs text-gray-500">{t.role}</span>
                    {t.organization && (
                      <span className="text-xs text-gray-400">at {t.organization}</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                    {t.content}
                  </p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusOptions.find(s => s.value === t.status)?.color || ''}`}>
                      {t.status}
                    </span>
                    {t.featured && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                        Featured
                      </span>
                    )}
                    {t.verified && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                        Verified
                      </span>
                    )}
                    <span className="text-xs text-gray-400">{t.relationship}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => toggleField(t._id, 'featured', !t.featured)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400 hover:text-amber-500 transition-colors"
                    title={t.featured ? 'Unfeature' : 'Feature'}
                  >
                    {t.featured ? <Star size={16} className="fill-amber-500" /> : <StarOff size={16} />}
                  </button>
                  <button
                    onClick={() => toggleField(t._id, 'status', t.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED')}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400 hover:text-emerald-500 transition-colors"
                    title={t.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                  >
                    {t.status === 'PUBLISHED' ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <button
                    onClick={() => openEdit(t)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400 hover:text-indigo-500 transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(t)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-2xl"
            >
              <form onSubmit={handleSave}>
                <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-slate-700">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    {editId ? 'Edit Testimonial' : 'New Testimonial'}
                  </h2>
                  <button type="button" onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700">
                    <X size={18} />
                  </button>
                </div>
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
                      <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role *</label>
                      <input required value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Organization</label>
                      <input value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Relationship</label>
                      <select value={form.relationship} onChange={(e) => setForm({ ...form, relationship: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30">
                        {relationshipOptions.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Avatar URL</label>
                      <input value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">LinkedIn URL</label>
                      <input value={form.linkedinUrl} onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Testimonial Content *</label>
                    <textarea required rows={4} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project</label>
                      <input value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                      <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30">
                        {statusOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Highlights</label>
                    <div className="flex gap-2">
                      <input value={highlightInput} onChange={(e) => setHighlightInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
                        placeholder="Add highlight and press Enter"
                        className="flex-1 px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30" />
                      <button type="button" onClick={addHighlight}
                        className="px-3 py-2 text-sm rounded-xl bg-indigo-600 text-white hover:bg-indigo-700">
                        Add
                      </button>
                    </div>
                    {form.highlights.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {form.highlights.map((h, i) => (
                          <span key={i} className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                            {h}
                            <button type="button" onClick={() => removeHighlight(i)} className="hover:text-red-500">
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <input type="checkbox" checked={form.verified} onChange={(e) => setForm({ ...form, verified: e.target.checked })}
                        className="rounded border-gray-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500" />
                      Verified
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                        className="rounded border-gray-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500" />
                      Featured
                    </label>
                  </div>
                </div>
                <div className="flex justify-end gap-3 p-5 border-t border-gray-200 dark:border-slate-700">
                  <button type="button" onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving}
                    className="px-4 py-2 text-sm rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50">
                    {saving ? 'Saving...' : editId ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Testimonial"
        message={`Delete testimonial from "${deleteTarget?.name}"? This cannot be undone.`}
        confirmText="Delete"
        loading={deleting}
        danger
      />

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  )
}
