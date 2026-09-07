import { useRef, useEffect, useCallback } from 'react'

/**
 * Premium Smooth Scroll Hook
 * 
 * Provides smooth interpolation for scroll-driven effects while maintaining
 * native scroll behavior for user control. Uses requestAnimationFrame for
 * performance and respects reduced motion preferences.
 * 
 * Features:
 * - Native scroll preservation (no scroll jacking)
 * - Smooth interpolation for visual effects
 * - Scroll velocity tracking
 * - Rotation and parallax controls
 * - Mobile and reduced motion support
 */
export function useSmoothScroll(options = {}) {
  const {
    enabled = true,
    maxRotationY = 1.5, // Maximum Y-axis rotation in degrees
    maxRotationX = 1.0, // Maximum X-axis rotation in degrees
    parallaxFactor = 0.1, // Parallax intensity (0-1)
    velocityFactor = 0.3, // Velocity effect intensity (0-1)
    smoothing = 0.08, // Interpolation smoothing (0-1)
  } = options

  const scrollRef = useRef({
    current: 0,
    target: 0,
    velocity: 0,
    lastScroll: 0,
    lastTime: 0,
    rotationX: 0,
    rotationY: 0,
    parallax: 0,
  })

  const rafRef = useRef(null)
  const enabledRef = useRef(enabled)
  const reducedMotionRef = useRef(false)

  // Update enabled ref when options change
  useEffect(() => {
    enabledRef.current = enabled
  }, [enabled])

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedMotionRef.current = mediaQuery.matches

    const handleChange = () => {
      reducedMotionRef.current = mediaQuery.matches
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Smooth interpolation loop
  const animate = useCallback(() => {
    const ref = scrollRef.current
    const isReducedMotion = reducedMotionRef.current
    const isEnabled = enabledRef.current

    if (!isEnabled || isReducedMotion) {
      // Bypass smoothing when disabled or reduced motion
      ref.current = ref.target
      ref.rotationX = 0
      ref.rotationY = 0
      ref.parallax = 0
      ref.velocity = 0
      rafRef.current = null
      return
    }

    // Smooth interpolation
    const diff = ref.target - ref.current
    ref.current += diff * smoothing

    // Calculate velocity
    const now = performance.now()
    const timeDelta = now - ref.lastTime
    if (timeDelta > 0) {
      const scrollDelta = ref.target - ref.lastScroll
      ref.velocity = scrollDelta / timeDelta
      ref.lastScroll = ref.target
      ref.lastTime = now
    }

    // Calculate rotation based on scroll position and velocity
    // Normalize scroll position to -1 to 1 range
    const scrollProgress = (ref.current / (document.documentElement.scrollHeight - window.innerHeight)) * 2 - 1
    
    // Base rotation from scroll position
    let targetRotationY = scrollProgress * maxRotationY
    let targetRotationX = Math.abs(scrollProgress) * maxRotationX * 0.5

    // Add velocity-based rotation (subtle)
    const velocityRotation = ref.velocity * velocityFactor * maxRotationY
    targetRotationY += velocityRotation

    // Clamp rotations to max values
    targetRotationY = Math.max(-maxRotationY, Math.min(maxRotationY, targetRotationY))
    targetRotationX = Math.max(-maxRotationX, Math.min(maxRotationX, targetRotationX))

    // Smooth rotation interpolation
    ref.rotationY += (targetRotationY - ref.rotationY) * smoothing
    ref.rotationX += (targetRotationX - ref.rotationX) * smoothing

    // Calculate parallax
    ref.parallax = ref.current * parallaxFactor

    // Continue animation loop
    rafRef.current = requestAnimationFrame(animate)
  }, [maxRotationY, maxRotationX, parallaxFactor, velocityFactor, smoothing])

  // Scroll handler
  const handleScroll = useCallback(() => {
    const ref = scrollRef.current
    ref.target = window.scrollY

    // Start animation loop if not running
    if (!rafRef.current && enabledRef.current && !reducedMotionRef.current) {
      ref.lastTime = performance.now()
      ref.lastScroll = ref.target
      rafRef.current = requestAnimationFrame(animate)
    }
  }, [animate])

  // Set up scroll listener
  useEffect(() => {
    // Initialize
    scrollRef.current.target = window.scrollY
    scrollRef.current.current = window.scrollY
    scrollRef.current.lastTime = performance.now()
    scrollRef.current.lastScroll = window.scrollY

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    // Start animation loop
    if (enabled && !reducedMotionRef.current) {
      rafRef.current = requestAnimationFrame(animate)
    }

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [handleScroll, animate, enabled])

  // Return current scroll state
  return {
    scrollY: scrollRef.current.current,
    scrollProgress: scrollRef.current.current / (document.documentElement.scrollHeight - window.innerHeight) || 0,
    velocity: scrollRef.current.velocity,
    rotationX: scrollRef.current.rotationX,
    rotationY: scrollRef.current.rotationY,
    parallax: scrollRef.current.parallax,
    isSmoothScrollEnabled: enabled && !reducedMotionRef.current,
  }
}

/**
 * Hook for section-specific scroll effects
 * Provides viewport-based calculations for individual sections
 */
export function useSectionScrollEffect(sectionId, options = {}) {
  const {
    rotationIntensity = 0.5, // Section-specific rotation intensity (0-1)
    parallaxIntensity = 0.3, // Section-specific parallax intensity (0-1)
    triggerOffset = 0.2, // When to trigger effects (0-1)
  } = options

  const sectionRef = useRef(null)
  const effectRef = useRef({
    inView: false,
    progress: 0,
    rotationX: 0,
    rotationY: 0,
    parallaxY: 0,
  })

  const rafRef = useRef(null)

  const updateEffects = useCallback(() => {
    const section = sectionRef.current
    if (!section) return

    const rect = section.getBoundingClientRect()
    const windowHeight = window.innerHeight
    const windowWidth = window.innerWidth

    // Calculate section progress in viewport
    const sectionTop = rect.top
    const sectionHeight = rect.height
    const sectionBottom = rect.bottom

    // Determine if section is in view
    const inView = sectionTop < windowHeight * (1 - triggerOffset) && 
                   sectionBottom > windowHeight * triggerOffset

    // Calculate progress through viewport (0 to 1)
    let progress = 0
    if (inView) {
      const visibleHeight = Math.min(sectionBottom, windowHeight) - Math.max(sectionTop, 0)
      progress = visibleHeight / windowHeight
    }

    // Calculate rotation based on viewport position
    const viewportCenter = sectionTop + sectionHeight / 2 - windowHeight / 2
    const normalizedPosition = viewportCenter / (windowHeight / 2)
    
    const targetRotationX = normalizedPosition * rotationIntensity
    const targetRotationY = (rect.left - windowWidth / 2) / (windowWidth / 2) * rotationIntensity * 0.5

    // Calculate parallax
    const targetParallaxY = -viewportCenter * parallaxIntensity * 0.1

    // Smooth interpolation
    const smoothing = 0.1
    effectRef.current.inView = inView
    effectRef.current.progress += (progress - effectRef.current.progress) * smoothing
    effectRef.current.rotationX += (targetRotationX - effectRef.current.rotationX) * smoothing
    effectRef.current.rotationY += (targetRotationY - effectRef.current.rotationY) * smoothing
    effectRef.current.parallaxY += (targetParallaxY - effectRef.current.parallaxY) * smoothing

    rafRef.current = requestAnimationFrame(updateEffects)
  }, [rotationIntensity, parallaxIntensity, triggerOffset])

  useEffect(() => {
    const section = document.getElementById(sectionId)
    if (section) {
      sectionRef.current = section
      rafRef.current = requestAnimationFrame(updateEffects)
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [sectionId, updateEffects])

  return {
    ref: sectionRef,
    inView: effectRef.current.inView,
    progress: effectRef.current.progress,
    rotationX: effectRef.current.rotationX,
    rotationY: effectRef.current.rotationY,
    parallaxY: effectRef.current.parallaxY,
  }
}