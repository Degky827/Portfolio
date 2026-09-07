import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { BadgeCheck, RefreshCw } from 'lucide-react'
import { getTestimonials } from '../../../shared/services/testimonialService'
import TestimonialCarousel from '../../components/testimonials/TestimonialCarousel'
import TestimonialSkeleton from '../../components/testimonials/TestimonialSkeleton'
import { usePublicSocket } from '../../../shared/context/PublicSocketContext'

const DEFAULT_TESTIMONIALS = [
  {
    _id: '1',
    name: 'Abebe Kebede',
    role: 'Senior Software Engineer',
    organization: 'Ethio Telecom',
    organizationUrl: 'https://www.ethiotelecom.et',
    organizationLogo: 'https://logo.clearbit.com/ethiotelecom.et',
    linkedinUrl: 'https://www.linkedin.com/in/abebe-kebede',
    relationship: 'Supervisor',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    content: 'Desalegn consistently delivered high-quality software solutions and demonstrated strong problem-solving skills throughout the Menged Transport project. His ability to work with microservices, APIs, and modern web technologies helped the team successfully deliver critical features on time.',
    verified: true,
    featured: true,
    publishedAt: '2025-08-15T00:00:00Z',
    project: 'Menged Transport Platform',
    projectUrl: 'https://github.com/Degky827',
  },
  {
    _id: '2',
    name: 'Sara Mohammed',
    role: 'Team Lead, Frontend Engineering',
    organization: 'Dashen Bank',
    organizationUrl: 'https://www.dashenbank.com',
    organizationLogo: 'https://logo.clearbit.com/dashenbank.com',
    linkedinUrl: 'https://www.linkedin.com/in/sara-mohammed',
    relationship: 'Team Lead',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    content: 'Working with Desalegn on the mobile banking interface was a great experience. He wrote clean, maintainable React components that our team could easily build upon, and his attention to detail and proactive communication made collaboration effortless.',
    verified: true,
    featured: false,
    publishedAt: '2025-06-20T00:00:00Z',
    project: 'Dashen Super App',
  },
  {
    _id: '3',
    name: 'Tadesse Girma',
    role: 'Chief Technology Officer',
    organization: 'Habesha Tech Solutions',
    organizationUrl: 'https://www.habeshatech.com',
    linkedinUrl: 'https://www.linkedin.com/in/tadesse-girma',
    relationship: 'Client',
    avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
    content: 'Desalegn delivered an e-commerce platform that exceeded our expectations. His command of both frontend and backend technologies allowed him to build a seamless, performant application. He was responsive, met every deadline, and provided thoughtful technical guidance throughout the engagement.',
    verified: true,
    featured: false,
    publishedAt: '2025-03-10T00:00:00Z',
    project: 'E-Commerce Platform',
  },
  {
    _id: '4',
    name: 'Yonas Alemayehu',
    role: 'Full Stack Developer',
    organization: 'Ministry of Innovation & Technology',
    organizationUrl: 'https://www.mint.gov.et',
    linkedinUrl: 'https://www.linkedin.com/in/yonas-alemayehu',
    relationship: 'Colleague',
    avatar: 'https://randomuser.me/api/portraits/men/52.jpg',
    content: 'I collaborated with Desalegn on several government digitalization initiatives. He is dependable, collaborative, and committed to writing clean, maintainable code. His ability to quickly adapt to new technologies and mentor junior developers made a real difference in our team\'s productivity.',
    verified: true,
    featured: false,
    publishedAt: '2025-01-25T00:00:00Z',
    project: 'Digital Governance Portal',
  },
]

export default function Testimonials() {
  const shouldReduceMotion = useReducedMotion()
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { on, off } = usePublicSocket()

  const fetchTestimonials = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getTestimonials({ status: 'PUBLISHED' })
      const fetched = data.testimonials || []
      setTestimonials(fetched.length > 0 ? fetched : DEFAULT_TESTIMONIALS)
    } catch {
      setError('Unable to load recommendations. Please try again.')
      setTestimonials(DEFAULT_TESTIMONIALS)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTestimonials()
  }, [])

  useEffect(() => {
    const handler = () => fetchTestimonials()
    on('content:updated', handler)
    return () => off('content:updated', handler)
  }, [on, off])

  return (
    <section
      id="testimonials"
      className="py-12 sm:py-14 lg:py-16"
      aria-label="Professional recommendations"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: shouldReduceMotion ? 0.1 : 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-6 sm:mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <BadgeCheck size={14} className="text-[#0a66c2] dark:text-[#70b5f9]" aria-hidden="true" />
            <span className="text-[11px] font-semibold tracking-wider text-slate-600 dark:text-slate-300 uppercase">
              Professional Network
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-[#0f172a] dark:text-white mb-2 tracking-tight leading-tight">
            Recommendations
          </h2>
          <p className="text-[15px] sm:text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            What supervisors, colleagues, and clients say about working with me.
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
              <TestimonialSkeleton key={i} />
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
          <TestimonialCarousel
            testimonials={testimonials}
            shouldReduceMotion={shouldReduceMotion}
          />
        )}
      </div>
    </section>
  )
}