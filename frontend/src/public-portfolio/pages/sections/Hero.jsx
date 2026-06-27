import { useEffect, useState, lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ArrowRight, Award, BookOpen, Cpu, Users, Trophy, Shield, Terminal, GraduationCap, Heart, Briefcase, Coffee, Smile, Download, MapPin, ExternalLink } from 'lucide-react'
import { useSiteSettings } from '../../../shared/context/SiteSettingsContext'

const HeroDesktopScene = lazy(() =>
  import('../../components/3d/HeroDesktopScene')
)

const iconMap = {
  Award, BookOpen, Cpu, Users, Trophy, Shield,
  Terminal, GraduationCap, Download, MapPin,
  Heart, Briefcase, Coffee, Smile,
}

function getIcon(name) {
  return iconMap[name] || Award
}

const GithubIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>
)
const LinkedinIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
)
const TelegramIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/></svg>
)
const TwitterIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
)
const FacebookIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
)
const InstagramIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
)
const YoutubeIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
)
const EmailIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
)
const socialIconMap = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  telegram: TelegramIcon,
  twitter: TwitterIcon,
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  youtube: YoutubeIcon,
  email: EmailIcon,
}

export default function Hero({ content, contactButtonText, contactButtonTextAm, contactButtonLink }) {
  const { t, i18n } = useTranslation()
  const { settings } = useSiteSettings()
  const [typedText, setTypedText] = useState('')
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const isAm = i18n.language === 'am'

  const greeting = isAm ? (settings?.greetingAm || content?.greetingAm || settings?.greeting || content?.greeting || t('hero.greeting')) : (settings?.greeting || content?.greeting || t('hero.greeting'))
  const fullName = isAm ? (settings?.brandNameAm || content?.fullNameAm || settings?.brandName || content?.fullName || t('hero.fullName')) : (settings?.brandName || content?.fullName || t('hero.fullName'))
  const nameAmharic = settings?.nameAmharic || content?.nameAmharic || t('hero.nameAmharic')
  const badge = isAm ? (settings?.professionalBadgeAm || content?.professionalBadgeAm || settings?.professionalBadge || content?.professionalBadge || t('hero.badge')) : (settings?.professionalBadge || content?.professionalBadge || t('hero.badge'))
  const fullText = isAm
    ? ((settings?.typingWordsAm?.length ? settings.typingWordsAm : content?.typingWordsAm)?.[0] || (settings?.typingWords?.length ? settings.typingWords : content?.typingWords)?.[0] || t('hero.typingText'))
    : ((settings?.typingWords?.length ? settings.typingWords : content?.typingWords)?.[0] || t('hero.typingText'))
  const introduction = isAm ? (settings?.shortIntroductionAm || content?.shortIntroductionAm || settings?.shortIntroduction || content?.shortIntroduction || t('hero.introduction')) : (settings?.shortIntroduction || content?.shortIntroduction || t('hero.introduction'))
  const profilePhotoUrl = content?.profilePhoto?.url || '/BDU1601297.png'
  const profilePhotoAlt = content?.profilePhoto?.alt || t('hero.profileAlt')
  const stats = content?.statistics?.length > 0
    ? content.statistics
    : [
        { label: t('hero.statTopCertifications'), value: '3+', icon: 'Award', color: '#6366f1' },
        { label: t('hero.statClassProjects'), value: '15+', icon: 'BookOpen', color: '#10b981' },
        { label: t('hero.statCoreSkills'), value: '30+', icon: 'Cpu', color: '#f59e0b' },
      ]
  const contactBtnText = isAm ? (contactButtonTextAm || settings?.contactButtonTextAm || contactButtonText || t('hero.getInTouch')) : (settings?.contactButtonText || contactButtonText || t('hero.getInTouch'))
  const contactBtnLink = settings?.contactButtonLink || contactButtonLink || '#contact'
  const ctaButtons = content?.ctaButtons?.length > 0
    ? content.ctaButtons
    : [{ text: '', link: '', openNewTab: false, icon: 'ArrowRight' }]

  useEffect(() => {
    let index = 0
    setTypedText('')
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index))
        index++
      } else {
        clearInterval(timer)
      }
    }, 50)
    return () => clearInterval(timer)
  }, [fullText])

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleCtaClick = (btn) => {
    if (btn.openNewTab) {
      window.open(btn.link, '_blank')
    } else if (btn.link) {
      const id = btn.link.replace('#', '')
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
      else window.location.href = btn.link
    } else {
      scrollToContact()
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  }

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-white dark:bg-black transition-colors duration-500">
      {/* Subtle Background Gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-transparent dark:bg-gradient-to-b dark:from-[#0B1120] dark:to-[#111827]" />
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]" 
          style={{ 
            backgroundImage: 'linear-gradient(rgba(99, 102, 241, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px' 
          }} 
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex justify-center"
        >
          <motion.div 
            variants={itemVariants}
            className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 p-6 sm:p-8 md:p-10 lg:p-12 rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] lg:rounded-[3.5rem] grid grid-cols-1 lg:grid-cols-[45%_55%] items-stretch gap-8 md:gap-10 lg:gap-0 max-w-5xl lg:max-w-6xl xl:max-w-7xl relative overflow-hidden w-full shadow-sm"
          >
            {/* Left Column - 2D Content */}
            <div className="flex flex-col items-center lg:items-start">
              {/* Image Wrapper */}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="relative flex-shrink-0 flex flex-col items-center"
              >
                <div className="w-40 h-40 sm:w-52 sm:h-52 md:w-56 md:h-56 lg:w-64 lg:h-64 relative">
                  {/* Decorative animated progress rings (SVG) */}
                  <svg viewBox="0 0 200 200" className="absolute -inset-3 w-[calc(100%+24px)] h-[calc(100%+24px)] z-0 pointer-events-none" aria-hidden="true">
                    <defs>
                      <linearGradient id="g1" x1="0%" x2="100%">
                        <stop offset="0%" stopColor="#34d399" />
                        <stop offset="50%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#6366f1" />
                      </linearGradient>
                      <linearGradient id="g2" x1="0%" x2="100%">
                        <stop offset="0%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#f43f5e" />
                      </linearGradient>
                    </defs>
                    <g transform="translate(100,100)">
                      <circle r="92" fill="none" stroke="url(#g1)" strokeWidth="6" strokeLinecap="round" strokeDasharray="40 260" opacity="0.95">
                        <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="8s" repeatCount="indefinite" />
                      </circle>
                      <circle r="74" fill="none" stroke="url(#g2)" strokeWidth="4" strokeLinecap="round" strokeDasharray="20 180" opacity="0.9">
                        <animateTransform attributeName="transform" type="rotate" from="360" to="0" dur="6s" repeatCount="indefinite" />
                      </circle>
                      <circle r="96" fill="none" stroke="#06b6d480" strokeWidth="8" />
                    </g>
                  </svg>

                  {/* Simple ring border */}
                  <div className="absolute inset-0 rounded-full border-2 border-primary/20 z-10" />
                  
                  {/* Portrait (animated) */}
                  <motion.div
                    className="absolute inset-[6px] rounded-full overflow-hidden z-20 bg-[#dce5f0] shadow-sm pt-[14px]"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <motion.img
                      src={profilePhotoUrl}
                      alt={profilePhotoAlt}
                      className="w-full h-full object-cover object-[center_18%]"
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.06 }}
                      transition={{ duration: 0.45 }}
                    />
                  </motion.div>
                </div>
                {/* Social Links */}
                <motion.div variants={itemVariants} className="flex gap-2 sm:gap-3 mt-4 sm:mt-6">
                  {Object.entries(settings?.socialLinks || {}).map(([platform, url]) => {
                    if (!url) return null
                    const Icon = socialIconMap[platform]
                    if (!Icon) return null
                    return (
                      <motion.a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.15, y: -2 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-600 dark:text-white hover:bg-primary hover:text-white transition-all shadow-sm"
                        title={platform}
                      >
                        <Icon size={16} />
                      </motion.a>
                    )
                  })}
                </motion.div>
              </motion.div>

              {/* Content */}
              <motion.div 
                variants={itemVariants}
                className="flex-1 text-center lg:text-left space-y-4 sm:space-y-6 md:space-y-8 mt-8 lg:mt-10"
              >
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black text-gray-900 dark:text-[#F8FAFC] leading-tight">
                  {greeting}{' '}
                  <span className="text-primary">
                    <span className="inline-flex items-center justify-center h-8 sm:h-10 px-1.5 rounded-xl bg-[#6366f1] text-white text-[9px] sm:text-[11px] font-black mr-1.5 -mt-1 align-middle shadow-lg">
                      {nameAmharic}
                    </span>{' '}
                    {fullName}
                  </span>
                  <br />
                  <span className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl text-gray-600 dark:text-[#94A3B8]">
                    {typedText}
                    <motion.span 
                      animate={{ opacity: [1, 0] }} 
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="inline-block w-0.5 h-6 sm:h-8 ml-1 bg-primary"
                    />
                  </span>
                </h1>

                <motion.p 
                  variants={itemVariants}
                  className="text-sm sm:text-base md:text-lg text-gray-500 dark:text-[#94A3B8] max-w-2xl lg:max-w-none leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: introduction }}
                />

                <motion.div 
                  variants={itemVariants}
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
                >
                  {/* Primary button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCtaClick({ text: contactBtnText, link: contactBtnLink })}
                    className="group flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-primary hover:bg-[#4F46E5] text-white font-bold rounded-full transition-all shadow-lg"
                  >
                    {contactBtnText}
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                  {/* Secondary buttons */}
                  {ctaButtons.map((btn, i) => {
                    if (!btn.text && !btn.link) return null
                    return (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCtaClick(btn)}
                        className="group flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold rounded-full transition-all"
                      >
                        {btn.text}
                        <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
                      </motion.button>
                    )
                  })}
                </motion.div>

                {/* Stats */}
                <motion.div variants={itemVariants} className="flex gap-6 sm:gap-10 lg:gap-12 justify-center lg:justify-start pt-6 sm:pt-8 border-t border-gray-100 dark:border-neutral-800">
                  {stats.map((stat, i) => {
                    const StatIcon = getIcon(stat.icon)
                    return (
                      <div key={i} className="flex items-center gap-2 sm:gap-4">
                        <div
                          className="p-2 sm:p-3 rounded-lg sm:rounded-xl"
                          style={{ backgroundColor: `${stat.color}1A`, color: stat.color }}
                        >
                          <StatIcon size={18} className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 dark:text-[#F8FAFC] leading-none">{stat.value}</span>
                          <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400">{stat.label}</span>
                        </div>
                      </div>
                    )
                  })}
                </motion.div>
              </motion.div>
            </div>

            {/* Right Column - 3D Desktop Scene */}
            <motion.div 
              variants={itemVariants}
              className="hidden lg:flex items-stretch justify-center relative p-4 xl:p-6"
            >
              <Suspense fallback={
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
              }>
                <HeroDesktopScene className="flex-1" />
              </Suspense>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 sm:gap-3 text-gray-400 dark:text-gray-500 cursor-pointer group"
        onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] group-hover:text-primary transition-colors">{t('hero.discoverMore')}</span>
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 sm:w-7 sm:h-12 border-2 border-gray-300 dark:border-neutral-800 rounded-full flex justify-center p-1.5 group-hover:border-primary transition-colors"
        >
          <motion.div 
            animate={{ 
              y: [0, 12, 0],
              opacity: [1, 0.3, 1]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-1.5 h-3 bg-primary rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
