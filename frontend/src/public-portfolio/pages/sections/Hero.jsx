import { useEffect, useState, lazy, Suspense, useCallback, memo } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, MessageCircle, Mail, Download } from 'lucide-react'
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
  { name: 'Node.js', icon: 'nodejs' },
  { name: 'TypeScript', icon: 'typescript' },
  { name: 'MongoDB', icon: 'mongodb' },
  { name: 'Express', icon: 'express' },
  { name: 'Flutter', icon: 'flutter' },
  { name: 'More', icon: 'more' },
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
  const resumeUrl = settings?.resume?.url || '#'

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
                className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] mb-4 sm:mb-5 text-primary"
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
                  className="block text-[34px] sm:text-[42px] md:text-[52px] lg:text-[64px] font-black leading-[1.05] tracking-tight text-primary"
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
                <div className="flex flex-wrap gap-2">
                  {technologies.map((tech, i) => (
                    <motion.div
                      key={tech.name}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: 0.95 + i * 0.04, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border transition-colors duration-200 hover:border-primary/40 cursor-default"
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        borderColor: 'var(--border-primary)',
                      }}
                    >
                      <TechIcon name={tech.icon} />
                      <span className="text-[11px] sm:text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
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
          <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20 pb-4">
            <div
              className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-0 py-3 sm:py-3.5 px-4 sm:px-5 rounded-lg border"
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
                  className={`flex items-center gap-2 px-3 sm:px-4 ${
                    i < stats.length - 1 ? 'sm:border-r' : ''
                  } ${i === 0 ? 'sm:border-r' : ''}`}
                  style={{ borderColor: 'var(--border-primary)' }}
                >
                  <div
                    className="w-7 h-7 flex items-center justify-center rounded-md shrink-0"
                    style={{ backgroundColor: `${stat.color}10`, color: stat.color }}
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

              {/* Spacer */}
              <div className="hidden sm:block flex-1 min-w-4" />

              {/* Available for freelance */}
              <div className="flex items-center gap-3 px-3 sm:px-4 sm:border-l" style={{ borderColor: 'var(--border-primary)' }}>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shrink-0" aria-hidden="true" />
                  <div className="flex flex-col">
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--text-primary)' }}>
                      Available for freelance
                    </span>
                    <span className="text-[10px] sm:text-[11px] hidden sm:block" style={{ color: 'var(--text-tertiary)' }}>
                      Let's build something amazing together.
                    </span>
                  </div>
                </div>
                <button
                  onClick={scrollToContact}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-[11px] sm:text-xs font-bold rounded-md hover:opacity-90 transition-all duration-200 whitespace-nowrap shrink-0"
                  aria-label="Hire me"
                >
                  Hire Me
                  <ArrowRight size={11} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right social sidebar */}
      <motion.div
        {...fadeIn(1.4)}
        className="hidden lg:flex fixed right-5 top-1/2 -translate-y-1/2 z-30 flex-col gap-2"
        aria-label="Social links"
      >
        {socialLinks.github && (
          <a
            href={socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-lg flex items-center justify-center border transition-all duration-200 hover:scale-110 hover:border-primary/40"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-primary)',
              color: 'var(--text-secondary)',
            }}
            title="GitHub"
            aria-label="GitHub profile"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
        )}
        {socialLinks.linkedin && (
          <a
            href={socialLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-lg flex items-center justify-center border transition-all duration-200 hover:scale-110 hover:border-primary/40"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-primary)',
              color: 'var(--text-secondary)',
            }}
            title="LinkedIn"
            aria-label="LinkedIn profile"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
        )}
        <a
          href={contactBtnLink}
          onClick={(e) => { e.preventDefault(); scrollToContact() }}
          className="w-9 h-9 rounded-lg flex items-center justify-center border transition-all duration-200 hover:scale-110 hover:border-primary/40"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)',
            color: 'var(--text-secondary)',
          }}
          title="Email"
          aria-label="Send email"
        >
          <Mail size={14} />
        </a>
        {resumeUrl && resumeUrl !== '#' && (
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="w-9 h-9 rounded-lg flex items-center justify-center border transition-all duration-200 hover:scale-110 hover:border-primary/40"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-primary)',
              color: 'var(--text-secondary)',
            }}
            title="Download CV"
            aria-label="Download CV"
          >
            <Download size={14} />
          </a>
        )}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        {...fadeIn(1.6)}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 cursor-pointer group z-20 pointer-events-auto"
        style={{ color: 'var(--text-tertiary)' }}
        onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }) }}
        aria-label="Scroll to about section"
      >
        <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.18em] group-hover:text-primary transition-colors duration-200">
          Scroll Down
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

      {/* Bottom bar: copyright + location */}
      <motion.div
        {...fadeIn(1.5)}
        className="absolute bottom-2.5 left-0 right-0 z-20 flex items-center justify-between px-5 sm:px-8 md:px-12 lg:px-16 xl:px-20 pointer-events-none"
      >
        <span className="text-[9px] sm:text-[10px] font-medium" style={{ color: 'var(--text-tertiary)' }}>
          &copy; {new Date().getFullYear()} {fullName}. All rights reserved.
        </span>
        <span className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-medium" style={{ color: 'var(--text-tertiary)' }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          Based in Ethiopia
        </span>
      </motion.div>
    </section>
  )
}

export default memo(Hero)
