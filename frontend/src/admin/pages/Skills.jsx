import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Plus, Search, X, Edit2, Trash2,
  Star, StarOff, Code2,
} from 'lucide-react'
import PageHeader from '../components/PageHeader'
import ConfirmModal from '../components/ConfirmModal'
import Toast from '../components/Toast'
import { getSkills, deleteSkill } from '../../services/skillService'

const FIXED_CATEGORIES = [
  { title: 'Frontend Development', color: '#6366f1' },
  { title: 'Backend Development', color: '#10b981' },
  { title: 'Mobile Development', color: '#3b82f6' },
  { title: 'Networking', color: '#8b5cf6' },
  { title: 'Tools', color: '#ef4444' },
  { title: 'Certificates', color: '#14b8a6' },
]

const statusStyles = {
  active: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  inactive: 'bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-slate-700',
}

export default function Skills() {
  const navigate = useNavigate()
  const [skills, setSkills] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [page, setPage] = useState(1)
  const [limit] = useState(15)
  const [totalPages, setTotalPages] = useState(1)

  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [featuredFilter, setFeaturedFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const skillsData = await getSkills({
        page, limit, search, category: categoryFilter,
        featured: featuredFilter, status: statusFilter,
      })
      setSkills(skillsData.skills || [])
      setTotalCount(skillsData.totalCount || 0)
      setTotalPages(skillsData.pagination?.totalPages || 1)
    } catch (err) {
      setError('Failed to load skills')
    } finally {
      setLoading(false)
    }
  }, [page, limit, search, categoryFilter, featuredFilter, statusFilter])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleSearch = (e) => {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1)
  }

  const clearFilters = () => {
    setSearchInput('')
    setSearch('')
    setCategoryFilter('')
    setFeaturedFilter('')
    setStatusFilter('')
    setPage(1)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteSkill(deleteTarget._id)
      setToast({ message: 'Skill deleted successfully', type: 'success' })
      setDeleteTarget(null)
      fetchData()
    } catch {
      setToast({ message: 'Failed to delete skill', type: 'error' })
    } finally {
      setDeleting(false)
    }
  }

  const hasFilters = search || categoryFilter || featuredFilter || statusFilter

  const proficiencyColor = (val) => {
    if (val >= 80) return 'text-emerald-600'
    if (val >= 60) return 'text-blue-600'
    if (val >= 40) return 'text-amber-600'
    return 'text-red-600'
  }

  const getCategoryColor = (name) => {
    const cat = FIXED_CATEGORIES.find((c) => c.title.toLowerCase() === name?.toLowerCase())
    return cat?.color || '#6366f1'
  }

  return (
    <div>
      <PageHeader
        title="Skills CMS"
        subtitle={`${totalCount} skill${totalCount !== 1 ? 's' : ''} · ${FIXED_CATEGORIES.length} categories`}
        actions={
          <button
            onClick={() => navigate('/admin/skills/new')}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-xl transition-colors"
          >
            <Plus size={18} />
            Add Skill
          </button>
        }
      />

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name or category..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => { setSearchInput(''); setSearch(''); setPage(1) }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </form>

          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1) }}
            className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="">All Categories</option>
            {FIXED_CATEGORIES.map((cat) => (
              <option key={cat.title} value={cat.title}>{cat.title}</option>
            ))}
          </select>

          <select
            value={featuredFilter}
            onChange={(e) => { setFeaturedFilter(e.target.value); setPage(1) }}
            className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="">All Skills</option>
            <option value="true">Featured Only</option>
            <option value="false">Non-Featured</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
            className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {hasFilters && (
          <div className="flex items-center gap-2 mt-3 text-sm text-gray-500 dark:text-gray-400">
            <span>Filters active:</span>
            <button onClick={clearFilters} className="text-primary hover:underline font-medium">
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
          {error}
          <button onClick={fetchData} className="ml-3 underline font-medium">Retry</button>
        </div>
      )}

      {loading ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden">
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-slate-700" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/4" />
                  <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/5" />
                </div>
                <div className="h-3 w-16 bg-gray-200 dark:bg-slate-700 rounded" />
                <div className="h-8 w-20 bg-gray-200 dark:bg-slate-700 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      ) : skills.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <Code2 size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No skills found</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
            {hasFilters
              ? 'No skills match your current filters. Try adjusting your search criteria.'
              : 'Get started by adding your first skill.'}
          </p>
          {hasFilters ? (
            <button onClick={clearFilters} className="px-6 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors">
              Clear Filters
            </button>
          ) : (
            <button
              onClick={() => navigate('/admin/skills/new')}
              className="px-6 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
            >
              <Plus size={18} />
              Add Your First Skill
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-slate-800/50 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    <th className="text-left px-4 sm:px-6 py-3">Skill</th>
                    <th className="text-left px-4 py-3 hidden md:table-cell">Category</th>
                    <th className="text-left px-4 py-3 hidden sm:table-cell">Proficiency</th>
                    <th className="text-center px-4 py-3 hidden sm:table-cell">Featured</th>
                    <th className="text-center px-4 py-3">Status</th>
                    <th className="text-right px-4 sm:px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                  {skills.map((skill) => {
                    const catColor = getCategoryColor(skill.category)
                    return (
                      <tr
                        key={skill._id}
                        className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="px-4 sm:px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary shrink-0">
                              <Code2 size={18} />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-gray-900 dark:text-white truncate max-w-[180px]">
                                {skill.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate max-w-[180px]">
                                {skill.description || skill.category}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 hidden md:table-cell">
                          <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border"
                            style={{ borderColor: catColor, color: catColor, backgroundColor: `${catColor}14` }}
                          >
                            {skill.category}
                          </span>
                        </td>
                        <td className="px-4 py-4 hidden sm:table-cell">
                          <div className="flex items-center gap-2.5">
                            <div className="flex-1 max-w-[100px] h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${skill.proficiency}%` }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                                className="h-full rounded-full"
                                style={{ backgroundColor: catColor }}
                              />
                            </div>
                            <span className={`text-xs font-bold ${proficiencyColor(skill.proficiency)}`}>
                              {skill.proficiency}%
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center hidden sm:table-cell">
                          {skill.featured ? (
                            <Star size={16} className="text-amber-500 fill-amber-500 mx-auto" />
                          ) : (
                            <StarOff size={16} className="text-gray-300 dark:text-gray-600 mx-auto" />
                          )}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className={`inline-flex px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${statusStyles[skill.status] || statusStyles.inactive}`}>
                            {skill.status}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => navigate(`/admin/skills/${skill._id}`)}
                              className="p-2 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                              title="Edit skill"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(skill)}
                              className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                              title="Delete skill"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 text-sm">
            <p className="text-gray-500 dark:text-gray-400">
              Showing {Math.min((page - 1) * limit + 1, totalCount)}-{Math.min(page * limit, totalCount)} of {totalCount}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium transition-colors"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .map((p, idx, arr) => (
                  <span key={p}>
                    {idx > 0 && arr[idx - 1] !== p - 1 && (
                      <span className="px-1 text-gray-400">...</span>
                    )}
                    <button
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                        p === page
                          ? 'bg-primary text-white'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {p}
                    </button>
                  </span>
                ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation - Skill */}
      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete Skill"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
