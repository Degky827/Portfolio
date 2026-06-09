import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Save } from 'lucide-react'
import ImageUpload from '../components/ImageUpload'
import { createProject, updateProject, getProject } from '../../services/projectService'

const categories = [
  'Web App',
  'Mobile App',
  'Network',
  'API',
  'Library',
  'Other',
]

export default function ProjectForm() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: '',
    shortDescription: '',
    fullDescription: '',
    technologies: '',
    githubUrl: '',
    liveDemoUrl: '',
    category: '',
    featured: false,
    displayOrder: 0,
    status: 'active',
  })
  const [imageFile, setImageFile] = useState(null)
  const [imageUrl, setImageUrl] = useState('')
  const [existingImage, setExistingImage] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEditing)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')

  useEffect(() => {
    if (!isEditing) return
    (async () => {
      try {
        const { project } = await getProject(id)
        setForm({
          title: project.title || '',
          shortDescription: project.shortDescription || '',
          fullDescription: project.fullDescription || '',
          technologies: (project.technologies || []).join(', '),
          githubUrl: project.githubUrl || '',
          liveDemoUrl: project.liveDemoUrl || '',
          category: project.category || '',
          featured: project.featured || false,
          displayOrder: project.displayOrder || 0,
          status: project.status || 'active',
        })
        setExistingImage(project.image || '')
      } catch {
        setServerError('Failed to load project')
      } finally {
        setFetching(false)
      }
    })()
  }, [id, isEditing])

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

    const fd = new FormData()
    fd.append('title', form.title.trim())
    fd.append('shortDescription', form.shortDescription.trim())
    fd.append('fullDescription', form.fullDescription.trim())
    fd.append('technologies', form.technologies)
    fd.append('githubUrl', form.githubUrl.trim())
    fd.append('liveDemoUrl', form.liveDemoUrl.trim())
    fd.append('category', form.category.trim())
    fd.append('featured', form.featured)
    fd.append('displayOrder', form.displayOrder)
    fd.append('status', form.status)
    if (imageFile) fd.append('image', imageFile)
    else if (imageUrl) fd.append('imageUrl', imageUrl)

    try {
      if (isEditing) {
        await updateProject(id, fd)
      } else {
        await createProject(fd)
      }
      navigate('/admin/projects')
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to save project')
    } finally {
      setLoading(false)
    }
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
                  onChange={set('title')}
                  placeholder="e.g. My Awesome Project"
                  className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${errors.title ? 'border-red-400' : 'border-gray-300 dark:border-slate-700'}`}
                />
                {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
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
                <textarea
                  value={form.fullDescription}
                  onChange={set('fullDescription')}
                  rows={6}
                  placeholder="Detailed description of the project..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                  Technologies Used (comma-separated)
                </label>
                <input
                  type="text"
                  value={form.technologies}
                  onChange={set('technologies')}
                  placeholder="e.g. React, Node.js, MongoDB"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 space-y-5"
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Links</h2>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                  GitHub URL
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
          </div>

          <div className="space-y-6">
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

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={set('status')}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6"
            >
              <ImageUpload
                value={existingImage}
                onChange={(val) => {
                  if (typeof val === 'string') { setImageUrl(val); setImageFile(null) }
                  else { setImageFile(val); setImageUrl('') }
                }}
                error={errors.image}
              />
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
    </div>
  )
}
