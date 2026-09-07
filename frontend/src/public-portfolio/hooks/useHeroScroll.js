import { useRef, useEffect, useCallback } from 'react'
import { useScrollData } from '../../../shared/context/ScrollContext'

/**
 * useHeroScroll
 *
 * Provides scroll-driven data specifically for the hero section.
 * Tracks how far the user has scrolled past the hero for
 * parallax, fade, and 3D camera effects.
 *
 * Returns smooth interpolated values via refs (no React re-renders).
 */
export function useHeroScroll() {
  const scrollData = useScrollData()
  const heroRef = useRef(null)
  const rafRef = useRef(null)
  const stateRef = useRef({
    progress: 0,
    parallaxY: 0,
    opacity: 1,
    scale: 1,
    rotationX: 0,
    rotationY: 0,
    cameraZ: 0,
  })
  const reducedMotion = useRef(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedMotion.current = mq.matches
    const handler = () => { reducedMotion.current = mq.matches }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const update = useCallback(() => {
    const el = heroRef.current
    if (!el || !scrollData || reducedMotion.current) {
      rafRef.current = null
      return
    }

    const s = scrollData
    const rect = el.getBoundingClientRect()
    const vh = window.innerHeight

    // How far through the hero section we've scrolled (0 = top, 1 = past hero)
    const heroProgress = Math.max(0, Math.min(1, -rect.top / rect.height))

    // Smooth interpolation
    const st = stateRef.current
    const sm = 0.08

    st.progress += (heroProgress - st.progress) * sm

    // Parallax: hero content moves up as we scroll
    st.parallaxY += (heroProgress * -40 - st.parallaxY) * sm

    // Opacity: fade out as we scroll past
    st.opacity += (Math.max(0, 1 - heroProgress * 2.5) - st.opacity) * sm

    // Scale: subtle scale down
    st.scale += (Math.max(0.96, 1 - heroProgress * 0.04) - st.scale) * sm

    // Rotation from velocity (very subtle)
    const velRotY = s.velocity * 0.03
    st.rotationY += (velRotY - st.rotationY) * sm

    // Camera Z: push camera back slightly as we scroll
    st.cameraZ += (heroProgress * 2 - st.cameraZ) * sm

    rafRef.current = requestAnimationFrame(update)
  }, [scrollData])

  useEffect(() => {
    if (!scrollData) return

    rafRef.current = requestAnimationFrame(update)

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [scrollData, update])

  return {
    ref: heroRef,
    getState: () => stateRef.current,
  }
}
