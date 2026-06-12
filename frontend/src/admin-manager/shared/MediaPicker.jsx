import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, ImageIcon, Upload, Loader2, Check } from 'lucide-react'
import { getMedia, uploadMedia } from '../../shared/services/mediaService'

export default function MediaPicker({ open, onClose, onSelect }) {
  const [media, setMedia] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [uploading, setUploading] = useState(false)

  const fetchMedia = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getMedia({ search, fileType: 'image', limit: 50 })
      setMedia(data.media || [])
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => { if (open) fetchMedia() }, [open, fetchMedia])

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('folder', 'general')
    try {
      const { media: uploaded } = await uploadMedia(fd)
      onSelect(uploaded.url)
      onClose()
    } catch {
      // ignore
    } finally {
      setUploading(false)
    }
  }

  const handleConfirm = () => {
    if (!selectedId) return
    const item = media.find((m) => m._id === selectedId)
    if (item) {
      onSelect(item.url)
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Select Media</h2>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400">
                <X size={18} />
              </button>
            </div>

            {/* Upload & Search */}
            <div className="p-4 border-b border-gray-200 dark:border-slate-800 space-y-3">
              <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-700 cursor-pointer hover:border-primary/50 transition-colors">
                {uploading ? (
                  <Loader2 size={18} className="animate-spin text-primary" />
                ) : (
                  <Upload size={18} className="text-gray-400" />
                )}
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {uploading ? 'Uploading...' : 'Upload new image'}
                </span>
                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
              </label>

              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search media..."
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            {/* Media grid */}
            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="grid grid-cols-4 gap-3">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="animate-pulse aspect-square rounded-xl bg-gray-200 dark:bg-slate-700" />
                  ))}
                </div>
              ) : media.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <ImageIcon size={40} className="text-gray-300 mb-3" />
                  <p className="text-sm text-gray-500">No images found</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                  {media.map((item) => (
                    <button
                      key={item._id}
                      type="button"
                      onClick={() => setSelectedId(item._id === selectedId ? null : item._id)}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                        selectedId === item._id
                          ? 'border-primary ring-2 ring-primary/30'
                          : 'border-transparent hover:border-gray-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <img
                        src={item.url.startsWith('http') ? item.url : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${item.url}`}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      {selectedId === item._id && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                          <Check size={12} className="text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-slate-800">
              <span className="text-sm text-gray-500">
                {selectedId ? '1 file selected' : 'No file selected'}
              </span>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!selectedId}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  Select
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
