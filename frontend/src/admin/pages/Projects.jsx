import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, X, ExternalLink, Eye, Edit2, Trash2,
  Star, StarOff, FolderKanban, ImageOff, Copy, Archive,
  Globe, CheckCircle, Clock, AlertCircle,
  LayoutGrid, List, RefreshCw, MoreHorizontal,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import PageHeader from '../components/PageHeader'
import ConfirmModal from '../components/ConfirmModal'
import Toast from '../components/Toast'
import ProjectPreview from '../components/ProjectPreview'
import {
  getProjects, deleteProject, duplicateProject,
  toggleFeatured, togglePublish, toggleArchive,
} from '../../services/projectService'

const statusConfig = {
  completed: {
    label: 'Completed',
    classes: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    icon: CheckCircle,
  },
  in_progress: {
    label: 'In Progress',
    classes: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    icon: Clock,
  },
  planned: {
    label: 'Planned',
    classes: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    icon: AlertCircle,
  },
}

export default function Projects() {
  const navigate = useNavigate()
  const { userRole } = useAuth()
  const canModify = userRole === 'super_admin' || userRole === 'admin'
  const [projects, setProjects] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [categories, setCategories] = useState([])
  const [allTechnologies, setAllTechnologies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [page, setPage] = useState(1)
  const [limit] = useState(12)
  const [totalPages, setTotalPages] = useState(1)

  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [technologyFilter, setTechnologyFilter] = useState('')
  const [featuredFilter, setFeaturedFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showArchived, setShowArchived] = useState(false)
  const [viewMode, setViewMode] = useState('table')

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [duplicating, setDuplicating] = useState(null)
  const [previewTarget, setPreviewTarget] = useState(null)
  const [actionLoading, setActionLoading] = useState(null)
  const [toast, setToast] = useState(null)

  const fetchProjects = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getProjects({
        page, limit, search, category: categoryFilter,
        technology: technologyFilter,
        featured: featuredFilter, status: statusFilter,
        archived: showArchived ? 'true' : '',
      })
      setProjects(data.projects || [])
      setTotalCount(data.totalCount || 0)
      setCategories(data.categories || [])
      setAllTechnologies(data.technologies || [])
      setTotalPages(data.pagination?.totalPages || 1)
    } catch (err) {
      setError('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }, [page, limit, search, categoryFilter, technologyFilter, featuredFilter, statusFilter, showArchived])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const handleSearch = (e) => {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1)
  }

  const clearFilters = () => {
    setSearchInput('')
    setSearch('')
    setCategoryFilter('')
    setTechnologyFilter('')
    setFeaturedFilter('')
    setStatusFilter('')
    setShowArchived(false)
    setPage(1)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteProject(deleteTarget._id)
      setToast({ message: `"${deleteTarget.title}" deleted successfully`, type: 'success' })
      setDeleteTarget(null)
      fetchProjects()
    } catch {
      setToast({ message: 'Failed to delete project', type: 'error' })
    } finally {
      setDeleting(false)
    }
  }

  const handleDuplicate = async (project) => {
    setDuplicating(project._id)
    try {
      await duplicateProject(project._id)
      setToast({ message: `"${project.title}" duplicated successfully`, type: 'success' })
      fetchProjects()
    } catch {
      setToast({ message: 'Failed to duplicate project', type: 'error' })
    } finally {
      setDuplicating(null)
    }
  }

  const handleToggleFeatured = async (project) => {
    setActionLoading(`featured-${project._id}`)
    try {
      await toggleFeatured(project._id)
      setToast({ message: project.featured ? 'Removed from featured' : 'Marked as featured', type: 'success' })
      fetchProjects()
    } catch {
      setToast({ message: 'Failed to update', type: 'error' })
    } finally {
      setActionLoading(null)
    }
  }

  const handleTogglePublish = async (project) => {
    setActionLoading(`publish-${project._id}`)
    try {
      await togglePublish(project._id)
      setToast({ message: project.published ? 'Project unpublished' : 'Project published', type: 'success' })
      fetchProjects()
    } catch {
      setToast({ message: 'Failed to update', type: 'error' })
    } finally {
      setActionLoading(null)
    }
  }

  const handleToggleArchive = async (project) => {
    setActionLoading(`archive-${project._id}`)
    try {
      await toggleArchive(project._id)
      setToast({ message: project.archived ? 'Project restored' : 'Project archived', type: 'success' })
      fetchProjects()
    } catch {
      setToast({ message: 'Failed to update', type: 'error' })
    } finally {
      setActionLoading(null)
    }
  }

  const hasFilters = search || categoryFilter || technologyFilter || featuredFilter || statusFilter || showArchived

  const StatusBadge = ({ status }) => {
    const config = statusConfig[status] || statusConfig.completed
    const Icon = config.icon
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${config.classes}`}>
        <Icon size={12} />
        {config.label}
      </span>
    )
  }

  const ProjectCard = ({ project }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all group"
    >
      <div className="relative aspect-video bg-gray-100 dark:bg-slate-800 overflow-hidden">
        {project.thumbnail || (project.images && project.images[0]) ? (
          <img
            src={(project.thumbnail || project.images[0]).startsWith('http') ? (project.thumbnail || project.images[0]) : `http://localhost:5000${project.thumbnail || project.images[0]}`}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <ImageOff size={32} className="text-gray-300 dark:text-gray-600" />
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-1">
          {!project.published && (
            <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded-full bg-gray-900/70 text-white">
              Draft
            </span>
          )}
          {project.archived && (
            <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded-full bg-red-600/70 text-white">
              Archived
            </span>
          )}
        </div>
        {project.featured && (
          <div className="absolute top-2 left-2">
            <Star size={14} className="text-amber-400 fill-amber-400" />
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-gray-900 dark:text-white text-sm truncate">{project.title}</h3>
          <StatusBadge status={project.status} />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
          {project.shortDescription}
        </p>
        <div className="flex flex-wrap gap-1 mb-3">
          {(project.technologies || []).slice(0, 3).map((tech) => (
            <span key={tech} className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400">
              {tech}
            </span>
          ))}
          {(project.technologies || []).length > 3 && (
            <span className="text-[9px] text-gray-400">+{project.technologies.length - 3}</span>
          )}
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-800">
          <span className="text-[10px] text-gray-400">{new Date(project.createdAt).toLocaleDateString()}</span>
          <div className="flex gap-1">
            <button
              onClick={(e) => { e.stopPropagation(); setPreviewTarget(project) }}
              className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors"
              title="Preview"
            >
              <Eye size={14} />
            </button>
            {canModify && (
              <>
                <button
                  onClick={() => navigate(`/admin/projects/${project._id}`)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                  title="Edit"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => handleDuplicate(project)}
                  disabled={duplicating === project._id}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10 transition-colors disabled:opacity-40"
                  title="Duplicate"
                >
                  <Copy size={14} />
                </button>
                <button
                  onClick={() => setDeleteTarget(project)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )

  return (
    <div>
      <PageHeader
        title="Projects"
        subtitle={`${totalCount} project${totalCount !== 1 ? 's' : ''} total`}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={fetchProjects}
              className="flex items-center gap-2 px-3 py-2.5 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 text-sm font-medium rounded-xl transition-colors"
              title="Refresh"
            >
              <RefreshCw size={16} />
            </button>
            <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100 dark:bg-slate-800">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                title="Table view"
              >
                <List size={18} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                title="Grid view"
              >
                <LayoutGrid size={18} />
              </button>
            </div>
            <button
              onClick={() => navigate('/admin/projects/new')}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-xl transition-colors"
            >
              <Plus size={18} />
              Add Project
            </button>
          </div>
        }
      />

      {/* Search & Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by title, technology, or category..."
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
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={technologyFilter}
            onChange={(e) => { setTechnologyFilter(e.target.value); setPage(1) }}
            className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="">All Technologies</option>
            {allTechnologies.map((tech) => (
              <option key={tech} value={tech}>{tech}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
            className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="in_progress">In Progress</option>
            <option value="planned">Planned</option>
          </select>

          <select
            value={featuredFilter}
            onChange={(e) => { setFeaturedFilter(e.target.value); setPage(1) }}
            className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="">All Projects</option>
            <option value="true">Featured Only</option>
            <option value="false">Non-Featured</option>
          </select>

          <label className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-gray-600 dark:text-gray-400 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
            <input
              type="checkbox"
              checked={showArchived}
              onChange={(e) => { setShowArchived(e.target.checked); setPage(1) }}
              className="rounded border-gray-300 dark:border-slate-600 text-primary focus:ring-primary"
            />
            <Archive size={14} />
            Archived
          </label>
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

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
          {error}
          <button onClick={fetchProjects} className="ml-3 underline font-medium">Retry</button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden animate-pulse">
                <div className="aspect-video bg-gray-200 dark:bg-slate-700" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-full" />
                  <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden">
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 animate-pulse">
                  <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-slate-700" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/3" />
                    <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/4" />
                  </div>
                  <div className="h-8 w-20 bg-gray-200 dark:bg-slate-700 rounded-lg" />
                  <div className="h-8 w-20 bg-gray-200 dark:bg-slate-700 rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        )
      ) : projects.length === 0 ? (
        /* Empty State */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <FolderKanban size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No projects found</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
            {hasFilters
              ? 'No projects match your current filters. Try adjusting your search criteria.'
              : 'Get started by adding your first project to the portfolio.'}
          </p>
          {hasFilters ? (
            <button onClick={clearFilters} className="px-6 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors">
              Clear Filters
            </button>
          ) : (
            <button
              onClick={() => navigate('/admin/projects/new')}
              className="px-6 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
            >
              <Plus size={18} />
              Add Your First Project
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        /* Table View */
        <>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-slate-800/50 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    <th className="text-left px-4 sm:px-6 py-3">Project</th>
                    <th className="text-left px-4 py-3 hidden md:table-cell">Category</th>
                    <th className="text-left px-4 py-3 hidden lg:table-cell">Technologies</th>
                    <th className="text-center px-4 py-3 hidden sm:table-cell">Status</th>
                    <th className="text-center px-4 py-3 hidden sm:table-cell">Featured</th>
                    <th className="text-center px-4 py-3 hidden sm:table-cell">Published</th>
                    <th className="text-right px-4 sm:px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                  {projects.map((project) => {
                    const isFeaturedLoading = actionLoading === `featured-${project._id}`
                    const isPublishLoading = actionLoading === `publish-${project._id}`
                    const isArchiveLoading = actionLoading === `archive-${project._id}`
                    return (
                      <tr
                        key={project._id}
                        className={`hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors ${project.archived ? 'opacity-60' : ''}`}
                      >
                        <td className="px-4 sm:px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-slate-800 flex items-center justify-center shrink-0 overflow-hidden">
                              {project.thumbnail || (project.images && project.images[0]) ? (
                                <img
                                  src={(project.thumbnail || project.images[0]).startsWith('http') ? (project.thumbnail || project.images[0]) : `http://localhost:5000${project.thumbnail || project.images[0]}`}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <ImageOff size={18} className="text-gray-400" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-gray-900 dark:text-white truncate max-w-[200px]">
                                {project.title}
                                {!project.published && (
                                  <span className="ml-2 text-[10px] text-gray-400 font-normal">(Draft)</span>
                                )}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                {new Date(project.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 hidden md:table-cell">
                          <span className="text-gray-600 dark:text-gray-400">{project.category}</span>
                        </td>
                        <td className="px-4 py-4 hidden lg:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {(project.technologies || []).slice(0, 3).map((tech) => (
                              <span
                                key={tech}
                                className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400"
                              >
                                {tech}
                              </span>
                            ))}
                            {(project.technologies || []).length > 3 && (
                              <span className="text-[10px] text-gray-400">+{project.technologies.length - 3}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center hidden sm:table-cell">
                          <StatusBadge status={project.status} />
                        </td>
                        <td className="px-4 py-4 text-center hidden sm:table-cell">
                          <button
                            onClick={() => handleToggleFeatured(project)}
                            disabled={isFeaturedLoading}
                            className="transition-colors disabled:opacity-40"
                            title={project.featured ? 'Remove from featured' : 'Mark as featured'}
                          >
                            {project.featured ? (
                              <Star size={16} className="text-amber-500 fill-amber-500" />
                            ) : (
                              <StarOff size={16} className="text-gray-300 dark:text-gray-600 hover:text-amber-400" />
                            )}
                          </button>
                        </td>
                        <td className="px-4 py-4 text-center hidden sm:table-cell">
                          <button
                            onClick={() => handleTogglePublish(project)}
                            disabled={isPublishLoading}
                            className={`p-1.5 rounded-lg transition-colors disabled:opacity-40 ${
                              project.published
                                ? 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10'
                                : 'text-gray-300 dark:text-gray-600 hover:text-emerald-400'
                            }`}
                            title={project.published ? 'Unpublish' : 'Publish'}
                          >
                            <Globe size={16} />
                          </button>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setPreviewTarget(project)}
                              className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors"
                              title="Preview"
                            >
                              <Eye size={16} />
                            </button>
                            {project.liveDemoUrl && (
                              <a
                                href={project.liveDemoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors"
                                title="View live demo"
                              >
                                <ExternalLink size={16} />
                              </a>
                            )}
                            {canModify && (
                              <>
                                <button
                                  onClick={() => navigate(`/admin/projects/${project._id}`)}
                                  className="p-2 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                                  title="Edit project"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  onClick={() => handleDuplicate(project)}
                                  disabled={duplicating === project._id}
                                  className="p-2 rounded-lg text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10 transition-colors disabled:opacity-40"
                                  title="Duplicate"
                                >
                                  <Copy size={16} />
                                </button>
                                <button
                                  onClick={() => handleToggleArchive(project)}
                                  disabled={isArchiveLoading}
                                  className="p-2 rounded-lg text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors disabled:opacity-40"
                                  title={project.archived ? 'Restore' : 'Archive'}
                                >
                                  <Archive size={16} />
                                </button>
                                <button
                                  onClick={() => setDeleteTarget(project)}
                                  className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                  title="Delete project"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
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

      {/* Delete Modal */}
      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />

      {/* Preview Modal */}
      <ProjectPreview
        project={previewTarget}
        onClose={() => setPreviewTarget(null)}
      />

      {/* Toast */}
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
