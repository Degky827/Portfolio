import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { BadgeCheck, RefreshCw, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { getTestimonials } from '../../../shared/services/testimonialService'
import TestimonialCard from '../../components/testimonials/TestimonialCard'
import TestimonialSkeleton from '../../components/testimonials/TestimonialSkeleton'

const AUTO_SCROLL_INTERVAL = 4000

export default function Testimonials() {
  const shouldReduceMotion = useReducedMotion()
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const scrollRef = useRef(null)
  const cardRefs = useRef([])
  const autoScrollRef = useRef(null)
  const activeIndexRef = useRef(0)

  const fetchTestimonials = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getTestimonials({ published: true })
      setTestimonials(data.testimonials || [])
    } catch {
      setError('Unable to load recommendations. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTestimonials()
  }, [])

  useEffect(() => {
    activeIndexRef.current = activeIndex
  }, [activeIndex])

  const scrollToCard = useCallback((index) => {
    const card = cardRefs.current[index]
    if (card && scrollRef.current) {
      const container = scrollRef.current
      const cardLeft = card.offsetLeft
      const cardWidth = card.offsetWidth
      const containerWidth = container.offsetWidth
      const scrollLeft = cardLeft - (containerWidth - cardWidth) / 2
      container.scrollTo({
        left: scrollLeft,
        behavior: shouldReduceMotion ? 'auto' : 'smooth',
      })
      setActiveIndex(index)
    }
  }, [shouldReduceMotion])

  const scrollNextAuto = useCallback(() => {
    const count = testimonials.length
    if (count <= 1) return
    const next = (activeIndexRef.current + 1) % count
    scrollToCard(next)
  }, [testimonials.length, scrollToCard])

  const scrollPrev = useCallback(() => {
    const count = testimonials.length
    if (count <= 1) return
    const newIndex = activeIndexRef.current > 0 ? activeIndexRef.current - 1 : count - 1
    scrollToCard(newIndex)
  }, [testimonials.length, scrollToCard])

  const scrollNext = useCallback(() => {
    const count = testimonials.length
    if (count <= 1) return
    const newIndex = activeIndexRef.current < count - 1 ? activeIndexRef.current + 1 : 0
    scrollToCard(newIndex)
  }, [testimonials.length, scrollToCard])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      scrollPrev()
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      scrollNext()
    } else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      setIsPaused((prev) => !prev)
    }
  }, [scrollPrev, scrollNext])

  // Auto-scroll
  useEffect(() => {
    if (shouldReduceMotion || testimonials.length <= 1 || isPaused) return

    autoScrollRef.current = setInterval(() => {
      const count = testimonials.length
      if (count <= 1) return
      const next = (activeIndexRef.current + 1) % count
      scrollToCard(next)
    }, AUTO_SCROLL_INTERVAL)

    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current)
      }
    }
  }, [shouldReduceMotion, testimonials.length, isPaused, scrollToCard])

  // Update active index on scroll
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft
      const containerWidth = container.offsetWidth
      const center = scrollLeft + containerWidth / 2

      let closestIndex = 0
      let closestDistance = Infinity

      cardRefs.current.forEach((card, i) => {
        if (!card) return
        const cardCenter = card.offsetLeft + card.offsetWidth / 2
        const distance = Math.abs(center - cardCenter)
        if (distance < closestDistance) {
          closestDistance = distance
          closestIndex = i
        }
      })

      setActiveIndex(closestIndex)
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [testimonials.length])

  return (
    <section
      id="testimonials"
      className="py-16 sm:py-20 lg:py-24 min-h-[50vh]"
      aria-label="Professional recommendations"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: shouldReduceMotion ? 0.1 : 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-12 sm:mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"
          >
            <BadgeCheck size={16} className="text-[#0a66c2] dark:text-[#70b5f9]" aria-hidden="true" />
            <span className="text-xs font-semibold tracking-wide text-slate-600 dark:text-slate-300 uppercase">
              Recommendations
            </span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-[2.75rem] font-bold text-slate-900 dark:text-white mb-4 sm:mb-5 tracking-tight leading-tight">
            Professional Recommendations
          </h2>
          <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed px-4">
            Feedback from supervisors, team leads, and colleagues I&apos;ve collaborated with.
          </p>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="flex gap-5 sm:gap-6 overflow-hidden max-w-6xl mx-auto">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="shrink-0 w-[320px] sm:w-[360px]">
                <TestimonialSkeleton />
              </div>
            ))}
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center border border-red-200 dark:border-red-500/20">
              <BadgeCheck className="w-8 h-8 text-red-400 dark:text-red-400" />
            </div>
            <p className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Unable to load recommendations
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              {error}
            </p>
            <button
              onClick={fetchTestimonials}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#0a66c2] dark:bg-[#70b5f9] dark:text-slate-900 rounded-lg hover:bg-[#004182] dark:hover:bg-[#5a9fe0] transition-colors cursor-pointer"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </motion.div>
        ) : testimonials.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
              <BadgeCheck className="w-8 h-8 text-slate-400 dark:text-slate-500" />
            </div>
            <p className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Recommendations coming soon
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              I&apos;m currently collecting recommendations from people I&apos;ve worked with.
            </p>
          </motion.div>
        ) : (
          <div
            className="relative max-w-6xl mx-auto"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
          >
            {/* Navigation buttons */}
            <button
              onClick={scrollPrev}
              className="absolute left-0 sm:-left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg hover:border-[#0a66c2]/30 dark:hover:border-[#70b5f9]/30 text-slate-700 dark:text-slate-300 transition-all duration-200 cursor-pointer"
              aria-label="Previous recommendation"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-0 sm:-right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg hover:border-[#0a66c2]/30 dark:hover:border-[#70b5f9]/30 text-slate-700 dark:text-slate-300 transition-all duration-200 cursor-pointer"
              aria-label="Next recommendation"
            >
              <ChevronRight size={20} />
            </button>

            {/* Pause/Play button */}
            <button
              onClick={() => setIsPaused((prev) => !prev)}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center text-slate-400 hover:text-[#0a66c2] dark:hover:text-[#70b5f9] transition-all duration-200 cursor-pointer opacity-0 hover:opacity-100 focus:opacity-100"
              aria-label={isPaused ? 'Play auto-scroll' : 'Pause auto-scroll'}
            >
              {isPaused ? <Play size={14} fill="currentColor" /> : <Pause size={14} />}
            </button>

            {/* Scrollable track */}
            <div
              ref={scrollRef}
              role="region"
              aria-label="Recommendations carousel"
              aria-roledescription="carousel"
              tabIndex={0}
              onKeyDown={handleKeyDown}
              className="flex gap-5 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 pt-2 px-2 -mx-2
                [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial._id}
                  ref={(el) => { cardRefs.current[index] = el }}
                  className="shrink-0 w-[320px] sm:w-[360px] lg:w-[380px] snap-center"
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`Recommendation ${index + 1} of ${testimonials.length}`}
                >
                  <TestimonialCard
                    testimonial={testimonial}
                    index={index}
                    shouldReduceMotion={shouldReduceMotion}
                  />
                </div>
              ))}
            </div>

            {/* Dot indicators */}
            {testimonials.length > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6" role="tablist" aria-label="Recommendation slides">
                {testimonials.map((testimonial, index) => (
                  <button
                    key={testimonial._id}
                    onClick={() => scrollToCard(index)}
                    role="tab"
                    aria-selected={activeIndex === index}
                    aria-label={`Go to recommendation ${index + 1}`}
                    className={`rounded-full transition-all duration-300 cursor-pointer ${
                      activeIndex === index
                        ? 'w-7 h-2.5 bg-[#0a66c2] dark:bg-[#70b5f9]'
                        : 'w-2.5 h-2.5 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}