import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Save, RefreshCw, Layout, User, ArrowRight, BarChart3, Share2,
  FileText, Palette, Search, Plus, Trash2, Eye, EyeOff,
  GraduationCap, Star, Type, Image, MousePointerClick, Medal,
  ChevronDown, Info,
} from 'lucide-react'
import PageHeader from '../shared/PageHeader'
import ImageUpload from '../shared/ImageUpload'
import FileUpload from '../shared/FileUpload'
import Toast from '../shared/Toast'
import { getHomeContent, updateHomeContent } from '../../shared/services/homeContentService'
import { updateSiteSettings } from '../../shared/services/siteSettingsService'
import { updateNavbarSettings } from '../../shared/services/navigationService'
import { updateFooterContent } from '../../shared/services/footerService'
import api, { getMediaUrl } from '../../shared/services/api'
import { useAuth } from '../authentication/AuthContext'
import { useSiteSettings } from '../../shared/context/SiteSettingsContext'

const ICON_OPTIONS = [
  'Award', 'BookOpen', 'Cpu', 'Code2', 'Globe', 'Rocket', 'Star', 'Zap',
  'Users', 'Trophy', 'Shield', 'Wifi', 'Server', 'Palette', 'Video',
  'Terminal', 'GraduationCap', 'Sparkles', 'Download', 'MapPin',
  'Heart', 'Briefcase', 'Coffee', 'Smile',
]



const UX_HINTS = {
  greeting: `How do you like to welcome visitors? "Hi, I'm" sets a friendly tone.`,
  fullName: `Your full name — the first thing people will remember about you.`,
  nameAmharic: `Your name in Amharic script (or any script that represents your heritage).`,
  professionalBadge: `What is your primary professional identity right now?`,
  typingWord: `What's the main role or specialty you want to be known for?`,
  shortIntroduction: `Sum up your technical expertise and passion in 2-3 welcoming sentences for someone discovering your work for the first time.`,
  profilePhoto: `A professional headshot or portrait creates a personal connection. Choose a photo that feels approachable and confident.`,
  ctaText: `What action do you want visitors to take? Keep it short and inviting.`,
  milestoneContext: `Describe what this milestone represents — when someone hovers, they'll see this context.`,
  seoDescription: `Sum up your technical expertise and passion in 2 welcoming sentences for someone discovering your work for the first time.`,
  metaTitle: `The title that appears in search results and browser tabs. Include your name and primary skill.`,
}

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
  theme: {
    primaryColor: '#6366f1',
    secondaryColor: '#10b981',
    accentColor: '#f59e0b',
  },
  seo: {
    metaTitle: '',
    metaDescription: '',
    metaKeywords: [],
  },
  logoImage: '',
  logoText: '',
  logoSubtitle: '',
  logoEnabled: true,
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

function Field({ label, children, hint }) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
        {label}
      </label>
      {children}
      {hint && (
        <p className="text-xs text-gray-400 mt-1.5 italic leading-relaxed flex items-start gap-1.5">
          <Info size={12} className="shrink-0 mt-0.5 text-gray-300" />
          {hint}
        </p>
      )}
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

function CardHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-start gap-3 pb-4 border-b border-gray-100 dark:border-slate-800">
      <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
        <Icon size={18} />
      </div>
      <div>
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">{title}</h3>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  )
}

