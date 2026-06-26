import { useState, useEffect, useRef, memo, useCallback } from 'react'

/**
 * StatisticCounter
 *
 * Animated number counter that:
 * - Parses numeric value from string (e.g., "50+" → 50)
 * - Animates from 0 to target number
 * - Duration: ~1.5s with easing
 * - Triggers once when entering viewport
 * - Preserves suffix (e.g., "+")
 */
const StatisticCounter = memo(function StatisticCounter({ value, color = '#f8fafc' }) {
  const [displayValue, setDisplayValue] = useState('0')
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef(null)
  const animationRef = useRef(null)

  // Parse the value to extract number and suffix
  const parsed = (() => {
    const str = String(value || '')
    const match = str.match(/^(\d+)(.*)$/)
    if (match) {
      return { number: parseInt(match[1], 10), suffix: match[2] }
    }
    return { number: 0, suffix: str }
  })()

  const animateValue = useCallback((start, end, duration) => {
    const startTime = performance.now()
    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4)

    const tick = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeOutQuart(progress)
      const current = Math.round(start + (end - start) * easedProgress)

      setDisplayValue(String(current))

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(tick)
      }
    }

    animationRef.current = requestAnimationFrame(tick)
  }, [])

  useEffect(() => {
    if (parsed.number === 0 && !parsed.suffix) {
      setDisplayValue(value || '0')
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          animateValue(0, parsed.number, 1500)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      observer.disconnect()
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [parsed.number, parsed.suffix, hasAnimated, animateValue, value])

  return (
    <span
      ref={ref}
      className="tabular-nums"
      style={{
        color,
        fontVariantNumeric: 'tabular-nums',
        fontFeatureSettings: '"tnum"',
      }}
    >
      {displayValue}{parsed.suffix}
    </span>
  )
})

export default StatisticCounter
