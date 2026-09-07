import { useRef, useEffect, useCallback, useState } from 'react'
import { useScrollData } from '../../shared/context/ScrollContext'

/**
 * useSectionReveal
 *
 * Provides scroll-driven reveal data for sections.
 * Tracks viewport entry, progress, and velocity for smooth entrance animations.
 *
 * Returns: { ref, isInView, progress, velocity, direction }
 */
export function useSectionReveal(options = {}) {
  const {
    threshold = 0.15,
    rootMargin = '-10% 0px -10% 0px',
  } = options

  const sectionRef = useRef(null)
  const scrollData = useScrollData()
  const [isInView, setIsInView] = useState(false)
  const progressRef = useRef(0)
  const velocityRef = useRef(0)
  const directionRef = useRef(0)
  const rafRef = useRef(null)

  const update = useCallback(() => {
    const el = sectionRef.current
    if (!el || !scrollData) {
      rafRef.current = null
      return
    }

    const rect = el.getBoundingClientRect()
    const vh = window.innerHeight
    const inView = rect.top < vh * 0.85 && rect.bottom > vh * 0.15

    if (inView !== progressRef.current > 0) {
      setIsInView(inView)
    }

    if (inView) {
      const sectionCenter = rect.top + rect.height / 2
      const normalized = (sectionCenter - vh / 2) / (vh / 2)
      progressRef.current = Math.max(0, Math.min(1, 1 - Math.abs(normalized)))
      velocityRef.current = scrollData.velocity
      directionRef.current = scrollData.direction
    } else {
      progressRef.current = 0
    }

    rafRef.current = requestAnimationFrame(update)
  }, [scrollData])

  useEffect(() => {
    if (!scrollData) return

    // IntersectionObserver for efficient in/out detection
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting)
        })
      },
      { threshold, rootMargin }
    )

    const el = sectionRef.current
    if (el) observer.observe(el)

    rafRef.current = requestAnimationFrame(update)

    return () => {
      observer.disconnect()
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [scrollData, threshold, rootMargin, update])

  return {
    ref: sectionRef,
    isInView,
    progress: progressRef.current,
    velocity: velocityRef.current,
    direction: directionRef.current,
  }
}
