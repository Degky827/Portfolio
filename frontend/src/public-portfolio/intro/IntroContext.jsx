import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'

const SCENES = [
  { id: 0, name: 'BEGINNING', duration: 1200 },
  { id: 1, name: 'KNOWLEDGE', duration: 1400 },
  { id: 2, name: 'INTELLIGENCE', duration: 1200 },
  { id: 3, name: 'ENGINEERING', duration: 1500 },
  { id: 4, name: 'DEVELOPER_DNA', duration: 1200 },
  { id: 5, name: 'DIGITAL_ECOSYSTEM', duration: 1000 },
  { id: 6, name: 'POWER_SEQUENCE', duration: 1200 },
  { id: 7, name: 'WELCOME', duration: 1500 },
  { id: 8, name: 'TRANSITION', duration: 1500 },
]

const SESSION_KEY = 'desalegn-cinematic-intro-v2'

const IntroContext = createContext(null)

export function IntroProvider({ children }) {
  const [introComplete, setIntroComplete] = useState(() => {
    try { return sessionStorage.getItem(SESSION_KEY) === 'true' } catch { return false }
  })
  const [currentScene, setCurrentScene] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [sceneProgress, setSceneProgress] = useState(0)
  const rafRef = useRef(null)
  const startTimeRef = useRef(0)

  const markComplete = useCallback(() => {
    setIntroComplete(true)
    setIsPlaying(false)
    try { sessionStorage.setItem(SESSION_KEY, 'true') } catch {}
  }, [])

  const skipIntro = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    markComplete()
  }, [markComplete])

  const replayIntro = useCallback(() => {
    try { sessionStorage.removeItem(SESSION_KEY) } catch {}
    setIntroComplete(false)
    setCurrentScene(0)
    setSceneProgress(0)
    setIsPlaying(true)
    startTimeRef.current = performance.now()
  }, [])

  const playIntro = useCallback(() => {
    setCurrentScene(0)
    setSceneProgress(0)
    setIsPlaying(true)
    startTimeRef.current = performance.now()
  }, [])

  const nextScene = useCallback(() => {
    setCurrentScene((prev) => {
      const next = prev + 1
      if (next >= SCENES.length) {
        markComplete()
        return prev
      }
      setSceneProgress(0)
      startTimeRef.current = performance.now()
      return next
    })
  }, [markComplete])

  const toggleMute = useCallback(() => setIsMuted((prev) => !prev), [])

  useEffect(() => {
    if (!isPlaying) return
    const scene = SCENES[currentScene]
    if (!scene) return

    const tick = () => {
      const elapsed = performance.now() - startTimeRef.current
      const progress = Math.min(elapsed / scene.duration, 1)
      setSceneProgress(progress)
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [isPlaying, currentScene])

  const value = {
    introComplete,
    currentScene,
    currentSceneName: SCENES[currentScene]?.name || '',
    isPlaying,
    isMuted,
    sceneProgress,
    scenes: SCENES,
    playIntro,
    nextScene,
    skipIntro,
    replayIntro,
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

export { SCENES, SESSION_KEY }
