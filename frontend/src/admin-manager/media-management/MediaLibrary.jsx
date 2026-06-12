import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createElement } from 'react'
import {
  Upload, Search, X, Grid3X3, List, Trash2, Copy,
  FileImage, FileText, File, ExternalLink, Download,
  Loader2, Check, ImageIcon,
} from 'lucide-react'
import PageHeader from '../shared/PageHeader'
import ConfirmModal from '../shared/ConfirmModal'
import Toast from '../shared/Toast'
import { getMedia, uploadMedia, deleteMedia, updateMedia } from '../../shared/services/mediaService'

const FILE_SIZE_LIMIT = 10 * 1024 * 1024

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

const fileIconMap = {
  image: FileImage,
  document: FileText,
  pdf: FileText,
}

function getFileIcon(mimeType) {
  if (mimeType.startsWith('image/')) return FileImage
  if (mimeType.includes('pdf')) return FileText
  return File
}

export default function MediaLibrary() {
  const [media, setMedia] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [page, setPage] = useState(1)
  const [limit] = useState(24)
  const [totalPages, setTotalPages] = useState(1)

  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [fileTypeFilter, setFileTypeFilter] = useState('')
  const [viewMode, setViewMode] = useState('grid')

  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef(null)
  const dropRef = useRef(null)

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const [previewTarget, setPreviewTarget] = useState(null)
  const [renameTarget, setRenameTarget] = useState(null)
  const [renameValue, setRenameValue] = useState('')

  const [toast, setToast] = useState(null)
  const [copiedId, setCopiedId] = useState(null)

  const fetchMedia = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getMedia({
        page, limit, search,
        fileType: fileTypeFilter,
      })
      setMedia(data.media || [])
      setTotalCount(data.totalCount || 0)
      setTotalPages(data.pagination?.totalPages || 1)
    } catch {
      setError('Failed to load media')
    } finally {
      setLoading(false)
    }
  }, [page, limit, search, fileTypeFilter])

  useEffect(() => { fetchMedia() }, [fetchMedia])

  const handleSearch = (e) => {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1)
  }

  const clearFilters = () => {
    setSearchInput('')
    setSearch('')
    setFileTypeFilter('')
    setPage(1)
  }

  const handleUpload = async (files) => {
    const validFiles = Array.from(files).filter((f) => {
      if (f.size > FILE_SIZE_LIMIT) {
        setToast({ message: `${f.name} exceeds 10MB limit`, type: 'error' })
        return false
      }
      return true
    })
    if (validFiles.length === 0) return
    setUploading(true)
    setUploadProgress(0)
    let completed = 0
    for (const file of validFiles) {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', 'general')
      try {
        await uploadMedia(fd)
      } catch {
        setToast({ message: `Failed to upload ${file.name}`, type: 'error' })
      }
      completed++
      setUploadProgress(Math.round((completed / validFiles.length) * 100))
    }
    setUploading(false)
    setUploadProgress(0)
    setToast({ message: `${validFiles.length} file(s) uploaded`, type: 'success' })
    fetchMedia()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    if (e.dataTransfer.files.length > 0) handleUpload(e.dataTransfer.files)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteMedia(deleteTarget._id)
      setToast({ message: 'File deleted', type: 'success' })
      setDeleteTarget(null)
      fetchMedia()
    } catch {
      setToast({ message: 'Failed to delete file', type: 'error' })
    } finally {
      setDeleting(false)
    }
  }

  const copyUrl = async (mediaItem) => {
    const url = mediaItem.url.startsWith('http')
      ? mediaItem.url
      : `${window.location.origin}${mediaItem.url}`
    try {
      await navigator.clipboard.writeText(url)
      setCopiedId(mediaItem._id)
      setToast({ message: 'URL copied to clipboard', type: 'success' })
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      setToast({ message: 'Failed to copy URL', type: 'error' })
    }
  }

  const handleRename = async () => {
    if (!renameTarget || !renameValue.trim()) return
    try {
      await updateMedia(renameTarget._id, { originalName: renameValue.trim() })
      setToast({ message: 'File renamed', type: 'success' })
      setRenameTarget(null)
      setRenameValue('')
      fetchMedia()
    } catch {
      setToast({ message: 'Failed to rename file', type: 'error' })
    }
  }

  const hasFilters = search || fileTypeFilter

  return (
    <div>
      <PageHeader
        title="Media Library"
        subtitle={`${totalCount} file${totalCount !== 1 ? 's' : ''} total`}
        actions={
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-xl transition-colors"
          >
            <Upload size={18} />
            Upload Files
          </button>
        }
      />

      {/* Upload area */}
      <div
        ref={dropRef}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className={`bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-gray-300 dark:border-slate-700 p-8 mb-6 text-center transition-colors ${
          uploading ? 'border-primary' : 'hover:border-primary/50'
        }`}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={32} className="text-primary animate-spin" />
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Uploading files...</p>
            <div className="w-full max-w-xs bg-gray-200 dark:bg-slate-700 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <span className="text-xs text-gray-400">{uploadProgress}%</span>
          </div>
        ) : (
          <div
            className="flex flex-col items-center gap-2 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
              <Upload size={28} className="text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                <span className="text-primary">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-400 mt-1">Images & Documents up to 10MB</p>
            </div>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx"
          onChange={(e) => { if (e.target.files.length > 0) handleUpload(e.target.files); e.target.value = '' }}
          className="hidden"
        />
      </div>

      {/* Search & filters */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search files..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all"
            />
            {searchInput && (
              <button type="button" onClick={() => { setSearchInput(''); setSearch(''); setPage(1) }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            )}
          </form>

          <select
            value={fileTypeFilter}
            onChange={(e) => { setFileTypeFilter(e.target.value); setPage(1) }}
            className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="">All Files</option>
            <option value="image">Images</option>
            <option value="document">Documents</option>
          </select>

          <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100 dark:bg-slate-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Grid3X3 size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>

        {hasFilters && (
          <div className="flex items-center gap-2 mt-3 text-sm text-gray-500 dark:text-gray-400">
            <span>Filters active:</span>
            <button onClick={clearFilters} className="text-primary hover:underline font-medium">Clear all filters</button>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
          {error}
          <button onClick={fetchMedia} className="ml-3 underline font-medium">Retry</button>
        </div>
      )}

      {loading ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square rounded-xl bg-gray-200 dark:bg-slate-700 mb-2" />
                  <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />
                  <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded w-1/2 mt-1" />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 space-y-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 animate-pulse">
                  <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-slate-700" />
                  <div className="flex-1 h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-20" />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : media.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <ImageIcon size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No files found</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
            {hasFilters ? 'No files match your filters.' : 'Upload your first file to get started.'}
          </p>
          {hasFilters ? (
            <button onClick={clearFilters} className="px-6 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors">Clear Filters</button>
          ) : (
            <button onClick={() => fileInputRef.current?.click()} className="px-6 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors inline-flex items-center gap-2">
              <Upload size={18} /> Upload File
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {media.map((item) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all"
              >
                <div
                  className="aspect-square relative bg-gray-50 dark:bg-slate-800 cursor-pointer overflow-hidden"
                  onClick={() => setPreviewTarget(item)}
                >
                  {item.fileType === 'image' ? (
                    <img
                      src={item.url.startsWith('http') ? item.url : `http://localhost:5000${item.url}`}
                      alt={item.originalName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      {createElement(getFileIcon(item.mimeType), { size: 40, className: 'text-gray-300' })}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={(e) => { e.stopPropagation(); copyUrl(item) }}
                      className="p-2 rounded-lg bg-white/90 text-gray-700 hover:bg-white transition-colors"
                      title="Copy URL"
                    >
                      {copiedId === item._id ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setRenameTarget(item); setRenameValue(item.originalName) }}
                      className="p-2 rounded-lg bg-white/90 text-gray-700 hover:bg-white transition-colors"
                      title="Rename"
                    >
                      <FileText size={16} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeleteTarget(item) }}
                      className="p-2 rounded-lg bg-red-500/90 text-white hover:bg-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{item.originalName}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{formatSize(item.fileSize)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-800/50 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  <th className="text-left px-4 sm:px-6 py-3">File</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">Type</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">Size</th>
                  <th className="text-left px-4 py-3 hidden lg:table-cell">Date</th>
                  <th className="text-right px-4 sm:px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {media.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 sm:px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-slate-800 flex items-center justify-center shrink-0 overflow-hidden">
                          {item.fileType === 'image' ? (
                            <img
                              src={item.url.startsWith('http') ? item.url : `http://localhost:5000${item.url}`}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            createElement(getFileIcon(item.mimeType), { size: 18, className: 'text-gray-400' })
                          )}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white truncate max-w-[200px]">{item.originalName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-gray-500 dark:text-gray-400 capitalize">{item.fileType}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-gray-500 dark:text-gray-400">{formatSize(item.fileSize)}</td>
                    <td className="px-4 py-3 hidden lg:table-cell text-gray-500 dark:text-gray-400">{formatDate(item.createdAt)}</td>
                    <td className="px-4 sm:px-6 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setPreviewTarget(item)} className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors" title="Preview"><ExternalLink size={15} /></button>
                        <button onClick={() => copyUrl(item)} className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors" title="Copy URL">
                          {copiedId === item._id ? <Check size={15} className="text-green-500" /> : <Copy size={15} />}
                        </button>
                        <button onClick={() => { setRenameTarget(item); setRenameValue(item.originalName) }} className="p-2 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors" title="Rename"><FileText size={15} /></button>
                        <button onClick={() => setDeleteTarget(item)} className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors" title="Delete"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
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
                  {idx > 0 && arr[idx - 1] !== p - 1 && <span className="px-1 text-gray-400">...</span>}
                  <button
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${p === page ? 'bg-primary text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'}`}
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
      )}

      {/* Preview modal */}
      <AnimatePresence>
        {previewTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={() => setPreviewTarget(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {previewTarget.fileType === 'image' ? (
                <div className="relative">
                  <img
                    src={previewTarget.url.startsWith('http') ? previewTarget.url : `http://localhost:5000${previewTarget.url}`}
                    alt={previewTarget.originalName}
                    className="w-full max-h-[60vh] object-contain bg-gray-100 dark:bg-slate-800"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 px-8 bg-gray-50 dark:bg-slate-800">
                  {createElement(getFileIcon(previewTarget.mimeType), { size: 64, className: 'text-gray-300 mb-4' })}
                  <p className="text-sm text-gray-500">Document Preview</p>
                  <p className="text-xs text-gray-400 mt-1">{previewTarget.originalName}</p>
                </div>
              )}
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 dark:text-white truncate max-w-[80%]">{previewTarget.originalName}</h3>
                  <button onClick={() => setPreviewTarget(null)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400">
                    <X size={18} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-400">Type</span>
                    <p className="font-medium text-gray-700 dark:text-gray-300 capitalize">{previewTarget.fileType}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Size</span>
                    <p className="font-medium text-gray-700 dark:text-gray-300">{formatSize(previewTarget.fileSize)}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Uploaded</span>
                    <p className="font-medium text-gray-700 dark:text-gray-300">{formatDate(previewTarget.createdAt)}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">MIME</span>
                    <p className="font-medium text-gray-700 dark:text-gray-300 truncate">{previewTarget.mimeType}</p>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => { copyUrl(previewTarget); setPreviewTarget(null) }} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                    <Copy size={16} /> Copy URL
                  </button>
                  <button onClick={() => { setDeleteTarget(previewTarget); setPreviewTarget(null) }} className="px-4 py-2.5 rounded-xl text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center justify-center gap-2">
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rename modal */}
      <AnimatePresence>
        {renameTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={() => { setRenameTarget(null); setRenameValue('') }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Rename File</h3>
              <input
                type="text"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleRename() }}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm mb-4"
                autoFocus
              />
              <div className="flex justify-end gap-3">
                <button onClick={() => { setRenameTarget(null); setRenameValue('') }} className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">Cancel</button>
                <button onClick={handleRename} className="px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors">Save</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete File"
        message={`Are you sure you want to delete "${deleteTarget?.originalName}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
