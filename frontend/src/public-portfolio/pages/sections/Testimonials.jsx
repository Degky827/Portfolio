import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { BadgeCheck, RefreshCw } from 'lucide-react'
import { getTestimonials } from '../../../shared/services/testimonialService'
import TestimonialCard from '../../components/testimonials/TestimonialCard'
import TestimonialSkeleton from '../../components/testimonials/TestimonialSkeleton'

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

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
      setError('Unable to load recommendations. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTestimonials()
  }, [])

  return (
    <section
      id="testimonials"
      className="py-14 sm:py-16 lg:py-20"
      aria-label="Professional recommendations"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: shouldReduceMotion ? 0.1 : 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-10 sm:mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"
          >
            <BadgeCheck size={16} className="text-[#0a66c2] dark:text-[#70b5f9]" aria-hidden="true" />
            <span className="text-xs font-semibold tracking-wide text-slate-600 dark:text-slate-300 uppercase">
              Recommendations
            </span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-[2.5rem] font-bold text-[#0f172a] dark:text-white mb-3 tracking-tight leading-tight">
            Professional Recommendations
          </h2>
          <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed px-4">
            Feedback from supervisors, team leads, and colleagues I&apos;ve collaborated with.
          </p>
        </motion.div>

        {/* Content */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 max-w-6xl mx-auto"
          >
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i}>
                <TestimonialSkeleton />
              </div>
            ))}
          </motion.div>
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
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 max-w-6xl mx-auto items-stretch"
          >
            {testimonials.map((testimonial, index) => (
              <div key={testimonial._id} className="flex">
                <TestimonialCard
                  testimonial={testimonial}
                  index={index}
                  shouldReduceMotion={shouldReduceMotion}
                />
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}
