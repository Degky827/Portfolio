import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Save, RefreshCw, Plus, Trash2, ArrowUp, ArrowDown,
  Award, Eye, EyeOff, Link, GripVertical, Terminal,
  BookOpen, Cpu, Globe, Zap, Code2, X, GraduationCap, Target,
  Briefcase, CheckCircle,
} from 'lucide-react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import PageHeader from '../shared/PageHeader'
import Toast from '../shared/Toast'
import ConfirmModal from '../shared/ConfirmModal'
import ImageUpload from '../shared/ImageUpload'
import { getAboutContent, updateAboutContent } from '../../shared/services/aboutService'
import { getMediaUrl } from '../../shared/services/api'

const STORY_PILLARS = [
  { key: 'educationBackground', title: 'Education & Background', icon: GraduationCap, color: 'indigo' },
  { key: 'professionalFocus', title: 'Professional Focus', icon: Briefcase, color: 'cyan' },
  { key: 'expertiseAreas', title: 'Expertise Areas', icon: Cpu, color: 'violet' },
  { key: 'missionApproach', title: 'Mission & Approach', icon: Target, color: 'emerald' },
]

const PILLAR_COLORS = {
  indigo: { bg: 'bg-indigo-50 dark:bg-indigo-500/10', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-200 dark:border-indigo-800' },
  cyan: { bg: 'bg-cyan-50 dark:bg-cyan-500/10', text: 'text-cyan-600 dark:text-cyan-400', border: 'border-cyan-200 dark:border-cyan-800' },
  violet: { bg: 'bg-violet-50 dark:bg-violet-500/10', text: 'text-violet-600 dark:text-violet-400', border: 'border-violet-200 dark:border-violet-800' },
  emerald: { bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800' },
}

const PILLAR_ICONS_HTML = ['🎓', '💼', '⚡', '🎯']

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

/* ─── Shared Components ─── */

function Field({ label, children, hint }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
        {label}
      </label>
      {children}
      {hint && <p className="text-[10px] text-gray-400 mt-1">{hint}</p>}
    </div>
  )
}

function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow ${className}`}
      {...props}
    />
  )
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

/* ─── Main Component ─── */

export default function AboutContent() {
  const [form, setForm] = useState({
    title: 'Get to Know Me',
    subtitle: '',
    profileImage: '',
    storyPillars: STORY_PILLARS.map((p) => ({ title: p.title, content: '' })),
    idePresentation: { skills: ['React', 'Node'], available: true, location: '' },
    certifications: [],
  })
  const [initialForm, setInitialForm] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [toast, setToast] = useState(null)
  const [showPreview, setShowPreview] = useState(false)
  const [confirmSave, setConfirmSave] = useState(false)
  const [confirmDiscard, setConfirmDiscard] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const { content } = await getAboutContent()
        if (content) {
          const loaded = {
            title: content.title || 'Get to Know Me',
            subtitle: content.subtitle || '',
            profileImage: content.profileImage || '',
            storyPillars: STORY_PILLARS.map((tpl, i) => ({
              title: content.storyPillars?.[i]?.title || tpl.title,
              content: content.storyPillars?.[i]?.content || '',
            })),
            idePresentation: content.idePresentation || { skills: ['React', 'Node'], available: true, location: '' },
            certifications: content.certifications || [],
          }
          setForm(loaded)
          setInitialForm(JSON.parse(JSON.stringify(loaded)))
        }
      } catch {
        setToast({ message: 'Failed to load about content', type: 'error' })
      } finally {
        setFetching(false)
      }
    })()
  }, [])

  const isDirty = initialForm && JSON.stringify(form) !== JSON.stringify(initialForm)

  const set = useCallback((field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }, [])

  const updatePillarContent = useCallback((idx, value) => {
    setForm((prev) => {
      const pillars = [...prev.storyPillars]
      pillars[idx] = { ...pillars[idx], content: value }
      return { ...prev, storyPillars: pillars }
    })
  }, [])

  const addSkill = useCallback(() => {
    setForm((prev) => ({
      ...prev,
      idePresentation: { ...prev.idePresentation, skills: [...prev.idePresentation.skills, ''] },
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
      idePresentation: { ...prev.idePresentation, skills: prev.idePresentation.skills.filter((_, i) => i !== idx) },
    }))
  }, [])

  const addCert = useCallback(() => {
    setForm((prev) => ({
      ...prev,
      certifications: [...prev.certifications, { title: '', verificationUrl: '', displayOrder: prev.certifications.length + 1 }],
    }))
  }, [])

  const updateCert = useCallback((idx, field) => (e) => {
    setForm((prev) => {
      const certs = [...prev.certifications]
      certs[idx] = { ...certs[idx], [field]: field === 'displayOrder' ? parseInt(e.target.value) || 0 : e.target.value }
      return { ...prev, certifications: certs }
    })
  }, [])

  const removeCert = useCallback((idx) => {
    setForm((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== idx),
    }))
  }, [])

  const moveCert = useCallback((idx, dir) => {
    setForm((prev) => {
      const certs = [...prev.certifications]
      const target = idx + dir
      if (target < 0 || target >= certs.length) return prev
      ;[certs[idx], certs[target]] = [certs[target], certs[idx]]
      return { ...prev, certifications: certs }
    })
  }, [])

  const handleDiscard = useCallback(() => {
    if (initialForm) setForm(JSON.parse(JSON.stringify(initialForm)))
    setConfirmDiscard(false)
    setToast({ message: 'Changes discarded', type: 'info' })
  }, [initialForm])

  const handleSubmit = async () => {
    setConfirmSave(false)
    setLoading(true)
    const fd = new FormData()
    fd.append('title', form.title)
    fd.append('subtitle', form.subtitle)
    fd.append('profileImage', form.profileImage)
    fd.append('storyPillars', JSON.stringify(form.storyPillars))
    fd.append('idePresentation', JSON.stringify(form.idePresentation))
    fd.append('certifications', JSON.stringify(form.certifications))
    try {
      await updateAboutContent(fd)
      setInitialForm(JSON.parse(JSON.stringify(form)))
      setToast({ message: 'About content saved successfully', type: 'success' })
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to save', type: 'error' })
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
      <PageHeader title="About Content" subtitle="Manage the About section — title, story cards, IDE presentation, and certifications." />

      {/* ── Action Bar ── */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowPreview((p) => !p)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
          >
            {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
            {showPreview ? 'Hide Preview' : 'Preview'}
          </button>
          {isDirty && (
            <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              Unsaved Changes
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {isDirty && (
            <button type="button" onClick={() => setConfirmDiscard(true)} className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
              Discard
            </button>
          )}
          <button
            type="button"
            onClick={() => setConfirmSave(true)}
            disabled={loading || !isDirty}
            className="px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* ── Live Preview ── */}
      <AnimatePresence>
        {showPreview && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="mb-6 overflow-hidden">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-lg">
              <div className="flex items-center justify-between px-6 py-3 bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
                <span className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Eye size={16} />
                  About Section Preview
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">LIVE</span>
                </span>
                <button onClick={() => setShowPreview(false)} className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
                  <X size={16} className="text-gray-400" />
                </button>
              </div>
              <div className="relative overflow-hidden" style={{ minHeight: '400px' }}>
                <iframe
                  key={JSON.stringify({ ...form, profileImageUrl: getMediaUrl(form.profileImage) })}
                  srcDoc={`<!DOCTYPE html><html><head><style>
                    *{margin:0;padding:0;box-sizing:border-box}
                    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#0f172a;color:#e2e8f0;padding:40px 20px}
                    .h{text-align:center;margin-bottom:32px}
                    .badge{display:inline-block;padding:4px 12px;background:rgba(99,102,241,.15);color:#818cf8;border-radius:20px;font-size:.65rem;font-weight:600;letter-spacing:.15em;text-transform:uppercase;margin-bottom:10px}
                    h1{font-size:1.8rem;font-weight:800;color:#f8fafc;margin-bottom:6px}
                    .sub{color:#94a3b8;font-size:.9rem;max-width:500px;margin:0 auto}
                    .line{display:flex;align-items:center;justify-content:center;gap:10px;margin:20px 0}
                    .line div:first-child,.line div:last-child{width:32px;height:1px;background:#334155}
                    .line div:nth-child(2){width:5px;height:5px;background:#6366f1;transform:rotate(45deg)}
                    .grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;max-width:800px;margin:0 auto 32px}
                    .card{padding:18px;border-radius:14px;border:1px solid #1e293b;background:rgba(30,41,59,.5)}
                    .card .icon{font-size:18px;margin-bottom:8px}
                    .card h3{font-size:.85rem;font-weight:700;color:#f1f5f9;margin-bottom:6px}
                    .card p{font-size:.75rem;color:#94a3b8;line-height:1.5}
                    .stitle{font-size:1rem;font-weight:700;color:#f1f5f9;margin-bottom:12px;text-align:center}
                    .certs{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;max-width:800px;margin:0 auto 24px}
                    .cert{padding:8px 14px;border-radius:8px;border:1px solid #1e293b;background:rgba(30,41,59,.4);font-size:.7rem;color:#e2e8f0;font-weight:600}
                    .metrics{display:flex;justify-content:center;gap:24px;margin:20px auto;max-width:500px}
                    .metric{text-align:center}
                    .metric .val{font-size:1.2rem;font-weight:800;color:#818cf8}
                    .metric .lbl{font-size:.65rem;color:#64748b;margin-top:2px}
                    .ide{max-width:500px;margin:20px auto;padding:16px;border-radius:12px;background:#1e1e1e;border:1px solid #333;font-family:'Fira Code',monospace}
                    .ide .bar{display:flex;gap:5px;margin-bottom:10px}
                    .ide .dot{width:8px;height:8px;border-radius:50%}
                    .ide .dot.r{background:#ff5f57}.ide .dot.y{background:#febc2e}.ide .dot.g{background:#28c840}
                    .ide .line{color:#94a3b8;font-size:.7rem;line-height:1.8}
                    .ide .kw{color:#c586c0}.ide .str{color:#ce9178}.ide .fn{color:#dcdcaa}.ide .cm{color:#6a9955}.ide .var{color:#9cdcfe}
                    .photo-wrap{display:flex;justify-content:center;margin:20px auto}
                    .photo{width:80px;height:80px;border-radius:50%;border:2px solid #334155;object-fit:cover;background:#1e293b}
                  </style></head><body>
                    <div class="h">
                      <div class="badge">ABOUT ME</div>
                      <h1>${form.title || 'Get to Know Me'}</h1>
                      <p class="sub">${form.subtitle || ''}</p>
                      <div class="line"><div></div><div></div><div></div></div>
                    </div>
                    <div class="grid">
                      ${form.storyPillars.map((p, i) => '<div class="card"><div class="icon">' + PILLAR_ICONS_HTML[i] + '</div><h3>' + (p.title || STORY_PILLARS[i].title) + '</h3><p>' + (p.content || '').replace(/<[^>]+>/g, '').substring(0, 100) + '</p></div>').join('')}
                    </div>
                    ${form.idePresentation.skills.length ? '<div class="stitle">Skills</div><div style="text-align:center;margin-bottom:24px">' + form.idePresentation.skills.filter(Boolean).map(s => '<span style="display:inline-block;padding:3px 10px;background:rgba(99,102,241,.12);color:#818cf8;border-radius:6px;font-size:.7rem;margin:2px">' + s + '</span>').join('') + '</div>' : ''}
                    <div class="photo-wrap">${form.profileImage ? '<img class="photo" src="' + getMediaUrl(form.profileImage) + '" alt="Profile" />' : '<div class="photo" style="display:flex;align-items:center;justify-content:center;color:#64748b;font-size:24px">👤</div>'}</div>
                    <div class="ide">
                      <div class="bar"><div class="dot r"></div><div class="dot y"></div><div class="dot g"></div></div>
                      <div class="line"><span class="kw">const</span> <span class="var">developer</span> = {</div>
                      <div class="line">&nbsp;&nbsp;name: <span class="str">"Developer"</span>,</div>
                      <div class="line">&nbsp;&nbsp;location: <span class="str">"${form.idePresentation.location || 'Location'}"</span>,</div>
                      <div class="line">&nbsp;&nbsp;skills: [${form.idePresentation.skills.filter(Boolean).map(s => '<span class="str">"' + s + '"</span>').join(', ')}],</div>
                      <div class="line">&nbsp;&nbsp;available: <span class="fn">${form.idePresentation.available}</span></div>
                      <div class="line">}</div>
                    </div>
                    ${form.certifications.length ? '<div class="stitle" style="margin-top:24px">Certifications</div><div class="certs">' + form.certifications.map(c => '<div class="cert">🏆 ' + (c.title || 'Cert') + '</div>').join('') + '</div>' : ''}
                  </body></html>`}
                  style={{ width: '100%', border: 'none', minHeight: '400px' }}
                  title="About Preview"
                  sandbox="allow-same-origin"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">

        {/* ═══════ 1. PAGE HEADER ═══════ */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6">
            <div className="flex items-start gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <BookOpen size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Section Header</h3>
                <p className="text-xs text-gray-400 mt-0.5">Title and subtitle at the top of the About section</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Title" hint="Main heading (e.g. Get to Know Me)">
                <Input value={form.title} onChange={set('title')} placeholder="Get to Know Me" />
              </Field>
              <Field label="Subtitle" hint="Tagline below the title">
                <Input value={form.subtitle} onChange={set('subtitle')} placeholder="A passionate developer crafting digital experiences" />
              </Field>
            </div>
            <div className="mt-4">
              <ImageUpload
                value={form.profileImage}
                onChange={(url) => setForm((prev) => ({ ...prev, profileImage: url }))}
                label="Profile Photo"
                folder="about"
              />
              <p className="text-[10px] text-gray-400 mt-1.5">This photo appears in the code terminal on the public About page.</p>
            </div>
          </div>
        </motion.div>

        {/* ═══════ 2. STORY CARDS ═══════ */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6">
            <div className="flex items-start gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Zap size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Story Cards</h3>
                <p className="text-xs text-gray-400 mt-0.5">Four narrative cards on the public About page. Only plain text is shown (HTML is stripped).</p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {STORY_PILLARS.map((pillar, idx) => {
                const colors = PILLAR_COLORS[pillar.color]
                return (
                  <div key={pillar.key} className={`p-4 rounded-xl border ${colors.border} space-y-3`}>
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg ${colors.bg} ${colors.text} flex items-center justify-center text-sm`}>
                        {PILLAR_ICONS_HTML[idx]}
                      </div>
                      <span className={`text-sm font-bold ${colors.text}`}>{pillar.title}</span>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Content</label>
                      <div className="quill-editor-min-h">
                        <ReactQuill
                          theme="snow"
                          value={form.storyPillars[idx]?.content || ''}
                          onChange={(val) => updatePillarContent(idx, val)}
                          modules={quillModules}
                          formats={quillFormats}
                          placeholder={`Write about ${pillar.title.toLowerCase()}...`}
                        />
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1">Note: HTML formatting is stripped on the public site. Only plain text is displayed.</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* ═══════ 3. IDE PRESENTATION ═══════ */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6">
            <div className="flex items-start gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center shrink-0">
                <Terminal size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">IDE Presentation</h3>
                <p className="text-xs text-gray-400 mt-0.5">Controls the code terminal block shown on the public About page</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Field label="Skills Array" hint="Displayed in the code block">
                  <div className="space-y-1.5">
                    {form.idePresentation.skills.map((skill, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <GripVertical size={12} className="text-gray-300 shrink-0" />
                        <Input value={skill} onChange={(e) => updateSkill(idx, e.target.value)} placeholder="e.g. TypeScript" className="!py-1.5 text-sm" />
                        <button type="button" onClick={() => removeSkill(idx)} className="p-1 rounded text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={addSkill} className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                      <Plus size={12} /> Add Skill
                    </button>
                  </div>
                </Field>
              </div>
              <div>
                <Field label="Available Status">
                  <select
                    value={form.idePresentation.available ? 'true' : 'false'}
                    onChange={(e) => setForm((prev) => ({ ...prev, idePresentation: { ...prev.idePresentation, available: e.target.value === 'true' } }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="true">Available</option>
                    <option value="false">Unavailable</option>
                  </select>
                </Field>
              </div>
              <div>
                <Field label="Location" hint="Shown in the code block">
                  <Input
                    value={form.idePresentation.location}
                    onChange={(e) => setForm((prev) => ({ ...prev, idePresentation: { ...prev.idePresentation, location: e.target.value } }))}
                    placeholder="e.g. Bahirdar"
                  />
                </Field>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ═══════ 4. CERTIFICATIONS ═══════ */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Award size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">Certifications & Badges</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Displayed in the certificate gallery on the public About page</p>
                </div>
              </div>
              <button type="button" onClick={addCert} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-primary hover:bg-primary/10 transition-colors">
                <Plus size={14} /> Add
              </button>
            </div>
            {form.certifications.length === 0 && <p className="text-sm text-gray-400 italic">No certifications added yet.</p>}
            <div className="space-y-3">
              {form.certifications.map((cert, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-gray-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                      <Award size={12} className="text-amber-500" />
                      #{idx + 1}
                    </span>
                    <EntryActions
                      onRemove={() => removeCert(idx)}
                      onMoveUp={() => moveCert(idx, -1)}
                      onMoveDown={() => moveCert(idx, 1)}
                      isFirst={idx === 0}
                      isLast={idx === form.certifications.length - 1}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Input value={cert.title} onChange={updateCert(idx, 'title')} placeholder="Certification title" />
                    <div className="relative">
                      <Link size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <input type="url" value={cert.verificationUrl} onChange={updateCert(idx, 'verificationUrl')} placeholder="Verification URL" className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                    </div>
                    <Input type="number" value={cert.displayOrder} onChange={updateCert(idx, 'displayOrder')} placeholder="Display order" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Modals ── */}
      <ConfirmModal
        open={confirmSave}
        title="Save About Content"
        message="Save all changes to the about section?"
        onConfirm={handleSubmit}
        onCancel={() => setConfirmSave(false)}
        loading={loading}
        confirmText="Save"
        variant="primary"
      />
      <ConfirmModal
        open={confirmDiscard}
        title="Discard Changes"
        message="All unsaved changes will be lost. Continue?"
        onConfirm={handleDiscard}
        onCancel={() => setConfirmDiscard(false)}
        loading={false}
        confirmText="Discard"
        variant="danger"
      />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
