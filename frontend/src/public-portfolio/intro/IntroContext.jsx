import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'

const PHASES = [
  { id: 0, name: 'DIGITAL_AWAKENING', duration: 3500 },
  { id: 1, name: 'CORE_INITIALIZATION', duration: 4000 },
  { id: 2, name: 'IDENTITY_RECOGNITION', duration: 3000 },
  { id: 3, name: 'DASHBOARD', duration: 3000 },
  { id: 4, name: 'WORKSPACE_CONSTRUCTION', duration: 3500 },
  { id: 5, name: 'POWER_ON', duration: 2500 },
  { id: 6, name: 'ENTER_WORKSPACE', duration: 2000 },
]

const INTRO_SESSION_KEY = 'desalegn-os-intro-played'

const IntroContext = createContext(null)

export function IntroProvider({ children }) {
  const [introComplete, setIntroComplete] = useState(() => {
    try { return sessionStorage.getItem(INTRO_SESSION_KEY) === 'true' } catch { return false }
  })
  const [currentPhase, setCurrentPhase] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [phaseProgress, setPhaseProgress] = useState(0)
  const timerRef = useRef(null)
  const startTimeRef = useRef(null)

  const markComplete = useCallback(() => {
    setIntroComplete(true)
    setIsPlaying(false)
    try { sessionStorage.setItem(INTRO_SESSION_KEY, 'true') } catch {}
  }, [])

  const skipIntro = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    markComplete()
  }, [markComplete])

  const playIntro = useCallback(() => {
    setCurrentPhase(0)
    setPhaseProgress(0)
    setIsPlaying(true)
    startTimeRef.current = Date.now()
  }, [])

  const nextPhase = useCallback(() => {
    setCurrentPhase((prev) => {
      const next = prev + 1
      if (next >= PHASES.length) {
        markComplete()
        return prev
      }
      setPhaseProgress(0)
      startTimeRef.current = Date.now()
      return next
    })
  }, [markComplete])

  const toggleMute = useCallback(() => setIsMuted((prev) => !prev), [])

  useEffect(() => {
    if (!isPlaying) return
    const phase = PHASES[currentPhase]
    if (!phase) return

    const tick = () => {
      const elapsed = Date.now() - startTimeRef.current
      const progress = Math.min(elapsed / phase.duration, 1)
      setPhaseProgress(progress)
      if (progress < 1) {
        timerRef.current = requestAnimationFrame(tick)
      }
    }
    timerRef.current = requestAnimationFrame(tick)
    return () => { if (timerRef.current) cancelAnimationFrame(timerRef.current) }
  }, [isPlaying, currentPhase])

  const value = {
    introComplete,
    currentPhase,
    currentPhaseName: PHASES[currentPhase]?.name || '',
    isPlaying,
    isMuted,
    phaseProgress,
    phases: PHASES,
    playIntro,
    nextPhase,
    skipIntro,
    toggleMute,
    markComplete,
  }

  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>
}

export function useIntro() {
  const ctx = useContext(IntroContext)
  if (!ctx) throw new Error('useIntro must be used within IntroProvider')
  return ctx
}

export { PHASES, INTRO_SESSION_KEY }
