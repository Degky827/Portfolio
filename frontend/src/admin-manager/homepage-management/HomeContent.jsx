import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Save, RefreshCw, Undo2, ExternalLink,
  Home, CheckCircle2, Circle, ChevronDown, ChevronUp,
  Type, MousePointer, ToggleLeft, ToggleRight,
  Cpu, BarChart3, Plus, Trash2, GripVertical,
  Search, ArrowUp, ArrowDown, Award, X,
} from 'lucide-react'
import PageHeader from '../shared/PageHeader'
import Toast from '../shared/Toast'
import ConfirmModal from '../shared/ConfirmModal'
import { getHomeContent, updateHomeContent } from '../../shared/services/homeContentService'
import { updateSiteSettings } from '../../shared/services/siteSettingsService'
import { updateNavbarSettings } from '../../shared/services/navigationService'
import { updateFooterContent } from '../../shared/services/footerService'
import { getMediaUrl } from '../../shared/services/api'
import { useAuth } from '../authentication/AuthContext'
import { useSiteSettings } from '../../shared/context/SiteSettingsContext'

const URL_PATTERN = /^(https?:\/\/.+|\/.*|#.*)?$/

const ICON_OPTIONS = [
  'Award', 'BookOpen', 'Cpu', 'Code2', 'Globe', 'Rocket', 'Star', 'Zap',
  'Users', 'Trophy', 'Shield', 'Wifi', 'Server', 'Palette', 'Video',
  'Terminal', 'GraduationCap', 'Sparkles', 'Download', 'MapPin',
  'Heart', 'Briefcase', 'Coffee', 'Smile',
]

const TABS = [
  { id: 'hero', label: 'Hero', icon: Home },
  { id: 'technologies', label: 'Technologies', icon: Cpu },
  { id: 'statistics', label: 'Statistics', icon: BarChart3 },
]

const defaultForm = {
  hero: {
    eyebrow: 'WELCOME TO MY DIGITAL SPACE',
    greeting: "Hi, I'm",
    fullName: 'Desalegn',
    nameAmharic: 'ደካ',
    professionalBadge: 'Student Developer',
    typingWords: [],
    description: '',
    shortIntroduction: '',
    profilePhoto: { url: '', alt: '' },
    primaryCtaText: 'Explore My Work',
    primaryCtaUrl: '#projects',
    secondaryCtaText: 'Get In Touch',
    secondaryCtaUrl: '#contact',
    showEyebrow: true,
    showGreeting: true,
    showName: true,
    showTitle: true,
    showDescription: true,
    showPrimaryCta: true,
    showSecondaryCta: true,
    ctaButtons: [],
  },
  technologies: [],
  statistics: [],
  published: false,
}

/* ─── Shared UI Components ─── */

function SkeletonLoader() {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gray-200 dark:bg-slate-700 animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
            <div className="h-3 w-48 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
          </div>
        </div>
        <div className="mt-6 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-gray-100 dark:bg-slate-800 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
}

function Field({ label, children, hint, required }) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">{hint}</p>}
    </div>
  )
}

function Input({ value, onChange, placeholder, type = 'text', className = '', disabled = false }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    />
  )
}

function Textarea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      rows={rows}
      placeholder={placeholder}
      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none text-sm"
    />
  )
}

function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div className="relative">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" />
        <div className="w-10 h-5 rounded-full bg-gray-200 dark:bg-slate-700 peer-checked:bg-primary transition-colors" />
        <div className="absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white shadow-sm peer-checked:translate-x-5 transition-transform" />
      </div>
      {label && <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{label}</span>}
    </label>
  )
}

function UrlInput({ value, onChange, placeholder, disabled = false }) {
  const isValid = !value || URL_PATTERN.test(value)
  return (
    <div>
      <Input value={value} onChange={onChange} placeholder={placeholder} disabled={disabled} className={!isValid ? 'border-red-400 focus:ring-red-400/50' : ''} />
      {!isValid && <p className="text-xs text-red-500 mt-1">Enter a valid URL (https://... , /path, or #anchor)</p>}
    </div>
  )
}

function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center mb-4">
        <Icon size={24} className="text-gray-400" />
      </div>
      <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">{title}</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mb-4">{description}</p>
      {action}
    </div>
  )
}

