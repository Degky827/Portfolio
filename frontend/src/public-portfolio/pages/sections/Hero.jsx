import { useEffect, useState, lazy, Suspense, useCallback, memo } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, MessageCircle, Mail, Download } from 'lucide-react'
import { useSiteSettings } from '../../../shared/context/SiteSettingsContext'
import TechTile from '../../components/ui/TechTile'

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
  { name: 'React' },
  { name: 'Node.js' },
  { name: 'TypeScript' },
  { name: 'MongoDB' },
  { name: 'Express' },
  { name: 'Flutter' },
]

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
  const contactBtnText = settings?.contactButtonText || contactButtonText || 'Get In Touch'
  const ctaButtons = content?.ctaButtons?.length > 0
    ? content.ctaButtons
    : [{ text: '', link: '', openNewTab: false, icon: 'ArrowRight' }]

  const typedText = useTypingEffect(fullText)
  const splitAt = fullText.indexOf(' ')
  const typedHead = splitAt === -1 ? typedText : typedText.slice(0, splitAt)
  const typedTail = splitAt === -1 ? '' : typedText.slice(splitAt)

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

  const scrollToAbout = useCallback(() => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const scrollToSkills = useCallback(() => {
    document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <section
      id="home"
      className="relative -mt-28 sm:-mt-32 min-h-0 md:min-h-screen overflow-hidden bg-white dark:bg-[#1a1a2e] text-slate-900 dark:text-white transition-colors duration-300"
      aria-label="Hero section"
    >
      {/* 3D Desktop Scene - visible on all screens */}
      <div className="md:absolute md:right-0 md:top-0 md:w-[58%] lg:w-[60%] md:h-full md:z-10 w-full h-[45vh] sm:h-[50vh] mt-28 sm:mt-32 md:mt-0 relative z-0 pointer-events-auto cursor-grab active:cursor-grabbing">
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
      <div className="md:relative md:z-20 relative z-10 min-h-0 md:min-h-screen flex flex-col pointer-events-none md:pt-20">
        {/* Hero content area */}
        <div className="flex-1 flex items-center">
          <div className="w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 flex items-center">
            {/* Left text content */}
            <div className="w-full md:w-[42%] lg:w-[40%] lg:max-w-md pt-6 sm:pt-8 md:pt-0 pb-6 md:pb-36 pointer-events-auto relative">
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
                  className="block text-sm sm:text-base md:text-xl lg:text-2xl font-bold leading-tight mt-1 text-slate-900 dark:text-white"
                >
                  {typedHead}
                  <span className="text-indigo-600 dark:text-[#818CF8]">{typedTail}</span>
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
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  {technologies.map((tech, i) => (
                    <motion.div
                      key={tech.name}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: 0.95 + i * 0.05 }}
                    >
                      <TechTile name={tech.name} />
                    </motion.div>
                  ))}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.95 + technologies.length * 0.05 }}
                  >
                    <TechTile name="More" icon="more" label="More" onClick={scrollToSkills} />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom stats panel - spans the full width over both halves */}
      <motion.div
        {...fadeUp(1.1)}
        className="pointer-events-auto hidden md:block absolute inset-x-6 lg:inset-x-8 bottom-24 z-30"
      >
        <div
          className="flex items-stretch rounded-2xl border bg-white/85 dark:bg-[#101522]/85 border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-xl shadow-slate-900/5 overflow-hidden"
          role="region"
          aria-label="Portfolio statistics"
        >
          {/* Stats */}
          {stats.map((stat, i) => (
            <div
              key={i}
              className="flex flex-col justify-center px-6 lg:px-8 py-4 border-r border-slate-200/80 dark:border-white/10"
            >
              <div className="text-lg lg:text-xl font-extrabold leading-none text-indigo-600 dark:text-[#818CF8]">
                {stat.value}
              </div>
              <div className="text-[10px] lg:text-[11px] font-medium mt-1.5 text-slate-500 dark:text-[#7a8599] whitespace-nowrap">
                {stat.label}
              </div>
            </div>
          ))}

          {/* Available for freelance */}
          <div className="flex items-center gap-4 ml-auto px-5 lg:px-6 py-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <div className="text-[11px] lg:text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Available for freelance
                </div>
              </div>
              <div className="text-[10px] lg:text-[11px] mt-0.5 text-slate-500 dark:text-[#7a8599]">
                Let's build something amazing together.
              </div>
            </div>
            <button
              onClick={scrollToContact}
              className="group flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg transition-all duration-200 shrink-0 cursor-pointer shadow-md shadow-indigo-600/25"
            >
              Hire Me
              <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        {...fadeIn(1.6)}
        onClick={scrollToAbout}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') scrollToAbout() }}
        className="hidden md:flex absolute bottom-5 left-1/2 -translate-x-1/2 flex-col items-center gap-1.5 cursor-pointer group z-30 pointer-events-auto text-slate-500 dark:text-[#7a8599]"
        role="button"
        tabIndex={0}
        aria-label="Scroll to explore"
      >
        <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.18em] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
          Scroll to explore
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
