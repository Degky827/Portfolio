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
  { name: 'Express', icon: 'express' },
  { name: 'MongoDB', icon: 'mongodb' },
  { name: 'PostgreSQL', icon: 'postgresql' },
  { name: 'Flutter', icon: 'flutter' },
  { name: 'Docker', icon: 'docker' },
  { name: 'Git', icon: 'git' },
]

function TechIcon({ name }) {
  const icons = {
    react: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#61DAFB" strokeWidth="1.5">
        <circle cx="12" cy="12" r="2.5" fill="#61DAFB" stroke="none" />
        <ellipse cx="12" cy="12" rx="10" ry="4" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
      </svg>
    ),
    nodejs: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="#68A063">
        <path d="M12 1.85c-.27 0-.55.07-.78.2l-7.44 4.3c-.48.28-.78.8-.78 1.36v8.58c0 .56.3 1.08.78 1.36l1.95 1.12c.95.46 1.27.46 1.71.46 1.4 0 2.21-.85 2.21-2.33V8.44c0-.12-.09-.21-.21-.21H8.22c-.12 0-.21.09-.21.21v8.06c0 .66-.68 1.31-1.77.76L4.16 16.2a.27.27 0 01-.13-.22V7.41c0-.09.05-.17.13-.22l7.44-4.29a.27.27 0 01.26 0l7.44 4.29c.08.05.13.13.13.22v8.58c0 .09-.05.17-.13.22l-7.44 4.29a.25.25 0 01-.25 0l-1.88-1.11c-.07-.04-.17-.05-.24-.02-.65.3-.78.32-1.39.51-.14.04-.36.11.08.34l2.48 1.47c.24.14.5.21.78.21s.55-.07.78-.2l7.44-4.3c.48-.28.78-.8.78-1.36V7.71c0-.56-.3-1.08-.78-1.36l-7.44-4.3c-.23-.13-.5-.2-.78-.2z" />
      </svg>
    ),
    express: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        <path d="M24 18.588a1.529 1.529 0 01-1.895-.72l-3.45-4.771-.241-.334-.258.347-2.118 2.904a1.583 1.583 0 01-1.928.562l3.593-4.927-3.317-4.45a1.614 1.614 0 011.961.584l2.274 3.083 2.257-3.069a1.593 1.593 0 012.351-.152l.381.524a.345.345 0 01.063.365l-1.455 2.323 3.17 4.242a1.527 1.527 0 01.444 1.007v.033zM0 18.618l.426-2.805H3.6l2.223 2.805H0zm6.347 0l.426-2.805h3.173l2.222 2.805H6.347zm6.42 0l.427-2.805h3.172l2.222 2.805h-5.821z" />
      </svg>
    ),
    mongodb: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="#47A248">
        <path d="M17.193 9.555c-1.264-5.58-4.252-7.414-4.573-8.115-.28-.394-.53-.954-.735-1.44-.036.495-.055.685-.523 1.184-.723.566-4.438 3.682-4.74 10.02-.282 5.912 4.27 9.435 4.889 9.884l.07.05A73.49 73.49 0 0111.91 24h.481c.114-1.032.284-2.056.51-3.07.417-.296.604-.463.85-.693a11.342 11.342 0 003.639-8.464c.01-.814-.103-1.662-.197-2.218zm-5.336 8.195s0-8.291.275-8.29.274 0 .261 6.741 .261 6.741l-.261 1.549z" />
      </svg>
    ),
    postgresql: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="#336791">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 6.63 5.37 12 12 12s12-5.37 12-12C24 5.37 18.63 0 12 0zm0 3.27c2.4 0 4.36 1.96 4.36 4.36S14.4 12 12 12 7.64 10.04 7.64 7.63 9.6 3.27 12 3.27zm0 10.37c3.15 0 7.09 1.42 7.09 3.27v1.09H4.91v-1.09c0-1.85 3.94-3.27 7.09-3.27z" />
      </svg>
    ),
    flutter: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="#02569B">
        <path d="M14.314 0L2.2 12.114l6.517 6.517L21.514 7.1 14.314 0zM14.314 14.314L7.797 7.8l5.617-5.614L20 12.114l-5.686 6.517-5.686-5.686L14.314 14.314zM14.5 24l6.514-6.514-6.514-6.514L8 10.972l6.5 6.514-6.5 6.514z" />
      </svg>
    ),
    docker: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="#2496ED">
        <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.186v1.887c0 .102.083.185.185.185zm-2.954-5.43h2.118a.185.185 0 00.186-.186V3.574a.185.185 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185zm0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.186.185.186zm-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.186.185.186zm-2.956 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.143a.186.186 0 00-.185.185v1.887c0 .102.083.186.185.186zm-2.93 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H2.213a.186.186 0 00-.185.185v1.887c0 .102.083.186.185.186zm8.816 2.714h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.186v1.887c0 .102.082.185.185.185zm-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.185.186v1.887c0 .102.083.185.185.185zm-2.956 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186H5.143a.186.186 0 00-.185.186v1.887c0 .102.083.185.185.185zm-2.93 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186H2.213a.186.186 0 00-.185.186v1.887c0 .102.083.185.185.185z" />
      </svg>
    ),
    git: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="#F05032">
        <path d="M23.546 10.93L13.067.452c-.604-.603-1.582-.603-2.188 0L8.708 2.627l2.76 2.76c.645-.215 1.379-.07 1.889.441.516.515.658 1.258.438 1.9l2.658 2.66c.645-.223 1.387-.078 1.9.435.721.72.721 1.884 0 2.604-.719.719-1.881.719-2.6 0-.539-.541-.674-1.337-.404-1.996L12.86 8.955v6.525c.176.086.342.203.488.348.713.721.713 1.883 0 2.6-.719.721-1.889.721-2.609 0-.719-.719-.719-1.879 0-2.598.182-.18.387-.316.605-.406V8.835c-.217-.091-.424-.227-.605-.406-.521-.52-.656-1.266-.43-1.91L7.525 3.738.452 10.81c-.603.605-.603 1.582 0 2.189l10.48 10.478c.604.604 1.582.604 2.186 0l10.428-10.43c.604-.603.604-1.58 0-2.187z" />
      </svg>
    ),
  }
  return icons[name] || null
}

