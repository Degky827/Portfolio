import { useEffect, lazy, Suspense, useCallback, memo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSiteSettings } from '../../../shared/context/SiteSettingsContext'
import { useScrollData } from '../../../shared/context/ScrollContext'
import { setHeroScrollProgress } from '../../shared/heroScrollStore'
import GuillocheWaves from '../../components/ui/GuillocheWaves'

const HeroDesktopScene = lazy(() =>
  import('../../components/3d/HeroDesktopScene')
)

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.5, delay },
})

function Hero({ content }) {
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

  const profileData = {
    name: 'Desalegn Kasaye',
    badge: 'fullstack and flutter developer',
    socialLinks: settings?.socialLinks || {},
  }

  const navigate = useNavigate()

  const scrollToAbout = useCallback(() => {
    navigate('/about')
  }, [navigate])

  return (
    <section
      id="home"
      ref={heroRef}
      className="flex flex-col h-[100svh] min-h-screen bg-white dark:bg-[#1a1a2e] text-slate-900 dark:text-white transition-colors duration-300 overflow-hidden relative"
      aria-label="Hero section"
    >
      {/* Background Guilloche Waves (#6C2BFF) matching Image 3 */}
      <GuillocheWaves />

      {/* ── Zone 0: Navbar spacer ── */}
      <div className="h-12 sm:h-14 shrink-0" />

      {/* ── Zone 1: Full-Screen 3D Workstation Scene matching Image 1 & Image 3 ── */}
      <div
        ref={contentRef}
        className="flex-1 w-full h-full min-h-0 relative z-10 pointer-events-auto cursor-grab active:cursor-grabbing"
        style={{ willChange: 'transform, opacity' }}
      >
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-[#6C2BFF]/30 border-t-[#6C2BFF] rounded-full animate-spin" />
          </div>
        }>
          <HeroDesktopScene className="w-full h-full" profileData={profileData} scene3D={content?.scene3D} />
        </Suspense>
      </div>

      {/* ── Zone 2: Subtle Scroll indicator at bottom ── */}
      <motion.div
        {...fadeIn(1.2)}
        onClick={scrollToAbout}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') scrollToAbout() }}
        className="hidden md:flex justify-center py-2.5 shrink-0 cursor-pointer group pointer-events-auto text-slate-500 dark:text-[#7a8599] z-20"
        role="button"
        tabIndex={0}
        aria-label="Scroll to explore"
      >
        <div className="flex flex-col items-center gap-1">
          <span className="text-[9px] font-semibold uppercase tracking-[0.18em] group-hover:text-[#6C2BFF] dark:group-hover:text-[#8B5CF6] transition-colors duration-200">
            Scroll to explore
          </span>
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="w-[16px] h-[24px] border-[1.5px] border-slate-300 dark:border-[#2a3454] rounded-full flex justify-center pt-1 group-hover:border-[#6C2BFF] dark:group-hover:border-[#8B5CF6] transition-colors duration-200"
          >
            <motion.div
              animate={{ y: [0, 6, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="w-[2px] h-[5px] bg-[#6C2BFF] dark:bg-[#8B5CF6] rounded-full"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

export default memo(Hero)
