import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, X, Edit2, Trash2, Briefcase, RefreshCw,
  Eye, EyeOff, ChevronDown, ChevronUp,
} from 'lucide-react'
import PageHeader from '../shared/PageHeader'
import ConfirmModal from '../shared/ConfirmModal'
import Toast from '../shared/Toast'
import {
  getExperiences, createExperience, updateExperience, deleteExperience,
} from '../../shared/services/experienceService'

const statusOptions = [
  { value: 'DRAFT', label: 'Draft', color: 'bg-gray-100 text-gray-700' },
  { value: 'PUBLISHED', label: 'Published', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'ARCHIVED', label: 'Archived', color: 'bg-red-100 text-red-700' },
]

const emptyForm = {
  badge: '', role: '', company: '', companyUrl: '', logo: '',
  period: '', dateYear: '', dateSub: '', location: '', summary: '',
  primaryTags: [], extraTags: [], contributions: [],
  featured: false, status: 'DRAFT', displayOrder: 0,
}

export default function ExperienceList() {
  const [experiences, setExperiences] = useState([])
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
  const [expandedId, setExpandedId] = useState(null)
  const [tagInput, setTagInput] = useState({ type: 'primary', value: '' })
  const [contributionInput, setContributionInput] = useState('')

  const fetchExperiences = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = {}
      if (statusFilter) params.status = statusFilter
      const data = await getExperiences(params)
      let list = data.experiences || []
      if (search) {
        const q = search.toLowerCase()
        list = list.filter(e =>
          e.role.toLowerCase().includes(q) ||
          e.company.toLowerCase().includes(q) ||
          e.summary?.toLowerCase().includes(q)
        )
      }
      setExperiences(list)
    } catch {
      setError('Failed to load experiences')
    } finally {
      setLoading(false)
    }
  }, [statusFilter, search])

  useEffect(() => { fetchExperiences() }, [fetchExperiences])

  const openCreate = () => { setForm(emptyForm); setEditId(null); setShowForm(true) }
  const openEdit = (exp) => {
    setForm({
      badge: exp.badge || '', role: exp.role || '', company: exp.company || '',
      companyUrl: exp.companyUrl || '', logo: exp.logo || '',
      period: exp.period || '', dateYear: exp.dateYear || '',
      dateSub: exp.dateSub || '', location: exp.location || '',
      summary: exp.summary || '', primaryTags: exp.primaryTags || [],
      extraTags: exp.extraTags || [], contributions: exp.contributions || [],
      featured: exp.featured || false, status: exp.status || 'DRAFT',
      displayOrder: exp.displayOrder || 0,
    })
    setEditId(exp._id)
    setShowForm(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editId) {
        await updateExperience(editId, form)
        setToast({ type: 'success', message: 'Experience updated' })
      } else {
        await createExperience(form)
        setToast({ type: 'success', message: 'Experience created' })
      }
      setShowForm(false)
      fetchExperiences()
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
      await deleteExperience(deleteTarget._id)
      setToast({ type: 'success', message: 'Deleted' })
      setDeleteTarget(null)
      fetchExperiences()
    } catch {
      setToast({ type: 'error', message: 'Failed to delete' })
    } finally {
      setDeleting(false)
    }
  }

  const toggleField = async (id, field, value) => {
    try {
      await updateExperience(id, { [field]: value })
      fetchExperiences()
    } catch {
      setToast({ type: 'error', message: 'Failed to update' })
    }
  }

  const addTag = (type) => {
    if (tagInput.value.trim()) {
      setForm(prev => ({
        ...prev,
        [type === 'primary' ? 'primaryTags' : 'extraTags']: [
          ...prev[type === 'primary' ? 'primaryTags' : 'extraTags'],
          tagInput.value.trim(),
        ],
      }))
      setTagInput({ type: 'primary', value: '' })
    }
  }

  const removeTag = (type, idx) => {
    setForm(prev => ({
      ...prev,
      [type === 'primary' ? 'primaryTags' : 'extraTags']:
        prev[type === 'primary' ? 'primaryTags' : 'extraTags'].filter((_, i) => i !== idx),
    }))
  }

  const addContribution = () => {
    if (contributionInput.trim()) {
      setForm(prev => ({ ...prev, contributions: [...prev.contributions, contributionInput.trim()] }))
      setContributionInput('')
    }
  }

  const removeContribution = (idx) => {
    setForm(prev => ({ ...prev, contributions: prev.contributions.filter((_, i) => i !== idx) }))
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Experience"
        subtitle="Manage your professional experience timeline"
        action={{ label: 'Add Experience', icon: Plus, onClick: openCreate }}
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search experiences..."
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
          <button onClick={fetchExperiences} className="text-indigo-600 hover:underline text-sm">
            <RefreshCw size={14} className="inline mr-1" /> Retry
          </button>
        </div>
      ) : experiences.length === 0 ? (
        <div className="text-center py-16">
          <Briefcase size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">No experiences yet</p>
          <button onClick={openCreate} className="text-indigo-600 hover:underline text-sm">
            Add your first experience
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {experiences.map((exp) => (
            <motion.div
              key={exp._id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                  <Briefcase size={20} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                      {exp.badge}
                    </span>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{exp.role}</h3>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">{exp.company}</span>
                    {exp.period && <span>· {exp.period}</span>}
                    {exp.location && <span>· {exp.location}</span>}
                  </div>
                  {exp.summary && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{exp.summary}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusOptions.find(s => s.value === exp.status)?.color || ''}`}>
                      {exp.status}
                    </span>
                    {exp.featured && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Featured</span>
                    )}
                    {exp.primaryTags?.length > 0 && (
                      <span className="text-xs text-gray-400">{exp.primaryTags.length} technologies</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setExpandedId(expandedId === exp._id ? null : exp._id)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {expandedId === exp._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  <button
                    onClick={() => toggleField(exp._id, 'status', exp.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED')}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400 hover:text-emerald-500 transition-colors"
                    title={exp.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                  >
                    {exp.status === 'PUBLISHED' ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <button
                    onClick={() => openEdit(exp)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400 hover:text-indigo-500 transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(exp)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              <AnimatePresence>
                {expandedId === exp._id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mt-4 pt-4 border-t border-gray-200 dark:border-slate-700"
                  >
                    <div className="space-y-3">
                      {exp.primaryTags?.length > 0 && (
                        <div>
                          <span className="text-xs font-medium text-gray-500">Primary Tags:</span>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {exp.primaryTags.map((t, i) => (
                              <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">{t}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {exp.extraTags?.length > 0 && (
                        <div>
                          <span className="text-xs font-medium text-gray-500">Extra Tags:</span>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {exp.extraTags.map((t, i) => (
                              <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">{t}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {exp.contributions?.length > 0 && (
                        <div>
                          <span className="text-xs font-medium text-gray-500">Contributions:</span>
                          <ul className="mt-1 space-y-1">
                            {exp.contributions.map((c, i) => (
                              <li key={i} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1.5">
                                <span className="text-indigo-500 mt-0.5">•</span> {c}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
                    {editId ? 'Edit Experience' : 'New Experience'}
                  </h2>
                  <button type="button" onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700">
                    <X size={18} />
                  </button>
                </div>
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Badge *</label>
                      <input required value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })}
                        placeholder="e.g. INTERNSHIP"
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
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company *</label>
                      <input required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company URL</label>
                      <input value={form.companyUrl} onChange={(e) => setForm({ ...form, companyUrl: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Period *</label>
                      <input required value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })}
                        placeholder="Jan 2026 – Present"
                        className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year *</label>
                      <input required value={form.dateYear} onChange={(e) => setForm({ ...form, dateYear: e.target.value })}
                        placeholder="Jan 2026"
                        className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date Sub</label>
                      <input value={form.dateSub} onChange={(e) => setForm({ ...form, dateSub: e.target.value })}
                        placeholder="– Present"
                        className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                      <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Summary</label>
                    <textarea rows={3} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30" />
                  </div>

                  {/* Primary Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Primary Tags</label>
                    <div className="flex gap-2">
                      <input value={tagInput.type === 'primary' ? tagInput.value : ''} onChange={(e) => setTagInput({ type: 'primary', value: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag('primary'))}
                        placeholder="Add tag"
                        className="flex-1 px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30" />
                      <button type="button" onClick={() => addTag('primary')}
                        className="px-3 py-2 text-sm rounded-xl bg-indigo-600 text-white hover:bg-indigo-700">Add</button>
                    </div>
                    {form.primaryTags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {form.primaryTags.map((t, i) => (
                          <span key={i} className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                            {t}
                            <button type="button" onClick={() => removeTag('primary', i)} className="hover:text-red-500"><X size={12} /></button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Extra Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Extra Tags</label>
                    <div className="flex gap-2">
                      <input value={tagInput.type === 'extra' ? tagInput.value : ''} onChange={(e) => setTagInput({ type: 'extra', value: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag('extra'))}
                        placeholder="Add tag"
                        className="flex-1 px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30" />
                      <button type="button" onClick={() => addTag('extra')}
                        className="px-3 py-2 text-sm rounded-xl bg-purple-600 text-white hover:bg-purple-700">Add</button>
                    </div>
                    {form.extraTags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {form.extraTags.map((t, i) => (
                          <span key={i} className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                            {t}
                            <button type="button" onClick={() => removeTag('extra', i)} className="hover:text-red-500"><X size={12} /></button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Contributions */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contributions</label>
                    <div className="flex gap-2">
                      <input value={contributionInput} onChange={(e) => setContributionInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addContribution())}
                        placeholder="Add contribution and press Enter"
                        className="flex-1 px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30" />
                      <button type="button" onClick={addContribution}
                        className="px-3 py-2 text-sm rounded-xl bg-emerald-600 text-white hover:bg-emerald-700">Add</button>
                    </div>
                    {form.contributions.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {form.contributions.map((c, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                            <span className="text-indigo-500">•</span>
                            <span className="flex-1">{c}</span>
                            <button type="button" onClick={() => removeContribution(i)} className="hover:text-red-500"><X size={12} /></button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                      className="rounded border-gray-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500" />
                    Featured
                  </label>
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
        title="Delete Experience"
        message={`Delete "${deleteTarget?.role}" at "${deleteTarget?.company}"? This cannot be undone.`}
        confirmText="Delete"
        loading={deleting}
        danger
      />

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  )
}
