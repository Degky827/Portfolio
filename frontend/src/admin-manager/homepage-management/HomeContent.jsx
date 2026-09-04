import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Save, RefreshCw, Eye, Undo2, ExternalLink,
  Home, CheckCircle2, Circle, ChevronDown, ChevronUp,
  Type, MousePointer, ToggleLeft, ToggleRight,
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
  published: false,
}

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
      {hint && (
        <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">{hint}</p>
      )}
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
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
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
      <Input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={!isValid ? 'border-red-400 focus:ring-red-400/50' : ''}
      />
      {!isValid && (
        <p className="text-xs text-red-500 mt-1">Enter a valid URL (https://... , /path, or #anchor)</p>
      )}
    </div>
  )
}

function HeroSectionCard({ form, updateForm, errors }) {
  const [expanded, setExpanded] = useState(true)
  const h = form.hero

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden">
      {/* Card Header */}
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
            <p className="text-xs text-gray-400 mt-0.5">Eyebrow, greeting, name, title, description, and call-to-action buttons</p>
          </div>
        </div>
        <div className="text-gray-400">
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
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
            <Input
              value={h.eyebrow}
              onChange={(e) => updateForm('hero.eyebrow', e.target.value)}
              placeholder="WELCOME TO MY DIGITAL SPACE"
              disabled={!h.showEyebrow}
            />
            <p className="text-[10px] text-gray-400">Small uppercase text above the greeting. Typically a welcome message or tagline.</p>
          </div>

          {/* Greeting & Name */}
          <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-700/50 space-y-4">
            <div className="flex items-center gap-2">
              <Type size={14} className="text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Greeting & Name</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Field label="Greeting" required>
                    <Input
                      value={h.greeting}
                      onChange={(e) => updateForm('hero.greeting', e.target.value)}
                      placeholder="Hi, I'm"
                    />
                  </Field>
                  <Toggle checked={h.showGreeting} onChange={(v) => updateForm('hero.showGreeting', v)} label="" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Field label="Full Name" required>
                    <Input
                      value={h.fullName}
                      onChange={(e) => updateForm('hero.fullName', e.target.value)}
                      placeholder="Your name"
                    />
                  </Field>
                  <Toggle checked={h.showName} onChange={(v) => updateForm('hero.showName', v)} label="" />
                </div>
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
              <Input
                value={h.professionalBadge}
                onChange={(e) => updateForm('hero.professionalBadge', e.target.value)}
                placeholder="e.g. Fullstack Developer"
                disabled={!h.showTitle}
              />
            </Field>
            <Field label="Typing Words" hint="Words that cycle in the typing animation (one per line or comma-separated).">
              <Input
                value={h.typingWords?.join(', ') || ''}
                onChange={(e) => updateForm('hero.typingWords', e.target.value.split(',').map(w => w.trim()).filter(Boolean))}
                placeholder="Fullstack Developer, UI/UX Designer, Problem Solver"
                disabled={!h.showTitle}
              />
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
              <Textarea
                value={h.shortIntroduction}
                onChange={(e) => updateForm('hero.shortIntroduction', e.target.value)}
                placeholder="I build scalable, high-performance web and mobile applications..."
                rows={3}
              />
            </Field>
          </div>

          {/* Call-to-Action Buttons */}
          <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-700/50 space-y-4">
            <div className="flex items-center gap-2">
              <MousePointer size={14} className="text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Call-to-Action Buttons</span>
            </div>

            {/* Primary CTA */}
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Primary Button</span>
                <Toggle checked={h.showPrimaryCta} onChange={(v) => updateForm('hero.showPrimaryCta', v)} label="Show" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Button Text">
                  <Input
                    value={h.primaryCtaText}
                    onChange={(e) => updateForm('hero.primaryCtaText', e.target.value)}
                    placeholder="Explore My Work"
                    disabled={!h.showPrimaryCta}
                  />
                </Field>
                <Field label="Button URL">
                  <UrlInput
                    value={h.primaryCtaUrl}
                    onChange={(e) => updateForm('hero.primaryCtaUrl', e.target.value)}
                    placeholder="#projects"
                    disabled={!h.showPrimaryCta}
                  />
                </Field>
              </div>
            </div>

            {/* Secondary CTA */}
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Secondary Button</span>
                <Toggle checked={h.showSecondaryCta} onChange={(v) => updateForm('hero.showSecondaryCta', v)} label="Show" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Button Text">
                  <Input
                    value={h.secondaryCtaText}
                    onChange={(e) => updateForm('hero.secondaryCtaText', e.target.value)}
                    placeholder="Get In Touch"
                    disabled={!h.showSecondaryCta}
                  />
                </Field>
                <Field label="Button URL">
                  <UrlInput
                    value={h.secondaryCtaUrl}
                    onChange={(e) => updateForm('hero.secondaryCtaUrl', e.target.value)}
                    placeholder="#contact"
                    disabled={!h.showSecondaryCta}
                  />
                </Field>
              </div>
            </div>
          </div>

          {/* Visibility Summary */}
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
  const [errors, setErrors] = useState({})

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

  function validate() {
    const newErrors = {}
    const h = form.hero
    if (!h.greeting?.trim()) newErrors.greeting = 'Greeting is required'
    if (!h.fullName?.trim()) newErrors.fullName = 'Name is required'
    if (h.primaryCtaUrl && !URL_PATTERN.test(h.primaryCtaUrl)) newErrors.primaryCtaUrl = 'Invalid URL'
    if (h.secondaryCtaUrl && !URL_PATTERN.test(h.secondaryCtaUrl)) newErrors.secondaryCtaUrl = 'Invalid URL'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleDiscard() {
    if (initialForm) setForm(JSON.parse(JSON.stringify(initialForm)))
    setConfirmDiscard(false)
    setErrors({})
    setToast({ message: 'Changes discarded', type: 'info' })
  }

  async function handleSubmit() {
    if (!validate()) {
      setToast({ message: 'Please fix validation errors', type: 'error' })
      return
    }

    setLoading(true)
    const payload = {
      hero: form.hero,
      published: form.published,
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
              Preview Homepage
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
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium ${
          form.published
            ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
            : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300'
        }`}>
          {form.published ? <CheckCircle2 size={16} /> : <Circle size={16} />}
          {form.published ? 'Published' : 'Draft'}
          {isDirty && (
            <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-primary/10 text-primary">
              Unsaved
            </span>
          )}
        </div>
      </motion.div>

      {/* Hero Section Card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <HeroSectionCard form={form} updateForm={updateForm} errors={errors} />
      </motion.div>

      {/* Confirm Save Modal */}
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

      {/* Confirm Discard Modal */}
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

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  )
}
