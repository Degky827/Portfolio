import { useRef, useEffect, useCallback } from 'react'
import { useScrollData } from '../../shared/context/ScrollContext'

/**
 * Scroll-Driven Page Rotation & Parallax
 *
 * Applies a very subtle 3D tilt to the main content wrapper
 * based on scroll velocity. Uses RAF + refs for zero React re-renders.
 *
 * Rotation: ±1.2° Y, ±0.6° X (velocity-based)
 * Returns to neutral when scroll stops.
 */
export default function ScrollDrivenEffects({ children }) {
  const wrapperRef = useRef(null)
  const scrollData = useScrollData()
  const rafRef = useRef(null)
  const reducedMotion = useRef(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedMotion.current = mq.matches
    const handler = () => { reducedMotion.current = mq.matches }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const updateTransform = useCallback(() => {
    const el = wrapperRef.current
    if (!el || !scrollData || reducedMotion.current) {
      rafRef.current = null
      return
    }

    const s = scrollData
    const rotY = s.rotationY
    const rotX = s.rotationX
    const parallax = s.current * 0.02

    el.style.transform = `translate3d(0, ${-parallax}px, 0) rotateX(${rotX}deg) rotateY(${rotY}deg)`

    rafRef.current = requestAnimationFrame(updateTransform)
  }, [scrollData])

  useEffect(() => {
    if (!scrollData) return

    const loop = () => {
      updateTransform()
      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      if (wrapperRef.current) {
        wrapperRef.current.style.transform = ''
      }
    }
  }, [scrollData, updateTransform])

  return (
    <div
      ref={wrapperRef}
      style={{
        willChange: 'transform',
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </div>
  )
}
