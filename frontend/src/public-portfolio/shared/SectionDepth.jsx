import { useRef, useEffect, useCallback } from 'react'
import { useScrollData } from '../../shared/context/ScrollContext'

/**
 * Section Depth Wrapper with 3D Scroll Rotation
 *
 * Rotates sections in 3D space as you scroll through the page:
 * - Entering sections tilt up from the back (+rotateX, -translateZ)
 * - Centered sections stand flat and clear (0deg, 0px)
 * - Exiting sections rotate away backwards (-rotateX, -translateZ)
 *
 * Gives a 3D cylindrical / flip-card turn between sections.
 */

const DEPTH_PRESETS = {
  hero: { parallax: 0, rotation: 10, scale: true },
  about: { parallax: 0.04, rotation: 14, scale: true },
  skills: { parallax: 0.02, rotation: 12, scale: true },
  projects: { parallax: 0.05, rotation: 15, scale: true },
  experience: { parallax: 0.03, rotation: 13, scale: true },
  testimonials: { parallax: 0.03, rotation: 12, scale: true },
  contact: { parallax: 0.01, rotation: 8, scale: true },
}

export default function SectionDepth({ children, sectionId, className = '', style = {} }) {
  const sectionRef = useRef(null)
  const scrollData = useScrollData()
  const rafRef = useRef(null)
  const reducedMotion = useRef(false)
  const stateRef = useRef({ currentRotX: 0, currentRotY: 0, currentZ: 0, currentParallax: 0 })

  const preset = DEPTH_PRESETS[sectionId] || DEPTH_PRESETS.about

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedMotion.current = mq.matches
    const handler = () => {
      reducedMotion.current = mq.matches
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const update = useCallback(() => {
    const el = sectionRef.current
    if (!el || !scrollData || reducedMotion.current) {
      rafRef.current = null
      return
    }

    const s = scrollData
    const rect = el.getBoundingClientRect()
    const vh = window.innerHeight

    // Section position relative to viewport center (-1 to 1)
    const sectionCenter = rect.top + rect.height / 2
    const normalizedPos = (sectionCenter - vh / 2) / (vh / 2)

    // Skip expensive math when section is far away
    if (Math.abs(normalizedPos) > 1.8) {
      rafRef.current = requestAnimationFrame(update)
      return
    }

    const st = stateRef.current

    // 3D Rotation along X-axis (tilts back when entering from bottom or exiting at top)
    const clampedPos = Math.max(-1.2, Math.min(1.2, normalizedPos))
    const targetRotX = clampedPos * preset.rotation

    // Velocity-induced dynamic yaw tilt
    const velInfluence = Math.max(-2.5, Math.min(2.5, s.velocity * 0.12))
    const targetRotY = clampedPos * 1.5 + velInfluence

    // 3D Z recession (pulls back into space when not at viewport center)
    const targetZ = -Math.abs(clampedPos) * 110

    // Subtle parallax
    const targetParallax = -clampedPos * preset.parallax * 35

    // Smooth physics damping
    const sm = 0.08
    st.currentRotX += (targetRotX - st.currentRotX) * sm
    st.currentRotY += (targetRotY - st.currentRotY) * sm
    st.currentZ += (targetZ - st.currentZ) * sm
    st.currentParallax += (targetParallax - st.currentParallax) * sm

    // Dynamic transform-origin based on entrance vs exit
    const originY = clampedPos > 0.1 ? '20%' : clampedPos < -0.1 ? '80%' : '50%'

    // Scale down slightly when rotated away
    const scale = 1 - Math.abs(clampedPos) * 0.04

    el.style.transform = `translate3d(0, ${st.currentParallax}px, ${st.currentZ}px) perspective(1400px) rotateX(${st.currentRotX}deg) rotateY(${st.currentRotY}deg) scale(${scale})`
    el.style.transformOrigin = `center ${originY}`

    rafRef.current = requestAnimationFrame(update)
  }, [scrollData, preset])

  useEffect(() => {
    if (!scrollData) return

    rafRef.current = requestAnimationFrame(update)

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      if (sectionRef.current) {
        sectionRef.current.style.transform = ''
      }
    }
  }, [scrollData, update])

  return (
    <div
      ref={sectionRef}
      className={className}
      style={{
        willChange: 'transform',
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
