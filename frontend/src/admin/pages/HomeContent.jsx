import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Save, RefreshCw, Layout, User, ArrowRight, BarChart3, Share2,
  FileText, Palette, Search, Plus, Trash2, GripVertical,
} from 'lucide-react'
import PageHeader from '../components/PageHeader'
import ImageUpload from '../components/ImageUpload'
import FileUpload from '../components/FileUpload'
import Toast from '../components/Toast'
import { getHomeContent, updateHomeContent } from '../../services/homeContentService'

const TABS = [
  { id: 'hero', label: 'Hero', icon: Layout },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'cta', label: 'CTA', icon: ArrowRight },
  { id: 'statistics', label: 'Statistics', icon: BarChart3 },
  { id: 'social', label: 'Social Links', icon: Share2 },
  { id: 'resume', label: 'Resume', icon: FileText },
  { id: 'theme', label: 'Theme', icon: Palette },
  { id: 'seo', label: 'SEO', icon: Search },
]

const ICON_OPTIONS = [
  'Award', 'BookOpen', 'Cpu', 'Code2', 'Globe', 'Rocket', 'Star', 'Zap',
  'Users', 'Trophy', 'Shield', 'Wifi', 'Server', 'Palette', 'Video',
  'Terminal', 'GraduationCap', 'Sparkles', 'Download', 'MapPin',
  'Heart', 'Briefcase', 'Coffee', 'Smile',
]

const COLOR_OPTIONS = [
  { label: 'Indigo', value: '#6366f1' },
  { label: 'Emerald', value: '#10b981' },
  { label: 'Amber', value: '#f59e0b' },
  { label: 'Blue', value: '#3b82f6' },
  { label: 'Red', value: '#ef4444' },
  { label: 'Pink', value: '#ec4899' },
  { label: 'Cyan', value: '#06b6d4' },
  { label: 'Orange', value: '#f97316' },
  { label: 'Purple', value: '#8b5cf6' },
  { label: 'Teal', value: '#14b8a6' },
]

const defaultForm = {
  hero: {
    greeting: "Hi, I'm",
    fullName: 'Desalegn',
    nameAmharic: 'ደካ',
    professionalBadge: 'Student Developer',
    typingWords: [],
    shortIntroduction: '',
    profilePhoto: { url: '', alt: '' },
    statistics: [],
    ctaButtons: [],
  },
  about: {
    title: 'Get to Know Me',
    subtitle: '',
    sections: [],
    achievements: [],
    location: 'Bahirdar',
    yearsOfExperience: 5,
    statClients: '50+ Clients',
    statNetwork: 'Network Designer',
  },
  cta: {
    title: '',
    subtitle: '',
    buttonText: 'Get In Touch',
    buttonLink: '#contact',
    backgroundImage: '',
  },
  socialLinks: {
    github: '', linkedin: '', telegram: '', twitter: '',
    facebook: '', instagram: '', youtube: '', email: '',
  },
  resume: {
    url: '',
    fileName: 'Resume.pdf',
  },
  theme: {
    primaryColor: '#6366f1',
    secondaryColor: '#10b981',
    accentColor: '#f59e0b',
  },
  seo: {
    metaTitle: '',
    metaDescription: '',
    metaKeywords: [],
    ogImage: '',
  },
  logoImage: '',
  logoText: '',

  resumeButtonText: 'Download CV',

  contactButtonText: 'Get In Touch',
  contactButtonLink: '#contact',

  published: false,
}

function Card({ children, className = '' }) {
  return (
    <div className={`bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 space-y-5 ${className}`}>
      {children}
    </div>
  )
}

function Field({ label, children, help }) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
        {label}
      </label>
      {children}
      {help && <p className="text-xs text-gray-400 mt-1">{help}</p>}
    </div>
  )
}

