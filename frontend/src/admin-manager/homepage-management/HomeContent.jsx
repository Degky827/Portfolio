import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Save, RefreshCw, Undo2, ExternalLink,
  Home, CheckCircle2, Circle, ChevronDown, ChevronUp,
  Type, MousePointer, ToggleLeft, ToggleRight,
  Cpu, BarChart3, Plus, Trash2, GripVertical,
  Search, ArrowUp, ArrowDown, Award, X,
  Wifi, Globe, Mail, Download, Link2, Navigation,
  ArrowUpRight, ChevronRight, Box, Camera, Zap, Monitor as MonitorIcon, Eye, EyeOff,
  Move, RotateCw, Sliders, Smartphone, Tablet, Laptop, Gauge, Sun, Moon,
  Send, Copy, FileText,
} from 'lucide-react'
import PageHeader from '../shared/PageHeader'
import Toast from '../shared/Toast'
import ConfirmModal from '../shared/ConfirmModal'
import { getHomeContentDraft, updateHomeContent, publishHomeContent } from '../../shared/services/homeContentService'
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
  { id: 'availability', label: 'Availability', icon: Wifi },
  { id: 'social', label: 'Social Links', icon: Globe },
  { id: 'navigation', label: 'Navigation', icon: Navigation },
  { id: '3dscene', label: '3D Scene', icon: Box },
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
  technologiesEnabled: true,
  statistics: [],
  statisticsEnabled: true,
  availability: {
    enabled: true,
    status: 'available',
    title: 'Available for Freelance',
    description: "Let's build something amazing together.",
    ctaText: 'Hire Me',
    ctaUrl: '/contact',
  },
  socialLinksOrder: [],
  socialLinksEnabled: true,
  scene3D: {
    enabled: true,
    interaction: true,
    autoRotate: false,
    objectRotation: false,
    particles: false,
    shadows: true,
    postProcessing: false,
    cursorInteraction: true,
    performance: {
      desktop: true,
      tablet: true,
      mobile: true,
      lightweightMobile: false,
      maxDpr: 2,
      shadowQuality: 'medium',
      particleCount: 50,
    },
    camera: {
      positionX: 0.35,
      positionY: 1.6,
      positionZ: 5.1,
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      fov: 36,
      zoom: 1,
    },
    objects: [],
  },
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
          <div className="flex items-center gap-3">
            <Toggle checked={form.technologiesEnabled !== false} onChange={(v) => updateForm('technologiesEnabled', v)} label={form.technologiesEnabled !== false ? 'Section ON' : 'Section OFF'} />
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
          <div className="flex items-center gap-3">
            <Toggle checked={form.statisticsEnabled !== false} onChange={(v) => updateForm('statisticsEnabled', v)} label={form.statisticsEnabled !== false ? 'Section ON' : 'Section OFF'} />
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

/* ─── Availability Panel ─── */

const STATUS_OPTIONS = [
  { value: 'available', label: 'Available', color: '#10b981', dotClass: 'bg-emerald-500 animate-pulse' },
  { value: 'busy', label: 'Busy', color: '#f59e0b', dotClass: 'bg-amber-500' },
  { value: 'not_available', label: 'Not Available', color: '#6b7280', dotClass: 'bg-gray-400' },
]

