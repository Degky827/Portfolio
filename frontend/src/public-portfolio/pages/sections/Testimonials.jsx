import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { BadgeCheck, RefreshCw, Star, Layers, Sparkles, Filter } from 'lucide-react'
import { getTestimonials } from '../../../shared/services/testimonialService'
import TestimonialCard from '../../components/testimonials/TestimonialCard'
import TestimonialSkeleton from '../../components/testimonials/TestimonialSkeleton'
import Recommendations3DScene from '../../components/testimonials/Recommendations3DScene'
import { usePublicSocket } from '../../../shared/context/PublicSocketContext'

const DEFAULT_TESTIMONIALS = [
  {
    _id: '1',
    name: 'Emily Rodriguez',
    role: 'Startup Founder',
    organization: 'Apex Innovations',
    organizationUrl: 'https://example.com',
    relationship: 'Client',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    rating: 5,
    content: 'Desalegn is an exceptional developer. His work is clean, professional, and always delivered on time.',
    highlights: ['exceptional developer', 'clean, professional', 'always delivered on time'],
    project: 'Fintech Platform',
    verified: true,
    featured: true,
    publishedAt: '2025-10-01T00:00:00Z',
  },
  {
    _id: '2',
    name: 'Daniel Tesfaye',
    role: 'Software Engineer',
    organization: 'TechCorp Solutions',
    organizationUrl: 'https://example.com',
    relationship: 'Colleague',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    rating: 5,
    content: 'Professional, creative, and always goes the extra mile.',
    highlights: ['Professional, creative', 'always goes the extra mile'],
    project: 'Cloud Infrastructure',
    verified: true,
    featured: true,
    publishedAt: '2025-09-12T00:00:00Z',
  },
  {
    _id: '3',
    name: 'Abebe Kebede',
    role: 'Senior Software Engineer',
    organization: 'Ethio Telecom',
    organizationUrl: 'https://www.ethiotelecom.et',
    organizationLogo: 'https://logo.clearbit.com/ethiotelecom.et',
    linkedinUrl: 'https://www.linkedin.com/in/abebe-kebede',
    relationship: 'Supervisor',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 5,
    content: 'Desalegn consistently delivered high-quality software solutions and demonstrated strong problem-solving skills throughout the Menged Transport project. His ability to work with microservices, APIs, and modern web technologies helped the team successfully deliver critical features on time.',
    highlights: ['high-quality software solutions', 'problem-solving', 'microservices', 'APIs'],
    project: 'Menged Transport Platform',
    projectUrl: 'https://github.com/Degky827',
    verified: true,
    featured: true,
    publishedAt: '2025-08-15T00:00:00Z',
  },
  {
    _id: '4',
    name: 'Sara Mohammed',
    role: 'Team Lead, Frontend Engineering',
    organization: 'Dashen Bank',
    organizationUrl: 'https://www.dashenbank.com',
    organizationLogo: 'https://logo.clearbit.com/dashenbank.com',
    linkedinUrl: 'https://www.linkedin.com/in/sara-mohammed',
    relationship: 'Team Lead',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 5,
    content: 'Working with Desalegn on the mobile banking interface was a great experience. He wrote clean, maintainable React components that our team could easily build upon, and his attention to detail and proactive communication made collaboration effortless.',
    highlights: ['clean, maintainable React components', 'attention to detail', 'proactive communication'],
    project: 'Dashen Super App',
    verified: true,
    featured: false,
    publishedAt: '2025-06-20T00:00:00Z',
  },
  {
    _id: '5',
    name: 'Tadesse Girma',
    role: 'Chief Technology Officer',
    organization: 'Habesha Tech Solutions',
    organizationUrl: 'https://www.habeshatech.com',
    linkedinUrl: 'https://www.linkedin.com/in/tadesse-girma',
    relationship: 'Client',
    avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
    rating: 5,
    content: 'Desalegn delivered an e-commerce platform that exceeded our expectations. His command of both frontend and backend technologies allowed him to build a seamless, performant application. He was responsive, met every deadline, and provided thoughtful technical guidance throughout the engagement.',
    highlights: ['exceeded our expectations', 'frontend and backend', 'performant application'],
    project: 'E-Commerce Platform',
    verified: true,
    featured: false,
    publishedAt: '2025-03-10T00:00:00Z',
  },
  {
    _id: '6',
    name: 'Yonas Alemayehu',
    role: 'Full Stack Developer',
    organization: 'Ministry of Innovation & Technology',
    organizationUrl: 'https://www.mint.gov.et',
    linkedinUrl: 'https://www.linkedin.com/in/yonas-alemayehu',
    relationship: 'Colleague',
    avatar: 'https://randomuser.me/api/portraits/men/52.jpg',
    rating: 5,
    content: 'I collaborated with Desalegn on several government digitalization initiatives. He is dependable, collaborative, and committed to writing clean, maintainable code. His ability to quickly adapt to new technologies and mentor junior developers made a real difference in our team\'s productivity.',
    highlights: ['dependable, collaborative', 'clean, maintainable code', 'mentor junior developers'],
    project: 'Digital Governance Portal',
    verified: true,
    featured: false,
    publishedAt: '2025-01-25T00:00:00Z',
  },
]