function Input({ value, onChange, placeholder, type = 'text', className = '' }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${className}`}
    />
  )
}

function Textarea({ value, onChange, placeholder, rows = 4 }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      rows={rows}
      placeholder={placeholder}
      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
    />
  )
}

function DynamicList({ items, onAdd, onRemove, onChange, renderItem, addLabel = 'Add', emptyText = 'No items' }) {
  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <p className="text-sm text-gray-400 italic">{emptyText}</p>
      )}
      {items.map((item, index) => (
        <div key={index} className="flex items-start gap-2">
          <div className="flex-1">{renderItem(item, index)}</div>
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="mt-2 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={onAdd}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-xl transition-colors"
      >
        <Plus size={16} />
        {addLabel}
      </button>
    </div>
  )
}

export default function HomeContent() {
  const [form, setForm] = useState(defaultForm)
  const [activeTab, setActiveTab] = useState('hero')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    ;(async () => {
      try {
        const { content } = await getHomeContent()
        if (content) {
          setForm({
            hero: {
              greeting: content.hero?.greeting ?? defaultForm.hero.greeting,
              fullName: content.hero?.fullName ?? defaultForm.hero.fullName,
              nameAmharic: content.hero?.nameAmharic ?? defaultForm.hero.nameAmharic,
              professionalBadge: content.hero?.professionalBadge ?? defaultForm.hero.professionalBadge,
              typingWords: content.hero?.typingWords ?? [],
              shortIntroduction: content.hero?.shortIntroduction ?? '',
              profilePhoto: {
                url: content.hero?.profilePhoto?.url ?? '',
                alt: content.hero?.profilePhoto?.alt ?? '',
              },
              statistics: content.hero?.statistics ?? [],
              ctaButtons: content.hero?.ctaButtons ?? [],
            },
            about: {
              title: content.about?.title ?? defaultForm.about.title,
              subtitle: content.about?.subtitle ?? '',
              sections: content.about?.sections ?? [],
              achievements: content.about?.achievements ?? [],
              location: content.about?.location ?? defaultForm.about.location,
              yearsOfExperience: content.about?.yearsOfExperience ?? 5,
              statClients: content.about?.statClients ?? defaultForm.about.statClients,
              statNetwork: content.about?.statNetwork ?? defaultForm.about.statNetwork,
            },
            cta: {
              title: content.cta?.title ?? '',
              subtitle: content.cta?.subtitle ?? '',
              buttonText: content.cta?.buttonText ?? defaultForm.cta.buttonText,
              buttonLink: content.cta?.buttonLink ?? defaultForm.cta.buttonLink,
              backgroundImage: content.cta?.backgroundImage ?? '',
            },
            socialLinks: {
              github: content.socialLinks?.github ?? '',
              linkedin: content.socialLinks?.linkedin ?? '',
              telegram: content.socialLinks?.telegram ?? '',
              twitter: content.socialLinks?.twitter ?? '',
              facebook: content.socialLinks?.facebook ?? '',
              instagram: content.socialLinks?.instagram ?? '',
              youtube: content.socialLinks?.youtube ?? '',
              email: content.socialLinks?.email ?? '',
            },
            resume: {
              url: content.resume?.url ?? '',
              fileName: content.resume?.fileName ?? 'Resume.pdf',
            },
            theme: {
              primaryColor: content.theme?.primaryColor ?? '#6366f1',
              secondaryColor: content.theme?.secondaryColor ?? '#10b981',
              accentColor: content.theme?.accentColor ?? '#f59e0b',
            },
            seo: {
              metaTitle: content.seo?.metaTitle ?? '',
              metaDescription: content.seo?.metaDescription ?? '',
              metaKeywords: content.seo?.metaKeywords ?? [],
              ogImage: content.seo?.ogImage ?? '',
            },
            logoImage: content.logoImage ?? '',
            logoText: content.logoText ?? '',
            resumeButtonText: content.resumeButtonText ?? 'Download CV',
            contactButtonText: content.contactButtonText ?? 'Get In Touch',
            contactButtonLink: content.contactButtonLink ?? '#contact',
            published: content.published ?? false,
          })
        }
      } catch {
        setToast({ message: 'Failed to load home content', type: 'error' })
      } finally {
        setFetching(false)
      }
    })()
  }, [])

  function updateForm(path, value) {
    setForm((prev) => {
      const keys = path.split('.')
      const newForm = { ...prev }
      let obj = newForm
      for (let i = 0; i < keys.length - 1; i++) {
        obj[keys[i]] = { ...obj[keys[i]] }
        obj = obj[keys[i]]
      }
      obj[keys[keys.length - 1]] = value
      return newForm
    })
  }

  function handleImageChange(formField) {
    return (val) => {
      updateForm(formField, val || '')
    }
  }

  function addStat() {
    updateForm('hero.statistics', [
      ...form.hero.statistics,
      { label: '', value: '', icon: 'Award', color: '#6366f1' },
    ])
  }

  function removeStat(index) {
    const arr = form.hero.statistics.filter((_, i) => i !== index)
    updateForm('hero.statistics', arr)
  }

  function updateStat(index, field, value) {
    const arr = form.hero.statistics.map((s, i) =>
      i === index ? { ...s, [field]: value } : s,
    )
    updateForm('hero.statistics', arr)
  }

  function addTypingWord() {
    updateForm('hero.typingWords', [...form.hero.typingWords, ''])
  }

  function removeTypingWord(index) {
    const arr = form.hero.typingWords.filter((_, i) => i !== index)
    updateForm('hero.typingWords', arr)
  }

  function updateTypingWord(index, value) {
    const arr = form.hero.typingWords.map((w, i) => (i === index ? value : w))
    updateForm('hero.typingWords', arr)
  }

  function addCtaButton() {
    updateForm('hero.ctaButtons', [
      ...form.hero.ctaButtons,
      { text: '', link: '', openNewTab: false, icon: 'ArrowRight' },
    ])
  }

  function removeCtaButton(index) {
    const arr = form.hero.ctaButtons.filter((_, i) => i !== index)
    updateForm('hero.ctaButtons', arr)
  }

  function updateCtaButton(index, field, value) {
    const arr = form.hero.ctaButtons.map((btn, i) =>
      i === index ? { ...btn, [field]: value } : btn,
    )
    updateForm('hero.ctaButtons', arr)
  }

  function addAchievement() {
    updateForm('about.achievements', [
      ...form.about.achievements,
      { title: '' },
    ])
  }

  function removeAchievement(index) {
    const arr = form.about.achievements.filter((_, i) => i !== index)
    updateForm('about.achievements', arr)
  }

  function updateAchievement(index, value) {
    const arr = form.about.achievements.map((a, i) =>
      i === index ? { ...a, title: value } : a,
    )
    updateForm('about.achievements', arr)
  }

  function addKeyword() {
    updateForm('seo.metaKeywords', [...form.seo.metaKeywords, ''])
  }

  function removeKeyword(index) {
    const arr = form.seo.metaKeywords.filter((_, i) => i !== index)
    updateForm('seo.metaKeywords', arr)
  }

  function updateKeyword(index, value) {
    const arr = form.seo.metaKeywords.map((k, i) => (i === index ? value : k))
    updateForm('seo.metaKeywords', arr)
  }

  function addSection() {
    updateForm('about.sections', [
      ...form.about.sections,
      { title: '', content: '' },
    ])
  }

  function removeSection(index) {
    const arr = form.about.sections.filter((_, i) => i !== index)
    updateForm('about.sections', arr)
  }

  function updateSection(index, field, value) {
    const arr = form.about.sections.map((s, i) =>
      i === index ? { ...s, [field]: value } : s,
    )
    updateForm('about.sections', arr)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    const payload = {
      hero: {
        greeting: form.hero.greeting,
        fullName: form.hero.fullName,
        nameAmharic: form.hero.nameAmharic,
        professionalBadge: form.hero.professionalBadge,
        shortIntroduction: form.hero.shortIntroduction,
        typingWords: form.hero.typingWords,
        profilePhoto: {
          url: form.hero.profilePhoto.url || '',
          alt: form.hero.profilePhoto.alt,
        },
        statistics: form.hero.statistics,
        ctaButtons: form.hero.ctaButtons,
      },
      about: {
        title: form.about.title,
        subtitle: form.about.subtitle,
        sections: form.about.sections,
        achievements: form.about.achievements,
        location: form.about.location,
        yearsOfExperience: form.about.yearsOfExperience,
        statClients: form.about.statClients,
        statNetwork: form.about.statNetwork,
      },
      cta: {
        title: form.cta.title,
        subtitle: form.cta.subtitle,
        buttonText: form.cta.buttonText,
        buttonLink: form.cta.buttonLink,
        backgroundImage: form.cta.backgroundImage || '',
      },
      socialLinks: form.socialLinks,
      resume: {
        url: form.resume.url,
        fileName: form.resume.fileName,
      },
      theme: {
        primaryColor: form.theme.primaryColor,
        secondaryColor: form.theme.secondaryColor,
        accentColor: form.theme.accentColor,
      },
      seo: {
        metaTitle: form.seo.metaTitle,
        metaDescription: form.seo.metaDescription,
        metaKeywords: form.seo.metaKeywords,
        ogImage: form.seo.ogImage || '',
      },
      logoImage: form.logoImage || '',
      logoText: form.logoText,
      resumeButtonText: form.resumeButtonText,
      contactButtonText: form.contactButtonText,
      contactButtonLink: form.contactButtonLink,
      published: form.published,
    }

    try {
      const { content } = await updateHomeContent(payload)
      setForm((prev) => ({
        ...prev,
        logoImage: content.logoImage ?? prev.logoImage,
        logoText: content.logoText ?? prev.logoText,
        resumeButtonText: content.resumeButtonText ?? prev.resumeButtonText,
        contactButtonText: content.contactButtonText ?? prev.contactButtonText,
        contactButtonLink: content.contactButtonLink ?? prev.contactButtonLink,
        hero: {
          ...prev.hero,
          profilePhoto: {
            url: content.hero?.profilePhoto?.url ?? prev.hero.profilePhoto.url,
            alt: content.hero?.profilePhoto?.alt ?? prev.hero.profilePhoto.alt,
          },
        },
        cta: {
          ...prev.cta,
          backgroundImage: content.cta?.backgroundImage ?? prev.cta.backgroundImage,
        },
        seo: {
          ...prev.seo,
          ogImage: content.seo?.ogImage ?? prev.seo.ogImage,
        },
      }))
      setToast({ message: 'Home content saved successfully', type: 'success' })
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Failed to save home content',
        type: 'error',
      })
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
      <PageHeader
        title="Home Content"
        subtitle="Manage all content on your homepage — hero, profile, CTA, statistics, social links, resume, theme, and SEO."
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-none">
          {TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'text-white'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary rounded-xl"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon size={16} className="relative z-10" />
                <span className="relative z-10">{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* ─── HERO TAB ─────────────────────────────────────────────────── */}
            {activeTab === 'hero' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Hero Identity</h3>
                    <Field label="Greeting">
                      <Input
                        value={form.hero.greeting}
                        onChange={(e) => updateForm('hero.greeting', e.target.value)}
                        placeholder="Hi, I'm"
                      />
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Full Name">
                        <Input
                          value={form.hero.fullName}
                          onChange={(e) => updateForm('hero.fullName', e.target.value)}
                          placeholder="Desalegn"
                        />
                      </Field>
                      <Field label="Name (Amharic)">
                        <Input
                          value={form.hero.nameAmharic}
                          onChange={(e) => updateForm('hero.nameAmharic', e.target.value)}
                          placeholder="ደካ"
                        />
                      </Field>
                    </div>
                    <Field label="Professional Badge">
                      <Input
                        value={form.hero.professionalBadge}
                        onChange={(e) => updateForm('hero.professionalBadge', e.target.value)}
                        placeholder="Student Developer"
                      />
                    </Field>
                  </Card>

                  <Card>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Typing Animation Words</h3>
                    <p className="text-sm text-gray-400">Each word will be typed out sequentially in the hero animation.</p>
                    <DynamicList
                      items={form.hero.typingWords}
                      onAdd={addTypingWord}
                      onRemove={removeTypingWord}
                      addLabel="Add Word"
                      emptyText="No typing words configured"
                      renderItem={(word, i) => (
                        <Input
                          value={word}
                          onChange={(e) => updateTypingWord(i, e.target.value)}
                          placeholder="e.g. Full Stack Developer"
                        />
                      )}
                    />
                  </Card>

                  <Card>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Short Introduction</h3>
                    <Field label="Description">
                      <Textarea
                        value={form.hero.shortIntroduction}
                        onChange={(e) => updateForm('hero.shortIntroduction', e.target.value)}
                        placeholder="A brief description about yourself..."
                        rows={4}
                      />
                    </Field>
                  </Card>

                  <Card>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">CTA Buttons</h3>
                    <DynamicList
                      items={form.hero.ctaButtons}
                      onAdd={addCtaButton}
                      onRemove={removeCtaButton}
                      addLabel="Add Button"
                      emptyText="No buttons configured"
                      renderItem={(btn, i) => (
                        <div className="space-y-3 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                          <div className="grid grid-cols-2 gap-3">
                            <Field label="Text">
                              <Input
                                value={btn.text}
                                onChange={(e) => updateCtaButton(i, 'text', e.target.value)}
                                placeholder="Get In Touch"
                              />
                            </Field>
                            <Field label="Link">
                              <Input
                                value={btn.link}
                                onChange={(e) => updateCtaButton(i, 'link', e.target.value)}
                                placeholder="#contact"
                              />
                            </Field>
                          </div>
                          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <input
                              type="checkbox"
                              checked={btn.openNewTab}
                              onChange={(e) => updateCtaButton(i, 'openNewTab', e.target.checked)}
                              className="rounded border-gray-300 dark:border-slate-700"
                            />
                            Open in new tab
                          </label>
                        </div>
                      )}
                    />
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Profile Photo</h3>
                    <Field label="Photo">
                      <ImageUpload
                        value={form.hero.profilePhoto.url}
                        onChange={handleImageChange('hero.profilePhoto.url')}
                        label="Profile Photo"
                        folder="profile-photos"
                      />
                    </Field>
                    <Field label="Alt Text">
                      <Input
                        value={form.hero.profilePhoto.alt}
                        onChange={(e) => updateForm('hero.profilePhoto.alt', e.target.value)}
                        placeholder="Desalegn Profile"
                      />
                    </Field>
                  </Card>

                  <Card>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Logo</h3>
                    <p className="text-sm text-gray-400">Upload your site logo. Supports PNG, JPG, SVG, WebP.</p>
                    <ImageUpload
                      value={form.logoImage}
                      onChange={handleImageChange('logoImage')}
                      label="Site Logo"
                      folder="logos"
                    />
                    <Field label="Logo Text">
                      <Input
                        value={form.logoText}
                        onChange={(e) => updateForm('logoText', e.target.value)}
                        placeholder="Desalegn Portfolio"
                      />
                    </Field>
                  </Card>
                </div>
              </div>
            )}

            {/* ─── PROFILE TAB ──────────────────────────────────────────────── */}
            {activeTab === 'profile' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">About Header</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Title">
                        <Input
                          value={form.about.title}
                          onChange={(e) => updateForm('about.title', e.target.value)}
                          placeholder="Get to Know Me"
                        />
                      </Field>
                      <Field label="Location">
                        <Input
                          value={form.about.location}
                          onChange={(e) => updateForm('about.location', e.target.value)}
                          placeholder="Bahirdar"
                        />
                      </Field>
                    </div>
                    <Field label="Subtitle">
                      <Textarea
                        value={form.about.subtitle}
                        onChange={(e) => updateForm('about.subtitle', e.target.value)}
                        placeholder="A short description about yourself..."
                        rows={3}
                      />
                    </Field>
                  </Card>

                  <Card>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Info Sections</h3>
                    <p className="text-sm text-gray-400">Each section becomes a card in the About panel.</p>
                    <DynamicList
                      items={form.about.sections}
                      onAdd={addSection}
                      onRemove={removeSection}
                      addLabel="Add Section"
                      emptyText="No sections configured"
                      renderItem={(section, i) => (
                        <div className="space-y-3 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                          <Field label="Section Title">
                            <Input
                              value={section.title}
                              onChange={(e) => updateSection(i, 'title', e.target.value)}
                              placeholder="e.g. Education & Background"
                            />
                          </Field>
                          <Field label="Content">
                            <Textarea
                              value={section.content}
                              onChange={(e) => updateSection(i, 'content', e.target.value)}
                              placeholder="Section content..."
                              rows={3}
                            />
                          </Field>
                        </div>
                      )}
                    />
                  </Card>

                  <Card>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Achievements / Certifications</h3>
                    <DynamicList
                      items={form.about.achievements}
                      onAdd={addAchievement}
                      onRemove={removeAchievement}
                      addLabel="Add Achievement"
                      emptyText="No achievements configured"
                      renderItem={(achievement, i) => (
                        <Input
                          value={achievement.title}
                          onChange={(e) => updateAchievement(i, e.target.value)}
                          placeholder="e.g. Ethio Coders"
                        />
                      )}
                    />
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Quick Stats</h3>
                    <Field label="Years of Experience">
                      <Input
                        type="number"
                        value={form.about.yearsOfExperience}
                        onChange={(e) => updateForm('about.yearsOfExperience', Number(e.target.value))}
                        placeholder="5"
                      />
                    </Field>
                    <Field label="Stat — Clients">
                      <Input
                        value={form.about.statClients}
                        onChange={(e) => updateForm('about.statClients', e.target.value)}
                        placeholder="50+ Clients"
                      />
                    </Field>
                    <Field label="Stat — Network">
                      <Input
                        value={form.about.statNetwork}
                        onChange={(e) => updateForm('about.statNetwork', e.target.value)}
                        placeholder="Network Designer"
                      />
                    </Field>
                  </Card>
                </div>
              </div>
            )}

            {/* ─── CTA TAB ──────────────────────────────────────────────────── */}
            {activeTab === 'cta' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Call to Action Section</h3>
                    <Field label="Title">
                      <Input
                        value={form.cta.title}
                        onChange={(e) => updateForm('cta.title', e.target.value)}
                        placeholder="Let's Work Together"
                      />
                    </Field>
                    <Field label="Subtitle">
                      <Textarea
                        value={form.cta.subtitle}
                        onChange={(e) => updateForm('cta.subtitle', e.target.value)}
                        placeholder="A compelling subtitle for the CTA section..."
                        rows={3}
                      />
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Button Text">
                        <Input
                          value={form.cta.buttonText}
                          onChange={(e) => updateForm('cta.buttonText', e.target.value)}
                          placeholder="Get In Touch"
                        />
                      </Field>
                      <Field label="Button Link">
                        <Input
                          value={form.cta.buttonLink}
                          onChange={(e) => updateForm('cta.buttonLink', e.target.value)}
                          placeholder="#contact"
                        />
                      </Field>
                    </div>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Hero Contact Button</h3>
                    <p className="text-sm text-gray-400">Configure the main "Get In Touch" button on the hero section.</p>
                    <Field label="Button Text">
                      <Input
                        value={form.contactButtonText}
                        onChange={(e) => updateForm('contactButtonText', e.target.value)}
                        placeholder="Get In Touch"
                      />
                    </Field>
                    <Field label="Button Link">
                      <Input
                        value={form.contactButtonLink}
                        onChange={(e) => updateForm('contactButtonLink', e.target.value)}
                        placeholder="#contact"
                      />
                    </Field>
                  </Card>
                  <Card>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Background Image</h3>
                    <ImageUpload
                      value={form.cta.backgroundImage}
                      onChange={handleImageChange('cta.backgroundImage')}
                      label="CTA Background"
                      folder="backgrounds"
                    />
                  </Card>
                </div>
              </div>
            )}

            {/* ─── STATISTICS TAB ───────────────────────────────────────────── */}
            {activeTab === 'statistics' && (
              <Card>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Hero Statistics</h3>
                <p className="text-sm text-gray-400">
                  These statistics appear below the hero introduction. Choose an icon, label, value, and accent color.
                </p>
                <DynamicList
                  items={form.hero.statistics}
                  onAdd={addStat}
                  onRemove={removeStat}
                  addLabel="Add Statistic"
                  emptyText="No statistics configured"
                  renderItem={(stat, i) => (
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                      <Field label="Icon">
                        <select
                          value={stat.icon}
                          onChange={(e) => updateStat(i, 'icon', e.target.value)}
                          className="w-full px-3 py-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                        >
                          {ICON_OPTIONS.map((icon) => (
                            <option key={icon} value={icon}>{icon}</option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Label">
                        <Input
                          value={stat.label}
                          onChange={(e) => updateStat(i, 'label', e.target.value)}
                          placeholder="Top Certifications"
                        />
                      </Field>
                      <Field label="Value">
                        <Input
                          value={stat.value}
                          onChange={(e) => updateStat(i, 'value', e.target.value)}
                          placeholder="3+"
                        />
                      </Field>
                      <Field label="Color">
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={stat.color || '#6366f1'}
                            onChange={(e) => updateStat(i, 'color', e.target.value)}
                            className="w-10 h-10 rounded-lg border border-gray-300 dark:border-slate-700 cursor-pointer"
                          />
                          <span className="text-xs text-gray-400 font-mono">{stat.color}</span>
                        </div>
                      </Field>
                    </div>
                  )}
                />
              </Card>
            )}

            {/* ─── SOCIAL LINKS TAB ─────────────────────────────────────────── */}
            {activeTab === 'social' && (
              <Card>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Social Links</h3>
                <p className="text-sm text-gray-400">Add your social media profile URLs. Leave empty to hide.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: 'github', label: 'GitHub', placeholder: 'https://github.com/username' },
                    { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/username' },
                    { key: 'telegram', label: 'Telegram', placeholder: 'https://t.me/username' },
                    { key: 'twitter', label: 'Twitter / X', placeholder: 'https://twitter.com/username' },
                    { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/username' },
                    { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/username' },
                    { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@channel' },
                    { key: 'email', label: 'Email', placeholder: 'mailto:hello@example.com' },
                  ].map(({ key, label, placeholder }) => (
                    <Field key={key} label={label}>
                      <Input
                        value={form.socialLinks[key]}
                        onChange={(e) => {
                          const links = { ...form.socialLinks, [key]: e.target.value }
                          updateForm('socialLinks', links)
                        }}
                        placeholder={placeholder}
                      />
                    </Field>
                  ))}
                </div>
              </Card>
            )}

            {/* ─── RESUME TAB ───────────────────────────────────────────────── */}
            {activeTab === 'resume' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Resume / CV</h3>
                    <p className="text-sm text-gray-400">Upload your resume PDF. The public download button will use this file.</p>
                    <FileUpload
                      value={form.resume.url}
                      onChange={(val) => updateForm('resume.url', val || '')}
                      label="Resume PDF"
                      folder="resumes"
                    />
                    <Field label="Resume File Name">
                      <Input
                        value={form.resume.fileName}
                        onChange={(e) => updateForm('resume.fileName', e.target.value)}
                        placeholder="Resume.pdf"
                      />
                    </Field>
                  </Card>
                </div>
                <div className="space-y-6">
                  <Card>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Download Button</h3>
                    <Field label="Button Text">
                      <Input
                        value={form.resumeButtonText}
                        onChange={(e) => updateForm('resumeButtonText', e.target.value)}
                        placeholder="Download CV"
                      />
                    </Field>
                    <Field label="Current Resume URL">
                      <Input
                        value={form.resume.url}
                        onChange={(e) => updateForm('resume.url', e.target.value)}
                        placeholder="https://res.cloudinary.com/..."
                      />
                      {form.resume.url && (
                        <p className="text-xs text-gray-400 mt-1 truncate">Current file: {form.resume.url.split('/').pop() || 'uploaded file'}</p>
                      )}
                    </Field>
                  </Card>
                </div>
              </div>
            )}

            {/* ─── THEME TAB ────────────────────────────────────────────────── */}
            {activeTab === 'theme' && (
              <Card>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Theme Colors</h3>
                <p className="text-sm text-gray-400">Customize the primary, secondary, and accent colors used across your portfolio.</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[
                    { key: 'primaryColor', label: 'Primary', default: '#6366f1' },
                    { key: 'secondaryColor', label: 'Secondary', default: '#10b981' },
                    { key: 'accentColor', label: 'Accent', default: '#f59e0b' },
                  ].map(({ key, label, default: def }) => (
                    <Field key={key} label={label}>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={form.theme[key]}
                          onChange={(e) => updateForm(`theme.${key}`, e.target.value)}
                          className="w-12 h-12 rounded-xl border border-gray-300 dark:border-slate-700 cursor-pointer"
                        />
                        <div className="flex-1">
                          <Input
                            value={form.theme[key]}
                            onChange={(e) => updateForm(`theme.${key}`, e.target.value)}
                            placeholder={def}
                          />
                        </div>
                      </div>
                      <div className="flex gap-1 mt-2">
                        {COLOR_OPTIONS.map((c) => (
                          <button
                            key={c.value}
                            type="button"
                            onClick={() => updateForm(`theme.${key}`, c.value)}
                            className={`w-6 h-6 rounded-full border-2 transition-all ${
                              form.theme[key] === c.value
                                ? 'border-gray-900 dark:border-white scale-110'
                                : 'border-transparent'
                            }`}
                            style={{ backgroundColor: c.value }}
                            title={c.label}
                          />
                        ))}
                      </div>
                    </Field>
                  ))}
                </div>
              </Card>
            )}

            {/* ─── SEO TAB ──────────────────────────────────────────────────── */}
            {activeTab === 'seo' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">SEO Meta</h3>
                    <Field label="Meta Title">
                      <Input
                        value={form.seo.metaTitle}
                        onChange={(e) => updateForm('seo.metaTitle', e.target.value)}
                        placeholder="Desalegn | Portfolio"
                      />
                    </Field>
                    <Field label="Meta Description">
                      <Textarea
                        value={form.seo.metaDescription}
                        onChange={(e) => updateForm('seo.metaDescription', e.target.value)}
                        placeholder="A brief description for search engines..."
                        rows={3}
                      />
                    </Field>
                    <Field label="Meta Keywords">
                      <DynamicList
                        items={form.seo.metaKeywords}
                        onAdd={addKeyword}
                        onRemove={removeKeyword}
                        addLabel="Add Keyword"
                        emptyText="No keywords configured"
                        renderItem={(kw, i) => (
                          <Input
                            value={kw}
                            onChange={(e) => updateKeyword(i, e.target.value)}
                            placeholder="e.g. portfolio, developer"
                          />
                        )}
                      />
                    </Field>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">OG Image</h3>
                    <p className="text-sm text-gray-400">Image shown when your portfolio is shared on social media.</p>
                    <ImageUpload
                      value={form.seo.ogImage}
                      onChange={handleImageChange('seo.ogImage')}
                      label="OG Image"
                      folder="og-images"
                    />
                  </Card>

                  <Card>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Publishing</h3>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div
                        role="checkbox"
                        tabIndex={0}
                        aria-checked={form.published}
                        onClick={() => updateForm('published', !form.published)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); updateForm('published', !form.published) } }}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          form.published ? 'bg-primary' : 'bg-gray-300 dark:bg-slate-700'
                        }`}
                      >
                        <motion.div
                          animate={{ x: form.published ? 24 : 2 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          className="absolute top-1 w-5 h-5 bg-white rounded-full shadow"
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {form.published ? 'Published' : 'Draft'}
                      </span>
                    </label>
                    <p className="text-xs text-gray-400 mt-1">
                      When published, the homepage will show this content. When in draft, the previous published version is shown.
                    </p>
                  </Card>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Save Button */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-slate-800">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
