import { lazy, Suspense, useCallback, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSiteSettings } from '../../../shared/context/SiteSettingsContext'
import GuillocheWaves from '../../components/ui/GuillocheWaves'
import HeroHeaderBanner from '../../components/ui/HeroHeaderBanner'

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
  const navigate = useNavigate()

  const profileData = {
    name: 'Desalegn Kasaye',
    badge: 'fullstack and flutter developer',
    socialLinks: settings?.socialLinks || {},
  }

  const scrollToAbout = useCallback(() => {
    navigate('/about')
  }, [navigate])

  return (
    <section
      id="home"
      className="flex flex-col min-h-[100svh] min-h-screen bg-white dark:bg-[#1a1a2e] text-slate-900 dark:text-white transition-colors duration-300 overflow-hidden relative"
      aria-label="Hero section"
    >
      {/* Background Guilloche Waves matching Image 1 & Image 3 */}
      <GuillocheWaves />

      {/* ── Zone 0: Navbar spacer ── */}
      <div className="h-10 sm:h-12 shrink-0" />

      {/* ── Zone 1: 3D Header Banner matching Image 1 ── */}
      <div className="w-full z-20 shrink-0 pointer-events-none">
        <HeroHeaderBanner name="Desalegn Kasaye" />
      </div>

      {/* ── Zone 2: Full-Bleed 3D Workstation Scene matching Image 1 (NO zoom in / zoom out) ── */}
      <div className="flex-1 w-full min-h-[500px] sm:min-h-[560px] md:min-h-[620px] relative z-10 pointer-events-auto">
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-[#0084FF]/30 border-t-[#0084FF] rounded-full animate-spin" />
          </div>
        }>
          <HeroDesktopScene className="w-full h-full" profileData={profileData} scene3D={content?.scene3D} />
        </Suspense>
      </div>

      {/* ── Zone 3: Subtle Scroll Indicator at bottom ── */}
      <motion.div
        {...fadeIn(1.2)}
        onClick={scrollToAbout}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') scrollToAbout() }}
        className="hidden md:flex justify-center py-2 shrink-0 cursor-pointer group pointer-events-auto text-slate-500 dark:text-[#7a8599] z-20"
        role="button"
        tabIndex={0}
        aria-label="Scroll to explore"
      >
        <div className="flex flex-col items-center gap-1">
          <span className="text-[9px] font-semibold uppercase tracking-[0.18em] group-hover:text-[#0084FF] dark:group-hover:text-[#38BDF8] transition-colors duration-200">
            Scroll to explore
          </span>
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="w-[16px] h-[24px] border-[1.5px] border-slate-300 dark:border-[#2a3454] rounded-full flex justify-center pt-1 group-hover:border-[#0084FF] dark:group-hover:border-[#38BDF8] transition-colors duration-200"
          >
            <motion.div
              animate={{ y: [0, 6, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="w-[2px] h-[5px] bg-[#0084FF] dark:bg-[#38BDF8] rounded-full"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

export default memo(Hero)
