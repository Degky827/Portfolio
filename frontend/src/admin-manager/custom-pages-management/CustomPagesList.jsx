import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiEye, FiEyeOff, FiGlobe } from 'react-icons/fi'
import PageHeader from '../shared/PageHeader'
import ConfirmModal from '../shared/ConfirmModal'
import Toast from '../shared/Toast'
import { getCustomPages, deleteCustomPage, toggleCustomPageStatus } from '../../shared/services/customPageService'

export default function CustomPagesList() {
  const navigate = useNavigate()
  const [pages, setPages] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [pageToDelete, setPageToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const limit = 20

  const fetchPages = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await getCustomPages({
        page: currentPage,
        limit,
        search: searchQuery,
        status: statusFilter,
      })
      setPages(data.pages)
      setTotalCount(data.totalCount)
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to load pages', type: 'error' })
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, searchQuery, statusFilter])

  useEffect(() => { fetchPages() }, [fetchPages])

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  const handleDelete = async () => {
    if (!pageToDelete) return
    setIsDeleting(true)
    try {
      await deleteCustomPage(pageToDelete._id)
      setToast({ message: 'Page deleted successfully', type: 'success' })
      setShowDeleteModal(false)
      setPageToDelete(null)
      fetchPages()
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to delete page', type: 'error' })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleToggleStatus = async (page) => {
    try {
      await toggleCustomPageStatus(page._id)
      setToast({
        message: page.status === 'published' ? 'Page unpublished' : 'Page published',
        type: 'success',
      })
      fetchPages()
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to update status', type: 'error' })
    }
  }

  const openDeleteModal = (page) => {
    setPageToDelete(page)
    setShowDeleteModal(true)
  }

  const totalPages = Math.ceil(totalCount / limit)

  return (
    <div className="p-6">
      <PageHeader
        title="Custom Pages"
        subtitle="Create and manage custom portfolio pages"
        action={
          <button
            onClick={() => navigate('/admin/custom-pages/new')}
            className="bg-[var(--accent-primary)] hover:brightness-90 text-[var(--text-primary)] px-4 py-2 rounded-lg flex items-center gap-2 transition-all font-medium"
          >
            <FiPlus size={18} />
            <span>New Page</span>
          </button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={16} />
          <input
            type="text"
            placeholder="Search pages..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1) }}
          className="px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
        >
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-[var(--text-secondary)]">Loading...</div>
      ) : pages.length === 0 ? (
        <div className="text-center py-20 text-[var(--text-secondary)]">
          <FiGlobe size={48} className="mx-auto mb-4 opacity-30" />
          <p>No custom pages yet</p>
          <button
            onClick={() => navigate('/admin/custom-pages/new')}
            className="mt-4 text-[var(--accent-primary)] hover:underline"
          >
            Create your first page
          </button>
        </div>
      ) : (
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-[var(--border-primary)]">
                <tr>
                  <th className="px-6 py-3 text-sm font-medium text-[var(--text-secondary)]">Title</th>
                  <th className="px-6 py-3 text-sm font-medium text-[var(--text-secondary)]">Slug</th>
                  <th className="px-6 py-3 text-sm font-medium text-[var(--text-secondary)]">Status</th>
                  <th className="px-6 py-3 text-sm font-medium text-[var(--text-secondary)]">Sections</th>
                  <th className="px-6 py-3 text-sm font-medium text-[var(--text-secondary)]">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {pages.map((page) => (
                    <motion.tr
                      key={page._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b border-[var(--border-primary)] last:border-b-0 hover:bg-[var(--bg-tertiary)] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-[var(--text-primary)]">{page.title}</div>
                        {page.description && (
                          <div className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-1">{page.description}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-[var(--text-secondary)]">/{page.slug}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            page.status === 'published'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                          }`}
                        >
                          {page.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                        {page.sections?.length || 0}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleStatus(page)}
                            className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                            title={page.status === 'published' ? 'Unpublish' : 'Publish'}
                          >
                            {page.status === 'published' ? <FiEye size={16} /> : <FiEyeOff size={16} />}
                          </button>
                          <button
                            onClick={() => navigate(`/admin/custom-pages/${page._id}`)}
                            className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                            title="Edit"
                          >
                            <FiEdit2 size={16} />
                          </button>
                          <button
                            onClick={() => openDeleteModal(page)}
                            className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-[var(--text-secondary)] hover:text-red-500 transition-colors"
                            title="Delete"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-3 border-t border-[var(--border-primary)]">
              <span className="text-sm text-[var(--text-secondary)]">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm bg-[var(--bg-tertiary)] rounded hover:bg-[var(--bg-secondary)] disabled:opacity-40 text-[var(--text-primary)]"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="px-3 py-1 text-sm bg-[var(--bg-tertiary)] rounded hover:bg-[var(--bg-secondary)] disabled:opacity-40 text-[var(--text-primary)]"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => { setShowDeleteModal(false); setPageToDelete(null) }}
        onConfirm={handleDelete}
        title="Delete Custom Page"
        message={`Are you sure you want to delete "${pageToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        loading={isDeleting}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}
