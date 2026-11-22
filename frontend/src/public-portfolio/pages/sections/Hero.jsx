import { useEffect, useState, lazy, Suspense, useCallback, memo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Mail } from 'lucide-react'
import { useSiteSettings } from '../../../shared/context/SiteSettingsContext'
import { useScrollData } from '../../../shared/context/ScrollContext'
import { setHeroScrollProgress } from '../../shared/heroScrollStore'
import GuillocheWaves from '../../components/ui/GuillocheWaves'

const HeroDesktopScene = lazy(() =>
  import('../../components/3d/HeroDesktopScene')
)

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

function Hero({ content, contactButtonText, contactButtonLink }) {
  const { settings } = useSiteSettings()
  const scrollData = useScrollData()
  const heroRef = useRef(null)
  const contentRef = useRef(null)
  const rafRef = useRef(null)
  const reducedMotion = useRef(false)
  const stateRef = useRef({ parallaxY: 0, opacity: 1, scale: 1 })

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedMotion.current = mq.matches
    const handler = () => { reducedMotion.current = mq.matches }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Scroll-driven hero effects
  useEffect(() => {
    if (!scrollData) return

    const update = () => {
      const el = heroRef.current
      const cEl = contentRef.current
      if (!el || !cEl || reducedMotion.current) {
        rafRef.current = null
        return
      }

      const rect = el.getBoundingClientRect()
      const heroProgress = Math.max(0, Math.min(1, -rect.top / rect.height))
      const s = stateRef.current
      const sm = 0.08

      // Parallax
      s.parallaxY += (heroProgress * -30 - s.parallaxY) * sm
      // Opacity
      s.opacity += (Math.max(0, 1 - heroProgress * 2.2) - s.opacity) * sm
      // Scale
      s.scale += (Math.max(0.97, 1 - heroProgress * 0.03) - s.scale) * sm
      // Progress for 3D scene
      s.progress = heroProgress

      cEl.style.transform = `translate3d(0, ${s.parallaxY}px, 0) scale(${s.scale})`
      cEl.style.opacity = Math.max(0, s.opacity)

      setHeroScrollProgress(heroProgress)

      rafRef.current = requestAnimationFrame(update)
    }

    rafRef.current = requestAnimationFrame(update)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      setHeroScrollProgress(0)
      if (contentRef.current) {
        contentRef.current.style.transform = ''
        contentRef.current.style.opacity = ''
      }
    }
  }, [scrollData])

  const h = content?.hero || {}
  const greeting = settings?.greeting || content?.greeting || h.greeting || "Hi, I'm"
  const fullName = settings?.brandName || content?.fullName || h.fullName || 'Desalegn'
  const badge = settings?.professionalBadge || content?.professionalBadge || h.professionalBadge || 'Full Stack Developer'
  const introduction = settings?.shortIntroduction || content?.shortIntroduction || h.shortIntroduction || h.description || 'I build scalable, high-performance web and mobile applications using modern technologies, robust architecture, and production-ready engineering practices.'
  const contactBtnText = h.secondaryCtaText || contactButtonText || settings?.contactButtonText || 'Get In Touch'
  const contactBtnLink = h.secondaryCtaUrl || contactButtonLink || settings?.contactButtonLink || '#contact'

  const showPrimaryCta = h.showPrimaryCta !== false
  const showSecondaryCta = h.showSecondaryCta !== false
  const primaryCtaText = h.primaryCtaText || 'Explore My Work'
  const primaryCtaUrl = h.primaryCtaUrl || '#projects'

  const displayName = (fullName === 'DESALEGN' || fullName === 'DK' || !fullName)
    ? 'Desalegn'
    : (fullName.includes(' ') ? fullName.split(' ')[0] : fullName)

  const profileData = {
    name: fullName,
    badge,
    socialLinks: settings?.socialLinks || {},
  }

  const navigate = useNavigate()

  const scrollToWork = useCallback(() => {
    navigate('/projects')
  }, [navigate])

  const scrollToContact = useCallback(() => {
    navigate('/contact')
  }, [navigate])

  const scrollToAbout = useCallback(() => {
    navigate('/about')
  }, [navigate])

  return (
    <section
      id="home"
      ref={heroRef}
      className="flex flex-col min-h-[100svh] min-h-screen bg-white dark:bg-[#1a1a2e] text-slate-900 dark:text-white transition-colors duration-300 overflow-hidden relative"
      aria-label="Hero section"
    >
      {/* Background Guilloche Waves (#6C2BFF) */}
      <GuillocheWaves />

      {/* ── Zone 0: Navbar spacer ── */}
      <div className="h-10 sm:h-12 shrink-0" />

      {/* ── Zone 1: Hero row (Hero Content + 3D Desktop Scene) ── */}
      <div
        ref={contentRef}
        className="flex-1 min-h-0 flex flex-col lg:flex-row items-center justify-between w-full max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16"
        style={{ willChange: 'transform, opacity' }}
      >
        {/* Left: Typography & Actions matching Image 2 */}
        <div className="w-full lg:w-[38%] xl:w-[36%] py-6 lg:py-0 pointer-events-none z-20">
          <div className="pointer-events-auto w-full">
            <div className="flex items-start gap-4 sm:gap-5">
              {/* Vertical Purple Accent Line with Dot */}
              <div className="flex flex-col items-center shrink-0 pt-2 sm:pt-2.5 select-none" aria-hidden="true">
                <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#6C2BFF] ring-4 ring-[#6C2BFF]/20 shadow-md shadow-[#6C2BFF]/40" />
                <div className="w-[3px] h-32 sm:h-40 md:h-48 bg-[#6C2BFF] rounded-full mt-2.5" />
              </div>

              <div className="flex-1 min-w-0">
                {/* Main Heading: Hi, I'm Desalegn */}
                <motion.h1
                  {...fadeUp(0.2)}
                  className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.12]"
                >
                  {greeting} <span className="text-[#6C2BFF] dark:text-[#8B5CF6]">{displayName}</span>
                </motion.h1>

                {/* Subtitle: I am Full Stack Developer, Content Creator */}
                <motion.div
                  {...fadeUp(0.3)}
                  className="text-xl sm:text-2xl lg:text-[26px] font-bold text-slate-800 dark:text-slate-100 mt-3 sm:mt-4 leading-snug"
                >
                  I am {badge},<br />
                  Content Creator
                </motion.div>

                {/* Introduction Paragraph */}
                <motion.p
                  {...fadeUp(0.4)}
                  className="text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 mt-3 sm:mt-4 max-w-lg leading-relaxed font-normal"
                >
                  {introduction}
                </motion.p>

                {/* CTA Buttons */}
                {(showPrimaryCta || showSecondaryCta) && (
                  <motion.div {...fadeUp(0.5)} className="flex flex-wrap items-center gap-3.5 sm:gap-4 mt-6 sm:mt-8">
                    {showPrimaryCta && (
                      <button
                        onClick={primaryCtaUrl.startsWith('#') ? scrollToWork : () => window.location.href = primaryCtaUrl}
                        className="group flex items-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 bg-[#6C2BFF] hover:bg-[#591FE6] text-white font-medium text-sm sm:text-[15px] rounded-full transition-all duration-200 shadow-md shadow-[#6C2BFF]/30 hover:shadow-xl hover:shadow-[#6C2BFF]/40 hover:-translate-y-0.5 cursor-pointer"
                        aria-label={primaryCtaText}
                      >
                        <span>{primaryCtaText}</span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
                      </button>
                    )}
                    {showSecondaryCta && (
                      <button
                        onClick={contactBtnLink.startsWith('#') ? scrollToContact : () => window.location.href = contactBtnLink}
                        className="group flex items-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 border border-slate-300 dark:border-white/20 bg-white/80 dark:bg-white/[0.04] backdrop-blur-md text-slate-800 dark:text-white hover:border-[#6C2BFF] hover:text-[#6C2BFF] font-medium text-sm sm:text-[15px] rounded-full transition-all duration-200 hover:-translate-y-0.5 shadow-sm cursor-pointer"
                        aria-label={contactBtnText}
                      >
                        <span>{contactBtnText}</span>
                        <Mail size={16} className="text-[#6C2BFF] group-hover:scale-110 transition-transform duration-200" />
                      </button>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: 3D Scene with Satin White Table, Sled Legs, Floor Shadow & Charcoal Components */}
        <div className="w-full lg:w-[62%] xl:w-[64%] h-[520px] sm:h-[580px] md:h-[640px] lg:h-[700px] relative z-10 pointer-events-auto cursor-grab active:cursor-grabbing">
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-[#6C2BFF]/30 border-t-[#6C2BFF] rounded-full animate-spin" />
            </div>
          }>
            <HeroDesktopScene className="w-full h-full" profileData={profileData} scene3D={content?.scene3D} />
          </Suspense>
        </div>
      </div>

      {/* ── Zone 4: Scroll indicator (Shows the whole previous home page is scrollable) ── */}
      <motion.div
        {...fadeIn(1.6)}
        onClick={scrollToAbout}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') scrollToAbout() }}
        className="hidden md:flex justify-center py-5 shrink-0 cursor-pointer group pointer-events-auto text-slate-500 dark:text-[#7a8599]"
        role="button"
        tabIndex={0}
        aria-label="Scroll to explore"
      >
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.18em] group-hover:text-[#6C2BFF] dark:group-hover:text-[#8B5CF6] transition-colors duration-200">
            Scroll to explore
          </span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="w-[18px] h-[28px] border-[1.5px] border-slate-300 dark:border-[#2a3454] rounded-full flex justify-center pt-1.5 group-hover:border-[#6C2BFF] dark:group-hover:border-[#8B5CF6] transition-colors duration-200"
          >
            <motion.div
              animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="w-[2px] h-[6px] bg-[#6C2BFF] dark:bg-[#8B5CF6] rounded-full"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

export default memo(Hero)
