import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Save, RefreshCw, User, FileText, Code2, Briefcase, FolderKanban,
  GraduationCap, Award, Trophy, Globe, Plus, Trash2, X, ChevronDown,
} from 'lucide-react'
import PageHeader from '../shared/PageHeader'
import Toast from '../shared/Toast'
import { getCVContent, updateCVContent } from '../../shared/services/cvService'

const tabs = [
  { id: 'personal', label: 'Personal', icon: User },
  { id: 'summary', label: 'Summary', icon: FileText },
  { id: 'skills', label: 'Skills', icon: Code2 },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'certifications', label: 'Certifications', icon: Award },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
  { id: 'languages', label: 'Languages', icon: Globe },
]

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

function Input({ value, onChange, placeholder, type = 'text', className = '' }) {
  return (
    <input type={type} value={value} onChange={onChange} placeholder={placeholder}
      className={`w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${className}`} />
  )
}

function Textarea({ value, onChange, placeholder, rows = 4 }) {
  return (
    <textarea rows={rows} value={value} onChange={onChange} placeholder={placeholder}
      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
  )
}

function Card({ children, className = '' }) {
  return (
    <div className={`bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 space-y-5 ${className}`}>{children}</div>
  )
}

export default function CVManagement() {
  const [cv, setCV] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [activeTab, setActiveTab] = useState('personal')

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const data = await getCVContent()
      setCV(data.content || {})
    } catch {
      setToast({ message: 'Failed to load CV data', type: 'error' })
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
        if (Array.isArray(obj[keys[i]])) {
          obj[keys[i]] = [...obj[keys[i]]]
        } else {
          obj[keys[i]] = { ...obj[keys[i]] }
        }
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
      setToast({ message: 'CV content saved successfully', type: 'success' })
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
      <PageHeader title="CV / Resume Management" subtitle="Manage your CV content displayed on the public CV page." />

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === tab.id ? 'bg-primary text-white shadow-lg' : 'bg-white dark:bg-slate-900 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-slate-800 hover:border-primary/30'
            }`}>
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Personal Info */}
      {activeTab === 'personal' && (
        <Card>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Personal Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full Name"><Input value={cv.personal?.name || ''} onChange={e => updateField('personal.name', e.target.value)} /></Field>
            <Field label="Job Title"><Input value={cv.personal?.title || ''} onChange={e => updateField('personal.title', e.target.value)} /></Field>
            <Field label="Photo URL"><Input value={cv.personal?.photo || ''} onChange={e => updateField('personal.photo', e.target.value)} placeholder="/path or URL" /></Field>
            <Field label="Location"><Input value={cv.personal?.location || ''} onChange={e => updateField('personal.location', e.target.value)} /></Field>
            <Field label="Phone"><Input value={cv.personal?.phone || ''} onChange={e => updateField('personal.phone', e.target.value)} /></Field>
            <Field label="Email"><Input value={cv.personal?.email || ''} onChange={e => updateField('personal.email', e.target.value)} /></Field>
            <Field label="GitHub URL"><Input value={cv.personal?.github || ''} onChange={e => updateField('personal.github', e.target.value)} /></Field>
            <Field label="LinkedIn URL"><Input value={cv.personal?.linkedin || ''} onChange={e => updateField('personal.linkedin', e.target.value)} /></Field>
            <Field label="Portfolio URL"><Input value={cv.personal?.portfolio || ''} onChange={e => updateField('personal.portfolio', e.target.value)} /></Field>
          </div>
        </Card>
      )}

      {/* Summary */}
      {activeTab === 'summary' && (
        <Card>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Professional Summary</h3>
          <Textarea rows={6} value={cv.summary || ''} onChange={e => updateField('summary', e.target.value)} placeholder="Write your professional summary..." />
        </Card>
      )}

      {/* Skills */}
      {activeTab === 'skills' && (
        <div className="space-y-4">
          {['frontend', 'backend', 'mobile', 'databases', 'devops'].map(cat => (
            <SkillCategory key={cat} category={cat} skills={cv.skills?.[cat] || []}
              onUpdate={(skills) => updateField(`skills.${cat}`, skills)} />
          ))}
        </div>
      )}

      {/* Experience */}
      {activeTab === 'experience' && (
        <div className="space-y-4">
          {(cv.experience || []).map((exp, i) => (
            <ExperienceItem key={i} item={exp} index={i}
              onUpdate={(field, val) => updateArrayItem('experience', i, field, val)}
              onRemove={() => removeArrayItem('experience', i)} />
          ))}
          <button onClick={() => addArrayItem('experience', { title: '', company: '', location: '', startDate: '', endDate: '', current: false, bullets: [] })}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-xl transition-colors">
            <Plus size={16} /> Add Experience
          </button>
        </div>
      )}

      {/* Projects */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          {(cv.projects || []).map((proj, i) => (
            <ProjectItem key={i} item={proj} index={i}
              onUpdate={(field, val) => updateArrayItem('projects', i, field, val)}
              onRemove={() => removeArrayItem('projects', i)} />
          ))}
          <button onClick={() => addArrayItem('projects', { name: '', description: '', technologies: [], highlights: [], url: null, github: null, featured: false })}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-xl transition-colors">
            <Plus size={16} /> Add Project
          </button>
        </div>
      )}

      {/* Education */}
      {activeTab === 'education' && (
        <div className="space-y-4">
          {(cv.education || []).map((edu, i) => (
            <EducationItem key={i} item={edu} index={i}
              onUpdate={(field, val) => updateArrayItem('education', i, field, val)}
              onRemove={() => removeArrayItem('education', i)} />
          ))}
          <button onClick={() => addArrayItem('education', { degree: '', institution: '', location: '', startDate: '', endDate: '', expected: false, description: null })}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-xl transition-colors">
            <Plus size={16} /> Add Education
          </button>
        </div>
      )}

      {/* Certifications */}
      {activeTab === 'certifications' && (
        <div className="space-y-4">
          {(cv.certifications || []).map((cert, i) => (
            <CertificationItem key={i} item={cert} index={i}
              onUpdate={(field, val) => updateArrayItem('certifications', i, field, val)}
              onRemove={() => removeArrayItem('certifications', i)} />
          ))}
          <button onClick={() => addArrayItem('certifications', { name: '', organization: '', track: '', date: null, url: null })}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-xl transition-colors">
            <Plus size={16} /> Add Certification
          </button>
        </div>
      )}

      {/* Achievements */}
      {activeTab === 'achievements' && (
        <div className="space-y-4">
          {(cv.achievements || []).map((ach, i) => (
            <AchievementItem key={i} item={ach} index={i}
              onUpdate={(field, val) => updateArrayItem('achievements', i, field, val)}
              onRemove={() => removeArrayItem('achievements', i)} />
          ))}
          <button onClick={() => addArrayItem('achievements', { title: '', description: '' })}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-xl transition-colors">
            <Plus size={16} /> Add Achievement
          </button>
        </div>
      )}

      {/* Languages */}
      {activeTab === 'languages' && (
        <div className="space-y-4">
          {(cv.languages || []).map((lang, i) => (
            <LanguageItem key={i} item={lang} index={i}
              onUpdate={(field, val) => updateArrayItem('languages', i, field, val)}
              onRemove={() => removeArrayItem('languages', i)} />
          ))}
          <button onClick={() => addArrayItem('languages', { language: '', proficiency: '' })}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-xl transition-colors">
            <Plus size={16} /> Add Language
          </button>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-slate-800">
        <button onClick={handleSave} disabled={saving}
          className="px-6 py-3 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2">
          {saving ? <><RefreshCw size={18} className="animate-spin" /> Saving...</> : <><Save size={18} /> Save All Changes</>}
        </button>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

function SkillCategory({ category, skills, onUpdate }) {
  const [input, setInput] = useState('')
  const label = category.charAt(0).toUpperCase() + category.slice(1)

  function add() {
    if (input.trim()) {
      onUpdate([...skills, input.trim()])
      setInput('')
    }
  }

  function remove(idx) {
    onUpdate(skills.filter((_, i) => i !== idx))
  }

  return (
    <Card>
      <h3 className="text-sm font-bold text-gray-900 dark:text-white">{label} Skills</h3>
      <div className="flex gap-2">
        <Input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())} placeholder={`Add ${label} skill`} />
        <button onClick={add} className="px-4 py-2 text-sm rounded-xl bg-primary text-white hover:bg-primary/90">Add</button>
      </div>
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {skills.map((s, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-primary/10 text-primary">
              {s}
              <button onClick={() => remove(i)} className="hover:text-red-500"><X size={12} /></button>
            </span>
          ))}
        </div>
      )}
    </Card>
  )
}

function ExperienceItem({ item, index, onUpdate, onRemove }) {
  const [expanded, setExpanded] = useState(false)
  const [bulletInput, setBulletInput] = useState('')

  function addBullet() {
    if (bulletInput.trim()) {
      onUpdate('bullets', [...(item.bullets || []), bulletInput.trim()])
      setBulletInput('')
    }
  }

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <Input value={item.title} onChange={e => onUpdate('title', e.target.value)} placeholder="Job Title" />
        </div>
        <div className="flex items-center gap-1 ml-3 shrink-0">
          <button onClick={() => setExpanded(!expanded)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400">
            <ChevronDown size={16} className={expanded ? 'rotate-180' : ''} />
          </button>
          <button onClick={onRemove} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-red-400 hover:text-red-600">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Input value={item.company} onChange={e => onUpdate('company', e.target.value)} placeholder="Company" />
              <Input value={item.location} onChange={e => onUpdate('location', e.target.value)} placeholder="Location" />
              <Input value={item.startDate} onChange={e => onUpdate('startDate', e.target.value)} placeholder="Start Date (e.g. 2026-01)" />
              <Input value={item.endDate || ''} onChange={e => onUpdate('endDate', e.target.value || null)} placeholder="End Date or leave empty" />
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <input type="checkbox" checked={item.current} onChange={e => onUpdate('current', e.target.checked)} className="rounded" />
              Currently working here
            </label>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Bullet Points</label>
              <div className="flex gap-2">
                <Input value={bulletInput} onChange={e => setBulletInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addBullet())} placeholder="Add bullet point" />
                <button onClick={addBullet} className="px-3 py-2 text-sm rounded-xl bg-primary text-white hover:bg-primary/90">Add</button>
              </div>
              {(item.bullets || []).length > 0 && (
                <ul className="mt-2 space-y-1">
                  {item.bullets.map((b, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <span className="text-primary">•</span>
                      <span className="flex-1">{b}</span>
                      <button onClick={() => onUpdate('bullets', item.bullets.filter((_, j) => j !== i))} className="hover:text-red-500"><X size={12} /></button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}

function ProjectItem({ item, index, onUpdate, onRemove }) {
  const [expanded, setExpanded] = useState(false)
  const [techInput, setTechInput] = useState('')
  const [highlightInput, setHighlightInput] = useState('')

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <Input value={item.name} onChange={e => onUpdate('name', e.target.value)} placeholder="Project Name" />
        </div>
        <div className="flex items-center gap-1 ml-3 shrink-0">
          <button onClick={() => setExpanded(!expanded)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400">
            <ChevronDown size={16} className={expanded ? 'rotate-180' : ''} />
          </button>
          <button onClick={onRemove} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-red-400 hover:text-red-600">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden space-y-3">
            <Textarea rows={3} value={item.description} onChange={e => onUpdate('description', e.target.value)} placeholder="Project description" />
            <div className="grid grid-cols-2 gap-3">
              <Input value={item.url || ''} onChange={e => onUpdate('url', e.target.value || null)} placeholder="Live URL" />
              <Input value={item.github || ''} onChange={e => onUpdate('github', e.target.value || null)} placeholder="GitHub URL" />
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <input type="checkbox" checked={item.featured} onChange={e => onUpdate('featured', e.target.checked)} className="rounded" />
              Featured Project
            </label>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Technologies</label>
              <div className="flex gap-2">
                <Input value={techInput} onChange={e => setTechInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), techInput.trim() && (onUpdate('technologies', [...(item.technologies || []), techInput.trim()]), setTechInput('')))} placeholder="Add technology" />
              </div>
              {(item.technologies || []).length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {item.technologies.map((t, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                      {t}
                      <button onClick={() => onUpdate('technologies', item.technologies.filter((_, j) => j !== i))} className="hover:text-red-500"><X size={12} /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Highlights</label>
              <div className="flex gap-2">
                <Input value={highlightInput} onChange={e => setHighlightInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), highlightInput.trim() && (onUpdate('highlights', [...(item.highlights || []), highlightInput.trim()]), setHighlightInput('')))} placeholder="Add highlight" />
              </div>
              {(item.highlights || []).length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {item.highlights.map((h, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                      {h}
                      <button onClick={() => onUpdate('highlights', item.highlights.filter((_, j) => j !== i))} className="hover:text-red-500"><X size={12} /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}

function EducationItem({ item, index, onUpdate, onRemove }) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <Input value={item.degree} onChange={e => onUpdate('degree', e.target.value)} placeholder="Degree" />
        </div>
        <button onClick={onRemove} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-red-400 hover:text-red-600 ml-3 shrink-0">
          <Trash2 size={16} />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input value={item.institution} onChange={e => onUpdate('institution', e.target.value)} placeholder="Institution" />
        <Input value={item.location} onChange={e => onUpdate('location', e.target.value)} placeholder="Location" />
        <Input value={item.startDate} onChange={e => onUpdate('startDate', e.target.value)} placeholder="Start Year" />
        <Input value={item.endDate} onChange={e => onUpdate('endDate', e.target.value)} placeholder="End Year" />
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <input type="checkbox" checked={item.expected} onChange={e => onUpdate('expected', e.target.checked)} className="rounded" />
        Expected (not yet completed)
      </label>
    </Card>
  )
}

function CertificationItem({ item, index, onUpdate, onRemove }) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <Input value={item.name} onChange={e => onUpdate('name', e.target.value)} placeholder="Certification Name" />
        </div>
        <button onClick={onRemove} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-red-400 hover:text-red-600 ml-3 shrink-0">
          <Trash2 size={16} />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input value={item.organization} onChange={e => onUpdate('organization', e.target.value)} placeholder="Organization" />
        <Input value={item.track} onChange={e => onUpdate('track', e.target.value)} placeholder="Track / Program" />
        <Input value={item.date || ''} onChange={e => onUpdate('date', e.target.value || null)} placeholder="Date (optional)" />
        <Input value={item.url || ''} onChange={e => onUpdate('url', e.target.value || null)} placeholder="URL (optional)" />
      </div>
    </Card>
  )
}

function AchievementItem({ item, index, onUpdate, onRemove }) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <Input value={item.title} onChange={e => onUpdate('title', e.target.value)} placeholder="Achievement Title" />
        </div>
        <button onClick={onRemove} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-red-400 hover:text-red-600 ml-3 shrink-0">
          <Trash2 size={16} />
        </button>
      </div>
      <Textarea rows={2} value={item.description} onChange={e => onUpdate('description', e.target.value)} placeholder="Description (optional)" />
    </Card>
  )
}

function LanguageItem({ item, index, onUpdate, onRemove }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <Input value={item.language} onChange={e => onUpdate('language', e.target.value)} placeholder="Language" />
      </div>
      <div className="flex-1">
        <Input value={item.proficiency} onChange={e => onUpdate('proficiency', e.target.value)} placeholder="Proficiency (e.g. Native, Fluent)" />
      </div>
      <button onClick={onRemove} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-red-400 hover:text-red-600 shrink-0">
        <Trash2 size={16} />
      </button>
    </div>
  )
}
