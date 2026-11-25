import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { BadgeCheck, RefreshCw, Star, Layers, Sparkles, Filter } from 'lucide-react'
import { getTestimonials } from '../../../shared/services/testimonialService'
import TestimonialCard from '../../components/testimonials/TestimonialCard'
import TestimonialSkeleton from '../../components/testimonials/TestimonialSkeleton'
import Recommendations3DScene from '../../components/testimonials/Recommendations3DScene'
import GuillocheWaves from '../../components/ui/GuillocheWaves'
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
      className="relative min-h-screen py-16 sm:py-24 bg-white dark:bg-[#1a1a2e] text-slate-900 dark:text-white transition-colors duration-300 overflow-hidden"
      aria-label="Testimonials and Recommendations"
    >
      {/* ── Monochromatic Purple Guilloche Ribbon Wave Background (matching About page) ── */}
      <GuillocheWaves className="absolute inset-0 z-0 opacity-45 dark:opacity-35 pointer-events-none" />

      {/* Subtle background glow orbs matching About page */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-slate-700/15 dark:bg-slate-800/25 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-[350px] h-[350px] bg-slate-800/10 dark:bg-slate-900/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-[#2C3539]/10 dark:bg-black/30 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ── Top Header Exactly Matching 3D Reference Image ── */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: shouldReduceMotion ? 0.1 : 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-8 sm:mb-12"
        >
          {/* 3D Extruded Title: WHAT PEOPLE SAY matching About page */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 tracking-wider uppercase font-sans text-slate-900 dark:text-white text-3d-extruded select-none transition-transform duration-300 hover:scale-[1.02]">
            WHAT PEOPLE SAY
          </h2>

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed px-4 font-normal">
            Real experiences from people I&apos;ve worked with.
          </p>

          {/* Decorative Diamond Accent Line: <> ◇ <> matching About page */}
          <div className="flex items-center justify-center gap-3 mt-5">
            <div className="h-[1.5px] w-14 sm:w-20 bg-gradient-to-r from-transparent via-[#36454F] dark:via-slate-400 to-transparent" />
            <div className="w-2.5 h-2.5 rotate-45 border-2 border-[#36454F] dark:border-slate-300 shadow-[0_0_12px_rgba(54,69,79,0.6)] dark:shadow-[0_0_12px_rgba(255,255,255,0.4)]" />
            <div className="h-[1.5px] w-14 sm:w-20 bg-gradient-to-r from-transparent via-[#36454F] dark:via-slate-400 to-transparent" />
          </div>
        </motion.div>

        {/* ── Content Area: 3D Hologram Rotating Cube ── */}
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
          <div className="w-full">
            <Recommendations3DScene
              testimonials={testimonials}
              onSelectTestimonial={() => {}}
            />
          </div>
        )}
      </div>
    </section>
  )
}
