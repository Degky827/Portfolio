import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { MessageSquareQuote, RefreshCw } from 'lucide-react'
import { createContainerVariants, defaultViewport } from '../../shared/animations'
import { getTestimonials } from '../../../shared/services/testimonialService'
import TestimonialCard from '../../components/testimonials/TestimonialCard'
import TestimonialSkeleton from '../../components/testimonials/TestimonialSkeleton'

export default function Testimonials() {
  const shouldReduceMotion = useReducedMotion()
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTestimonials = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getTestimonials({ published: true })
      setTestimonials(data.testimonials || [])
    } catch {
      setError('Unable to load testimonials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const containerVariants = createContainerVariants(shouldReduceMotion, 0.12)

  return (
    <section
      id="testimonials"
      className="py-16 sm:py-20 lg:py-24 min-h-[50vh]"
      aria-label="Testimonials section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: shouldReduceMotion ? 0.1 : 0.8 }}
          className="text-center mb-12 sm:mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 mb-4 sm:mb-6 text-xs sm:text-sm font-bold tracking-[0.2em] text-[var(--accent-testimonials)] uppercase bg-[var(--accent-testimonials)]/10 rounded-full border border-[var(--accent-testimonials)]/20"
          >
            <MessageSquareQuote className="w-3 h-3 sm:w-4 sm:h-4" />
            Testimonials
          </motion.span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[var(--text-primary)] mb-4 sm:mb-6 tracking-tight">
            What people say about working with me
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed px-4">
            Feedback from colleagues and supervisors I&apos;ve collaborated with on various projects.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 max-w-6xl mx-auto">
            {Array.from({ length: 3 }, (_, i) => (
              <TestimonialSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--error-bg)] flex items-center justify-center">
              <MessageSquareQuote className="w-8 h-8 text-[var(--error-color)]" />
            </div>
            <p className="text-lg font-semibold text-[var(--text-primary)] mb-2">
              Unable to load testimonials
            </p>
            <p className="text-sm text-[var(--text-secondary)] mb-6">
              {error}
            </p>
            <button
              onClick={fetchTestimonials}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-lg transition-colors"
              style={{ backgroundColor: 'var(--accent-testimonials)' }}
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--surface)] flex items-center justify-center border border-[var(--border-default)]">
              <MessageSquareQuote className="w-8 h-8 text-[var(--text-secondary)]" />
            </div>
            <p className="text-lg font-semibold text-[var(--text-primary)] mb-2">
              Testimonials coming soon
            </p>
            <p className="text-sm text-[var(--text-secondary)] max-w-sm mx-auto">
              I&apos;m currently collecting feedback from people I&apos;ve worked with.
            </p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 max-w-6xl mx-auto"
          >
            {testimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial._id}
                testimonial={testimonial}
                shouldReduceMotion={shouldReduceMotion}
              />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}