function AvailabilityPanel({ form, updateForm }) {
  const a = form.availability
  const currentStatus = STATUS_OPTIONS.find((s) => s.value === a.status) || STATUS_OPTIONS[0]

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Wifi size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Availability / Hire Me</h3>
              <p className="text-xs text-gray-400">Control the availability banner on the homepage</p>
            </div>
          </div>
          <Toggle checked={a.enabled} onChange={(v) => updateForm('availability.enabled', v)} label={a.enabled ? 'Visible' : 'Hidden'} />
        </div>

        {a.enabled && (
          <div className="space-y-5">
            {/* Live Preview */}
            <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-700/50">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Live Preview</p>
              <div className="flex items-center gap-3">
                <span className={`w-2.5 h-2.5 rounded-full ${currentStatus.dotClass}`} />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">{a.title}</span>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 ml-5.5">{a.description}</p>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Status</label>
              <div className="flex gap-2">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => updateForm('availability.status', opt.value)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium border transition-all ${
                      a.status === opt.value
                        ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary/20'
                        : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${opt.dotClass.replace(' animate-pulse', '')}`} />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <Field label="Title" hint="Displayed next to the status indicator.">
              <Input value={a.title} onChange={(e) => updateForm('availability.title', e.target.value)} placeholder="Available for Freelance" />
            </Field>

            {/* Description */}
            <Field label="Description" hint="Short text below the title.">
              <Input value={a.description} onChange={(e) => updateForm('availability.description', e.target.value)} placeholder="Let's build something amazing together." />
            </Field>

            {/* CTA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Button Text">
                <Input value={a.ctaText} onChange={(e) => updateForm('availability.ctaText', e.target.value)} placeholder="Hire Me" />
              </Field>
              <Field label="Button URL">
                <UrlInput value={a.ctaUrl} onChange={(e) => updateForm('availability.ctaUrl', e.target.value)} placeholder="/contact" />
              </Field>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Social Links Panel ─── */

const PLATFORM_PRESETS = {
  github: { label: 'GitHub', icon: 'github', type: 'github' },
  linkedin: { label: 'LinkedIn', icon: 'linkedin', type: 'linkedin' },
  twitter: { label: 'Twitter', icon: 'twitter', type: 'twitter' },
  telegram: { label: 'Telegram', icon: 'telegram', type: 'telegram' },
  facebook: { label: 'Facebook', icon: 'facebook', type: 'facebook' },
  instagram: { label: 'Instagram', icon: 'instagram', type: 'instagram' },
  youtube: { label: 'YouTube', icon: 'youtube', type: 'youtube' },
  email: { label: 'Email', icon: 'mail', type: 'email' },
  cv: { label: 'Download CV', icon: 'download', type: 'cv' },
}

const SOCIAL_PLATFORM_OPTIONS = Object.entries(PLATFORM_PRESETS).map(([key, v]) => ({ value: key, label: v.label }))

function SocialLinksPanel({ form, updateForm }) {
  const links = form.socialLinksOrder || []
  const [search, setSearch] = useState('')
  const [editingIndex, setEditingIndex] = useState(-1)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newLink, setNewLink] = useState({ platform: '', url: '', icon: '', tooltip: '', visible: true, active: true, openNewTab: true })
  const [confirmDelete, setConfirmDelete] = useState(-1)

  const filtered = links.filter((l) => (l.platform || '').toLowerCase().includes(search.toLowerCase()) || (l.url || '').toLowerCase().includes(search.toLowerCase()))

  function addLink() {
    if (!newLink.platform.trim() || !newLink.url.trim()) return
    if (links.some((l) => l.platform.toLowerCase() === newLink.platform.trim().toLowerCase())) return
    const preset = PLATFORM_PRESETS[newLink.platform.trim().toLowerCase()] || {}
    updateForm('socialLinksOrder', [...links, {
      ...newLink,
      platform: newLink.platform.trim(),
      icon: newLink.icon || preset.icon || '',
      tooltip: newLink.tooltip || preset.label || newLink.platform.trim(),
      order: links.length,
    }])
    setNewLink({ platform: '', url: '', icon: '', tooltip: '', visible: true, active: true, openNewTab: true })
    setShowAddForm(false)
  }

  function updateLink(index, field, value) {
    const arr = links.map((l, i) => (i === index ? { ...l, [field]: value } : l))
    updateForm('socialLinksOrder', arr)
  }

  function removeLink(index) {
    updateForm('socialLinksOrder', links.filter((_, i) => i !== index))
    setConfirmDelete(-1)
  }

  function moveLink(index, direction) {
    const arr = [...links]
    const target = index + direction
    if (target < 0 || target >= arr.length) return
    ;[arr[index], arr[target]] = [arr[target], arr[index]]
    arr.forEach((l, i) => { l.order = i })
    updateForm('socialLinksOrder', arr)
  }

  function getPlatformIcon(platform) {
    const key = (platform || '').toLowerCase()
    if (key === 'email') return <Mail size={14} />
    if (key === 'cv') return <Download size={14} />
    if (key === 'github') return (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
    )
    if (key === 'linkedin') return (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
    )
    return <Globe size={14} />
  }

  const isValidEmail = (url) => !url || url.startsWith('mailto:') || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(url)
  const isValidUrl = (url) => !url || URL_PATTERN.test(url)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Globe size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Social Links</h3>
              <p className="text-xs text-gray-400">{links.length} total, {links.filter(l => l.active !== false).length} active</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Toggle checked={form.socialLinksEnabled !== false} onChange={(v) => updateForm('socialLinksEnabled', v)} label={form.socialLinksEnabled !== false ? 'Section ON' : 'Section OFF'} />
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="pl-8 pr-3 py-2 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 w-40" />
            </div>
            <button onClick={() => setShowAddForm(!showAddForm)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors">
              <Plus size={14} /> Add
            </button>
          </div>
        </div>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-primary/30 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary">New Social Link</span>
                <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600"><X size={14} /></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Platform</label>
                  <select value={newLink.platform} onChange={(e) => {
                    const val = e.target.value
                    const preset = PLATFORM_PRESETS[val] || {}
                    setNewLink({ ...newLink, platform: val, icon: preset.icon || '', tooltip: preset.label || val })
                  }} className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="">Select platform</option>
                    {SOCIAL_PLATFORM_OPTIONS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">URL *</label>
                  <Input value={newLink.url} onChange={(e) => setNewLink({ ...newLink, url: e.target.value })} placeholder="https://..." className={!isValidUrl(newLink.url) && !isValidEmail(newLink.url) ? 'border-red-400' : ''} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Label</label>
                  <Input value={newLink.tooltip} onChange={(e) => setNewLink({ ...newLink, tooltip: e.target.value })} placeholder="GitHub" />
                </div>
                <div className="flex items-end">
                  <button onClick={addLink} disabled={!newLink.platform.trim() || !newLink.url.trim()} className="w-full px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors disabled:opacity-50">Add Link</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Links List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState icon={Globe} title={search ? 'No matches' : 'No social links'} description={search ? 'Try a different search.' : 'Add social links to display in the hero sidebar.'} action={!search && <button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-xl"><Plus size={14} /> Add Link</button>} />
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-slate-800">
            {filtered.map((link) => {
              const realIndex = links.indexOf(link)
              return (
                <div key={realIndex} className="flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex flex-col gap-0.5">
                    <button onClick={() => moveLink(realIndex, -1)} disabled={realIndex === 0} className="text-gray-300 hover:text-gray-600 dark:hover:text-gray-400 disabled:opacity-30"><ArrowUp size={12} /></button>
                    <button onClick={() => moveLink(realIndex, 1)} disabled={realIndex === links.length - 1} className="text-gray-300 hover:text-gray-600 dark:hover:text-gray-400 disabled:opacity-30"><ArrowDown size={12} /></button>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-slate-800 flex items-center justify-center shrink-0 text-gray-600 dark:text-gray-400">
                    {getPlatformIcon(link.platform)}
                  </div>
                  <div className="flex-1 min-w-0">
                    {editingIndex === realIndex ? (
                      <div className="flex items-center gap-2 flex-wrap">
                        <select value={link.platform} onChange={(e) => updateLink(realIndex, 'platform', e.target.value)} className="px-2 py-1.5 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-gray-900 dark:text-white">
                          {SOCIAL_PLATFORM_OPTIONS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                          <option value="other">Other</option>
                        </select>
                        <Input value={link.url} onChange={(e) => updateLink(realIndex, 'url', e.target.value)} className="flex-1 min-w-[200px]" placeholder="URL" />
                        <Input value={link.tooltip || ''} onChange={(e) => updateLink(realIndex, 'tooltip', e.target.value)} className="w-28" placeholder="Label" />
                        <label className="flex items-center gap-1 text-xs text-gray-500">
                          <input type="checkbox" checked={link.openNewTab !== false} onChange={(e) => updateLink(realIndex, 'openNewTab', e.target.checked)} className="rounded" />
                          New tab
                        </label>
                        <button onClick={() => setEditingIndex(-1)} className="text-xs text-primary font-medium">Done</button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{link.platform}</span>
                        {link.tooltip && link.tooltip !== link.platform && <span className="text-xs text-gray-400">({link.tooltip})</span>}
                        <span className="text-[10px] text-gray-400 truncate max-w-[200px]">{link.url}</span>
                        {link.openNewTab !== false && <ArrowUpRight size={10} className="text-gray-400" />}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 w-6 text-center">#{realIndex + 1}</span>
                  <Toggle checked={link.active !== false} onChange={(v) => updateLink(realIndex, 'active', v)} />
                  <button onClick={() => setEditingIndex(editingIndex === realIndex ? -1 : realIndex)} className="p-1.5 text-gray-400 hover:text-primary rounded-lg hover:bg-primary/5 transition-colors text-xs">Edit</button>
                  <button onClick={() => setConfirmDelete(realIndex)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><Trash2 size={14} /></button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <ConfirmModal open={confirmDelete >= 0} title="Delete Social Link" message={`Remove "${links[confirmDelete]?.platform || ''}" from your social links?`} onConfirm={() => removeLink(confirmDelete)} onCancel={() => setConfirmDelete(-1)} confirmText="Delete" variant="danger" />
    </div>
  )
}

/* ─── 3D Scene Management Panel ─── */

const SCENE_SUB_TABS = [
  { id: 'general', label: 'General', icon: Sliders },
  { id: 'camera', label: 'Camera', icon: Camera },
  { id: 'objects', label: 'Objects', icon: Box },
  { id: 'performance', label: 'Performance', icon: Gauge },
]

const SCENE_OBJECT_NAMES = [
  { name: 'desk', label: 'Desk', desc: 'Main desk surface' },
  { name: 'monitor', label: 'Monitor', desc: 'Display screen' },
  { name: 'keyboard', label: 'Keyboard', desc: 'Input device' },
  { name: 'mouse', label: 'Mouse', desc: 'Mouse + glow' },
  { name: 'pc', label: 'PC Tower', desc: 'Computer case' },
  { name: 'speaker-left', label: 'Speaker (L)', desc: 'Left speaker' },
  { name: 'speaker-right', label: 'Speaker (R)', desc: 'Right speaker' },
  { name: 'group', label: 'Entire Scene', desc: 'Scale & position all' },
]

function SceneGeneralTab({ s3, u }) {
  return (
    <div className="space-y-5">
      <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
        <Toggle checked={s3.enabled} onChange={(v) => u('scene3D.enabled', v)} label="Enable 3D Scene" />
        <p className="text-xs text-gray-400 mt-1.5 ml-[52px]">Turn off to hide the entire 3D workspace</p>
      </div>
      {s3.enabled && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Toggle checked={s3.interaction} onChange={(v) => u('scene3D.interaction', v)} label="User Interaction" />
            <Toggle checked={s3.autoRotate} onChange={(v) => u('scene3D.autoRotate', v)} label="Auto Rotate" />
            <Toggle checked={s3.shadows} onChange={(v) => u('scene3D.shadows', v)} label="Cast Shadows" />
            <Toggle checked={s3.cursorInteraction} onChange={(v) => u('scene3D.cursorInteraction', v)} label="Cursor Hover" />
            <Toggle checked={s3.particles} onChange={(v) => u('scene3D.particles', v)} label="Particles Effect" />
            <Toggle checked={s3.postProcessing} onChange={(v) => u('scene3D.postProcessing', v)} label="Post Processing" />
            <Toggle checked={s3.objectRotation} onChange={(v) => u('scene3D.objectRotation', v)} label="Object Rotation" />
          </div>
          <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-4">
            <p className="text-xs text-indigo-600 dark:text-indigo-400 leading-relaxed">
              <strong>Tip:</strong> Shadows add depth but cost GPU. Disable on mobile for better performance.
              Particles and post-processing are premium effects — enable selectively.
            </p>
          </div>
        </>
      )}
    </div>
  )
}

function SceneCameraTab({ s3, u }) {
  const cam = s3.camera
  return (
    <div className="space-y-5">
      <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
          <Move size={12} /> Position
        </h4>
        <div className="grid grid-cols-3 gap-3">
          {[
            { key: 'positionX', label: 'X', hint: 'Left / Right' },
            { key: 'positionY', label: 'Y', hint: 'Up / Down' },
            { key: 'positionZ', label: 'Z', hint: 'Forward / Back' },
          ].map(({ key, label, hint }) => (
            <Field key={key} label={label} hint={hint}>
              <Input
                type="number"
                step="0.05"
                value={cam[key]}
                onChange={(e) => u(`scene3D.camera.${key}`, parseFloat(e.target.value) || 0)}
              />
            </Field>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
          <RotateCw size={12} /> Rotation
        </h4>
        <div className="grid grid-cols-3 gap-3">
          {[
            { key: 'rotationX', label: 'Pitch', hint: 'Tilt up/down' },
            { key: 'rotationY', label: 'Yaw', hint: 'Pan left/right' },
            { key: 'rotationZ', label: 'Roll', hint: 'Tilt sideways' },
          ].map(({ key, label, hint }) => (
            <Field key={key} label={label} hint={hint}>
              <Input
                type="number"
                step="0.05"
                value={cam[key]}
                onChange={(e) => u(`scene3D.camera.${key}`, parseFloat(e.target.value) || 0)}
              />
            </Field>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Field of View" hint="Lower = more zoom (25–60)">
          <Input
            type="number"
            min="10"
            max="120"
            step="1"
            value={cam.fov}
            onChange={(e) => u('scene3D.camera.fov', parseInt(e.target.value) || 36)}
          />
        </Field>
        <Field label="Zoom" hint="1 = normal">
          <Input
            type="number"
            min="0.1"
            max="5"
            step="0.1"
            value={cam.zoom}
            onChange={(e) => u('scene3D.camera.zoom', parseFloat(e.target.value) || 1)}
          />
        </Field>
      </div>

      <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">Quick Presets</h4>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Default', px: 0.35, py: 1.6, pz: 5.1, fov: 36 },
            { label: 'Close-up', px: 0.2, py: 1.2, pz: 3.5, fov: 40 },
            { label: 'Wide', px: 0.5, py: 2.0, pz: 7.0, fov: 30 },
            { label: 'Top-down', px: 0, py: 4.0, pz: 3.0, fov: 45 },
          ].map((p) => (
            <button
              key={p.label}
              onClick={() => {
                u('scene3D.camera.positionX', p.px)
                u('scene3D.camera.positionY', p.py)
                u('scene3D.camera.positionZ', p.pz)
                u('scene3D.camera.fov', p.fov)
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function SceneObjectsTab({ s3, u }) {
  const objects = s3.objects || []

  function addObject() {
    u('scene3D.objects', [
      ...objects,
      { name: '', visible: true, position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: 1, animate: true },
    ])
  }

  function updateObject(idx, path, value) {
    const updated = objects.map((o, i) => {
      if (i !== idx) return o
      const keys = path.split('.')
      const next = { ...o }
      let obj = next
      for (let k = 0; k < keys.length - 1; k++) {
        obj[keys[k]] = { ...obj[keys[k]] }
        obj = obj[keys[k]]
      }
      obj[keys[keys.length - 1]] = value
      return next
    })
    u('scene3D.objects', updated)
  }

  function removeObject(idx) {
    u('scene3D.objects', objects.filter((_, i) => i !== idx))
  }

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          Configure individual 3D objects. Toggle visibility, adjust position/rotation/scale, or hide objects entirely.
          Unlisted objects use their default hardcoded values.
        </p>
      </div>

      {SCENE_OBJECT_NAMES.map((def) => {
        const obj = objects.find((o) => o.name === def.name)
        const isCustom = !!obj
        return (
          <div key={def.name} className={`bg-white dark:bg-slate-900 rounded-xl border p-4 transition-colors ${
            isCustom
              ? 'border-primary/30 dark:border-primary/30'
              : 'border-gray-200 dark:border-slate-800'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{def.label}</h4>
                <p className="text-xs text-gray-400">{def.desc}</p>
              </div>
              <div className="flex items-center gap-2">
                <Toggle
                  checked={obj?.visible !== false}
                  onChange={(v) => {
                    if (!isCustom) {
                      u('scene3D.objects', [...objects, { name: def.name, visible: v, position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: 1, animate: true }])
                    } else {
                      updateObject(objects.indexOf(obj), 'visible', v)
                    }
                  }}
                  label=""
                />
                {isCustom && (
                  <button onClick={() => removeObject(objects.indexOf(obj))} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {isCustom && (
              <div className="space-y-3 mt-3 pt-3 border-t border-gray-100 dark:border-slate-800">
                <div className="grid grid-cols-3 gap-2">
                  {['x', 'y', 'z'].map((axis) => (
                    <Field key={`pos-${axis}`} label={`Pos ${axis.toUpperCase()}`}>
                      <Input
                        type="number"
                        step="0.05"
                        value={obj.position?.[axis] ?? 0}
                        onChange={(e) => updateObject(objects.indexOf(obj), `position.${axis}`, parseFloat(e.target.value) || 0)}
                      />
                    </Field>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {['x', 'y', 'z'].map((axis) => (
                    <Field key={`rot-${axis}`} label={`Rot ${axis.toUpperCase()}`}>
                      <Input
                        type="number"
                        step="0.05"
                        value={obj.rotation?.[axis] ?? 0}
                        onChange={(e) => updateObject(objects.indexOf(obj), `rotation.${axis}`, parseFloat(e.target.value) || 0)}
                      />
                    </Field>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Scale">
                    <Input
                      type="number"
                      step="0.05"
                      min="0.1"
                      max="5"
                      value={obj.scale ?? 1}
                      onChange={(e) => updateObject(objects.indexOf(obj), 'scale', parseFloat(e.target.value) || 1)}
                    />
                  </Field>
                  <div className="flex items-end pb-1">
                    <Toggle checked={obj.animate !== false} onChange={(v) => updateObject(objects.indexOf(obj), 'animate', v)} label="Animate" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}

      <button onClick={addObject} className="w-full py-3 rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-600 text-sm font-medium text-gray-500 hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2">
        <Plus size={14} /> Add Custom Object
      </button>
    </div>
  )
}

function ScenePerformanceTab({ s3, u }) {
  const perf = s3.performance
  return (
    <div className="space-y-5">
      <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
          <MonitorIcon size={12} /> Device Support
        </h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Laptop size={16} className="text-gray-400 shrink-0" />
            <Toggle checked={perf.desktop} onChange={(v) => u('scene3D.performance.desktop', v)} label="Desktop" />
          </div>
          <div className="flex items-center gap-3">
            <Tablet size={16} className="text-gray-400 shrink-0" />
            <Toggle checked={perf.tablet} onChange={(v) => u('scene3D.performance.tablet', v)} label="Tablet" />
          </div>
          <div className="flex items-center gap-3">
            <Smartphone size={16} className="text-gray-400 shrink-0" />
            <Toggle checked={perf.mobile} onChange={(v) => u('scene3D.performance.mobile', v)} label="Mobile" />
          </div>
          <div className="flex items-center gap-3">
            <Zap size={16} className="text-gray-400 shrink-0" />
            <Toggle checked={perf.lightweightMobile} onChange={(v) => u('scene3D.performance.lightweightMobile', v)} label="Lightweight Mobile" />
            <span className="text-[10px] text-gray-400 bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">Low Power</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Max DPR" hint="Device pixel ratio (1–3)">
          <Input
            type="number"
            min="1"
            max="3"
            step="0.5"
            value={perf.maxDpr}
            onChange={(e) => u('scene3D.performance.maxDpr', parseFloat(e.target.value) || 2)}
          />
        </Field>
        <Field label="Shadow Quality">
          <select
            value={perf.shadowQuality}
            onChange={(e) => u('scene3D.performance.shadowQuality', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
          >
            <option value="low">Low (256px)</option>
            <option value="medium">Medium (512px)</option>
            <option value="high">High (1024px)</option>
          </select>
        </Field>
      </div>

      <Field label="Particle Count" hint="Number of floating particles (0–200)">
        <input
          type="range"
          min="0"
          max="200"
          step="10"
          value={perf.particleCount}
          onChange={(e) => u('scene3D.performance.particleCount', parseInt(e.target.value))}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0</span>
          <span className="font-medium text-primary">{perf.particleCount}</span>
          <span>200</span>
        </div>
      </Field>

      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
        <p className="text-xs text-amber-600 dark:text-amber-400 leading-relaxed">
          <strong>Performance Guide:</strong><br/>
          • Desktop: Full quality, shadows + DPR 2<br/>
          • Tablet: Medium shadows, DPR 1.5<br/>
          • Mobile: Consider disabling shadows, DPR 1<br/>
          • Lightweight Mobile: Low-power GPU, no effects
        </p>
      </div>
    </div>
  )
}

function Scene3DPanel({ form, updateForm }) {
  const [subTab, setSubTab] = useState('general')
  const s3 = form.scene3D

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden">
      <div className="p-6 pb-4 border-b border-gray-100 dark:border-slate-800">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Box size={18} />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">3D Scene Management</h3>
            <p className="text-xs text-gray-400 mt-0.5">Configure camera, objects, lighting, effects, and performance for the hero 3D workspace</p>
          </div>
        </div>
      </div>

      <div className="flex gap-1 p-2 mx-6 mt-4 bg-gray-100 dark:bg-slate-800 rounded-xl w-fit">
        {SCENE_SUB_TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setSubTab(id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              subTab === id
                ? 'bg-white dark:bg-slate-900 text-primary shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Icon size={12} />
            {label}
          </button>
        ))}
      </div>

      <div className="p-6">
        {subTab === 'general' && <SceneGeneralTab s3={s3} u={updateForm} />}
        {subTab === 'camera' && <SceneCameraTab s3={s3} u={updateForm} />}
        {subTab === 'objects' && <SceneObjectsTab s3={s3} u={updateForm} />}
        {subTab === 'performance' && <ScenePerformanceTab s3={s3} u={updateForm} />}
      </div>
    </div>
  )
}

/* ─── Navigation Reference Tab ─── */

function NavigationTab() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-8 text-center">
      <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
        <Navigation size={24} />
      </div>
      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">Navigation Management</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
        Manage your navigation menu items, navbar settings, logo, and theme toggle from the dedicated Navigation admin page.
      </p>
      <a
        href="/#/admin/navigation"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors"
      >
        Open Navigation Manager
        <ExternalLink size={14} />
      </a>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-lg mx-auto">
        {[
          { title: 'Menu Items', desc: 'Add, edit, reorder, and toggle nav links' },
          { title: 'Navbar Settings', desc: 'Colors, spacing, transparency, and layout' },
          { title: 'Logo & Theme', desc: 'Brand logo, name, and theme toggle' },
        ].map((item) => (
          <div key={item.title} className="p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-700/50">
            <p className="text-xs font-bold text-gray-900 dark:text-white mb-0.5">{item.title}</p>
            <p className="text-[10px] text-gray-400">{item.desc}</p>
          </div>
        ))}
      </div>
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
  const [confirmPublish, setConfirmPublish] = useState(false)
  const [activeTab, setActiveTab] = useState('hero')
  const [showPreview, setShowPreview] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [isPublished, setIsPublished] = useState(false)
  const [lastPublishedAt, setLastPublishedAt] = useState(null)

  const isDirty = useMemo(() => {
    if (!initialForm) return false
    return JSON.stringify(form) !== JSON.stringify(initialForm)
  }, [form, initialForm])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { content } = await getHomeContentDraft()
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
          technologiesEnabled: content.technologiesEnabled !== false,
          statistics: (content.statistics ?? []).map((s, i) => ({
            value: s.value || '',
            label: s.label || '',
            icon: s.icon || 'Award',
            color: s.color || '#6366f1',
            order: typeof s.order === 'number' ? s.order : i,
            active: s.active !== false,
            context: s.context || '',
          })),
          statisticsEnabled: content.statisticsEnabled !== false,
          availability: {
            enabled: content.availability?.enabled !== false,
            status: content.availability?.status || 'available',
            title: content.availability?.title || 'Available for Freelance',
            description: content.availability?.description || "Let's build something amazing together.",
            ctaText: content.availability?.ctaText || 'Hire Me',
            ctaUrl: content.availability?.ctaUrl || '/contact',
          },
          socialLinksOrder: (content.socialLinksOrder ?? []).map((l, i) => ({
            platform: l.platform || '',
            url: l.url || '',
            icon: l.icon || '',
            tooltip: l.tooltip || '',
            order: typeof l.order === 'number' ? l.order : i,
            visible: l.visible !== false,
            active: l.active !== false,
            openNewTab: l.openNewTab !== false,
          })),
          socialLinksEnabled: content.socialLinksEnabled !== false,
          scene3D: {
            enabled: content.scene3D?.enabled !== false,
            interaction: content.scene3D?.interaction !== false,
            autoRotate: content.scene3D?.autoRotate === true,
            objectRotation: content.scene3D?.objectRotation === true,
            particles: content.scene3D?.particles === true,
            shadows: content.scene3D?.shadows !== false,
            postProcessing: content.scene3D?.postProcessing === true,
            cursorInteraction: content.scene3D?.cursorInteraction !== false,
            performance: {
              desktop: content.scene3D?.performance?.desktop !== false,
              tablet: content.scene3D?.performance?.tablet !== false,
              mobile: content.scene3D?.performance?.mobile !== false,
              lightweightMobile: content.scene3D?.performance?.lightweightMobile === true,
              maxDpr: content.scene3D?.performance?.maxDpr ?? 2,
              shadowQuality: content.scene3D?.performance?.shadowQuality || 'medium',
              particleCount: content.scene3D?.performance?.particleCount ?? 50,
            },
            camera: {
              positionX: content.scene3D?.camera?.positionX ?? 0.35,
              positionY: content.scene3D?.camera?.positionY ?? 1.6,
              positionZ: content.scene3D?.camera?.positionZ ?? 5.1,
              rotationX: content.scene3D?.camera?.rotationX ?? 0,
              rotationY: content.scene3D?.camera?.rotationY ?? 0,
              rotationZ: content.scene3D?.camera?.rotationZ ?? 0,
              fov: content.scene3D?.camera?.fov ?? 36,
              zoom: content.scene3D?.camera?.zoom ?? 1,
            },
            objects: (content.scene3D?.objects ?? []).map((o) => ({
              name: o.name || '',
              visible: o.visible !== false,
              position: {
                x: o.position?.x ?? 0,
                y: o.position?.y ?? 0,
                z: o.position?.z ?? 0,
              },
              rotation: {
                x: o.rotation?.x ?? 0,
                y: o.rotation?.y ?? 0,
                z: o.rotation?.z ?? 0,
              },
              scale: typeof o.scale === 'number' ? o.scale : 1,
              animate: o.animate !== false,
            })),
          },
          published: content.published ?? false,
        }
        setForm(loaded)
        setInitialForm(JSON.parse(JSON.stringify(loaded)))
        setIsPublished(content.published === true)
        setLastPublishedAt(content.lastPublishedAt || null)
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
      technologiesEnabled: form.technologiesEnabled,
      statistics: form.statistics,
      statisticsEnabled: form.statisticsEnabled,
      availability: form.availability,
      socialLinksOrder: form.socialLinksOrder,
      socialLinksEnabled: form.socialLinksEnabled,
      socialLinks: (form.socialLinksOrder || []).reduce((acc, l) => {
        if (l.platform && l.url) acc[l.platform.toLowerCase()] = l.url
        return acc
      }, {}),
      scene3D: form.scene3D,
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

  async function handlePublish() {
    setPublishing(true)
    try {
      const { data } = await publishHomeContent()
      setIsPublished(true)
      setLastPublishedAt(new Date())
      setInitialForm(JSON.parse(JSON.stringify(form)))
      setShowPreview(false)
      setToast({ message: 'Content published to live site!', type: 'success' })
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to publish', type: 'error' })
    } finally {
      setPublishing(false)
      setConfirmSave(false)
    }
  }

  if (fetching) return <SkeletonLoader />

  const statusLabel = isPublished ? 'Published' : 'Draft'
  const statusColor = isPublished ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300' : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300'

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
            <motion.button
              onClick={() => setShowPreview((p) => !p)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors border ${
                showPreview
                  ? 'bg-primary/10 text-primary border-primary/30'
                  : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-slate-700 hover:bg-gray-200 dark:hover:bg-slate-700'
              }`}
            >
              <Eye size={14} />
              {showPreview ? 'Hide Preview' : 'Preview'}
            </motion.button>
            {!isPublished && (
              <button
                onClick={() => setConfirmPublish(true)}
                disabled={publishing || !isDirty}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {publishing ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
                {publishing ? 'Publishing...' : 'Publish'}
              </button>
            )}
            {isPublished && (
              <button
                onClick={() => setConfirmPublish(true)}
                disabled={publishing}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors disabled:opacity-50"
              >
                <Copy size={14} />
                Republish
              </button>
            )}
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
          isPublished
            ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
            : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300'
        }`}>
          {isPublished ? <CheckCircle2 size={16} /> : <Circle size={16} />}
          {isPublished ? 'Published' : 'Draft'}
          {isDirty && <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-primary/10 text-primary">Unsaved</span>}
          {isPublished && lastPublishedAt && (
            <span className="ml-2 text-[10px] opacity-70">
              Last: {lastPublishedAt.toLocaleString()}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-2 ml-1">
          {isPublished
            ? 'Your changes are live on the public site. Save to make further edits, or republish to apply.'
            : 'Changes are saved as draft only. Click Publish to make them visible on the public site.'}
        </p>
      </motion.div>

      {/* In-Page Preview Panel */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6 overflow-hidden"
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-lg">
              <div className="flex items-center justify-between px-6 py-3 bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
                <span className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Eye size={16} />
                  Preview — Draft Mode
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                    DRAFT
                  </span>
                </span>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <X size={16} className="text-gray-400" />
                </button>
              </div>
              <div className="relative overflow-hidden" style={{ minHeight: '600px', background: 'transparent' }}>
                <iframe
                  srcDoc={`
                    <!DOCTYPE html>
                    <html>
                    <head>
                      <style>
                        * { margin: 0; padding: 0; box-sizing: border-box; }
                        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #fff; color: #1e293b; }
                        .section { padding: 40px; max-width: 1200px; margin: 0 auto; }
                        .hero-text h1 { font-size: 2.5rem; font-weight: 800; margin: 10px 0; }
                        .hero-text p { font-size: 1.1rem; color: #64748b; }
                        .btn { display: inline-block; padding: 12px 24px; border-radius: 12px; font-weight: 600; margin: 5px; }
                        .btn-primary { background: #6366f1; color: white; border: none; }
                        .btn-secondary { background: transparent; color: #6366f1; border: 2px solid #6366f1; }
                        .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 30px; }
                        .card { padding: 20px; border: 1px solid #e2e8f0; border-radius: 16px; text-align: center; }
                        .card h3 { font-size: 1.5rem; font-weight: 700; color: #6366f1; }
                        .card p { font-size: 0.85rem; color: #94a3b8; margin-top: 5px; }
                        .status-bar { padding: 8px 16px; background: #fef3c7; color: #92400e; font-size: 0.75rem; font-weight: 600; text-align: center; }
                        .tech { display: inline-block; padding: 4px 12px; background: #eef2ff; color: #4338ca; border-radius: 8px; margin: 3px; font-size: 0.8rem; }
                      </style>
                    </head>
                    <body>
                      <div class="status-bar">⚠️ PREVIEW — Changes are DRAFT only. Publish to go live.</div>
                      <div class="section hero-text">
                        <p style="text-transform:uppercase; letter-spacing:0.2em; font-size:0.75rem; color:#6366f1; font-weight:600;">${form.hero?.eyebrow || 'WELCOME'}</p>
                        <h1>${form.hero?.greeting || 'Hi, I\'m'} ${form.hero?.fullName || 'Desalegn'}</h1>
                        <p>${form.hero?.professionalBadge || 'Student Developer'}</p>
                        <p style="margin-top:15px;">${form.hero?.description || 'Build something amazing.'}</p>
                        <div style="margin-top:20px;">
                          <button class="btn btn-primary">${form.hero?.primaryCtaText || 'Explore'}</button>
                          <button class="btn btn-secondary">${form.hero?.secondaryCtaText || 'Contact'}</button>
                        </div>
                      </div>
                      ${form.technologies?.length > 0 ? `
                      <div class="section">
                        <h2 style="font-size:1.5rem; font-weight:700; margin-bottom:15px;">Technologies</h2>
                        <div>${form.technologies.map(t => `<span class="tech">${t.name || ''}</span>`).join('')}</div>
                      </div>` : ''}
                      ${form.statistics?.length > 0 ? `
                      <div class="section">
                        <h2 style="font-size:1.5rem; font-weight:700; margin-bottom:15px;">Stats</h2>
                        <div class="grid-3">${form.statistics.map(s => `<div class="card"><h3>${s.value || ''}</h3><p>${s.label || ''}</p></div>`).join('')}</div>
                      </div>` : ''}
                      ${form.availability?.enabled ? `
                      <div class="section">
                        <div style="padding:20px; border:2px solid #10b981; border-radius:16px; text-align:center; background:#ecfdf5;">
                          <span style="color:#059669; font-weight:700; font-size:1.1rem;">● ${form.availability?.status === 'available' ? 'Available for Freelance' : form.availability?.status}</span>
                          <p style="margin-top:10px; color:#64748b;">${form.availability?.description || ''}</p>
                          <button class="btn btn-primary" style="margin-top:15px;">${form.availability?.ctaText || 'Hire Me'}</button>
                        </div>
                      </div>` : ''}
                    </body>
                    </html>
                  `}
                  style={{ width: '100%', border: 'none', minHeight: '600px' }}
                  title="Draft Preview"
                  sandbox="allow-same-origin"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
          {activeTab === 'availability' && <AvailabilityPanel form={form} updateForm={updateForm} />}
          {activeTab === 'social' && <SocialLinksPanel form={form} updateForm={updateForm} />}
          {activeTab === 'navigation' && <NavigationTab />}
          {activeTab === '3dscene' && <Scene3DPanel form={form} updateForm={updateForm} />}
        </motion.div>
      </AnimatePresence>

      {/* Modals */}
      <ConfirmModal
        open={confirmSave}
        title="Save as Draft"
        message="Your changes will be saved as a draft. They won't appear on the public site until you Publish."
        onConfirm={handleSubmit}
        onCancel={() => setConfirmSave(false)}
        loading={loading}
        confirmText="Save Draft"
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
      <ConfirmModal
        open={confirmPublish}
        title="Publish to Live Site"
        message="This will make all your draft changes visible to the public. You can republish later to update the live site."
        onConfirm={handlePublish}
        onCancel={() => setConfirmPublish(false)}
        loading={publishing}
        confirmText="Publish Now"
        variant="success"
      />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
