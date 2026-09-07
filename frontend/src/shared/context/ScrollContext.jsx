import { createContext, useContext, useRef, useEffect, useCallback, useMemo } from 'react'

/**
 * Centralized Smooth Scroll Context
 *
 * Provides scroll position, velocity, rotation, and parallax data
 * to the entire app via a single RAF-driven interpolation loop.
 * No scroll jacking — native scroll is preserved for user control.
 */

const ScrollContext = createContext(null)

const SMOOTHING = 0.08
const ROTATION_Y_MAX = 1.2
const ROTATION_X_MAX = 0.6
const VELOCITY_SCALE = 0.15

export function ScrollProvider({ children }) {
  const state = useRef({
    raw: 0,
    current: 0,
    target: 0,
    velocity: 0,
    direction: 0,
    lastTime: 0,
    lastScroll: 0,
    rotationX: 0,
    rotationY: 0,
    progress: 0,
    isScrolling: false,
    scrollTimeout: null,
    raf: null,
    reducedMotion: false,
  })

  // Check reduced motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    state.current.reducedMotion = mq.matches
    const handler = () => { state.current.reducedMotion = mq.matches }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const animate = useCallback(() => {
    const s = state.current
    const docHeight = document.documentElement.scrollHeight - window.innerHeight

    if (s.reducedMotion) {
      s.current = s.target
      s.velocity = 0
      s.rotationX = 0
      s.rotationY = 0
      s.progress = docHeight > 0 ? s.target / docHeight : 0
      s.raf = null
      return
    }

    // Smooth interpolation
    const diff = s.target - s.current
    s.current += diff * SMOOTHING

    // Snap when close enough
    if (Math.abs(diff) < 0.5) {
      s.current = s.target
    }

    // Velocity calculation
    const now = performance.now()
    const dt = now - s.lastTime
    if (dt > 0) {
      const rawVelocity = (s.target - s.lastScroll) / dt
      s.velocity = s.velocity * 0.7 + rawVelocity * 0.3
      s.lastScroll = s.target
      s.lastTime = now
    }

    // Direction
    s.direction = s.velocity > 0.1 ? 1 : s.velocity < -0.1 ? -1 : 0

    // Progress (0-1)
    s.progress = docHeight > 0 ? Math.max(0, Math.min(1, s.current / docHeight)) : 0

    // Scroll state
    s.isScrolling = Math.abs(s.velocity) > 0.05

    // Rotation from velocity (subtle)
    const velocityRotation = s.velocity * VELOCITY_SCALE * ROTATION_Y_MAX
    const targetRotY = Math.max(-ROTATION_Y_MAX, Math.min(ROTATION_Y_MAX, velocityRotation))
    const targetRotX = s.direction * Math.abs(s.velocity) * VELOCITY_SCALE * ROTATION_X_MAX * 0.3

    s.rotationY += (targetRotY - s.rotationY) * SMOOTHING
    s.rotationX += (targetRotX - s.rotationX) * SMOOTHING

    // Clamp
    s.rotationY = Math.max(-ROTATION_Y_MAX, Math.min(ROTATION_Y_MAX, s.rotationY))
    s.rotationX = Math.max(-ROTATION_X_MAX, Math.min(ROTATION_X_MAX, s.rotationX))

    s.raf = requestAnimationFrame(animate)
  }, [])

  const handleScroll = useCallback(() => {
    const s = state.current
    s.target = window.scrollY

    if (!s.raf) {
      s.lastTime = performance.now()
      s.lastScroll = s.target
      s.raf = requestAnimationFrame(animate)
    }
  }, [animate])

  useEffect(() => {
    state.current.target = window.scrollY
    state.current.current = window.scrollY
    state.current.lastTime = performance.now()
    state.current.lastScroll = window.scrollY

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (state.current.raf) {
        cancelAnimationFrame(state.current.raf)
        state.current.raf = null
      }
    }
  }, [handleScroll])

  const value = useMemo(() => ({
    getState: () => state.current,
  }), [])

  return (
    <ScrollContext.Provider value={value}>
      {children}
    </ScrollContext.Provider>
  )
}

/**
 * Hook to read scroll state. Use in animation loops or refs.
 * Returns a ref-like object — always read .current for latest values.
 */
export function useScrollData() {
  const ctx = useContext(ScrollContext)
  if (!ctx) return null
  return ctx.getState()
}