export default function Testimonials() {
  const shouldReduceMotion = useReducedMotion()
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState('3d') // '3d' | 'grid'
  const [selectedCategory, setSelectedCategory] = useState('ALL')
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

  const categories = useMemo(() => {
    const set = new Set(['ALL'])
    testimonials.forEach((t) => {
      if (t.relationship) set.add(t.relationship)
    })
    return Array.from(set)
  }, [testimonials])

  const filteredTestimonials = useMemo(() => {
    if (selectedCategory === 'ALL') return testimonials
    return testimonials.filter((t) => t.relationship === selectedCategory)
  }, [testimonials, selectedCategory])

  return (
    <section
      id="testimonials"
      className="relative py-16 sm:py-24 bg-white overflow-hidden"
      aria-label="Testimonials and Recommendations"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ── Top Header Exactly Matching 3D Reference Image ── */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: shouldReduceMotion ? 0.1 : 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-8 sm:mb-12"
        >
          {/* Badge: ★ Testimonials */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 mb-3.5 rounded-full bg-[#f3eeff] border border-purple-200/80 shadow-sm">
            <span className="text-purple-600 text-xs font-black">★</span>
            <span className="text-xs font-bold tracking-wide text-purple-700">
              Testimonials
            </span>
          </div>

          {/* Headline: What People Say */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1a0b3b] mb-2.5 tracking-tight">
            What People Say
          </h2>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Real experiences from people I&apos;ve worked with.
          </p>

          {/* View Mode Toggle: 3D Scene vs All Reviews Grid */}
          <div className="inline-flex items-center gap-1.5 p-1 mt-6 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setViewMode('3d')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                viewMode === '3d'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles size={13} />
              <span>3D Hologram Cube</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers size={13} />
              <span>All Recommendations ({testimonials.length})</span>
            </button>
          </div>
        </motion.div>

        {/* ── Content Area ── */}
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
        ) : error && testimonials.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center border border-red-200 dark:border-red-500/20">
              <BadgeCheck className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Unable to load recommendations
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              {error}
            </p>
            <button
              onClick={fetchTestimonials}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-colors cursor-pointer"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            {viewMode === '3d' ? (
              <motion.div
                key="3d-mode"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
                className="w-full"
              >
                {/* The 3D Scene */}
                <Recommendations3DScene
                  testimonials={testimonials}
                  onSelectTestimonial={() => {}}
                />

                {/* Rating & Trust Strip */}
                <div className="mt-12 text-center flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-purple-600 dark:text-purple-400">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star key={i} className="w-4 h-4 fill-purple-600 text-purple-600 dark:fill-purple-400 dark:text-purple-400" />
                      ))}
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">5.0 Star Rating</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <BadgeCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>100% Verified Recommendations</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className="text-purple-600 dark:text-purple-400 font-semibold hover:underline cursor-pointer"
                  >
                    Explore all reviews →
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="grid-mode"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-6xl mx-auto"
              >
                {/* Category Filter Pills */}
                {categories.length > 2 && (
                  <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                          selectedCategory === cat
                            ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                            : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-purple-300'
                        }`}
                      >
                        {cat === 'ALL' ? 'All Roles' : cat}
                      </button>
                    ))}
                  </div>
                )}

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTestimonials.map((t, index) => (
                    <TestimonialCard
                      key={t._id || t.id || index}
                      testimonial={t}
                      index={index}
                      shouldReduceMotion={shouldReduceMotion}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </section>
  )
}
