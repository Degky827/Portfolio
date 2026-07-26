import { useCallback, useEffect, memo, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { useIntro } from './IntroContext'
import IntroControls from './IntroControls'

const Phase1 = lazy(() => import('./phases/Phase1DigitalAwakening'))
const Phase2 = lazy(() => import('./phases/Phase2CoreInitialization'))
const Phase3 = lazy(() => import('./phases/Phase3IdentityRecognition'))
const Phase4 = lazy(() => import('./phases/Phase4Dashboard'))
const Phase5 = lazy(() => import('./phases/Phase5WorkspaceConstruction'))
const Phase6 = lazy(() => import('./phases/Phase6PowerOn'))
const Phase7 = lazy(() => import('./phases/Phase7EnterWorkspace'))

const PHASE_COMPONENTS = [Phase1, Phase2, Phase3, Phase4, Phase5, Phase6, Phase7]

const phaseSpinner = (
  <div className="absolute inset-0 bg-black flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-[#06b6d4]/30 border-t-[#06b6d4] rounded-full animate-spin" />
  </div>
)

function IntroSystem() {
  const { currentPhase, nextPhase, introComplete, isPlaying, playIntro } = useIntro()
  const { pathname } = useLocation()

  useEffect(() => {
    const isRoot = pathname === '/' || pathname === ''
    const isPublic = !pathname.startsWith('/admin') && !pathname.startsWith('/workspace') && !pathname.startsWith('/login')
    if (!introComplete && !isPlaying && isRoot && isPublic) {
      playIntro()
    }
  }, [pathname, introComplete, isPlaying, playIntro])

  const handlePhaseComplete = useCallback(() => {
    nextPhase()
  }, [nextPhase])

  if (introComplete || !isPlaying) return null

  const CurrentPhaseComponent = PHASE_COMPONENTS[currentPhase]

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="fixed inset-0 z-[9999]"
      style={{ backgroundColor: '#000000' }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPhase}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0"
        >
          <Suspense fallback={phaseSpinner}>
            {CurrentPhaseComponent && (
              <CurrentPhaseComponent onComplete={handlePhaseComplete} />
            )}
          </Suspense>
        </motion.div>
      </AnimatePresence>

      <IntroControls />

      {/* Corner branding */}
      <div className="absolute top-5 left-5 z-50 font-mono text-[10px] tracking-[0.2em] uppercase" style={{ color: '#06b6d430' }}>
        DESALEGN OS v3.0
      </div>
      <div className="absolute top-5 right-5 z-50 font-mono text-[10px] tracking-[0.2em] uppercase" style={{ color: '#06b6d430' }}>
        {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
      </div>
    </motion.div>
  )
}

export default memo(IntroSystem)
