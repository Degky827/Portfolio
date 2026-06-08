import { useState, useRef } from 'react'
import { Upload, X, ImageIcon } from 'lucide-react'

export default function ImageUpload({ value, onChange, error }) {
  const [preview, setPreview] = useState(value || '')
  const inputRef = useRef(null)

  const handleFile = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) return
    if (file.size > 5 * 1024 * 1024) return
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target.result)
    reader.readAsDataURL(file)
    onChange(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    handleFile(e.dataTransfer.files[0])
  }

  const handleChange = (e) => {
    handleFile(e.target.files[0])
  }

  const handleRemove = () => {
    setPreview('')
    onChange(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
        Project Image
      </label>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
          preview
            ? 'border-transparent'
            : 'border-gray-300 dark:border-slate-700 hover:border-primary/50 dark:hover:border-primary/50'
        } ${error ? 'border-red-400' : ''}`}
      >
        {preview ? (
          <div className="relative inline-block">
            <img
              src={preview}
              alt="Preview"
              className="max-h-48 rounded-lg object-cover"
            />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleRemove() }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-4">
            <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
              <ImageIcon size={24} className="text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                <span className="text-primary">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG, WebP up to 5MB</p>
            </div>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
