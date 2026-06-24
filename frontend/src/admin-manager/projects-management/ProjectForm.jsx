import { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Save, X, Plus, Upload, ImageIcon,
  Loader2, GripVertical, CheckCircle, AlertCircle,
} from 'lucide-react'
import RichTextEditor from '../shared/RichTextEditor'
import MediaPicker from '../shared/MediaPicker'
import Toast from '../shared/Toast'
import { createProject, updateProject, getProject } from '../../shared/services/projectService'
import { uploadMedia } from '../../shared/services/mediaService'
import { getMediaUrl } from '../../shared/services/api'

const categories = [
  'Web App', 'Mobile App', 'Network', 'API', 'Library', 'Other',
]

const statusOptions = [
  { value: 'completed', label: 'Completed' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'planned', label: 'Planned' },
]

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function ProjectForm() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: '',
    slug: '',
    shortDescription: '',
    fullDescription: '',
    technologies: [],
    githubUrl: '',
    liveDemoUrl: '',
    category: '',
    featured: false,
    displayOrder: 0,
    status: 'completed',
    published: true,
    archived: false,
    metaTitle: '',
    metaDescription: '',
    keywords: '',
  })
  const [thumbnail, setThumbnail] = useState('')
  const [galleryImages, setGalleryImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEditing)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [techInput, setTechInput] = useState('')
  const [pickerFor, setPickerFor] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [toast, setToast] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (!isEditing) return
    (async () => {
      try {
        const { project } = await getProject(id)
        setForm({
          title: project.title || '',
          slug: project.slug || '',
          shortDescription: project.shortDescription || '',
          fullDescription: project.fullDescription || '',
          technologies: project.technologies || [],
          githubUrl: project.githubUrl || '',
          liveDemoUrl: project.liveDemoUrl || '',
          category: project.category || '',
          featured: project.featured || false,
          displayOrder: project.displayOrder || 0,
          status: project.status || 'completed',
          published: project.published !== false,
          archived: project.archived || false,
          metaTitle: project.metaTitle || '',
          metaDescription: project.metaDescription || '',
          keywords: project.keywords || '',
        })
        setThumbnail(project.thumbnail || '')
        setGalleryImages(project.images || [])
      } catch {
        setServerError('Failed to load project')
      } finally {
        setFetching(false)
      }
    })()
  }, [id, isEditing])

  const handleTitleChange = (value) => {
    setForm((prev) => ({
      ...prev,
      title: value,
      slug: isEditing ? prev.slug : slugify(value),
    }))
  }

  const validate = () => {
    const errs = {}
    if (!form.title.trim()) errs.title = 'Title is required'
    if (!form.shortDescription.trim()) errs.shortDescription = 'Short description is required'
    if (!form.category.trim()) errs.category = 'Category is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setServerError('')

    const body = {
      ...form,
      title: form.title.trim(),
      shortDescription: form.shortDescription.trim(),
      thumbnail,
      images: galleryImages,
    }

    console.log('Submitting Project:', body)
    console.log('fullDescription length:', (body.fullDescription || '').length)

    try {
      if (isEditing) {
        await updateProject(id, body)
      } else {
        const response = await createProject(body)
        console.log('API Response:', response)
      }
      navigate('/admin/projects')
    } catch (err) {
      console.error('Create project error:', err)
      console.error('Error response:', err.response?.data)
      console.error('Error status:', err.response?.status)
      const message = err.response?.data?.message || err.message || 'Failed to save project'
      setServerError(`Error (${err.response?.status || 'unknown'}): ${message}`)
    } finally {
      setLoading(false)
    }
  }

  const addTechTag = (tag) => {
    const t = tag.trim()
    if (!t) return
    if (form.technologies.includes(t)) return
    setForm((prev) => ({ ...prev, technologies: [...prev.technologies, t] }))
    setTechInput('')
  }

  const removeTechTag = (tag) => {
    setForm((prev) => ({ ...prev, technologies: prev.technologies.filter((t) => t !== tag) }))
  }

  const handleTechKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTechTag(techInput)
    }
    if (e.key === ',' || e.key === ';') {
      e.preventDefault()
      addTechTag(techInput.replace(/[,;]/g, ''))
    }
    if (e.key === 'Backspace' && !techInput && form.technologies.length > 0) {
      removeTechTag(form.technologies[form.technologies.length - 1])
    }
  }

  const uploadImage = async (file) => {
    setUploadingImage(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', 'projects')
      const { media } = await uploadMedia(fd)
      return media.url
    } catch {
      setToast({ message: 'Failed to upload image', type: 'error' })
      return null
    } finally {
      setUploadingImage(false)
    }
  }

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await uploadImage(file)
    if (url) setThumbnail(url)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleGalleryUpload = async (e) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    const urls = []
    for (const file of files) {
      const url = await uploadImage(file)
      if (url) urls.push(url)
    }
    setGalleryImages((prev) => [...prev, ...urls])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeGalleryImage = (index) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index))
  }

  const set = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/admin/projects')}
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-500" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">
            {isEditing ? 'Edit Project' : 'Add Project'}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {isEditing ? 'Update the project details below' : 'Fill in the details to add a new project'}
          </p>
        </div>
      </div>

      {serverError && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 space-y-5"
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Basic Information</h2>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                  Project Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. My Awesome Project"
                  className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${errors.title ? 'border-red-400' : 'border-gray-300 dark:border-slate-700'}`}
                />
                {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
                {form.slug && (
                  <p className="text-xs text-gray-400 mt-1">
                    Slug: <span className="font-mono text-gray-500">{form.slug}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                  Short Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.shortDescription}
                  onChange={set('shortDescription')}
                  rows={3}
                  placeholder="Brief description of the project..."
                  className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none ${errors.shortDescription ? 'border-red-400' : 'border-gray-300 dark:border-slate-700'}`}
                />
                {errors.shortDescription && <p className="text-xs text-red-500 mt-1">{errors.shortDescription}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                  Full Description
                </label>
                <RichTextEditor
                  value={form.fullDescription}
                  onChange={(val) => setForm((prev) => ({ ...prev, fullDescription: val }))}
                  placeholder="Detailed description of the project..."
                />
              </div>
            </motion.div>

            {/* Technology Tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 space-y-4"
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Technologies</h2>

              <div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={handleTechKeyDown}
                    placeholder="Type a technology and press Enter..."
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => addTechTag(techInput)}
                    disabled={!techInput.trim()}
                    className="px-4 py-3 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {form.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {form.technologies.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20"
                    >
                      {tag}
                      <button type="button" onClick={() => removeTechTag(tag)} className="hover:text-red-400 transition-colors">
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 space-y-5"
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Links</h2>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                  GitHub Repository URL
                </label>
                <input
                  type="url"
                  value={form.githubUrl}
                  onChange={set('githubUrl')}
                  placeholder="https://github.com/username/repo"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                  Live Demo URL
                </label>
                <input
                  type="url"
                  value={form.liveDemoUrl}
                  onChange={set('liveDemoUrl')}
                  placeholder="https://myproject.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
            </motion.div>

            {/* SEO Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 space-y-5"
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">SEO Settings</h2>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={form.metaTitle}
                  onChange={set('metaTitle')}
                  placeholder="SEO title for search engines"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                  Meta Description
                </label>
                <textarea
                  value={form.metaDescription}
                  onChange={set('metaDescription')}
                  rows={2}
                  placeholder="Brief description for search results"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                  Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  value={form.keywords}
                  onChange={set('keywords')}
                  placeholder="react, portfolio, web development"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
            </motion.div>
          </div>

          {/* Right Column - Settings & Images */}
          <div className="space-y-6">
            {/* Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 space-y-5"
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Settings</h2>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.category}
                  onChange={set('category')}
                  className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${errors.category ? 'border-red-400' : 'border-gray-300 dark:border-slate-700'}`}
                >
                  <option value="">Select category...</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                  Project Status
                </label>
                <select
                  value={form.status}
                  onChange={set('status')}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                  Display Order
                </label>
                <input
                  type="number"
                  value={form.displayOrder}
                  onChange={set('displayOrder')}
                  min={0}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={set('featured')}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-gray-300 dark:bg-slate-700 rounded-full peer-checked:bg-primary transition-colors" />
                  <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-4 transition-transform" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Featured Project</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={set('published')}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-gray-300 dark:bg-slate-700 rounded-full peer-checked:bg-primary transition-colors" />
                  <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-4 transition-transform" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Published</span>
              </label>
            </motion.div>

            {/* Thumbnail Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 space-y-4"
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Thumbnail</h2>

              {thumbnail ? (
                <div className="relative group">
                  <img
                    src={getMediaUrl(thumbnail)}
                    alt="Thumbnail"
                    className="w-full aspect-video rounded-xl object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 rounded-xl transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => setPickerFor('thumbnail')}
                      className="p-2 rounded-lg bg-white/90 text-gray-700 hover:bg-white transition-colors"
                      title="Choose from media library"
                    >
                      <ImageIcon size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 rounded-lg bg-white/90 text-gray-700 hover:bg-white transition-colors"
                      title="Replace"
                    >
                      <Upload size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setThumbnail('')}
                      className="p-2 rounded-lg bg-red-500/90 text-white hover:bg-red-500 transition-colors"
                      title="Remove"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                >
                  {uploadingImage ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 size={24} className="animate-spin text-primary" />
                      <p className="text-sm text-gray-500">Uploading...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload size={24} className="text-gray-400" />
                      <p className="text-sm text-gray-500 font-medium">Click to upload thumbnail</p>
                      <p className="text-xs text-gray-400">PNG, JPG, WebP</p>
                    </div>
                  )}
                </div>
              )}

              {!uploadingImage && (
                <button
                  type="button"
                  onClick={() => setPickerFor('thumbnail')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <ImageIcon size={16} />
                  Choose From Media Library
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => {
                  if (pickerFor === 'gallery') {
                    handleGalleryUpload(e)
                  } else {
                    handleThumbnailUpload(e)
                  }
                }}
                className="hidden"
                multiple={pickerFor === 'gallery'}
              />
            </motion.div>

            {/* Gallery Images */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Gallery</h2>
                <button
                  type="button"
                  onClick={() => { setPickerFor('gallery'); fileInputRef.current?.click() }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  <Plus size={14} />
                  Add Images
                </button>
              </div>

              {galleryImages.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {galleryImages.map((url, index) => (
                    <div key={index} className="relative group aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-800">
                      <img
                        src={getMediaUrl(url)}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="absolute top-1 right-1 p-1 rounded-lg bg-red-500/90 text-white hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  onClick={() => { setPickerFor('gallery'); fileInputRef.current?.click() }}
                  className="border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <div className="flex flex-col items-center gap-2">
                    <ImageIcon size={24} className="text-gray-400" />
                    <p className="text-sm text-gray-500 font-medium">Add screenshots</p>
                    <p className="text-xs text-gray-400">PNG, JPG, WebP</p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/projects')}
            className="px-6 py-3 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                {isEditing ? 'Update Project' : 'Create Project'}
              </>
            )}
          </button>
        </div>
      </form>

      {/* Media Picker */}
      <MediaPicker
        open={Boolean(pickerFor)}
        onClose={() => setPickerFor(null)}
        onSelect={(url) => {
          if (pickerFor === 'thumbnail') {
            setThumbnail(url)
          } else if (pickerFor === 'gallery') {
            setGalleryImages((prev) => [...prev, url])
          }
          setPickerFor(null)
        }}
      />

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  )
}
