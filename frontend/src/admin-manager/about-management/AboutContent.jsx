import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Save, RefreshCw, Plus, Trash2, ArrowUp, ArrowDown,
  Award, Users, TrendingUp, CheckCircle,
  Link, GripVertical, Terminal, ToggleLeft, Hash,
  BookOpen, Cpu, Globe, Shield, Zap, Star, Code2,
  Rocket, Trophy, Wifi, Server, Palette, Video,
  Sparkles, Download, MapPin, Heart, Briefcase, Coffee, Smile,
} from 'lucide-react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import PageHeader from '../shared/PageHeader'
import Toast from '../shared/Toast'
import { getAboutContent, updateAboutContent } from '../../shared/services/aboutService'

const ICON_OPTIONS = [
  'Award', 'BookOpen', 'Cpu', 'Code2', 'Globe', 'Rocket', 'Star', 'Zap',
  'Users', 'Trophy', 'Shield', 'Wifi', 'Server', 'Palette', 'Video',
  'Terminal', 'GraduationCap', 'Sparkles', 'Download', 'MapPin',
  'Heart', 'Briefcase', 'Coffee', 'Smile',
]

const iconMap = {
  Award, BookOpen, Cpu, Code2, Globe, Rocket, Star, Zap,
  Users, Trophy, Shield, Wifi, Server, Palette, Video,
  Terminal, GraduationCap: () => null, Sparkles, Download, MapPin,
  Heart, Briefcase, Coffee, Smile,
}

const STORY_PILLAR_TEMPLATES = [
  { title: 'Education & Background', key: 'educationBackground', defaultContent: '' },
  { title: 'Professional Focus', key: 'professionalFocus', defaultContent: '' },
  { title: 'Expertise Areas', key: 'expertiseAreas', defaultContent: '' },
  { title: 'Mission & Approach', key: 'missionApproach', defaultContent: '' },
]

function getIconComponent(name) {
  const Icon = iconMap[name]
  return Icon || Award
}

const quillModules = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'code-block'],
    ['clean'],
  ],
}

const quillFormats = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'list', 'bullet', 'link', 'code-block',
]

function SyncBadge({ synced }) {
  if (synced) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
        <CheckCircle size={10} />
        Saved
      </span>
    )
  }
  return null
}

function Card({ children, className = '' }) {
  return (
    <div className={`bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 space-y-5 ${className}`}>
      {children}
    </div>
  )
}

function SectionHeader({ title, synced, badge }) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-2">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
        {synced !== undefined && <SyncBadge synced={synced} />}
      </div>
      {badge}
    </div>
  )
}

function EmptyState({ message }) {
  return <p className="text-sm text-gray-400 italic">{message}</p>
}

function EntryActions({ onRemove, onMoveUp, onMoveDown, isFirst, isLast }) {
  return (
    <div className="flex items-center gap-1">
      {onMoveUp && (
        <button type="button" onClick={onMoveUp} disabled={isFirst} className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <ArrowUp size={14} />
        </button>
      )}
      {onMoveDown && (
        <button type="button" onClick={onMoveDown} disabled={isLast} className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <ArrowDown size={14} />
        </button>
      )}
      {onRemove && (
        <button type="button" onClick={onRemove} className="p-1 rounded text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
          <Trash2 size={14} />
        </button>
      )}
    </div>
  )
}

