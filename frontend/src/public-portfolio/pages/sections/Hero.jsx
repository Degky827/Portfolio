import { useEffect, useState, lazy, Suspense, useCallback, memo } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, MessageCircle } from 'lucide-react'
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

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] },
})

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.5, delay },
})

const technologies = [
  { name: 'React', icon: 'react' },
  { name: 'TypeScript', icon: 'typescript' },
  { name: 'PostgreSQL', icon: 'postgresql' },
  { name: 'Express', icon: 'express' },
  { name: 'Flutter', icon: 'flutter' },
]

function TechIcon({ name }) {
  const icons = {
    react: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#61DAFB" strokeWidth="1.5">
        <circle cx="12" cy="12" r="2.5" fill="#61DAFB" stroke="none" />
        <ellipse cx="12" cy="12" rx="10" ry="4" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
      </svg>
    ),
    nodejs: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="#68A063">
        <path d="M12 1.85c-.27 0-.55.07-.78.2l-7.44 4.3c-.48.28-.78.8-.78 1.36v8.58c0 .56.3 1.08.78 1.36l1.95 1.12c.95.46 1.27.46 1.71.46 1.4 0 2.21-.85 2.21-2.33V8.44c0-.12-.09-.21-.21-.21H8.22c-.12 0-.21.09-.21.21v8.06c0 .66-.68 1.31-1.77.76L4.16 16.2a.27.27 0 01-.13-.22V7.41c0-.09.05-.17.13-.22l7.44-4.29a.27.27 0 01.26 0l7.44 4.29c.08.05.13.13.13.22v8.58c0 .09-.05.17-.13.22l-7.44 4.29a.25.25 0 01-.25 0l-1.88-1.11c-.07-.04-.17-.05-.24-.02-.65.3-.78.32-1.39.51-.14.04-.36.11.08.34l2.48 1.47c.24.14.5.21.78.21s.55-.07.78-.2l7.44-4.3c.48-.28.78-.8.78-1.36V7.71c0-.56-.3-1.08-.78-1.36l-7.44-4.3c-.23-.13-.5-.2-.78-.2z" />
      </svg>
    ),
    typescript: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="#3178C6">
        <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 011.306.34v2.458a3.95 3.95 0 00-.643-.361 5.093 5.093 0 00-.717-.26 5.453 5.453 0 00-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 00-.623.242c-.17.104-.3.229-.393.374a.888.888 0 00-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 01-1.012 1.085 4.38 4.38 0 01-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 01-1.84-.164 5.544 5.544 0 01-1.512-.493v-2.63a5.033 5.033 0 003.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 00-.074-1.089 2.12 2.12 0 00-.537-.5 5.597 5.597 0 00-.807-.444 27.72 27.72 0 00-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 011.47-.629 7.536 7.536 0 011.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" />
      </svg>
    ),
    mongodb: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="#47A248">
        <path d="M17.193 9.555c-1.264-5.58-4.252-7.414-4.573-8.115-.28-.394-.53-.954-.735-1.44-.036.495-.055.685-.523 1.184-.723.566-4.438 3.682-4.74 10.02-.282 5.912 4.27 9.435 4.889 9.884l.07.05A73.49 73.49 0 0111.91 24h.481c.114-1.032.284-2.056.51-3.07.417-.296.604-.463.85-.693a11.342 11.342 0 003.639-8.464c.01-.814-.103-1.662-.197-2.218zm-5.336 8.195s0-8.291.275-8.29c.274 0 .261 6.741.261 6.741l-.261 1.549z" />
      </svg>
    ),
    postgresql: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="#4169E1">
        <path d="M17.128 0c-.31.023-.62.06-.926.113C14.32.34 12.95.6 12.157.818c-.793.218-1.447.572-1.97 1.093-.524.52-.87 1.162-1.085 1.938-.177.635-.27 1.452-.3 2.282H6.96c-.122-.62-.342-1.2-.66-1.707-.317-.507-.732-.936-1.23-1.266-.498-.33-1.08-.56-1.72-.672C2.72 2.38 2.04 2.34 1.38 2.404.72.468.18 2.78.04 3.58c-.14.8.04 1.64.44 2.35.4.71 1.04 1.28 1.8 1.66.76.38 1.64.57 2.52.55.88-.02 1.74-.22 2.52-.6.78-.38 1.44-.94 1.92-1.63.48-.69.78-1.5.88-2.34h3.2c.16.88.52 1.7 1.04 2.4.52.7 1.2 1.26 2 1.64.8.38 1.68.57 2.56.55.88-.02 1.74-.22 2.52-.6.78-.38 1.44-.94 1.92-1.63.48-.69.78-1.5.88-2.34h3.48c-.1 1.14-.52 2.24-1.2 3.14-.68.9-1.6 1.6-2.66 2.04-1.06.44-2.24.62-3.42.52-1.18-.1-2.3-.46-3.26-1.06-.96-.6-1.74-1.42-2.26-2.38-.52-.96-.78-2.06-.74-3.18.04-1.12.42-2.2 1.1-3.08.68-.88 1.62-1.52 2.7-1.86 1.08-.34 2.24-.38 3.34-.12 1.1.26 2.1.8 2.88 1.56.78.76 1.3 1.7 1.5 2.74h3.56c-.36-2.24-1.3-4.32-2.74-6-1.44-1.68-3.32-2.9-5.44-3.52C18.18.34 16.36.08 14.56.16 13.7.2 12.86.36 12.08.64c-.78.28-1.48.7-2.06 1.24-.58.54-1.04 1.2-1.36 1.94-.32.74-.5 1.56-.54 2.4H5.76c-.18-.82-.46-1.6-.84-2.32-.38-.72-.86-1.36-1.44-1.88-.58-.52-1.26-.92-2-.1.4.38.72.84.96 1.36.24.52.4 1.08.48 1.66.08.58.08 1.18 0 1.76H1.2c-.08.58-.08 1.16 0 1.74h1.76c.08.58.24 1.14.48 1.66.24.52.56.98.96 1.36-.74.52-1.42.92-2 .1.58-.52 1.06-1.16 1.44-1.88.38-.72.66-1.5.84-2.32h3.36c.04.84.22 1.66.54 2.4.32.74.78 1.4 1.36 1.94.58.54 1.28.96 2.06 1.24.78.28 1.62.44 2.48.48.86.04 1.7-.04 2.52-.24.82-.2 1.6-.54 2.28-1.02.68-.48 1.26-1.1 1.7-1.82.44-.72.74-1.54.88-2.4h3.48c-.14 1.32-.6 2.58-1.34 3.66-.74 1.08-1.74 1.96-2.92 2.56-1.18.6-2.52.92-3.9.92-1.38 0-2.72-.32-3.9-.92-1.18-.6-2.18-1.48-2.92-2.56-.74-1.08-1.2-2.34-1.34-3.66H1.2c.18 1.96.92 3.84 2.12 5.4 1.2 1.56 2.82 2.8 4.68 3.6 1.86.8 3.94 1.16 6.04 1.04 2.1-.12 4.1-.64 5.88-1.52 1.78-.88 3.26-2.1 4.36-3.56 1.1-1.46 1.78-3.14 2-4.92h-3.48c-.18 1.08-.6 2.1-1.2 3-0.6.9-1.38 1.64-2.28 2.16-.9.52-1.92.82-2.96.88-1.04.06-2.06-.14-3-.56-.94-.42-1.74-1.06-2.34-1.86-.6-.8-.98-1.74-1.12-2.74h3.36c.24.58.64 1.08 1.16 1.44.52.36 1.14.56 1.78.58.64-.02 1.26-.22 1.78-.58.52-.36.92-.86 1.16-1.44H22.8c-.14 1.08-.54 2.12-1.18 3.02-.64.9-1.5 1.64-2.5 2.16-1 .52-2.1.82-3.22.88-1.12.06-2.22-.14-3.24-.56-1.02-.42-1.9-.1-2.62-.6-.72-.5-1.28-1.18-1.62-1.98-.34-.8-.46-1.68-.36-2.56h-3.36c.18 1.44.72 2.82 1.56 4 .84 1.18 1.96 2.14 3.26 2.78 1.3.64 2.76.94 4.24.88 1.48-.06 2.92-.46 4.2-1.2 1.28-.74 2.34-1.78 3.08-3.02.74-1.24 1.14-2.64 1.18-4.08h-3.48c-.08.58-.24 1.14-.48 1.66-.24.52-.56.98-.96 1.36.74-.52 1.42-.92 2-.1-.58.52-1.06 1.16-1.44 1.88-.38.72-.66 1.5-.84 2.32h-3.36c-.04-.58-.04-1.16 0-1.74h3.36c.18-.82.46-1.6.84-2.32.38-.72.86-1.36 1.44-1.88-.58-.52-1.26-.92-2-.1.58.52 1.06 1.16 1.44 1.88.38.72.66 1.5.84 2.32h3.36c.04-.58.04-1.16 0-1.74h-3.36c-.18-.82-.46-1.6-.84-2.32-.38-.72-.86-1.36-1.44-1.88.58-.52 1.26-.92 2-.1-.58.52-1.06 1.16-1.44 1.88-.38.72-.66 1.5-.84 2.32h-3.36c.04-.58.04-1.16 0-1.74h3.36c.18-.82.46-1.6.84-2.32.38-.72.86-1.36 1.44-1.88-.58-.52-1.26-.92-2-.1.58.52 1.06 1.16 1.44 1.88.38.72.66 1.5.84 2.32h3.36c.04-.58.04-1.16 0-1.74h-3.36c-.18-.82-.46-1.6-.84-2.32-.38-.72-.86-1.36-1.44-1.88.58-.52 1.26-.92 2-.1z" />
      </svg>
    ),
    express: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M24 18.588a1.529 1.529 0 01-1.895-.72l-3.45-4.771-.241-.334-.258.347-2.118 2.904a1.583 1.583 0 01-1.928.562l3.593-4.927-3.317-4.45a1.614 1.614 0 011.961.584l2.274 3.083 2.257-3.069a1.593 1.593 0 012.351-.152l.381.524a.345.345 0 01.063.365l-1.455 2.323 3.17 4.242a1.527 1.527 0 01.444 1.007v.033zM0 18.618l.426-2.805H3.6l2.223 2.805H0zm6.347 0l.426-2.805h3.173l2.222 2.805H6.347zm6.42 0l.427-2.805h3.172l2.222 2.805h-5.821z" />
      </svg>
    ),
    flutter: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="#02569B">
        <path d="M14.314 0L2.2 12.114l6.517 6.517L21.514 7.1 14.314 0zM14.314 14.314L7.797 7.8l5.617-5.614L20 12.114l-5.686 6.517-5.686-5.686L14.314 14.314zM14.5 24l6.514-6.514-6.514-6.514L8 10.972l6.5 6.514-6.5 6.514z" />
      </svg>
    ),
    more: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="5" cy="12" r="1.5" fill="currentColor" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        <circle cx="19" cy="12" r="1.5" fill="currentColor" />
      </svg>
    ),
  }
  return icons[name] || null
}