function Hero({ content, contactButtonText, contactButtonLink }) {
  const { settings } = useSiteSettings()

  const greeting = settings?.greeting || content?.greeting || "Hi, I'm"
  const fullName = settings?.brandName || content?.fullName || 'DESALEGN'
  const badge = settings?.professionalBadge || content?.professionalBadge || 'Full Stack Developer'
  const fullText = (settings?.typingWords?.length ? settings.typingWords : content?.typingWords)?.[0] || 'Fullstack Developer'
  const introduction = settings?.shortIntroduction || content?.shortIntroduction || 'I build scalable, high-performance web and mobile applications using modern technologies, robust architecture, and production-ready engineering practices.'
  const stats = content?.statistics?.length > 0
    ? content.statistics
    : [
        { label: 'Years Experience', value: '2+', icon: 'Award', color: '#6366f1' },
        { label: 'Projects Completed', value: '12+', icon: 'BookOpen', color: '#6366f1' },
        { label: 'Technologies', value: '10+', icon: 'Cpu', color: '#6366f1' },
        { label: 'Happy Clients', value: '5+', icon: 'Users', color: '#6366f1' },
      ]
  const contactBtnText = settings?.contactButtonText || contactButtonText || "Let's Work Together"
  const ctaButtons = content?.ctaButtons?.length > 0
    ? content.ctaButtons
    : [{ text: '', link: '', openNewTab: false, icon: 'ArrowRight' }]

  const typedText = useTypingEffect(fullText)

  const profileData = {
    name: fullName,
    badge,
    stats,
    skills: [
      { name: 'React', level: 92, color: '#61dafb', icon: 'React' },
      { name: 'Node.js', level: 85, color: '#68a063', icon: 'Node.js' },
      { name: 'Express', level: 82, color: '#6366f1', icon: 'Express' },
      { name: 'Flutter', level: 78, color: '#02569b', icon: 'Flutter' },
    ],
    socialLinks: settings?.socialLinks || {},
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
      className="relative min-h-0 md:min-h-screen overflow-hidden bg-white dark:bg-[#1a1a2e] text-slate-900 dark:text-white transition-colors duration-300"
      aria-label="Hero section"
    >
      {/* 3D Desktop Scene - visible on all screens */}
      <div className="md:absolute md:right-0 md:top-0 md:w-[50%] lg:md:w-[48%] md:h-full md:z-10 w-full h-[45vh] sm:h-[50vh] relative z-0 pointer-events-auto cursor-grab active:cursor-grabbing">
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          </div>
        }>
          <HeroDesktopScene className="w-full h-full" profileData={profileData} />
        </Suspense>
      </div>

      {/* Social media sidebar - right edge floating bar */}
      <motion.div
        {...fadeIn(1.4)}
        className="hidden lg:flex fixed right-4 xl:right-6 top-1/2 -translate-y-1/2 z-30 flex-col items-center gap-3 pointer-events-auto"
      >
        {[
          {
            name: 'GitHub',
            url: profileData.socialLinks?.github || 'https://github.com/desalegn-tech',
            icon: (
              <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            ),
          },
          {
            name: 'LinkedIn',
            url: profileData.socialLinks?.linkedin || 'https://linkedin.com/in/dk-cs-3rd',
            icon: (
              <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            ),
          },
          {
            name: 'Email',
            url: `mailto:${profileData.socialLinks?.email || 'desalegnky827@gmail.com'}`,
            icon: <Mail size={17} />,
          },
          {
            name: 'Download CV',
            url: profileData.socialLinks?.cv || '#',
            icon: <Download size={17} />,
          },
        ].map((social, i) => (
          <motion.a
            key={social.name}
            href={social.url}
            target={social.name !== 'Email' && social.name !== 'Download CV' ? '_blank' : undefined}
            rel={social.name !== 'Email' && social.name !== 'Download CV' ? 'noopener noreferrer' : undefined}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 1.2 + i * 0.1 }}
            className="group relative flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-200 hover:scale-110 border bg-white/80 dark:bg-[#101522]/80 border-slate-200 dark:border-white/10 text-slate-600 dark:text-[#A8B0C0] hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500 shadow-md backdrop-blur-md"
            aria-label={social.name}
          >
            {social.icon}
            <span
              className="absolute right-full mr-3 px-2.5 py-1 text-xs font-semibold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg bg-slate-900 dark:bg-[#101522] text-white border border-slate-700 dark:border-white/10"
            >
              {social.name}
            </span>
          </motion.a>
        ))}
      </motion.div>

      {/* Main content overlay */}
      <div className="md:relative md:z-10 relative z-10 min-h-0 md:min-h-screen flex flex-col pointer-events-none">
        {/* Hero content area */}
        <div className="flex-1 flex items-center">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 flex items-center">
            {/* Left text content */}
            <div className="w-full md:w-[52%] lg:max-w-xl pt-6 sm:pt-8 md:pt-0 pointer-events-auto relative">
              {/* Mobile text backdrop */}
              <div className="md:hidden absolute -inset-x-6 -top-24 -bottom-6 bg-white/80 dark:bg-[#1a1a2e]/85 backdrop-blur-sm -z-10 rounded-3xl" />

              {/* Eyebrow */}
              <motion.p
                {...fadeIn(0.2)}
                className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3 text-indigo-600 dark:text-indigo-400"
              >
                Welcome to my digital space
              </motion.p>

              {/* Heading group */}
              <h1 className="mb-5">
                {/* Greeting line */}
                <motion.span
                  {...fadeUp(0.35)}
                  className="block text-sm sm:text-base md:text-lg font-semibold leading-tight text-slate-500 dark:text-[#A8B0C0]"
                >
                  {greeting}
                </motion.span>

                {/* Name */}
                <motion.span
                  {...fadeUp(0.45)}
                  className="block text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 dark:text-white my-0.5"
                >
                  {fullName}
                </motion.span>

                {/* Role / typed text */}
                <motion.span
                  {...fadeUp(0.55)}
                  className="block text-sm sm:text-base md:text-xl lg:text-2xl font-bold leading-tight mt-1 text-indigo-600 dark:text-[#818CF8]"
                >
                  {typedText}
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                    className="inline-block w-[2px] h-5 sm:h-6 md:h-7 lg:h-8 ml-1 bg-indigo-500 align-middle"
                    aria-hidden="true"
                  />
                </motion.span>
              </h1>

              {/* Introduction */}
              <motion.p
                {...fadeUp(0.65)}
                className="text-xs sm:text-sm md:text-base leading-relaxed mb-6 text-slate-600 dark:text-[#A8B0C0] max-w-lg font-normal"
              >
                {introduction}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                {...fadeUp(0.75)}
                className="flex flex-wrap items-center gap-3 mb-8"
              >
                <button
                  onClick={scrollToWork}
                  className="group flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/25 cursor-pointer"
                  aria-label="Explore my work"
                >
                  Explore My Work
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
                </button>
                <button
                  onClick={scrollToContact}
                  className="group flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 border border-slate-300 dark:border-white/10 hover:border-indigo-500/50 bg-slate-100/80 dark:bg-white/[0.04] backdrop-blur-md text-slate-800 dark:text-white font-semibold text-xs sm:text-sm rounded-xl transition-all duration-200 cursor-pointer"
                  aria-label={contactBtnText}
                >
                  {contactBtnText}
                  <MessageCircle size={14} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                </button>
              </motion.div>

              {/* Technologies Strip */}
              <motion.div {...fadeUp(0.85)}>
                <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.18em] mb-2.5 text-slate-500 dark:text-[#64748B]">
                  Technologies I work with
                </p>
                <div className="flex flex-wrap gap-2">
                  {technologies.map((tech, i) => (
                    <motion.div
                      key={tech.name}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: 0.95 + i * 0.04 }}
                      className="relative group flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-[#101522] border border-slate-200 dark:border-white/10 hover:border-indigo-500/50 transition-all duration-200 shadow-sm cursor-default"
                    >
                      <TechIcon name={tech.icon} />
                      <span className="text-[10px] sm:text-xs font-semibold text-slate-700 dark:text-[#A8B0C0] group-hover:text-indigo-600 dark:group-hover:text-white transition-colors">
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
          className="pointer-events-auto hidden md:block"
        >
          <div className="w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 pb-12 sm:pb-16">
            <div
              className="flex flex-wrap items-center gap-2 sm:gap-4 py-2.5 sm:py-3 px-2.5 sm:px-4 rounded-xl border bg-slate-100/90 dark:bg-[#101522]/90 border-slate-200 dark:border-white/10 backdrop-blur-md"
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
                    className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-md shrink-0 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm md:text-base font-bold leading-none text-slate-900 dark:text-white">
                      {stat.value}
                    </span>
                    <span className="text-[7px] sm:text-[8px] md:text-[9px] font-medium mt-0.5 text-slate-500 dark:text-[#7a8599]">
                      {stat.label}
                    </span>
                  </div>
                </div>
              ))}

              {/* Divider */}
              <div className="hidden sm:block w-px h-8 mx-1 bg-slate-200 dark:bg-white/10" />

              {/* Available for freelance */}
              <div className="hidden sm:flex items-center gap-2 ml-auto">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                      Available for freelance
                    </span>
                  </div>
                  <span className="text-[8px] sm:text-[9px] mt-0.5 text-slate-500 dark:text-[#7a8599]">
                    Let's build something amazing together.
                  </span>
                </div>
                <button
                  onClick={scrollToContact}
                  className="group flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[10px] sm:text-[11px] rounded-lg transition-all duration-200 shrink-0 cursor-pointer shadow-md"
                >
                  Hire Me
                  <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform duration-200" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        {...fadeIn(1.6)}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 cursor-pointer group z-20 pointer-events-auto text-slate-400 dark:text-[#7a8599]"
        role="button"
        tabIndex={0}
        aria-label="Scroll to explore"
      >
        <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.18em] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
          Scroll Down
        </span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="w-[18px] h-[28px] border-[1.5px] border-slate-300 dark:border-[#2a3454] rounded-full flex justify-center pt-1.5 group-hover:border-indigo-600 dark:group-hover:border-indigo-400 transition-colors duration-200"
        >
          <motion.div
            animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="w-[2px] h-[6px] bg-indigo-600 dark:bg-indigo-400 rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}

export default memo(Hero)
