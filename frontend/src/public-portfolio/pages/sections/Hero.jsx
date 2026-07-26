import { useEffect, useState, lazy, Suspense, useCallback, useRef, memo } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useSiteSettings } from '../../../shared/context/SiteSettingsContext'

const HeroDesktopScene = lazy(() =>
  import('../../components/3d/HeroDesktopScene')
)

function useTypingEffect(fullText) {
  const [typedText, setTypedText] = useState('')

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

  return typedText
}

function Hero({ content, contactButtonText, contactButtonTextAm, contactButtonLink }) {
  const { t, i18n } = useTranslation()
  const { settings } = useSiteSettings()
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

  const typedText = useTypingEffect(fullText)

  const profileData = {
    name: fullName,
    badge,
    stats,
    skills: [
      { name: 'React', level: 92, color: '#61dafb', icon: '⚛' },
      { name: 'Node.js', level: 85, color: '#68a063', icon: '⬢' },
      { name: 'Three.js', level: 78, color: '#8b5cf6', icon: '△' },
      { name: 'Flutter', level: 70, color: '#02569b', icon: '◆' },
    ],
    socialLinks: settings?.socialLinks || {},
    ctaButtons: ctaButtons.filter(b => b.text || b.link),
    introduction,
    profilePhotoUrl,
  }

  const scrollToContact = useCallback(() => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <section id="home" className="relative min-h-screen overflow-hidden bg-white dark:bg-black transition-colors duration-500">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-transparent dark:bg-gradient-to-b dark:from-[#0B1120] dark:to-[#111827]" />
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(rgba(99, 102, 241, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Full-screen 3D Desktop Scene */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        }>
          <HeroDesktopScene className="w-full h-full" profileData={profileData} />
        </Suspense>
      </div>

      {/* Floating HTML Overlay */}
      <div className="relative z-10 min-h-screen flex flex-col pointer-events-none">
        {/* Top-left greeting overlay */}
        <motion.div
          initial={{ opacity: 0, x: -40, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="pt-16 sm:pt-20 md:pt-24 pl-6 sm:pl-10 md:pl-14 lg:pl-20 max-w-xl"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 dark:text-[#F8FAFC] leading-tight drop-shadow-lg">
            {greeting}{' '}
            <span className="text-primary">
              <span className="inline-flex items-center justify-center h-6 sm:h-7 md:h-8 px-1.5 rounded-lg bg-[#6366f1] text-white text-[8px] sm:text-[9px] md:text-[11px] font-black mr-1.5 -mt-0.5 align-middle shadow-lg">
                {nameAmharic}
              </span>{' '}
              {fullName}
            </span>
            <br />
            <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-[var(--text-secondary)] drop-shadow-md">
              {typedText}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="inline-block w-0.5 h-5 sm:h-6 md:h-7 ml-1 bg-primary"
              />
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-4 sm:mt-5 md:mt-6 text-xs sm:text-sm md:text-base text-[var(--text-secondary)] leading-relaxed drop-shadow-sm"
            dangerouslySetInnerHTML={{ __html: introduction }}
          />
        </motion.div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="pointer-events-auto px-6 sm:px-10 md:px-14 lg:px-20 pb-4"
        >
          <div className="flex gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-center">
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center gap-2 sm:gap-3">
                <div
                  className="p-1.5 sm:p-2 rounded-lg backdrop-blur-sm"
                  style={{ backgroundColor: `${stat.color}1A`, color: stat.color }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-black text-gray-900 dark:text-[#F8FAFC] leading-none">{stat.value}</span>
                  <span className="text-[7px] sm:text-[8px] md:text-[9px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 sm:gap-3 text-gray-400 dark:text-gray-500 cursor-pointer group pointer-events-auto"
          onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <span className="text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] group-hover:text-primary transition-colors">{t('hero.discoverMore')}</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-5 h-8 sm:w-6 sm:h-10 md:w-7 md:h-12 border-2 border-gray-300 dark:border-neutral-800 rounded-full flex justify-center p-1 group-hover:border-primary transition-colors"
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
              className="w-1 h-2.5 bg-primary rounded-full"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default memo(Hero)