function Hero({ content, contactButtonText, contactButtonLink }) {
  const { settings } = useSiteSettings()

  const greeting = settings?.greeting || content?.greeting || "Hi, I'm"
  const fullName = settings?.brandName || content?.fullName || 'Desalegn Kasaye'
  const badge = settings?.professionalBadge || content?.professionalBadge || 'Full Stack Developer'
  const fullText = (settings?.typingWords?.length ? settings.typingWords : content?.typingWords)?.[0] || 'Full Stack Developer'
  const introduction = settings?.shortIntroduction || content?.shortIntroduction || 'I build scalable, high-performance web and mobile applications with modern technologies and clean architecture.'
  const stats = content?.statistics?.length > 0
    ? content.statistics
    : [
        { label: 'Years Experience', value: '2+', icon: 'Award', color: '#6366f1' },
        { label: 'Projects Completed', value: '12+', icon: 'BookOpen', color: '#6366f1' },
        { label: 'Technologies', value: '10+', icon: 'Cpu', color: '#6366f1' },
        { label: 'Happy Clients', value: '5+', icon: 'Users', color: '#6366f1' },
      ]
  const contactBtnText = settings?.contactButtonText || contactButtonText || 'Contact Me'
  const contactBtnLink = settings?.contactButtonLink || contactButtonLink || '#contact'
  const ctaButtons = content?.ctaButtons?.length > 0
    ? content.ctaButtons
    : [{ text: '', link: '', openNewTab: false, icon: 'ArrowRight' }]

  const socialLinks = settings?.socialLinks || {}

  const typedText = useTypingEffect(fullText)

  const profileData = {
    name: fullName,
    badge,
    stats,
    skills: [
      { name: 'React', level: 92, color: '#61dafb', icon: 'React' },
      { name: 'Node.js', level: 85, color: '#68a063', icon: 'Node.js' },
      { name: 'Three.js', level: 78, color: '#8b5cf6', icon: 'Three.js' },
      { name: 'Flutter', level: 70, color: '#02569b', icon: 'Flutter' },
    ],
    socialLinks,
    ctaButtons: ctaButtons.filter(b => b.text || b.link),
    introduction,
  }

  const scrollToWork = useCallback(() => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const scrollToContact = useCallback(() => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundColor: 'var(--bg-primary)' }}
      aria-label="Hero section"
    >
      {/* 3D Desktop Scene - right side */}
      <div className="absolute right-0 top-0 w-full md:w-[52%] lg:w-[48%] h-full z-0" aria-hidden="true">
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        }>
          <HeroDesktopScene className="w-full h-full" profileData={profileData} />
        </Suspense>
      </div>

      {/* Main content overlay */}
      <div className="relative z-10 min-h-screen flex flex-col pointer-events-none">
        {/* Hero content area */}
        <div className="flex-1 flex items-center">
          <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20 flex items-center">
            {/* Left text content */}
            <div className="max-w-lg md:max-w-xl lg:max-w-lg pt-24 sm:pt-28 md:pt-0">

              {/* Eyebrow */}
              <motion.p
                {...fadeIn(0.2)}
                className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] mb-4 sm:mb-5 text-white"
              >
                Welcome to my digital space
              </motion.p>

              {/* Heading group */}
              <h1 className="mb-5 sm:mb-6">
                {/* Greeting line */}
                <motion.span
                  {...fadeUp(0.35)}
                  className="block text-[26px] sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {greeting}
                </motion.span>

                {/* Name */}
                <motion.span
                  {...fadeUp(0.45)}
                  className="block text-[34px] sm:text-[42px] md:text-[52px] lg:text-[64px] font-black leading-[1.05] tracking-tight text-white"
                >
                  {fullName}
                </motion.span>

                {/* Role / typed text */}
                <motion.span
                  {...fadeUp(0.55)}
                  className="block text-[20px] sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mt-1"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {typedText}
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                    className="inline-block w-[2px] h-5 sm:h-6 md:h-7 lg:h-8 ml-0.5 bg-primary align-middle"
                    aria-hidden="true"
                  />
                </motion.span>
              </h1>

              {/* Introduction */}
              <motion.p
                {...fadeUp(0.65)}
                className="text-sm sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-8 max-w-md"
                style={{ color: 'var(--text-secondary)' }}
              >
                {introduction}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                {...fadeUp(0.75)}
                className="flex flex-wrap items-center gap-3 sm:gap-4 mb-8 sm:mb-10"
              >
                <button
                  onClick={scrollToWork}
                  className="group flex items-center gap-2.5 px-5 sm:px-6 py-2.5 sm:py-3 bg-primary text-white font-semibold text-sm sm:text-[15px] rounded-lg hover:opacity-90 transition-all duration-200 shadow-md shadow-primary/20"
                  aria-label="Explore my work"
                >
                  Explore My Work
                  <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform duration-200" />
                </button>
                <button
                  onClick={scrollToContact}
                  className="group flex items-center gap-2.5 px-5 sm:px-6 py-2.5 sm:py-3 border font-semibold text-sm sm:text-[15px] rounded-lg transition-all duration-200 hover:border-primary/50"
                  style={{
                    borderColor: 'var(--border-strong)',
                    color: 'var(--text-primary)',
                  }}
                  aria-label={contactBtnText}
                >
                  {contactBtnText}
                  <MessageCircle size={15} className="opacity-60" />
                </button>
              </motion.div>

              {/* Technologies */}
              <motion.div {...fadeUp(0.85)}>
                <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.18em] mb-3" style={{ color: 'var(--text-tertiary)' }}>
                  Technologies I work with
                </p>
                <div className="flex flex-wrap gap-3">
                  {technologies.map((tech, i) => (
                    <motion.div
                      key={tech.name}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: 0.95 + i * 0.04, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="relative group flex items-center justify-center w-10 h-10 rounded-xl cursor-default"
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        border: '1px solid var(--border-primary)',
                      }}
                    >
                      <TechIcon name={tech.icon} />
                      <span
                        className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-[10px] font-semibold rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-30"
                        style={{
                          backgroundColor: 'var(--bg-primary)',
                          color: 'var(--text-primary)',
                          border: '1px solid var(--border-primary)',
                        }}
                      >
                        {tech.name}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom stats panel */}
        <motion.div
          {...fadeUp(1.1)}
          className="pointer-events-auto"
        >
          <div className="w-full px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20 pb-4">
            <div
              className="flex flex-wrap items-center gap-4 sm:gap-6 py-3 sm:py-3.5 px-4 sm:px-5 rounded-lg border"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-primary)',
              }}
              role="region"
              aria-label="Portfolio statistics"
            >
              {/* Stats */}
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2"
                >
                  <div
                    className="w-7 h-7 flex items-center justify-center rounded-md shrink-0"
                    style={{ backgroundColor: '#6366f110', color: '#6366f1' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base sm:text-lg font-bold leading-none" style={{ color: 'var(--text-primary)' }}>
                      {stat.value}
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-medium mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                      {stat.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        {...fadeIn(1.6)}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 cursor-pointer group z-20 pointer-events-auto"
        style={{ color: 'var(--text-tertiary)' }}
        role="button"
        tabIndex={0}
        aria-label="Scroll to explore"
      >
        <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.18em] group-hover:text-primary transition-colors duration-200">
          Scroll to Explore
        </span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="w-[18px] h-[28px] border-[1.5px] rounded-full flex justify-center pt-1.5 group-hover:border-primary transition-colors duration-200"
          style={{ borderColor: 'var(--border-strong)' }}
        >
          <motion.div
            animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="w-[2px] h-[6px] bg-primary rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}

export default memo(Hero)