/* ─── Hero Section Panel ─── */

function HeroPanel({ form, updateForm }) {
  const [expanded, setExpanded] = useState(true)
  const h = form.hero

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-6 pb-4 border-b border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Home size={18} />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Hero Section</h3>
            <p className="text-xs text-gray-400 mt-0.5">Eyebrow, greeting, name, title, description, and CTAs</p>
          </div>
        </div>
        <div className="text-gray-400">{expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</div>
      </button>

      {expanded && (
        <div className="p-6 space-y-6">
          {/* Eyebrow */}
          <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-700/50 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Type size={14} className="text-primary" />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Eyebrow</span>
              </div>
              <Toggle checked={h.showEyebrow} onChange={(v) => updateForm('hero.showEyebrow', v)} label="Show" />
            </div>
            <Input value={h.eyebrow} onChange={(e) => updateForm('hero.eyebrow', e.target.value)} placeholder="WELCOME TO MY DIGITAL SPACE" disabled={!h.showEyebrow} />
          </div>

          {/* Greeting & Name */}
          <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-700/50 space-y-4">
            <div className="flex items-center gap-2">
              <Type size={14} className="text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Greeting & Name</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Field label="Greeting" required>
                  <Input value={h.greeting} onChange={(e) => updateForm('hero.greeting', e.target.value)} placeholder="Hi, I'm" />
                </Field>
                <Toggle checked={h.showGreeting} onChange={(v) => updateForm('hero.showGreeting', v)} label="" />
              </div>
              <div className="flex items-center justify-between">
                <Field label="Full Name" required>
                  <Input value={h.fullName} onChange={(e) => updateForm('hero.fullName', e.target.value)} placeholder="Your name" />
                </Field>
                <Toggle checked={h.showName} onChange={(v) => updateForm('hero.showName', v)} label="" />
              </div>
            </div>
          </div>

          {/* Professional Title */}
          <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-700/50 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Type size={14} className="text-primary" />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Professional Title</span>
              </div>
              <Toggle checked={h.showTitle} onChange={(v) => updateForm('hero.showTitle', v)} label="Show" />
            </div>
            <Field label="Title" hint="Displayed with typing animation on the hero.">
              <Input value={h.professionalBadge} onChange={(e) => updateForm('hero.professionalBadge', e.target.value)} placeholder="e.g. Fullstack Developer" disabled={!h.showTitle} />
            </Field>
            <Field label="Typing Words" hint="Comma-separated words that cycle in the typing animation.">
              <Input value={h.typingWords?.join(', ') || ''} onChange={(e) => updateForm('hero.typingWords', e.target.value.split(',').map(w => w.trim()).filter(Boolean))} placeholder="Fullstack Developer, UI/UX Designer, Problem Solver" disabled={!h.showTitle} />
            </Field>
          </div>

          {/* Description */}
          <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-700/50 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Type size={14} className="text-primary" />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Description</span>
              </div>
              <Toggle checked={h.showDescription} onChange={(v) => updateForm('hero.showDescription', v)} label="Show" />
            </div>
            <Field label="Introduction" hint="Brief paragraph below the title.">
              <Textarea value={h.shortIntroduction} onChange={(e) => updateForm('hero.shortIntroduction', e.target.value)} placeholder="I build scalable, high-performance web and mobile applications..." rows={3} />
            </Field>
          </div>

          {/* CTAs */}
          <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-700/50 space-y-4">
            <div className="flex items-center gap-2">
              <MousePointer size={14} className="text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Call-to-Action Buttons</span>
            </div>

            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Primary Button</span>
                <Toggle checked={h.showPrimaryCta} onChange={(v) => updateForm('hero.showPrimaryCta', v)} label="Show" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Button Text">
                  <Input value={h.primaryCtaText} onChange={(e) => updateForm('hero.primaryCtaText', e.target.value)} placeholder="Explore My Work" disabled={!h.showPrimaryCta} />
                </Field>
                <Field label="Button URL">
                  <UrlInput value={h.primaryCtaUrl} onChange={(e) => updateForm('hero.primaryCtaUrl', e.target.value)} placeholder="#projects" disabled={!h.showPrimaryCta} />
                </Field>
              </div>
            </div>

            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Secondary Button</span>
                <Toggle checked={h.showSecondaryCta} onChange={(v) => updateForm('hero.showSecondaryCta', v)} label="Show" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Button Text">
                  <Input value={h.secondaryCtaText} onChange={(e) => updateForm('hero.secondaryCtaText', e.target.value)} placeholder="Get In Touch" disabled={!h.showSecondaryCta} />
                </Field>
                <Field label="Button URL">
                  <UrlInput value={h.secondaryCtaUrl} onChange={(e) => updateForm('hero.secondaryCtaUrl', e.target.value)} placeholder="#contact" disabled={!h.showSecondaryCta} />
                </Field>
              </div>
            </div>
          </div>

          {/* Visibility Quick Toggles */}
          <div className="flex flex-wrap gap-2 pt-2">
            {[
              { key: 'showEyebrow', label: 'Eyebrow' },
              { key: 'showGreeting', label: 'Greeting' },
              { key: 'showName', label: 'Name' },
              { key: 'showTitle', label: 'Title' },
              { key: 'showDescription', label: 'Description' },
              { key: 'showPrimaryCta', label: 'Primary CTA' },
              { key: 'showSecondaryCta', label: 'Secondary CTA' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => updateForm(`hero.${key}`, !h[key])}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  h[key]
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-400 border border-gray-200 dark:border-slate-700'
                }`}
              >
                {h[key] ? <ToggleRight size={12} /> : <ToggleLeft size={12} />}
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Technologies Panel ─── */

function TechnologiesPanel({ form, updateForm }) {
  const techs = form.technologies || []
  const [search, setSearch] = useState('')
  const [editingIndex, setEditingIndex] = useState(-1)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newTech, setNewTech] = useState({ name: '', icon: '', color: '#6366f1', url: '', active: true })
  const [confirmDelete, setConfirmDelete] = useState(-1)

  const filtered = techs.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()))

  function addTech() {
    if (!newTech.name.trim()) return
    if (techs.some((t) => t.name.toLowerCase() === newTech.name.trim().toLowerCase())) {
      return
    }
    updateForm('technologies', [...techs, { ...newTech, name: newTech.name.trim(), order: techs.length }])
    setNewTech({ name: '', icon: '', color: '#6366f1', url: '', active: true })
    setShowAddForm(false)
  }

  function updateTech(index, field, value) {
    const arr = techs.map((t, i) => (i === index ? { ...t, [field]: value } : t))
    updateForm('technologies', arr)
  }

  function removeTech(index) {
    updateForm('technologies', techs.filter((_, i) => i !== index))
    setConfirmDelete(-1)
  }

  function moveTech(index, direction) {
    const arr = [...techs]
    const target = index + direction
    if (target < 0 || target >= arr.length) return
    ;[arr[index], arr[target]] = [arr[target], arr[index]]
    arr.forEach((t, i) => { t.order = i })
    updateForm('technologies', arr)
  }

  return (
    <div className="space-y-4">
      {/* Header & Search */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Cpu size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Technologies</h3>
              <p className="text-xs text-gray-400">{techs.length} total, {techs.filter(t => t.active !== false).length} active</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="pl-8 pr-3 py-2 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 w-40"
              />
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors"
            >
              <Plus size={14} /> Add
            </button>
          </div>
        </div>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-primary/30 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary">New Technology</span>
                <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600"><X size={14} /></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <Input value={newTech.name} onChange={(e) => setNewTech({ ...newTech, name: e.target.value })} placeholder="Technology name *" />
                <Input value={newTech.icon} onChange={(e) => setNewTech({ ...newTech, icon: e.target.value })} placeholder="Icon name (optional)" />
                <div className="flex items-center gap-2">
                  <input type="color" value={newTech.color} onChange={(e) => setNewTech({ ...newTech, color: e.target.value })} className="w-10 h-10 rounded-lg border border-gray-300 dark:border-slate-700 cursor-pointer shrink-0" />
                  <Input value={newTech.url} onChange={(e) => setNewTech({ ...newTech, url: e.target.value })} placeholder="URL (optional)" />
                </div>
                <button onClick={addTech} disabled={!newTech.name.trim()} className="px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors disabled:opacity-50">Add Technology</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tech List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            icon={Cpu}
            title={search ? 'No matches' : 'No technologies'}
            description={search ? 'Try a different search term.' : 'Add technologies to display your tech stack on the homepage.'}
            action={!search && <button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-xl"><Plus size={14} /> Add Technology</button>}
          />
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-slate-800">
            {filtered.map((tech) => {
              const realIndex = techs.indexOf(tech)
              return (
                <div key={realIndex} className="flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex flex-col gap-0.5">
                    <button onClick={() => moveTech(realIndex, -1)} disabled={realIndex === 0} className="text-gray-300 hover:text-gray-600 dark:hover:text-gray-400 disabled:opacity-30"><ArrowUp size={12} /></button>
                    <button onClick={() => moveTech(realIndex, 1)} disabled={realIndex === techs.length - 1} className="text-gray-300 hover:text-gray-600 dark:hover:text-gray-400 disabled:opacity-30"><ArrowDown size={12} /></button>
                  </div>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: (tech.color || '#6366f1') + '20' }}>
                    <Cpu size={14} style={{ color: tech.color || '#6366f1' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    {editingIndex === realIndex ? (
                      <div className="flex items-center gap-2">
                        <Input value={tech.name} onChange={(e) => updateTech(realIndex, 'name', e.target.value)} className="flex-1" placeholder="Name" />
                        <input type="color" value={tech.color || '#6366f1'} onChange={(e) => updateTech(realIndex, 'color', e.target.value)} className="w-8 h-8 rounded-lg border border-gray-300 dark:border-slate-700 cursor-pointer" />
                        <Input value={tech.url || ''} onChange={(e) => updateTech(realIndex, 'url', e.target.value)} className="flex-1" placeholder="URL" />
                        <button onClick={() => setEditingIndex(-1)} className="text-xs text-primary font-medium">Done</button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{tech.name}</span>
                        {tech.url && <a href={tech.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-gray-400 hover:text-primary truncate max-w-[120px]">{tech.url}</a>}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 w-6 text-center">#{realIndex + 1}</span>
                  <Toggle checked={tech.active !== false} onChange={(v) => updateTech(realIndex, 'active', v)} />
                  <button onClick={() => setEditingIndex(editingIndex === realIndex ? -1 : realIndex)} className="p-1.5 text-gray-400 hover:text-primary rounded-lg hover:bg-primary/5 transition-colors text-xs">Edit</button>
                  <button onClick={() => setConfirmDelete(realIndex)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><Trash2 size={14} /></button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <ConfirmModal
        open={confirmDelete >= 0}
        title="Delete Technology"
        message={`Remove "${techs[confirmDelete]?.name || ''}" from your tech stack?`}
        onConfirm={() => removeTech(confirmDelete)}
        onCancel={() => setConfirmDelete(-1)}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  )
}

/* ─── Statistics Panel ─── */

function StatisticsPanel({ form, updateForm }) {
  const stats = form.statistics || []
  const [search, setSearch] = useState('')
  const [editingIndex, setEditingIndex] = useState(-1)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newStat, setNewStat] = useState({ value: '', label: '', icon: 'Award', color: '#6366f1', active: true, context: '' })
  const [confirmDelete, setConfirmDelete] = useState(-1)

  const filtered = stats.filter((s) => s.label.toLowerCase().includes(search.toLowerCase()) || s.value.toLowerCase().includes(search.toLowerCase()))

  function addStat() {
    if (!newStat.value.trim() || !newStat.label.trim()) return
    updateForm('statistics', [...stats, { ...newStat, value: newStat.value.trim(), label: newStat.label.trim(), order: stats.length }])
    setNewStat({ value: '', label: '', icon: 'Award', color: '#6366f1', active: true, context: '' })
    setShowAddForm(false)
  }

  function updateStat(index, field, value) {
    const arr = stats.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    updateForm('statistics', arr)
  }

  function removeStat(index) {
    updateForm('statistics', stats.filter((_, i) => i !== index))
    setConfirmDelete(-1)
  }

  function moveStat(index, direction) {
    const arr = [...stats]
    const target = index + direction
    if (target < 0 || target >= arr.length) return
    ;[arr[index], arr[target]] = [arr[target], arr[index]]
    arr.forEach((s, i) => { s.order = i })
    updateForm('statistics', arr)
  }

  return (
    <div className="space-y-4">
      {/* Header & Search */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <BarChart3 size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Statistics</h3>
              <p className="text-xs text-gray-400">{stats.length} total, {stats.filter(s => s.active !== false).length} active</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="pl-8 pr-3 py-2 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 w-40"
              />
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors"
            >
              <Plus size={14} /> Add
            </button>
          </div>
        </div>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-primary/30 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary">New Statistic</span>
                <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600"><X size={14} /></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                <Input value={newStat.value} onChange={(e) => setNewStat({ ...newStat, value: e.target.value })} placeholder="Value (e.g. 2+)" />
                <Input value={newStat.label} onChange={(e) => setNewStat({ ...newStat, label: e.target.value })} placeholder="Label (e.g. Years Experience)" />
                <select
                  value={newStat.icon}
                  onChange={(e) => setNewStat({ ...newStat, icon: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {ICON_OPTIONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                </select>
                <div className="flex items-center gap-2">
                  <input type="color" value={newStat.color} onChange={(e) => setNewStat({ ...newStat, color: e.target.value })} className="w-10 h-10 rounded-lg border border-gray-300 dark:border-slate-700 cursor-pointer shrink-0" />
                  <Input value={newStat.context || ''} onChange={(e) => setNewStat({ ...newStat, context: e.target.value })} placeholder="Hover text" />
                </div>
                <button onClick={addStat} disabled={!newStat.value.trim() || !newStat.label.trim()} className="px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors disabled:opacity-50">Add Stat</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            icon={BarChart3}
            title={search ? 'No matches' : 'No statistics'}
            description={search ? 'Try a different search term.' : 'Add statistics to showcase your achievements on the homepage.'}
            action={!search && <button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-xl"><Plus size={14} /> Add Statistic</button>}
          />
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-slate-800">
            {filtered.map((stat) => {
              const realIndex = stats.indexOf(stat)
              return (
                <div key={realIndex} className="flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex flex-col gap-0.5">
                    <button onClick={() => moveStat(realIndex, -1)} disabled={realIndex === 0} className="text-gray-300 hover:text-gray-600 dark:hover:text-gray-400 disabled:opacity-30"><ArrowUp size={12} /></button>
                    <button onClick={() => moveStat(realIndex, 1)} disabled={realIndex === stats.length - 1} className="text-gray-300 hover:text-gray-600 dark:hover:text-gray-400 disabled:opacity-30"><ArrowDown size={12} /></button>
                  </div>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: (stat.color || '#6366f1') + '20' }}>
                    <Award size={14} style={{ color: stat.color || '#6366f1' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    {editingIndex === realIndex ? (
                      <div className="flex items-center gap-2 flex-wrap">
                        <Input value={stat.value} onChange={(e) => updateStat(realIndex, 'value', e.target.value)} className="w-20" placeholder="Value" />
                        <Input value={stat.label} onChange={(e) => updateStat(realIndex, 'label', e.target.value)} className="flex-1" placeholder="Label" />
                        <select value={stat.icon} onChange={(e) => updateStat(realIndex, 'icon', e.target.value)} className="px-2 py-1.5 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-gray-900 dark:text-white">
                          {ICON_OPTIONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                        </select>
                        <input type="color" value={stat.color || '#6366f1'} onChange={(e) => updateStat(realIndex, 'color', e.target.value)} className="w-8 h-8 rounded-lg border border-gray-300 dark:border-slate-700 cursor-pointer" />
                        <button onClick={() => setEditingIndex(-1)} className="text-xs text-primary font-medium">Done</button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-black text-primary">{stat.value}</span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{stat.label}</span>
                        {stat.context && <span className="text-[10px] text-gray-400 hidden sm:inline">({stat.context})</span>}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 w-6 text-center">#{realIndex + 1}</span>
                  <Toggle checked={stat.active !== false} onChange={(v) => updateStat(realIndex, 'active', v)} />
                  <button onClick={() => setEditingIndex(editingIndex === realIndex ? -1 : realIndex)} className="p-1.5 text-gray-400 hover:text-primary rounded-lg hover:bg-primary/5 transition-colors text-xs">Edit</button>
                  <button onClick={() => setConfirmDelete(realIndex)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><Trash2 size={14} /></button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <ConfirmModal
        open={confirmDelete >= 0}
        title="Delete Statistic"
        message={`Remove "${stats[confirmDelete]?.label || ''}" from your statistics?`}
        onConfirm={() => removeStat(confirmDelete)}
        onCancel={() => setConfirmDelete(-1)}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  )
}

/* ─── Main HomeContent Component ─── */

export default function HomeContent() {
  const { setUserData, user: authUser } = useAuth()
  const { refreshSettings } = useSiteSettings()
  const [form, setForm] = useState(defaultForm)
  const [initialForm, setInitialForm] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [toast, setToast] = useState(null)
  const [confirmSave, setConfirmSave] = useState(false)
  const [confirmDiscard, setConfirmDiscard] = useState(false)
  const [activeTab, setActiveTab] = useState('hero')

  const isDirty = useMemo(() => {
    if (!initialForm) return false
    return JSON.stringify(form) !== JSON.stringify(initialForm)
  }, [form, initialForm])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { content } = await getHomeContent()
        if (cancelled || !content) return
        const loaded = {
          hero: {
            eyebrow: content.hero?.eyebrow ?? defaultForm.hero.eyebrow,
            greeting: content.hero?.greeting ?? defaultForm.hero.greeting,
            fullName: content.hero?.fullName ?? defaultForm.hero.fullName,
            nameAmharic: content.hero?.nameAmharic ?? defaultForm.hero.nameAmharic,
            professionalBadge: content.hero?.professionalBadge ?? defaultForm.hero.professionalBadge,
            typingWords: content.hero?.typingWords ?? [],
            description: content.hero?.description ?? '',
            shortIntroduction: content.hero?.shortIntroduction ?? '',
            profilePhoto: {
              url: content.hero?.profilePhoto?.url ?? '',
              alt: content.hero?.profilePhoto?.alt ?? '',
            },
            primaryCtaText: content.hero?.primaryCtaText ?? defaultForm.hero.primaryCtaText,
            primaryCtaUrl: content.hero?.primaryCtaUrl ?? defaultForm.hero.primaryCtaUrl,
            secondaryCtaText: content.hero?.secondaryCtaText ?? defaultForm.hero.secondaryCtaText,
            secondaryCtaUrl: content.hero?.secondaryCtaUrl ?? defaultForm.hero.secondaryCtaUrl,
            showEyebrow: content.hero?.showEyebrow !== false,
            showGreeting: content.hero?.showGreeting !== false,
            showName: content.hero?.showName !== false,
            showTitle: content.hero?.showTitle !== false,
            showDescription: content.hero?.showDescription !== false,
            showPrimaryCta: content.hero?.showPrimaryCta !== false,
            showSecondaryCta: content.hero?.showSecondaryCta !== false,
            ctaButtons: content.hero?.ctaButtons ?? [],
          },
          technologies: (content.technologies ?? []).map((t, i) => ({
            name: t.name || '',
            icon: t.icon || '',
            color: t.color || '#6366f1',
            url: t.url || '',
            order: typeof t.order === 'number' ? t.order : i,
            active: t.active !== false,
          })),
          statistics: (content.statistics ?? []).map((s, i) => ({
            value: s.value || '',
            label: s.label || '',
            icon: s.icon || 'Award',
            color: s.color || '#6366f1',
            order: typeof s.order === 'number' ? s.order : i,
            active: s.active !== false,
            context: s.context || '',
          })),
          published: content.published ?? false,
        }
        setForm(loaded)
        setInitialForm(JSON.parse(JSON.stringify(loaded)))
      } catch {
        setToast({ message: 'Failed to load home content', type: 'error' })
      } finally {
        setFetching(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  function updateForm(path, value) {
    setForm((prev) => {
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

  function handleDiscard() {
    if (initialForm) setForm(JSON.parse(JSON.stringify(initialForm)))
    setConfirmDiscard(false)
    setToast({ message: 'Changes discarded', type: 'info' })
  }

  async function handleSubmit() {
    setLoading(true)
    const payload = {
      hero: form.hero,
      technologies: form.technologies,
      statistics: form.statistics,
      published: form.published,
      contactButtonText: form.hero.secondaryCtaText || 'Get In Touch',
      contactButtonLink: form.hero.secondaryCtaUrl || '#contact',
    }

    try {
      const { content } = await updateHomeContent(payload)
      setForm((prev) => ({
        ...prev,
        hero: {
          ...prev.hero,
          profilePhoto: {
            url: content.hero?.profilePhoto?.url ?? prev.hero.profilePhoto.url,
            alt: content.hero?.profilePhoto?.alt ?? prev.hero.profilePhoto.alt,
          },
        },
      }))
      setInitialForm(JSON.parse(JSON.stringify(form)))
      setToast({ message: 'Home content saved successfully', type: 'success' })
      try {
        await updateSiteSettings({
          brandName: form.hero.fullName,
          greeting: form.hero.greeting,
          shortIntroduction: form.hero.shortIntroduction,
          professionalBadge: form.hero.professionalBadge,
          typingWords: form.hero.typingWords,
        })
      } catch {}
      try { await updateNavbarSettings({ brandName: form.hero.fullName, logo: form.hero.profilePhoto?.url || '' }) } catch {}
      try {
        const fd = new FormData()
        fd.append('brandName', form.hero.fullName || '')
        fd.append('footerLogoUrl', form.hero.profilePhoto?.url || '')
        await updateFooterContent(fd)
      } catch {}
      if (authUser) {
        setUserData({ ...authUser, displayName: form.hero.fullName, avatar: getMediaUrl(form.hero.profilePhoto?.url) || form.hero.profilePhoto?.url || authUser.avatar })
      }
      refreshSettings()
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to save home content', type: 'error' })
    } finally {
      setLoading(false)
      setConfirmSave(false)
    }
  }

  if (fetching) return <SkeletonLoader />

  return (
    <div>
      <PageHeader
        title="Home Management"
        description="Manage everything displayed on the public homepage."
        icon={Home}
        actions={
          <div className="flex items-center gap-2">
            {isDirty && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setConfirmDiscard(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors border border-gray-200 dark:border-slate-700"
              >
                <Undo2 size={14} />
                Discard
              </motion.button>
            )}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors border border-gray-200 dark:border-slate-700"
            >
              <ExternalLink size={14} />
              Preview
            </a>
            <button
              onClick={() => setConfirmSave(true)}
              disabled={loading || !isDirty}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {loading ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        }
      />

      {/* Publish Status */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium ${
          form.published
            ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
            : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300'
        }`}>
          {form.published ? <CheckCircle2 size={16} /> : <Circle size={16} />}
          {form.published ? 'Published' : 'Draft'}
          {isDirty && <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-primary/10 text-primary">Unsaved</span>}
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-6 bg-gray-100 dark:bg-slate-800 rounded-xl p-1 w-fit">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === id
                ? 'bg-white dark:bg-slate-900 text-primary shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
        >
          {activeTab === 'hero' && <HeroPanel form={form} updateForm={updateForm} />}
          {activeTab === 'technologies' && <TechnologiesPanel form={form} updateForm={updateForm} />}
          {activeTab === 'statistics' && <StatisticsPanel form={form} updateForm={updateForm} />}
        </motion.div>
      </AnimatePresence>

      {/* Modals */}
      <ConfirmModal
        open={confirmSave}
        title="Save Changes"
        message="This will update the live public homepage. Continue?"
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
