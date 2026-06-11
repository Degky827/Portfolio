import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Save } from 'lucide-react'
import { createSkill, updateSkill, getSkill } from '../../services/skillService'
import ImageUpload from '../components/ImageUpload'

const FIXED_CATEGORIES = [
  { title: 'Frontend Development', color: '#6366f1' },
  { title: 'Backend Development', color: '#10b981' },
  { title: 'Mobile Development', color: '#3b82f6' },
  { title: 'Networking', color: '#8b5cf6' },
  { title: 'Tools', color: '#ef4444' },
  { title: 'Certificates', color: '#14b8a6' },
]

const proficiencyLevels = [
  { value: 25, label: 'Beginner' },
  { value: 50, label: 'Intermediate' },
  { value: 75, label: 'Advanced' },
  { value: 100, label: 'Expert' },
]

export default function SkillForm() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    category: '',
    icon: '',
    proficiency: 50,
    description: '',
    displayOrder: 0,
    featured: false,
    status: 'active',
    issuer: '',
    issueDate: '',
    certificateUrl: '',
  })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEditing)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')

  const isCert = form.category?.toLowerCase() === 'certificates'
  const selectedCat = FIXED_CATEGORIES.find((c) => c.title === form.category)

  useEffect(() => {
    if (!isEditing) return
    ;(async () => {
      try {
        const { skill } = await getSkill(id)
        setForm({
          name: skill.name || '',
          category: skill.category || '',
          icon: skill.icon || '',
          proficiency: skill.proficiency ?? 50,
          description: skill.description || '',
          displayOrder: skill.displayOrder || 0,
          featured: skill.featured || false,
          status: skill.status || 'active',
          issuer: skill.issuer || '',
          issueDate: skill.issueDate || '',
          certificateUrl: skill.certificateUrl || '',
        })
      } catch {
        setServerError('Failed to load skill')
      } finally {
        setFetching(false)
      }
    })()
  }, [id, isEditing])

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.category.trim()) errs.category = 'Category is required'
    if (!isCert) {
      const prof = parseInt(form.proficiency, 10)
      if (isNaN(prof) || prof < 0 || prof > 100) errs.proficiency = 'Must be between 0 and 100'
    }
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
      displayOrder: parseInt(form.displayOrder, 10) || 0,
      featured: form.featured,
    }
    if (!isCert) {
      body.proficiency = parseInt(form.proficiency, 10)
    }

    try {
      if (isEditing) {
        await updateSkill(id, body)
      } else {
        await createSkill(body)
      }
      navigate('/admin/skills')
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to save')
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
          onClick={() => navigate('/admin/skills')}
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-500" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">
            {isEditing ? (isCert ? 'Edit Certificate' : 'Edit Skill') : (isCert ? 'Add Certificate' : 'Add Skill')}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {isEditing ? 'Update the details below' : 'Fill in the details below'}
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
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {isCert ? 'Certificate Information' : 'Skill Information'}
              </h2>

              {/* Name / Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                  {isCert ? 'Certificate Title' : 'Skill Name'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={set('name')}
                  placeholder={isCert ? 'e.g. Cisco Networking Basics' : 'e.g. React.js'}
                  className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${errors.name ? 'border-red-400' : 'border-gray-300 dark:border-slate-700'}`}
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              {isCert ? (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                      Issuing Organization
                    </label>
                    <input
                      type="text"
                      value={form.issuer}
                      onChange={set('issuer')}
                      placeholder="e.g. Cisco Networking Academy"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                      Issue Date
                    </label>
                    <input
                      type="text"
                      value={form.issueDate}
                      onChange={set('issueDate')}
                      placeholder="e.g. 2025 or March 2025"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                      Description
                    </label>
                    <textarea
                      value={form.description}
                      onChange={set('description')}
                      rows={3}
                      placeholder="Brief description of this certificate..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                      Certificate Image
                    </label>
                    <ImageUpload
                      value={form.icon}
                      onChange={(url) => setForm((p) => ({ ...p, icon: url }))}
                      label="Upload Certificate Image"
                      folder="certificates"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                      Certificate PDF <span className="text-gray-400 font-normal normal-case">(optional)</span>
                    </label>
                    <input
                      type="url"
                      value={form.certificateUrl}
                      onChange={set('certificateUrl')}
                      placeholder="https://example.com/certificate.pdf"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                      Skill Icon
                    </label>
                    <input
                      type="text"
                      value={form.icon}
                      onChange={set('icon')}
                      placeholder="e.g. SiReact, FaNodeJs"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                    <p className="text-xs text-gray-400 mt-1">Icon identifier for display on the portfolio</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                      Skill Level <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={form.proficiency}
                        onChange={set('proficiency')}
                        className="flex-1 accent-primary"
                      />
                      <span className="text-lg font-black text-primary min-w-[3ch] text-center">
                        {form.proficiency}%
                      </span>
                    </div>
                    <div className="flex justify-between mt-1">
                      {proficiencyLevels.map((l) => (
                        <button
                          key={l.value}
                          type="button"
                          onClick={() => setForm((prev) => ({ ...prev, proficiency: l.value }))}
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full transition-colors ${
                            form.proficiency >= l.value
                              ? 'text-primary bg-primary/10'
                              : 'text-gray-400'
                          }`}
                        >
                          {l.label}
                        </button>
                      ))}
                    </div>
                    {errors.proficiency && <p className="text-xs text-red-500 mt-1">{errors.proficiency}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={form.displayOrder}
                      onChange={set('displayOrder')}
                      min="0"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  </div>
                </>
              )}
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 space-y-5"
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Settings</h2>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.category}
                  onChange={set('category')}
                  className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${errors.category ? 'border-red-400' : 'border-gray-300 dark:border-slate-700'}`}
                >
                  <option value="">Select a category...</option>
                  {FIXED_CATEGORIES.map((cat) => (
                    <option key={cat.title} value={cat.title}>{cat.title}</option>
                  ))}
                </select>
                {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
                {selectedCat && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedCat.color }} />
                    <span className="text-xs text-gray-500 dark:text-gray-400">{selectedCat.title} category</span>
                  </div>
                )}
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
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {isCert ? 'Featured Certificate' : 'Featured Skill'}
                </span>
              </label>
            </motion.div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/skills')}
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
                {isEditing ? (isCert ? 'Update Certificate' : 'Update Skill') : (isCert ? 'Create Certificate' : 'Create Skill')}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
