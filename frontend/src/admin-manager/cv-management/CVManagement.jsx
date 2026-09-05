import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Save, RefreshCw, Edit2, X, Plus, Trash2, ChevronDown,
  User, FileText, Code2, Briefcase, FolderKanban,
  GraduationCap, Award, Trophy, Globe,
} from 'lucide-react'
import Toast from '../shared/Toast'
import ImageUpload from '../shared/ImageUpload'
import { getCVContent, updateCVContent } from '../../shared/services/cvService'
import defaultCVData from '../../shared/data/cvData'
import CVSidebar from '../../public-portfolio/pages/cv/CVSidebar'
import CVMain from '../../public-portfolio/pages/cv/CVMain'

const editTabs = [
  { id: 'personal', label: 'Personal', icon: User },
  { id: 'summary', label: 'Summary', icon: FileText },
  { id: 'skills', label: 'Skills', icon: Code2 },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'certifications', label: 'Certs', icon: Award },
  { id: 'achievements', label: 'Awards', icon: Trophy },
  { id: 'languages', label: 'Languages', icon: Globe },
]

function Input({ value, onChange, placeholder, className = '' }) {
  return (
    <input type="text" value={value} onChange={onChange} placeholder={placeholder}
      className={`w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${className}`} />
  )
}

function Textarea({ value, onChange, placeholder, rows = 4 }) {
  return (
    <textarea rows={rows} value={value} onChange={onChange} placeholder={placeholder}
      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

export default function CVManagement() {
  const [cv, setCV] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [editing, setEditing] = useState(false)
  const [editTab, setEditTab] = useState('personal')

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    try {
      const data = await getCVContent()
      setCV(data.content && data.content.personal?.name ? data.content : defaultCVData)
    } catch {
      setCV(defaultCVData)
    } finally {
      setLoading(false)
    }
  }

  function updateField(path, value) {
    setCV(prev => {
      const keys = path.split('.')
      const next = { ...prev }
      let obj = next
      for (let i = 0; i < keys.length - 1; i++) {
        if (Array.isArray(obj[keys[i]])) obj[keys[i]] = [...obj[keys[i]]]
        else obj[keys[i]] = { ...obj[keys[i]] }
        obj = obj[keys[i]]
      }
      obj[keys[keys.length - 1]] = value
      return next
    })
  }

  function updateArrayItem(section, index, field, value) {
    setCV(prev => {
      const arr = [...prev[section]]
      arr[index] = { ...arr[index], [field]: value }
      return { ...prev, [section]: arr }
    })
  }

  function addArrayItem(section, item) {
    setCV(prev => ({ ...prev, [section]: [...(prev[section] || []), item] }))
  }

  function removeArrayItem(section, index) {
    setCV(prev => ({ ...prev, [section]: prev[section].filter((_, i) => i !== index) }))
  }

  async function handleSave() {
    setSaving(true)
    try {
      await updateCVContent(cv)
      setToast({ message: 'CV saved successfully', type: 'success' })
      setEditing(false)
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to save', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  if (!cv) return null

  return (
    <div className="space-y-6">
      {/* Top bar with Edit button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">CV / Resume</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Preview your public CV page. Click Edit to make changes.</p>
        </div>
        <div className="flex gap-3">
          <a href="/#/cv" target="_blank" rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
            View Public Page
          </a>
          <button onClick={() => setEditing(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors">
            <Edit2 size={16} /> Edit CV
          </button>
        </div>
      </div>

      {/* CV Preview */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-lg">
        <div className="cv-container" style={{ transform: 'scale(0.75)', transformOrigin: 'top center', minHeight: 600 }}>
          <CVSidebar data={cv} />
          <CVMain data={cv} />
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex bg-black/60 backdrop-blur-sm" onClick={() => setEditing(false)}>
            {/* Left: Edit Form */}
            <motion.div initial={{ x: -400 }} animate={{ x: 0 }} exit={{ x: -400 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-2xl h-full overflow-y-auto bg-white dark:bg-slate-900 shadow-2xl">
              <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Edit CV Content</h2>
                <div className="flex items-center gap-3">
                  <button onClick={() => setEditing(false)}
                    className="px-4 py-2 text-sm rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800">
                    Cancel
                  </button>
                  <button onClick={handleSave} disabled={saving}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary/90 disabled:opacity-50">
                    {saving ? <><RefreshCw size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save</>}
                  </button>
                </div>
              </div>

              {/* Edit Tabs */}
              <div className="flex flex-wrap gap-1.5 px-6 py-3 border-b border-gray-200 dark:border-slate-700">
                {editTabs.map(tab => (
                  <button key={tab.id} onClick={() => setEditTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      editTab === tab.id ? 'bg-primary text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                    }`}>
                    <tab.icon size={12} /> {tab.label}
                  </button>
                ))}
              </div>

              {/* Edit Content */}
              <div className="px-6 py-5 space-y-4">
                {editTab === 'personal' && (
                  <div className="space-y-4">
                    <ImageUpload
                      value={cv.personal?.photo || ''}
                      onChange={url => updateField('personal.photo', url)}
                      label="Profile Photo"
                      folder="cv/photos"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Full Name"><Input value={cv.personal?.name || ''} onChange={e => updateField('personal.name', e.target.value)} /></Field>
                      <Field label="Job Title"><Input value={cv.personal?.title || ''} onChange={e => updateField('personal.title', e.target.value)} /></Field>
                      <Field label="Location"><Input value={cv.personal?.location || ''} onChange={e => updateField('personal.location', e.target.value)} /></Field>
                      <Field label="Phone"><Input value={cv.personal?.phone || ''} onChange={e => updateField('personal.phone', e.target.value)} /></Field>
                      <Field label="Email"><Input value={cv.personal?.email || ''} onChange={e => updateField('personal.email', e.target.value)} /></Field>
                      <Field label="GitHub"><Input value={cv.personal?.github || ''} onChange={e => updateField('personal.github', e.target.value)} /></Field>
                      <Field label="LinkedIn"><Input value={cv.personal?.linkedin || ''} onChange={e => updateField('personal.linkedin', e.target.value)} /></Field>
                      <Field label="Portfolio"><Input value={cv.personal?.portfolio || ''} onChange={e => updateField('personal.portfolio', e.target.value)} /></Field>
                    </div>
                  </div>
                )}

                {editTab === 'summary' && (
                  <Field label="Professional Summary">
                    <Textarea rows={6} value={cv.summary || ''} onChange={e => updateField('summary', e.target.value)} />
                  </Field>
                )}

                {editTab === 'skills' && (
                  <div className="space-y-4">
                    {['frontend', 'backend', 'mobile', 'databases', 'devops'].map(cat => (
                      <SkillEditor key={cat} category={cat} skills={cv.skills?.[cat] || []}
                        onUpdate={s => updateField(`skills.${cat}`, s)} />
                    ))}
                  </div>
                )}

                {editTab === 'experience' && (
                  <div className="space-y-3">
                    {(cv.experience || []).map((exp, i) => (
                      <ExpandableItem key={i} title={exp.title || 'New Experience'}>
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <Input value={exp.title} onChange={e => updateArrayItem('experience', i, 'title', e.target.value)} placeholder="Job Title" />
                            <Input value={exp.company} onChange={e => updateArrayItem('experience', i, 'company', e.target.value)} placeholder="Company" />
                            <Input value={exp.location} onChange={e => updateArrayItem('experience', i, 'location', e.target.value)} placeholder="Location" />
                            <Input value={exp.startDate} onChange={e => updateArrayItem('experience', i, 'startDate', e.target.value)} placeholder="Start (e.g. 2026-01)" />
                            <Input value={exp.endDate || ''} onChange={e => updateArrayItem('experience', i, 'endDate', e.target.value || null)} placeholder="End Date" />
                            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <input type="checkbox" checked={exp.current} onChange={e => updateArrayItem('experience', i, 'current', e.target.checked)} className="rounded" />
                              Current
                            </label>
                          </div>
                          <TagEditor label="Bullet Points" items={exp.bullets || []} onAdd={b => updateArrayItem('experience', i, 'bullets', [...(exp.bullets || []), b])}
                            onRemove={idx => updateArrayItem('experience', i, 'bullets', exp.bullets.filter((_, j) => j !== idx))} />
                        </div>
                        <button onClick={() => removeArrayItem('experience', i)} className="mt-3 text-xs text-red-500 hover:text-red-700">Remove</button>
                      </ExpandableItem>
                    ))}
                    <button onClick={() => addArrayItem('experience', { title: '', company: '', location: '', startDate: '', endDate: '', current: false, bullets: [] })}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-primary hover:bg-primary/5 rounded-xl"><Plus size={14} /> Add Experience</button>
                  </div>
                )}

                {editTab === 'projects' && (
                  <div className="space-y-3">
                    {(cv.projects || []).map((proj, i) => (
                      <ExpandableItem key={i} title={proj.name || 'New Project'}>
                        <div className="space-y-3">
                          <Input value={proj.name} onChange={e => updateArrayItem('projects', i, 'name', e.target.value)} placeholder="Project Name" />
                          <Textarea rows={2} value={proj.description} onChange={e => updateArrayItem('projects', i, 'description', e.target.value)} placeholder="Description" />
                          <div className="grid grid-cols-2 gap-3">
                            <Input value={proj.url || ''} onChange={e => updateArrayItem('projects', i, 'url', e.target.value || null)} placeholder="Live URL" />
                            <Input value={proj.github || ''} onChange={e => updateArrayItem('projects', i, 'github', e.target.value || null)} placeholder="GitHub URL" />
                          </div>
                          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <input type="checkbox" checked={proj.featured} onChange={e => updateArrayItem('projects', i, 'featured', e.target.checked)} className="rounded" />
                            Featured
                          </label>
                          <TagEditor label="Technologies" items={proj.technologies || []} onAdd={t => updateArrayItem('projects', i, 'technologies', [...(proj.technologies || []), t])}
                            onRemove={idx => updateArrayItem('projects', i, 'technologies', proj.technologies.filter((_, j) => j !== idx))} />
                          <TagEditor label="Highlights" items={proj.highlights || []} onAdd={h => updateArrayItem('projects', i, 'highlights', [...(proj.highlights || []), h])}
                            onRemove={idx => updateArrayItem('projects', i, 'highlights', proj.highlights.filter((_, j) => j !== idx))} />
                        </div>
                        <button onClick={() => removeArrayItem('projects', i)} className="mt-3 text-xs text-red-500 hover:text-red-700">Remove</button>
                      </ExpandableItem>
                    ))}
                    <button onClick={() => addArrayItem('projects', { name: '', description: '', technologies: [], highlights: [], url: null, github: null, featured: false })}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-primary hover:bg-primary/5 rounded-xl"><Plus size={14} /> Add Project</button>
                  </div>
                )}

                {editTab === 'education' && (
                  <div className="space-y-3">
                    {(cv.education || []).map((edu, i) => (
                      <div key={i} className="p-4 rounded-xl border border-gray-200 dark:border-slate-700 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <Input value={edu.degree} onChange={e => updateArrayItem('education', i, 'degree', e.target.value)} placeholder="Degree" />
                          <Input value={edu.institution} onChange={e => updateArrayItem('education', i, 'institution', e.target.value)} placeholder="Institution" />
                          <Input value={edu.location} onChange={e => updateArrayItem('education', i, 'location', e.target.value)} placeholder="Location" />
                          <Input value={edu.startDate} onChange={e => updateArrayItem('education', i, 'startDate', e.target.value)} placeholder="Start Year" />
                          <Input value={edu.endDate} onChange={e => updateArrayItem('education', i, 'endDate', e.target.value)} placeholder="End Year" />
                          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <input type="checkbox" checked={edu.expected} onChange={e => updateArrayItem('education', i, 'expected', e.target.checked)} className="rounded" />
                            Expected
                          </label>
                        </div>
                        <button onClick={() => removeArrayItem('education', i)} className="text-xs text-red-500 hover:text-red-700">Remove</button>
                      </div>
                    ))}
                    <button onClick={() => addArrayItem('education', { degree: '', institution: '', location: '', startDate: '', endDate: '', expected: false })}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-primary hover:bg-primary/5 rounded-xl"><Plus size={14} /> Add Education</button>
                  </div>
                )}

                {editTab === 'certifications' && (
                  <div className="space-y-3">
                    {(cv.certifications || []).map((cert, i) => (
                      <div key={i} className="p-4 rounded-xl border border-gray-200 dark:border-slate-700 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <Input value={cert.name} onChange={e => updateArrayItem('certifications', i, 'name', e.target.value)} placeholder="Certification Name" />
                          <Input value={cert.organization} onChange={e => updateArrayItem('certifications', i, 'organization', e.target.value)} placeholder="Organization" />
                          <Input value={cert.track} onChange={e => updateArrayItem('certifications', i, 'track', e.target.value)} placeholder="Track / Program" />
                          <Input value={cert.date || ''} onChange={e => updateArrayItem('certifications', i, 'date', e.target.value || null)} placeholder="Date" />
                        </div>
                        <button onClick={() => removeArrayItem('certifications', i)} className="text-xs text-red-500 hover:text-red-700">Remove</button>
                      </div>
                    ))}
                    <button onClick={() => addArrayItem('certifications', { name: '', organization: '', track: '', date: null, url: null })}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-primary hover:bg-primary/5 rounded-xl"><Plus size={14} /> Add Certification</button>
                  </div>
                )}

                {editTab === 'achievements' && (
                  <div className="space-y-3">
                    {(cv.achievements || []).map((ach, i) => (
                      <div key={i} className="p-4 rounded-xl border border-gray-200 dark:border-slate-700 space-y-3">
                        <Input value={ach.title} onChange={e => updateArrayItem('achievements', i, 'title', e.target.value)} placeholder="Achievement Title" />
                        <Textarea rows={2} value={ach.description} onChange={e => updateArrayItem('achievements', i, 'description', e.target.value)} placeholder="Description" />
                        <button onClick={() => removeArrayItem('achievements', i)} className="text-xs text-red-500 hover:text-red-700">Remove</button>
                      </div>
                    ))}
                    <button onClick={() => addArrayItem('achievements', { title: '', description: '' })}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-primary hover:bg-primary/5 rounded-xl"><Plus size={14} /> Add Achievement</button>
                  </div>
                )}

                {editTab === 'languages' && (
                  <div className="space-y-3">
                    {(cv.languages || []).map((lang, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="flex-1"><Input value={lang.language} onChange={e => updateArrayItem('languages', i, 'language', e.target.value)} placeholder="Language" /></div>
                        <div className="flex-1"><Input value={lang.proficiency} onChange={e => updateArrayItem('languages', i, 'proficiency', e.target.value)} placeholder="Proficiency" /></div>
                        <button onClick={() => removeArrayItem('languages', i)} className="p-2 text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                      </div>
                    ))}
                    <button onClick={() => addArrayItem('languages', { language: '', proficiency: '' })}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-primary hover:bg-primary/5 rounded-xl"><Plus size={14} /> Add Language</button>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Right: Live Preview */}
            <div className="hidden lg:block flex-1 overflow-y-auto p-8 bg-gray-100 dark:bg-slate-800">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl mx-auto" style={{ transform: 'scale(0.85)', transformOrigin: 'top center' }}>
                <div className="cv-container">
                  <CVSidebar data={cv} />
                  <CVMain data={cv} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

function ExpandableItem({ title, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-800/50">
        <span className="truncate">{title || 'Untitled'}</span>
        <ChevronDown size={16} className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
            <div className="px-4 pb-4 space-y-3 border-t border-gray-100 dark:border-slate-800 pt-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function TagEditor({ label, items, onAdd, onRemove }) {
  const [input, setInput] = useState('')
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">{label}</label>
      <div className="flex gap-2">
        <Input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), input.trim() && (onAdd(input.trim()), setInput('')))}
          placeholder={`Add ${label.toLowerCase()}`} />
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {items.map((t, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-full bg-primary/10 text-primary">
              {t}
              <button onClick={() => onRemove(i)} className="hover:text-red-500"><X size={11} /></button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function SkillEditor({ category, skills, onUpdate }) {
  const [input, setInput] = useState('')
  const label = category.charAt(0).toUpperCase() + category.slice(1)
  return (
    <div className="p-4 rounded-xl border border-gray-200 dark:border-slate-700">
      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">{label}</h4>
      <div className="flex gap-2">
        <Input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), input.trim() && (onUpdate([...skills, input.trim()]), setInput('')))}
          placeholder={`Add ${label} skill`} />
      </div>
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {skills.map((s, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-full bg-primary/10 text-primary">
              {s}
              <button onClick={() => onUpdate(skills.filter((_, j) => j !== i))} className="hover:text-red-500"><X size={11} /></button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
