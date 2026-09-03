import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import TestimonialCard from './TestimonialCard'

const AUTOPLAY_MS = 5000
const BREAKPOINTS = [
  { query: '(min-width: 1024px)', perView: 3 },
  { query: '(min-width: 768px)', perView: 2 },
]

function usePerView() {
  const compute = () => {
    if (typeof window === 'undefined') return 3
    const match = BREAKPOINTS.find((b) => window.matchMedia(b.query).matches)
    return match ? match.perView : 1
  }
  const [perView, setPerView] = useState(compute)

  useEffect(() => {
    const queries = BREAKPOINTS.map((b) => window.matchMedia(b.query))
    const update = () => setPerView(compute())
    queries.forEach((q) => q.addEventListener('change', update))
    return () => queries.forEach((q) => q.removeEventListener('change', update))
  }, [])

  return perView
}

export default function TestimonialCarousel({ testimonials, shouldReduceMotion }) {
  const perView = usePerView()
  const count = testimonials.length
  const [index, setIndex] = useState(0)
  const [animated, setAnimated] = useState(true)
  const [paused, setPaused] = useState(false)
  const settling = useRef(false)

  const canSlide = count > perView
  const track = canSlide ? [...testimonials, ...testimonials.slice(0, perView)] : testimonials
  const step = 100 / perView

  const goTo = useCallback(
    (next) => {
      if (settling.current || !canSlide) return
      setAnimated(true)
      setIndex(next)
    },
    [canSlide]
  )

  const next = useCallback(() => goTo(index + 1), [goTo, index])
  const prev = useCallback(() => {
    if (index === 0) {
      settling.current = true
      setAnimated(false)
      setIndex(count)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          settling.current = false
          setAnimated(true)
          setIndex(count - 1)
        })
      })
      return
    }
    goTo(index - 1)
  }, [goTo, index, count])

  useEffect(() => {
    setIndex(0)
  }, [perView])

  useEffect(() => {
    if (!canSlide || paused) return
    const id = setInterval(() => setIndex((i) => i + 1), AUTOPLAY_MS)
    return () => clearInterval(id)
  }, [canSlide, paused, index])

  const handleAnimationComplete = () => {
    if (index >= count) {
      settling.current = true
      setAnimated(false)
      setIndex(index - count)
      requestAnimationFrame(() => {
        settling.current = false
        setAnimated(true)
      })
    }
  }

  const activeDot = index % count

  return (
    <div
      className="relative max-w-6xl mx-auto"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="overflow-hidden -mx-3 px-3 py-2" aria-live="polite" aria-roledescription="carousel">
        <motion.div
          className="flex items-stretch"
          animate={{ x: `-${index * step}%` }}
          transition={
            animated && !shouldReduceMotion
              ? { type: 'tween', duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
              : { duration: 0 }
          }
          onAnimationComplete={handleAnimationComplete}
        >
          {track.map((testimonial, i) => (
            <div
              key={`${testimonial._id}-${i}`}
              className="flex-none px-3 flex"
              style={{ width: `${step}%` }}
              aria-hidden={i >= count ? true : undefined}
            >
              <TestimonialCard
                testimonial={testimonial}
                index={i % perView}
                shouldReduceMotion={shouldReduceMotion}
              />
            </div>
          ))}
        </motion.div>
      </div>

      {canSlide && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous recommendation"
            className="w-9 h-9 inline-flex items-center justify-center rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#111827] text-[#0f172a] dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <div className="flex items-center gap-2" role="tablist" aria-label="Recommendation slides">
            {testimonials.map((t, i) => (
              <button
                key={t._id}
                type="button"
                role="tab"
                aria-selected={i === activeDot}
                aria-label={`Go to recommendation ${i + 1}`}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  i === activeDot
                    ? 'w-6 bg-[#0f172a] dark:bg-[#70b5f9]'
                    : 'w-2 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={next}
            aria-label="Next recommendation"
            className="w-9 h-9 inline-flex items-center justify-center rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#111827] text-[#0f172a] dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  )
}
