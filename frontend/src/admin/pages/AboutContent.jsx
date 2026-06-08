import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, RefreshCw, Plus, Trash2, Edit2 } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import ImageUpload from '../components/ImageUpload'
import Toast from '../components/Toast'
import { getAboutContent, updateAboutContent } from '../../services/aboutService'

const emptyEducation = { degree: '', institution: '', year: '' }
const emptyExperience = { role: '', company: '', duration: '', description: '' }
const emptyAchievement = { title: '', description: '' }

export default function AboutContent() {
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    yearsOfExperience: 0,
    location: '',
    cvUrl: '',
    status: 'active',
    education: [],
    experience: [],
    achievements: [],
  })
  const [profileImageFile, setProfileImageFile] = useState(null)
  const [existingImage, setExistingImage] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [toast, setToast] = useState(null)

  const [editEduIdx, setEditEduIdx] = useState(null)
  const [editExpIdx, setEditExpIdx] = useState(null)
  const [editAchIdx, setEditAchIdx] = useState(null)

  useEffect(() => {
    ;(async () => {
      try {
        const { content } = await getAboutContent()
        if (content) {
          setForm({
            title: content.title || '',
            subtitle: content.subtitle || '',
            description: content.description || '',
            yearsOfExperience: content.yearsOfExperience || 0,
            location: content.location || '',
            cvUrl: content.cvUrl || '',
            status: content.status || 'active',
            education: content.education || [],
            experience: content.experience || [],
            achievements: content.achievements || [],
          })
          setExistingImage(content.profileImage || '')
        }
      } catch {
        setToast({ message: 'Failed to load about content', type: 'error' })
      } finally {
        setFetching(false)
      }
    })()
  }, [])

  const set = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const addItem = (key, empty) => {
    setForm((prev) => ({ ...prev, [key]: [...prev[key], { ...empty }] }))
  }

  const removeItem = (key, idx) => {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== idx),
    }))
  }

  const updateItem = (key, idx, field) => (e) => {
    setForm((prev) => {
      const items = [...prev[key]]
      items[idx] = { ...items[idx], [field]: e.target.value }
      return { ...prev, [key]: items }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData()
    fd.append('title', form.title)
    fd.append('subtitle', form.subtitle)
    fd.append('description', form.description)
    fd.append('yearsOfExperience', form.yearsOfExperience)
    fd.append('location', form.location)
    fd.append('cvUrl', form.cvUrl)
    fd.append('status', form.status)
    fd.append('education', JSON.stringify(form.education))
    fd.append('experience', JSON.stringify(form.experience))
    fd.append('achievements', JSON.stringify(form.achievements))
    if (profileImageFile) fd.append('profileImage', profileImageFile)
    try {
      await updateAboutContent(fd)
      setToast({ message: 'About content updated successfully', type: 'success' })
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to update about content', type: 'error' })
    } finally {
      setLoading(false)
    }
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
      <PageHeader title="About Content" subtitle="Manage your about section information." />
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 space-y-5"
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Hero Section</h2>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Title</label>
                <input type="text" value={form.title} onChange={set('title')} placeholder="e.g. Get to Know Me" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Subtitle</label>
                <input type="text" value={form.subtitle} onChange={set('subtitle')} placeholder="e.g. A passionate developer..." className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Description</label>
                <textarea value={form.description} onChange={set('description')} rows={4} placeholder="About description..." className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Years of Experience</label>
                  <input type="number" value={form.yearsOfExperience} onChange={set('yearsOfExperience')} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Location</label>
                  <input type="text" value={form.location} onChange={set('location')} placeholder="e.g. Bahirdar, Ethiopia" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">CV URL</label>
                <input type="url" value={form.cvUrl} onChange={set('cvUrl')} placeholder="https://drive.google.com/your-cv" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 space-y-5"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Education</h2>
                <button type="button" onClick={() => addItem('education', emptyEducation)} className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                  <Plus size={16} /> Add Education
                </button>
              </div>
              {form.education.length === 0 && <p className="text-sm text-gray-400">No education entries yet.</p>}
              {form.education.map((edu, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-gray-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-600 dark:text-gray-400">Entry {idx + 1}</span>
                    <button type="button" onClick={() => removeItem('education', idx)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"><Trash2 size={14} /></button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <input type="text" value={edu.degree} onChange={updateItem('education', idx, 'degree')} placeholder="Degree" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                    <input type="text" value={edu.institution} onChange={updateItem('education', idx, 'institution')} placeholder="Institution" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                    <input type="text" value={edu.year} onChange={updateItem('education', idx, 'year')} placeholder="Year" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 space-y-5"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Experience</h2>
                <button type="button" onClick={() => addItem('experience', emptyExperience)} className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                  <Plus size={16} /> Add Experience
                </button>
              </div>
              {form.experience.length === 0 && <p className="text-sm text-gray-400">No experience entries yet.</p>}
              {form.experience.map((exp, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-gray-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-600 dark:text-gray-400">Entry {idx + 1}</span>
                    <button type="button" onClick={() => removeItem('experience', idx)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"><Trash2 size={14} /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" value={exp.role} onChange={updateItem('experience', idx, 'role')} placeholder="Role" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                    <input type="text" value={exp.company} onChange={updateItem('experience', idx, 'company')} placeholder="Company" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" value={exp.duration} onChange={updateItem('experience', idx, 'duration')} placeholder="Duration" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <textarea value={exp.description} onChange={updateItem('experience', idx, 'description')} rows={2} placeholder="Description" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 space-y-5"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Achievements</h2>
                <button type="button" onClick={() => addItem('achievements', emptyAchievement)} className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                  <Plus size={16} /> Add Achievement
                </button>
              </div>
              {form.achievements.length === 0 && <p className="text-sm text-gray-400">No achievements yet.</p>}
              {form.achievements.map((ach, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-gray-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-600 dark:text-gray-400">Entry {idx + 1}</span>
                    <button type="button" onClick={() => removeItem('achievements', idx)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"><Trash2 size={14} /></button>
                  </div>
                  <input type="text" value={ach.title} onChange={updateItem('achievements', idx, 'title')} placeholder="Achievement title" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  <textarea value={ach.description} onChange={updateItem('achievements', idx, 'description')} rows={2} placeholder="Description" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
                </div>
              ))}
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6"
            >
              <ImageUpload value={existingImage} onChange={setProfileImageFile} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 space-y-4"
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Settings</h2>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Status</label>
                <select value={form.status} onChange={set('status')} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6 flex justify-end gap-3"
        >
          <button type="submit" disabled={loading} className="px-6 py-3 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2">
            {loading ? <><RefreshCw size={18} className="animate-spin" /> Saving...</> : <><Save size={18} /> Save Changes</>}
          </button>
        </motion.div>
      </form>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
