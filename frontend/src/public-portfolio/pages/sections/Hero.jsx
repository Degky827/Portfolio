import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ArrowRight, Award, BookOpen, Cpu, Users, Trophy, Shield, Terminal, GraduationCap, Heart, Briefcase, Coffee, Smile, Download, MapPin } from 'lucide-react'
import { useSiteSettings } from '../../../shared/context/SiteSettingsContext'

const iconMap = {
  Award, BookOpen, Cpu, Users, Trophy, Shield,
  Terminal, GraduationCap, Download, MapPin,
  Heart, Briefcase, Coffee, Smile,
}

function getIcon(name) {
  return iconMap[name] || Award
}

export default function Hero({ content, contactButtonText, contactButtonLink }) {
  const { t } = useTranslation()
  const { settings } = useSiteSettings()
  const [typedText, setTypedText] = useState('')
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const greeting = settings?.greeting || content?.greeting || t('hero.greeting')
  const fullName = settings?.brandName || content?.fullName || t('hero.fullName')
  const nameAmharic = settings?.nameAmharic || content?.nameAmharic || t('hero.nameAmharic')
  const badge = settings?.professionalBadge || content?.professionalBadge || t('hero.badge')
  const fullText = (settings?.typingWords?.length ? settings.typingWords : content?.typingWords)?.[0] || t('hero.typingText')
  const introduction = settings?.shortIntroduction || content?.shortIntroduction || t('hero.introduction')
  const profilePhotoUrl = content?.profilePhoto?.url || '/BDU1601297.png'
  const profilePhotoAlt = content?.profilePhoto?.alt || t('hero.profileAlt')
  const stats = content?.statistics?.length > 0
    ? content.statistics
    : [
        { label: t('hero.statTopCertifications'), value: '3+', icon: 'Award', color: '#6366f1' },
        { label: t('hero.statClassProjects'), value: '15+', icon: 'BookOpen', color: '#10b981' },
        { label: t('hero.statCoreSkills'), value: '30+', icon: 'Cpu', color: '#f59e0b' },
      ]
  const contactBtnText = settings?.contactButtonText || contactButtonText || t('hero.getInTouch')
  const contactBtnLink = settings?.contactButtonLink || contactButtonLink || '#contact'
  const ctaButtons = content?.ctaButtons?.length > 0
    ? content.ctaButtons.map((btn, i) => i === 0 ? { ...btn, text: contactBtnText, link: contactBtnLink } : btn)
    : [{ text: contactBtnText, link: contactBtnLink, openNewTab: false, icon: 'ArrowRight' }]

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

      <div className="container mx-auto px-4 sm:px-6 relative z-10 mt-20 md:mt-16">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex justify-center"
        >
          <motion.div 
            variants={itemVariants}
            className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 p-6 sm:p-8 md:p-14 lg:p-16 rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] lg:rounded-[3.5rem] flex flex-col lg:flex-row items-center gap-8 md:gap-12 lg:gap-16 max-w-5xl lg:max-w-6xl xl:max-w-7xl relative overflow-hidden w-full shadow-sm"
          >
            {/* Image Wrapper */}
              <motion.div 
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="relative flex-shrink-0"
            >
              <div className="w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64 lg:w-72 lg:h-72 relative">
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
                    {/* subtle glow */}
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
            </motion.div>

            {/* Content */}
            <motion.div 
              variants={itemVariants}
              className="flex-1 text-center lg:text-left space-y-4 sm:space-y-6 md:space-y-8"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-gray-900 dark:text-[#F8FAFC] leading-tight">
                {greeting}{' '}
                <span className="text-primary">
                  <span className="inline-flex items-center justify-center h-8 sm:h-10 px-1.5 rounded-xl bg-[#6366f1] text-white text-[9px] sm:text-[11px] font-black mr-1.5 -mt-1 align-middle shadow-lg">
                    {nameAmharic}
                  </span>{' '}
                  {fullName}
                </span>
                <br />
                <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-gray-600 dark:text-[#94A3B8]">
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
                className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-500 dark:text-[#94A3B8] max-w-2xl lg:max-w-none leading-relaxed"
                dangerouslySetInnerHTML={{ __html: introduction }}
              />

              <motion.div 
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
              >
                {ctaButtons.map((btn, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCtaClick(btn)}
                    className="group flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-primary hover:bg-[#4F46E5] text-white font-bold rounded-full transition-all shadow-lg"
                  >
                    {btn.text || t('hero.getInTouch')}
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                ))}
              </motion.div>

              {/* Stats */}
              <motion.div variants={itemVariants} className="flex gap-6 sm:gap-10 lg:gap-12 justify-center lg:justify-start pt-6 sm:pt-10 border-t border-gray-100 dark:border-neutral-800">
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