export default function AboutContent() {
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    yearsOfExperience: 0,
    status: 'active',
    education: [],
    experience: [],
    certifications: [],
    storyPillars: STORY_PILLAR_TEMPLATES.map((t) => ({ title: t.title, content: '' })),
    idePresentation: { skills: ['React', 'Node'], available: true, location: '' },
    highlightMetrics: [
      { icon: 'Award', title: 'Network Designer', value: '' },
      { icon: 'Users', title: 'Happy Clients', value: '50+' },
      { icon: 'TrendingUp', title: 'Years Experience', value: '5+' },
    ],
  })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    ;(async () => {
      try {
        const { content } = await getAboutContent()
        if (content) {
          setForm({
            title: content.title || '',
            subtitle: content.subtitle || '',
            yearsOfExperience: content.yearsOfExperience || 0,
            status: content.status || 'active',
            education: content.education || [],
            experience: content.experience || [],
            certifications: content.certifications || [],
            storyPillars: content.storyPillars?.length
              ? content.storyPillars
              : STORY_PILLAR_TEMPLATES.map((t) => ({ title: t.title, content: '' })),
            idePresentation: content.idePresentation || { skills: ['React', 'Node'], available: true, location: '' },
            highlightMetrics: content.highlightMetrics?.length
              ? content.highlightMetrics
              : [
                  { icon: 'Award', title: 'Network Designer', value: '' },
                  { icon: 'Users', title: 'Happy Clients', value: '50+' },
                  { icon: 'TrendingUp', title: 'Years Experience', value: '5+' },
                ],
          })
        }
      } catch {
        setToast({ message: 'Failed to load about content', type: 'error' })
      } finally {
        setFetching(false)
      }
    })()
  }, [])

  const set = useCallback((field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
  }, [])

  const addItem = useCallback((key, empty) => {
    setForm((prev) => ({ ...prev, [key]: [...prev[key], { ...empty }] }))
  }, [])

  const removeItem = useCallback((key, idx) => {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== idx),
    }))
  }, [])

  const updateItem = useCallback((key, idx, field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((prev) => {
      const items = [...prev[key]]
      items[idx] = { ...items[idx], [field]: value }
      return { ...prev, [key]: items }
    })
  }, [])

  const moveItem = useCallback((key, idx, direction) => {
    setForm((prev) => {
      const items = [...prev[key]]
      const target = idx + direction
      if (target < 0 || target >= items.length) return prev
      ;[items[idx], items[target]] = [items[target], items[idx]]
      return { ...prev, [key]: items }
    })
  }, [])

  const updatePillarContent = useCallback((idx, content) => {
    setForm((prev) => {
      const pillars = [...prev.storyPillars]
      pillars[idx] = { ...pillars[idx], content }
      return { ...prev, storyPillars: pillars }
    })
  }, [])

  const addSkill = useCallback(() => {
    setForm((prev) => ({
      ...prev,
      idePresentation: {
        ...prev.idePresentation,
        skills: [...prev.idePresentation.skills, ''],
      },
    }))
  }, [])

  const updateSkill = useCallback((idx, value) => {
    setForm((prev) => {
      const skills = [...prev.idePresentation.skills]
      skills[idx] = value
      return { ...prev, idePresentation: { ...prev.idePresentation, skills } }
    })
  }, [])

  const removeSkill = useCallback((idx) => {
    setForm((prev) => ({
      ...prev,
      idePresentation: {
        ...prev.idePresentation,
        skills: prev.idePresentation.skills.filter((_, i) => i !== idx),
      },
    }))
  }, [])

  const updateMetric = useCallback((idx, field) => (e) => {
    const value = e.target.value
    setForm((prev) => {
      const metrics = [...prev.highlightMetrics]
      metrics[idx] = { ...metrics[idx], [field]: value }
      return { ...prev, highlightMetrics: metrics }
    })
  }, [])

  const storyPillarsSynced = form.storyPillars.some((p) => p.content && p.content !== '<p><br></p>')

  const ideSkillsSynced = form.idePresentation.skills.length > 0 &&
    (form.idePresentation.skills[0] !== 'React' || form.idePresentation.skills.length > 2 ||
     form.idePresentation.skills.some((s) => s && s !== 'React' && s !== 'Node'))

  const metricsSynced = form.highlightMetrics.some((m) => m.value && m.value !== '50+' && m.value !== '5+')

  const certsSynced = form.certifications.length > 0 && form.certifications.some((c) => c.title)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData()
    fd.append('title', form.title)
    fd.append('subtitle', form.subtitle)
    fd.append('yearsOfExperience', form.yearsOfExperience)
    fd.append('status', form.status)
    fd.append('education', JSON.stringify(form.education))
    fd.append('experience', JSON.stringify(form.experience))
    fd.append('certifications', JSON.stringify(form.certifications))
    fd.append('storyPillars', JSON.stringify(form.storyPillars))
    fd.append('idePresentation', JSON.stringify(form.idePresentation))
    fd.append('highlightMetrics', JSON.stringify(form.highlightMetrics))
    try {
      await updateAboutContent(fd)
      setToast({ message: 'About content updated successfully', type: 'success' })
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to update about content', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const emptyCert = { title: '', verificationUrl: '', displayOrder: 0 }

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
          {/* ────────────── LEFT COLUMN ────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* ── 1. Story Pillars ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <SectionHeader title="Story Pillars" synced={storyPillarsSynced} />
                <p className="text-xs text-gray-500 dark:text-gray-400 -mt-3 leading-relaxed">
                  These 4 narrative blocks map directly to the cards on your public About page.
                  Write in your own voice — bold, italic, and lists are supported.
                </p>
                <div className="space-y-5">
                  {STORY_PILLAR_TEMPLATES.map((tpl, idx) => (
                    <div key={tpl.key} className="p-4 rounded-xl border border-gray-200 dark:border-slate-700 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-500/10 text-xs flex items-center justify-center font-black">
                            {idx + 1}
                          </span>
                          {tpl.title}
                        </span>
                      </div>
                      <div className="quill-editor-min-h">
                        <ReactQuill
                          theme="snow"
                          value={form.storyPillars[idx]?.content || ''}
                          onChange={(val) => updatePillarContent(idx, val)}
                          modules={quillModules}
                          formats={quillFormats}
                          placeholder={`Write about your ${tpl.title.toLowerCase()}...`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* ── 2. IDE Presentation ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <Card>
                <SectionHeader
                  title="IDE Presentation"
                  synced={ideSkillsSynced}
                  badge={
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                      <Terminal size={12} />
                      Controls `const developer = {'{'}` block
                    </span>
                  }
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                      <Code2 size={12} className="inline mr-1" />
                      Skills Array
                    </label>
                    <div className="space-y-1.5">
                      {form.idePresentation.skills.map((skill, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <GripVertical size={12} className="text-gray-300 shrink-0" />
                          <input
                            type="text"
                            value={skill}
                            onChange={(e) => updateSkill(idx, e.target.value)}
                            placeholder="e.g. TypeScript"
                            className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                          <button type="button" onClick={() => removeSkill(idx)} className="p-1 rounded text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                            <XIcon size={12} />
                          </button>
                        </div>
                      ))}
                      <button type="button" onClick={addSkill} className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                        <Plus size={12} /> Add Skill
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                      <ToggleLeft size={12} className="inline mr-1" />
                      Available Status
                    </label>
                    <select
                      value={form.idePresentation.available ? 'true' : 'false'}
                      onChange={(e) => setForm((prev) => ({
                        ...prev,
                        idePresentation: { ...prev.idePresentation, available: e.target.value === 'true' },
                      }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="true">Available (true)</option>
                      <option value="false">Unavailable (false)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                      <Globe size={12} className="inline mr-1" />
                      Location (override)
                    </label>
                    <input
                      type="text"
                      value={form.idePresentation.location}
                      onChange={(e) => setForm((prev) => ({
                        ...prev,
                        idePresentation: { ...prev.idePresentation, location: e.target.value },
                      }))}
                      placeholder="Leave blank to use Profile location"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <p className="text-xs text-gray-400 mt-1">Overrides the location synced from Admin Profile.</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* ── 3. Education ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Education</h2>
                  <button type="button" onClick={() => addItem('education', { degree: '', institution: '', year: '' })} className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                    <Plus size={16} /> Add Education
                  </button>
                </div>
                {form.education.length === 0 && <EmptyState message="No education entries yet." />}
                {form.education.map((edu, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-gray-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-600 dark:text-gray-400">Entry {idx + 1}</span>
                      <EntryActions
                        onRemove={() => removeItem('education', idx)}
                        onMoveUp={() => moveItem('education', idx, -1)}
                        onMoveDown={() => moveItem('education', idx, 1)}
                        isFirst={idx === 0}
                        isLast={idx === form.education.length - 1}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <input type="text" value={edu.degree} onChange={updateItem('education', idx, 'degree')} placeholder="Degree" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                      <input type="text" value={edu.institution} onChange={updateItem('education', idx, 'institution')} placeholder="Institution" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                      <input type="text" value={edu.year} onChange={updateItem('education', idx, 'year')} placeholder="Year" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                    </div>
                  </div>
                ))}
              </Card>
            </motion.div>

            {/* ── 4. Experience ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Card>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Experience</h2>
                  <button type="button" onClick={() => addItem('experience', { role: '', company: '', duration: '', description: '' })} className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                    <Plus size={16} /> Add Experience
                  </button>
                </div>
                {form.experience.length === 0 && <EmptyState message="No experience entries yet." />}
                {form.experience.map((exp, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-gray-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-600 dark:text-gray-400">Entry {idx + 1}</span>
                      <EntryActions
                        onRemove={() => removeItem('experience', idx)}
                        onMoveUp={() => moveItem('experience', idx, -1)}
                        onMoveDown={() => moveItem('experience', idx, 1)}
                        isFirst={idx === 0}
                        isLast={idx === form.experience.length - 1}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" value={exp.role} onChange={updateItem('experience', idx, 'role')} placeholder="Role" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                      <input type="text" value={exp.company} onChange={updateItem('experience', idx, 'company')} placeholder="Company" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                    </div>
                    <input type="text" value={exp.duration} onChange={updateItem('experience', idx, 'duration')} placeholder="Duration" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                    <textarea value={exp.description} onChange={updateItem('experience', idx, 'description')} rows={2} placeholder="Description" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
                  </div>
                ))}
              </Card>
            </motion.div>

            {/* ── 5. Certifications ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <SectionHeader title="Professional Certifications & Badges" synced={certsSynced} />
                <p className="text-xs text-gray-500 dark:text-gray-400 -mt-3 leading-relaxed">
                  These appear as the bolded trailing list on the public About page.
                </p>
                {form.certifications.length === 0 && <EmptyState message="No certifications added yet." />}
                {form.certifications.map((cert, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-gray-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <Award size={14} className="text-amber-500" />
                        Certification #{idx + 1}
                      </span>
                      <EntryActions
                        onRemove={() => removeItem('certifications', idx)}
                        onMoveUp={() => moveItem('certifications', idx, -1)}
                        onMoveDown={() => moveItem('certifications', idx, 1)}
                        isFirst={idx === 0}
                        isLast={idx === form.certifications.length - 1}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input type="text" value={cert.title} onChange={updateItem('certifications', idx, 'title')} placeholder="Certification title" className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                      <div className="relative">
                        <Link size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <input type="url" value={cert.verificationUrl} onChange={updateItem('certifications', idx, 'verificationUrl')} placeholder="Verification URL (optional)" className="w-full pl-8 pr-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                      </div>
                      <div className="relative">
                        <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <input type="number" value={cert.displayOrder} onChange={updateItem('certifications', idx, 'displayOrder')} placeholder="Display order" className="w-full pl-8 pr-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                      </div>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={() => addItem('certifications', { ...emptyCert, displayOrder: form.certifications.length + 1 })} className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                  <Plus size={16} /> Add Certification
                </button>
              </Card>
            </motion.div>
          </div>

          {/* ────────────── RIGHT COLUMN ────────────── */}
          <div className="space-y-6">

            {/* ── Highlight Metrics Row ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <SectionHeader title="Highlight Metrics" synced={metricsSynced} />
                <p className="text-xs text-gray-500 dark:text-gray-400 -mt-3 leading-relaxed">
                  These 3 counters render at the bottom of the code terminal preview.
                </p>
                <div className="space-y-4">
                  {form.highlightMetrics.map((metric, idx) => {
                    const Icon = getIconComponent(metric.icon)
                    return (
                      <div key={idx} className="p-3 rounded-xl border border-gray-200 dark:border-slate-700 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Metric #{idx + 1}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-medium text-gray-400 mb-0.5">Icon</label>
                            <select
                              value={metric.icon}
                              onChange={updateMetric(idx, 'icon')}
                              className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                            >
                              {ICON_OPTIONS.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-medium text-gray-400 mb-0.5">Title</label>
                            <input
                              type="text"
                              value={metric.title}
                              onChange={updateMetric(idx, 'title')}
                              placeholder="e.g. Network Designer"
                              className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-gray-400 mb-0.5">Value</label>
                          <input
                            type="text"
                            value={metric.value}
                            onChange={updateMetric(idx, 'value')}
                            placeholder="e.g. 50+"
                            className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                          <Icon size={16} className="text-primary shrink-0" />
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Preview: <strong className="text-gray-700 dark:text-gray-200">{metric.title || 'Title'}</strong>
                            {metric.value && <span className="ml-1 text-primary font-bold">{metric.value}</span>}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>
            </motion.div>

            {/* ── Settings ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <SectionHeader title="Settings" />
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Title</label>
                    <input type="text" value={form.title} onChange={set('title')} placeholder="e.g. Get to Know Me" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Subtitle</label>
                    <input type="text" value={form.subtitle} onChange={set('subtitle')} placeholder="e.g. A passionate developer..." className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Status</label>
                    <select value={form.status} onChange={set('status')} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </Card>
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

function XIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}
