import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Upload, X, ImageIcon, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import MediaPicker from './MediaPicker'
import { uploadMedia } from '../../shared/services/mediaService'

function formatSize(bytes) {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function ImageUpload({
  value,
  onChange,
  error,
  label = 'Image',
  folder = 'general',
}) {
  const [preview, setPreview] = useState(value || '')
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadError, setUploadError] = useState(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [fileInfo, setFileInfo] = useState(null)
  const inputRef = useRef(null)

  useEffect(() => {
    setPreview(value || '')
  }, [value])

  const uploadToCloudinary = async (file) => {
    setUploading(true)
    setProgress(0)
    setUploadError(null)
    setUploadSuccess(false)
    setFileInfo({ name: file.name, size: file.size, type: file.type })

    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target.result)
    reader.readAsDataURL(file)

    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', folder)

      const result = await uploadMedia(fd, (progressEvent) => {
        if (progressEvent.total) {
          const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          setProgress(pct)
        }
      })

      const url = result.media.url
      setPreview(url)
      setProgress(100)
      setUploadSuccess(true)
      setFileInfo(null)
      onChange(url)
      setTimeout(() => setUploadSuccess(false), 2000)
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Upload failed. Please try again.')
      setPreview(value || '')
    } finally {
      setUploading(false)
    }
  }

  const handleFile = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size must be under 5MB')
      return
    }
    uploadToCloudinary(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }

  const handleChange = (e) => {
    handleFile(e.target.files[0])
  }

  const handleRemove = () => {
    setPreview('')
    setUploadError(null)
    setFileInfo(null)
    onChange('')
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleMediaSelect = (url) => {
    setPreview(url)
    setUploadError(null)
    onChange(url)
  }

  return (
    <div>
      {label && (
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
          {label}
        </label>
      )}

      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => { if (!uploading && !preview) inputRef.current?.click() }}
        className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
          dragOver
            ? 'border-primary bg-primary/5 scale-[1.02]'
            : preview
              ? 'border-transparent bg-transparent'
              : 'border-gray-300 dark:border-slate-700 hover:border-primary/50 dark:hover:border-primary/50'
        } ${error || uploadError ? 'border-red-400' : ''}`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && !uploading && !preview) inputRef.current?.click() }}
        aria-label={uploading ? 'Uploading...' : preview ? 'Image preview' : 'Upload image'}
      >
        {uploading ? (
          <div className="py-4 space-y-3">
            <div className="flex items-center justify-center gap-2">
              <Loader2 size={20} className="animate-spin text-primary" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Uploading... {progress}%
              </span>
            </div>
            <div className="w-full max-w-xs mx-auto bg-gray-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut', duration: 0.3 }}
                className="h-full bg-indigo-600 rounded-full"
              />
            </div>
            {fileInfo && (
              <p className="text-xs text-gray-400">{fileInfo.name} ({formatSize(fileInfo.size)})</p>
            )}
          </div>
        ) : uploadSuccess ? (
          <div className="py-4 flex items-center justify-center gap-2">
            <CheckCircle size={20} className="text-emerald-500" />
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Uploaded successfully</span>
          </div>
        ) : preview ? (
          <div className="relative inline-block group">
            <img
              src={preview}
              alt="Preview"
              className="max-h-48 rounded-lg object-cover shadow-sm group-hover:shadow-md transition-shadow"
            />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleRemove() }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow transition-transform hover:scale-110"
              aria-label="Remove image"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-6">
            <div className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Upload size={28} className="text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                <span className="text-primary font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG, SVG, WebP &middot; Max 5MB</p>
            </div>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml"
          onChange={handleChange}
          className="hidden"
          disabled={uploading}
        />
      </div>

      {uploadError && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 flex items-start gap-2 text-xs text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg"
        >
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          <span className="flex-1">{uploadError}</span>
          <button
            type="button"
            onClick={() => setUploadError(null)}
            className="text-red-400 hover:text-red-600 shrink-0 font-medium"
          >
            Dismiss
          </button>
        </motion.div>
      )}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

      {!uploading && preview && (
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Upload size={16} />
            Replace Photo
          </button>
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
          >
            <ImageIcon size={16} />
            Media Library
          </button>
        </div>
      )}

      {!uploading && !preview && (
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
        >
          <ImageIcon size={16} />
          Choose From Media Library
        </button>
      )}

      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handleMediaSelect}
      />
    </div>
  )
}
