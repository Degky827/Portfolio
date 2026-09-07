import { useRef, useEffect, useCallback } from 'react'
import { useScrollData } from '../../shared/context/ScrollContext'

/**
 * Section Depth Wrapper
 *
 * Applies section-specific parallax and subtle rotation based on
 * the section's position in the viewport. Uses RAF for performance.
 *
 * Each section gets a unique depth layer:
 * - Hero: strongest effect
 * - About: subtle tilt
 * - Skills: mostly stable
 * - Projects: moderate parallax
 * - Experience: timeline animation support
 * - Testimonials: subtle horizontal parallax
 * - Contact: calm and stable
 */

const DEPTH_PRESETS = {
  hero: { parallax: 0.08, rotation: 0.4, scale: true },
  about: { parallax: 0.04, rotation: 0.3, scale: false },
  skills: { parallax: 0.02, rotation: 0.15, scale: false },
  projects: { parallax: 0.05, rotation: 0.35, scale: true },
  experience: { parallax: 0.03, rotation: 0.2, scale: false },
  testimonials: { parallax: 0.03, rotation: 0.2, scale: false },
  contact: { parallax: 0.01, rotation: 0.05, scale: false },
}

export default function SectionDepth({ children, sectionId, className = '', style = {} }) {
  const sectionRef = useRef(null)
  const scrollData = useScrollData()
  const rafRef = useRef(null)
  const reducedMotion = useRef(false)
  const stateRef = useRef({ currentRotX: 0, currentRotY: 0, currentParallax: 0 })

  const preset = DEPTH_PRESETS[sectionId] || DEPTH_PRESETS.about

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedMotion.current = mq.matches
    const handler = () => { reducedMotion.current = mq.matches }
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

    // Section position in viewport (-1 to 1)
    const sectionCenter = rect.top + rect.height / 2
    const normalizedPos = (sectionCenter - vh / 2) / (vh / 2)

    // Only apply effects when section is near viewport
    if (Math.abs(normalizedPos) > 1.5) {
      rafRef.current = requestAnimationFrame(update)
      return
    }

    const st = stateRef.current

    // Target rotation from section position
    const targetRotX = normalizedPos * preset.rotation
    const targetRotY = normalizedPos * preset.rotation * 0.3

    // Velocity influence
    const velInfluence = s.velocity * 0.08 * preset.rotation
    const targetRotYWithVel = Math.max(-1.2, Math.min(1.2, targetRotY + velInfluence))

    // Smooth interpolation
    const sm = 0.06
    st.currentRotX += (targetRotX - st.currentRotX) * sm
    st.currentRotY += (targetRotYWithVel - st.currentRotY) * sm

    // Parallax
    const targetParallax = -normalizedPos * preset.parallax * 30
    st.currentParallax += (targetParallax - st.currentParallax) * sm

    // Scale effect (subtle)
    const scale = preset.scale ? 1 + Math.abs(normalizedPos) * 0.005 : 1

    el.style.transform = `translate3d(0, ${st.currentParallax}px, 0) perspective(1000px) rotateX(${st.currentRotX}deg) rotateY(${st.currentRotY}deg) scale(${scale})`
    el.style.transformOrigin = 'center center'

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
        ...style,
      }}
    >
      {children}
    </div>
  )
}