function CollapsibleSection({ title, icon: Icon, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex items-center justify-between w-full px-6 py-4 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon size={18} className="text-gray-400" />
          {title}
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={16} className="text-gray-400" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 space-y-5 border-t border-gray-100 dark:border-slate-800 pt-5">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function LivePreview({ form }) {
  const h = form.hero
  const badge = h.professionalBadge || 'Student Developer'
  const greeting = h.greeting || "Hi, I'm"
  const fullName = h.fullName || 'Desalegn'
  const nameAmharic = h.nameAmharic || 'ደካ'
  const typingWord = h.typingWords?.[0] || 'Developer and Network Designer'
  const intro = h.shortIntroduction || 'Passionate about creating secure, scalable digital solutions.'
  const photoUrl = h.profilePhoto?.url || '/BDU1601297.png'
  const photoAlt = h.profilePhoto?.alt || 'Profile'
  const stats = h.statistics?.length > 0 ? h.statistics : []
  const ctaText = form.contactButtonText || 'Get In Touch'

  return (
    <div className="bg-white dark:bg-[#0B1120] rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden shadow-lg">
      <div className="px-3 py-2 bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
        <Eye size={12} />
        Live Preview
      </div>
      <div className="p-5 flex flex-col items-center text-center gap-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/5 rounded-full border border-primary/10">
          <GraduationCap size={10} className="text-primary" />
          <span className="text-[9px] font-bold text-primary uppercase tracking-[0.15em]">{badge}</span>
          <Star size={8} className="text-yellow-500 fill-yellow-500" />
        </div>

        <h2 className="text-lg font-black text-gray-900 dark:text-[#F8FAFC] leading-tight">
          {greeting}{' '}
          <span className="text-primary">
            <span className="inline-flex items-center justify-center h-5 px-1 rounded-md bg-primary text-white text-[7px] font-black mr-0.5 align-middle">
              {nameAmharic}
            </span>{' '}
            {fullName}
          </span>
        </h2>

        <p className="text-[11px] text-gray-500 dark:text-[#94A3B8] leading-relaxed line-clamp-2">{typingWord}</p>

        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20 shrink-0 bg-gray-100">
          <img src={photoUrl} alt={photoAlt} className="w-full h-full object-cover object-[center_18%]" />
        </div>

        <div className="flex items-center gap-2">
          <button className="px-4 py-1.5 bg-primary text-white text-[10px] font-bold rounded-full shadow">
            {ctaText}
          </button>
        </div>

        {stats.length > 0 && (
          <div className="flex gap-4 pt-3 border-t border-gray-100 dark:border-slate-700 w-full justify-center">
            {stats.slice(0, 3).map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-sm font-black text-gray-900 dark:text-[#F8FAFC] leading-none">{s.value}</p>
                <p className="text-[7px] font-black uppercase tracking-widest text-gray-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function HomeContent() {
  const { setUserData, user: authUser } = useAuth()
  const { settings, refreshSettings } = useSiteSettings()
  const [form, setForm] = useState(defaultForm)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [toast, setToast] = useState(null)
  const [previewOpen, setPreviewOpen] = useState(true)

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
            logoSubtitle: content.logoSubtitle ?? '',
            logoEnabled: content.logoEnabled ?? true,
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
    return (val) => updateForm(formField, val || '')
  }

  function addStat() {
    updateForm('hero.statistics', [
      ...form.hero.statistics,
      { label: '', value: '', icon: 'Award', color: '#6366f1', context: '' },
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
      theme: {
        primaryColor: form.theme.primaryColor,
        secondaryColor: form.theme.secondaryColor,
        accentColor: form.theme.accentColor,
      },
      seo: {
        metaTitle: form.seo.metaTitle,
        metaDescription: form.seo.metaDescription,
        metaKeywords: form.seo.metaKeywords,
      },
      logoImage: form.logoImage || '',
      logoText: form.logoText,
      logoSubtitle: form.logoSubtitle,
      logoEnabled: form.logoEnabled,
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
        logoSubtitle: content.logoSubtitle ?? prev.logoSubtitle,
        logoEnabled: content.logoEnabled ?? prev.logoEnabled,
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
        seo: { ...prev.seo },
      }))
      setToast({ message: 'Home content saved successfully', type: 'success' })
      try {
        const socialLinks = Object.fromEntries(
          Object.entries(form.socialLinks).filter(([, v]) => v)
        )
        await updateSiteSettings({
          brandName: form.hero.fullName,
          nameAmharic: form.hero.nameAmharic,
          professionalBadge: form.hero.professionalBadge,
          greeting: form.hero.greeting,
          shortIntroduction: form.hero.shortIntroduction,
          typingWords: form.hero.typingWords,
          logoImage: form.logoImage,
          logoText: form.logoText,
          logoSubtitle: form.logoSubtitle,
          logoEnabled: form.logoEnabled,
          contactButtonText: form.contactButtonText,
          contactButtonLink: form.contactButtonLink,
          socialLinks,
        })
      } catch {}
      try {
        await updateNavbarSettings({
          brandName: form.hero.fullName,
          logo: form.hero.profilePhoto?.url || '',
          logoAlt: form.hero.profilePhoto?.alt || '',
        })
      } catch {}
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
        subtitle="Shape your landing page story — every card below maps directly to a section visitors will see."
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex gap-4 lg:gap-8">
          {/* ── EDITOR PANEL ─────────────────────────────── */}
          <div className={`flex-1 space-y-6 ${previewOpen ? 'lg:max-w-[55%]' : 'lg:max-w-full'}`}>
            {/* ── CARD 1: Identity Badge & Greetings ───── */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader icon={GraduationCap} title="Identity Badge & Greetings" subtitle="This maps to the badge and 'Hi, I'm...' header at the top of your hero." />
                <Field label="Professional Badge" hint={UX_HINTS.professionalBadge}>
                  <Input
                    value={form.hero.professionalBadge}
                    onChange={(e) => updateForm('hero.professionalBadge', e.target.value)}
                    placeholder="e.g. Student Developer | Full-Stack Engineer | Cybersecurity Analyst"
                  />
                </Field>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Field label="Greeting" hint={UX_HINTS.greeting}>
                    <Input
                      value={form.hero.greeting}
                      onChange={(e) => updateForm('hero.greeting', e.target.value)}
                      placeholder="Hi, I'm"
                    />
                  </Field>
                  <Field label="Full Name" hint={UX_HINTS.fullName}>
                    <Input
                      value={form.hero.fullName}
                      onChange={(e) => updateForm('hero.fullName', e.target.value)}
                      placeholder="Your full name"
                    />
                  </Field>
                  <Field label="Name (Amharic / Script)" hint={UX_HINTS.nameAmharic}>
                    <Input
                      value={form.hero.nameAmharic}
                      onChange={(e) => updateForm('hero.nameAmharic', e.target.value)}
                      placeholder="ደካ"
                    />
                  </Field>
                </div>
              </Card>
            </motion.div>

            {/* ── CARD 2: Main Dynamic Title ───────────── */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <Card>
                <CardHeader icon={Type} title="Main Dynamic Title" subtitle="The animated typing headline and introduction paragraph beneath your name." />
                <Field label="Typing Animation Word" hint={UX_HINTS.typingWord}>
                  <Input
                    value={form.hero.typingWords?.[0] || ''}
                    onChange={(e) => {
                      const arr = [...form.hero.typingWords]
                      arr[0] = e.target.value
                      updateForm('hero.typingWords', arr)
                    }}
                    placeholder="e.g. Full Stack Developer | Network & Security Engineer | Creative Problem Solver"
                  />
                </Field>
                <Field label="Short Introduction" hint={UX_HINTS.shortIntroduction}>
                  <Textarea
                    value={form.hero.shortIntroduction}
                    onChange={(e) => updateForm('hero.shortIntroduction', e.target.value)}
                    placeholder="Passionate about creating secure, scalable digital solutions and designing robust network architectures..."
                    rows={3}
                  />
                </Field>
              </Card>
            </motion.div>

            {/* ── CARD 3: Profile Avatar ──────────────── */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card>
                <CardHeader icon={Image} title="Profile Avatar" subtitle="The circular portrait with animated rings that appears next to your introduction." />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Field label="Profile Photo" hint={UX_HINTS.profilePhoto}>
                    <ImageUpload
                      value={form.hero.profilePhoto.url}
                      onChange={handleImageChange('hero.profilePhoto.url')}
                      label="Upload Profile Photo"
                      folder="profile-photos"
                    />
                  </Field>
                  <Field label="Alt Text">
                    <Input
                      value={form.hero.profilePhoto.alt}
                      onChange={(e) => updateForm('hero.profilePhoto.alt', e.target.value)}
                      placeholder="Describe the photo for accessibility"
                    />
                  </Field>
                </div>
              </Card>
            </motion.div>

            {/* ── CARD 4: Social Links ──────────────── */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <Card>
                <CardHeader icon={Share2} title="Social Links" subtitle="Links appear under your profile photo with auto-generated platform icons." />
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
            </motion.div>

            {/* ── CARD 5: Primary Action ──────────────── */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card>
                <CardHeader icon={MousePointerClick} title="Primary Action" subtitle="The main 'Get In Touch' button and any secondary CTA buttons that appear below your introduction." />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Button Text" hint={UX_HINTS.ctaText}>
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
                </div>
                <div className="pt-2 border-t border-gray-100 dark:border-slate-800">
                  <DynamicList
                    items={form.hero.ctaButtons}
                    onAdd={addCtaButton}
                    onRemove={removeCtaButton}
                    addLabel="Add Secondary Button"
                    emptyText="No secondary buttons configured"
                    renderItem={(btn, i) => (
                      <div className="space-y-3 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                        <div className="grid grid-cols-2 gap-3">
                          <Field label="Text">
                            <Input
                              value={btn.text}
                              onChange={(e) => updateCtaButton(i, 'text', e.target.value)}
                              placeholder="e.g. View Projects"
                            />
                          </Field>
                          <Field label="Link">
                            <Input
                              value={btn.link}
                              onChange={(e) => updateCtaButton(i, 'link', e.target.value)}
                              placeholder="#projects"
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
                </div>
              </Card>
            </motion.div>

            {/* ── CARD 6: Professional Milestones ──────── */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <Card>
                <CardHeader icon={Medal} title="Professional Milestones" subtitle="The metrics row at the bottom of your hero — certifications, projects, skills, or any achievement you want to highlight." />
                <DynamicList
                  items={form.hero.statistics}
                  onAdd={addStat}
                  onRemove={removeStat}
                  addLabel="Add Milestone"
                  emptyText="No milestones configured — tell visitors what you've accomplished"
                  renderItem={(stat, i) => (
                    <div className="space-y-3 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-700">
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
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
                        <Field label="Value / Number">
                          <Input
                            value={stat.value}
                            onChange={(e) => updateStat(i, 'value', e.target.value)}
                            placeholder="e.g. 3+, 15+, 30+"
                          />
                        </Field>
                        <Field label="Label">
                          <Input
                            value={stat.label}
                            onChange={(e) => updateStat(i, 'label', e.target.value)}
                            placeholder="e.g. Top Certifications"
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
                      <Field label="Hover Context (Optional)" hint={UX_HINTS.milestoneContext}>
                        <Input
                          value={stat.context || ''}
                          onChange={(e) => updateStat(i, 'context', e.target.value)}
                          placeholder='e.g. "Top Certifications" instead of just "Certifications" — use contextual milestone terms like "Class Projects" or "Real-world Builds"'
                        />
                      </Field>
                    </div>
                  )}
                />
              </Card>
            </motion.div>

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
          </div>

          {/* ── PREVIEW PANEL ───────────────────────────── */}
          {previewOpen && (
            <div className="hidden lg:block lg:w-[40%] xl:w-[38%] shrink-0">
              <div className="sticky top-24 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Live Preview</span>
                  <button
                    type="button"
                    onClick={() => setPreviewOpen(false)}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    title="Hide preview"
                  >
                    <EyeOff size={16} />
                  </button>
                </div>
                <LivePreview form={form} />
                <p className="text-[10px] text-gray-400 leading-relaxed text-center">
                  Changes reflect instantly. This is a simplified view — the live public page includes full animations and responsive styling.
                </p>
              </div>
            </div>
          )}

          {!previewOpen && (
            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              className="hidden lg:flex fixed right-4 top-24 z-30 items-center gap-2 px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-medium text-gray-500 hover:text-primary shadow-lg transition-colors"
            >
              <Eye size={16} />
              Show Preview
            </button>
          )}
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


