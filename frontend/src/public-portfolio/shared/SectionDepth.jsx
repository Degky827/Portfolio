import { useRef, useEffect, useCallback } from 'react'

/**
 * SectionDepth
 *
 * Lightweight, zero-overhead 3D depth layer.
 * Event-driven with RAF throttle — consumes 0 CPU/GPU when idle.
 * Uses IntersectionObserver so offscreen sections are completely ignored.
 */
export default function SectionDepth({ children, sectionId, className = '', style = {} }) {
  const sectionRef = useRef(null)
  const isVisibleRef = useRef(true)
  const rafRef = useRef(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting
      },
      { rootMargin: '120px 0px 120px 0px', threshold: 0 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const update = useCallback(() => {
    rafRef.current = null
    const el = sectionRef.current
    if (!el || !isVisibleRef.current) return

    const rect = el.getBoundingClientRect()
    const vh = window.innerHeight
    const sectionCenter = rect.top + rect.height / 2
    const normalizedPos = Math.max(-1, Math.min(1, (sectionCenter - vh / 2) / (vh / 2)))

    // Subtle 3D perspective tilt
    const rotX = (normalizedPos * 2.2).toFixed(2)
    const scale = (1 - Math.abs(normalizedPos) * 0.008).toFixed(3)

    el.style.transform = `perspective(1000px) rotateX(${rotX}deg) scale(${scale})`
  }, [])

  const onScroll = useCallback(() => {
    if (!isVisibleRef.current) return
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(update)
    }
  }, [update])

  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    // Initial calculation
    onScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      if (sectionRef.current) {
        sectionRef.current.style.transform = ''
      }
    }
  }, [onScroll])

  return (
    <div
      ref={sectionRef}
      className={className}
      style={{
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
