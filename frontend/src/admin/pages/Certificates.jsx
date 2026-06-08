import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Plus, Search, X, ExternalLink, Edit2, Trash2,
  Star, StarOff, Award, ImageOff, Calendar,
} from 'lucide-react'
import PageHeader from '../components/PageHeader'
import ConfirmModal from '../components/ConfirmModal'
import Toast from '../components/Toast'
import { getCertificates, deleteCertificate } from '../../services/certificateService'

const statusStyles = {
  active: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  inactive: 'bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-slate-700',
}

export default function Certificates() {
  const navigate = useNavigate()
  const [certificates, setCertificates] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)

  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [featuredFilter, setFeaturedFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState(null)

  const fetchCertificates = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getCertificates({
        page, limit, search,
        featured: featuredFilter, status: statusFilter,
      })
      setCertificates(data.certificates || [])
      setTotalCount(data.totalCount || 0)
      setTotalPages(data.pagination?.totalPages || 1)
    } catch (err) {
      setError('Failed to load certificates')
    } finally {
      setLoading(false)
    }
  }, [page, limit, search, featuredFilter, statusFilter])

  useEffect(() => {
    fetchCertificates()
  }, [fetchCertificates])

  const handleSearch = (e) => {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1)
  }

  const clearFilters = () => {
    setSearchInput('')
    setSearch('')
    setFeaturedFilter('')
    setStatusFilter('')
    setPage(1)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteCertificate(deleteTarget._id)
      setToast({ message: 'Certificate deleted successfully', type: 'success' })
      setDeleteTarget(null)
      fetchCertificates()
    } catch {
      setToast({ message: 'Failed to delete certificate', type: 'error' })
    } finally {
      setDeleting(false)
    }
  }

  const hasFilters = search || featuredFilter || statusFilter

  return (
    <div>
      <PageHeader
        title="Certificates"
        subtitle={`${totalCount} certificate${totalCount !== 1 ? 's' : ''} total`}
        actions={
          <button
            onClick={() => navigate('/admin/certificates/new')}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-xl transition-colors"
          >
            <Plus size={18} />
            Add Certificate
          </button>
        }
      />

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by title, organization, or skill..."
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
            value={featuredFilter}
            onChange={(e) => { setFeaturedFilter(e.target.value); setPage(1) }}
            className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="">All Certificates</option>
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
          <button onClick={fetchCertificates} className="ml-3 underline font-medium">Retry</button>
        </div>
      )}

      {loading ? (
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
      ) : certificates.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <Award size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No certificates found</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
            {hasFilters
              ? 'No certificates match your current filters. Try adjusting your search criteria.'
              : 'Get started by adding your first certificate to the portfolio.'}
          </p>
          {hasFilters ? (
            <button onClick={clearFilters} className="px-6 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors">
              Clear Filters
            </button>
          ) : (
            <button
              onClick={() => navigate('/admin/certificates/new')}
              className="px-6 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
            >
              <Plus size={18} />
              Add Your First Certificate
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
                    <th className="text-left px-4 sm:px-6 py-3">Certificate</th>
                    <th className="text-left px-4 py-3 hidden md:table-cell">Organization</th>
                    <th className="text-left px-4 py-3 hidden lg:table-cell">Issue Date</th>
                    <th className="text-center px-4 py-3 hidden sm:table-cell">Featured</th>
                    <th className="text-center px-4 py-3">Status</th>
                    <th className="text-right px-4 sm:px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                  {certificates.map((cert) => (
                    <tr
                      key={cert._id}
                      className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-slate-800 flex items-center justify-center shrink-0 overflow-hidden">
                            {cert.certificateImage ? (
                              <img
                                src={cert.certificateImage.startsWith('http') ? cert.certificateImage : `http://localhost:5000${cert.certificateImage}`}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ImageOff size={18} className="text-gray-400" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 dark:text-white truncate max-w-[200px]">
                              {cert.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              {cert.credentialId ? `ID: ${cert.credentialId}` : ''}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <span className="text-gray-600 dark:text-gray-400">{cert.issuingOrganization}</span>
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                          <Calendar size={14} />
                          {new Date(cert.issueDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center hidden sm:table-cell">
                        {cert.featured ? (
                          <Star size={16} className="text-amber-500 fill-amber-500 mx-auto" />
                        ) : (
                          <StarOff size={16} className="text-gray-300 dark:text-gray-600 mx-auto" />
                        )}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-flex px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${statusStyles[cert.status] || statusStyles.inactive}`}>
                          {cert.status}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          {cert.verificationUrl && (
                            <a
                              href={cert.verificationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors"
                              title="Verify certificate"
                            >
                              <ExternalLink size={16} />
                            </a>
                          )}
                          <button
                            onClick={() => navigate(`/admin/certificates/${cert._id}`)}
                            className="p-2 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                            title="Edit certificate"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(cert)}
                            className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                            title="Delete certificate"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
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

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete Certificate"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
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
