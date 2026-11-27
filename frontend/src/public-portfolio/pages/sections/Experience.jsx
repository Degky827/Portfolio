import { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import Experience3DRoadmap from '../../components/experience/Experience3DRoadmap'
import GuillocheWaves from '../../components/ui/GuillocheWaves'
import { getExperiences } from '../../../shared/services/experienceService'
import { usePublicSocket } from '../../../shared/context/PublicSocketContext'
import Testimonials from './Testimonials'

/* ─── Company & University Brand Logos from Assets ─────────────── */
const AskualaLogo = () => (
  <img
    src="/assets/logos/askuala-logo.png"
    alt="Askuala Link Logo"
    className="w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow-sm select-none"
  />
)

const AlyahLogo = () => (
  <img
    src="/assets/logos/alyah-logo.png"
    alt="Alyah Technologies Logo"
    className="w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow-sm select-none"
  />
)

const BduLogo = () => (
  <img
    src="/assets/logos/bdu-logo.png"
    alt="Bahir Dar University Logo"
    className="w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow-sm select-none"
  />
)

const DEFAULT_EXPERIENCES = [
  {
    _id: '1',
    badge: 'INTERNSHIP',
    role: 'Software Development Intern',
    company: 'Askuala Link',
    companyUrl: 'https://www.askualalink.com/',
    logo: AskualaLogo,
    period: 'Jan 2023 – Present',
    dateYear: '2023',
    dateSub: 'Present',
    location: 'Addis Ababa, Ethiopia',
    summary: 'Building scalable web applications and learning modern development practices with React, Node.js, and MongoDB.',
    primaryTags: ['React', 'Node.js', 'TypeScript', 'MongoDB'],
    extraTags: ['Docker', 'AWS', 'GraphQL'],
    contributions: [
      'Developed RESTful APIs for internal tools and client services',
      'Implemented real-time features using Socket.IO',
      'Optimized database queries reducing response time by 40%',
    ],
    featured: true,
    status: 'PUBLISHED',
    displayOrder: 1,
    analyticsEnabled: true,
    viewCount: 0,
  },
  {
    _id: '2',
    badge: 'SOFTWARE ENGINEER',
    role: 'Full Stack Developer',
    company: 'Alyah Technologies',
    companyUrl: 'https://alyahsoftware.com/',
    logo: AlyahLogo,
    period: 'Jun 2022 – Dec 2022',
    dateYear: '2022',
    dateSub: 'Dec 2022',
    location: 'Remote',
    summary: 'Delivered custom web solutions, enterprise architectures, and production applications.',
    primaryTags: ['Vue.js', 'Laravel', 'PostgreSQL', 'TailwindCSS'],
    extraTags: ['GraphQL', 'Redis', 'CI/CD'],
    contributions: [
      'Built 5+ production applications for international clients',
      'Implemented authentication and authorization systems',
      'Set up automated deployment pipelines with CI/CD',
    ],
    featured: true,
    status: 'PUBLISHED',
    displayOrder: 2,
    analyticsEnabled: true,
    viewCount: 0,
  },
  {
    _id: '3',
    badge: 'EDUCATION',
    role: 'Computer Science Student',
    company: 'Bahir Dar University',
    companyUrl: 'https://www.bdu.edu.et/',
    logo: BduLogo,
    period: 'Sep 2019 – Jun 2023',
    dateYear: '2019',
    dateSub: '2023',
    location: 'Bahir Dar, Ethiopia',
    summary: 'Focused on software engineering, algorithms, data structures, and computer vision research.',
    primaryTags: ['Python', 'C++', 'Java', 'Algorithms'],
    extraTags: ['Machine Learning', 'Computer Vision', 'Research'],
    contributions: [
      'Graduated with distinction (GPA: 3.8/4.0)',
      'Published research on computer vision applications',
      'Led university programming club and mentored students',
    ],
    featured: true,
    status: 'PUBLISHED',
    displayOrder: 3,
    analyticsEnabled: true,
    viewCount: 0,
  },
  {
    _id: '4',
    badge: 'DISTRIBUTED & MOBILE',
    role: 'Distributed Systems & Mobile Developer',
    company: 'Askuala Link',
    companyUrl: 'https://www.askualalink.com/',
    logo: AskualaLogo,
    period: '2024 – Present',
    dateYear: '2024',
    dateSub: 'Present',
    location: 'Bahir Dar, Ethiopia',
    summary: 'Contributing to transport microservices, mobile driver workflows, and containerized Docker deployments.',
    primaryTags: ['Flutter', 'Node.js', 'RabbitMQ', 'Docker'],
    extraTags: ['Prisma', 'PostgreSQL', 'Microservices'],
    contributions: [
      'Worked on Menged Transport Driver App and verification workflows',
      'Integrated microservice architecture with asynchronous RabbitMQ queues',
      'Contributed to containerized development and deployment with Docker',
    ],
    featured: true,
    status: 'PUBLISHED',
    displayOrder: 4,
    analyticsEnabled: true,
    viewCount: 0,
  },
]

export default function Experience() {
  const [experienceData, setExperienceData] = useState([])
  const { on, off } = usePublicSocket()

  const fetchExperiences = useCallback(async () => {
    try {
      const data = await getExperiences({ status: 'PUBLISHED' })
      const fetched = data.experiences || []
      setExperienceData(fetched.length >= 4 ? fetched : DEFAULT_EXPERIENCES)
    } catch {
      setExperienceData(DEFAULT_EXPERIENCES)
    }
  }, [])

  useEffect(() => {
    fetchExperiences()
  }, [fetchExperiences])

  useEffect(() => {
    const handler = () => fetchExperiences()
    on('content:updated', handler)
    return () => off('content:updated', handler)
  }, [on, off, fetchExperiences])

  return (
    <section
      id="experience"
      className="relative min-h-screen py-16 sm:py-20 lg:py-24 bg-white dark:bg-[#1a1a2e] text-slate-900 dark:text-white transition-colors duration-300 overflow-hidden"
      aria-label="Experience section"
    >
      {/* ── Monochromatic Purple Guilloche Ribbon Wave Background (matching About page) ── */}
      <GuillocheWaves className="absolute inset-0 z-0 opacity-45 dark:opacity-35 pointer-events-none" />

      {/* Subtle background glow orbs matching About page */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-slate-700/15 dark:bg-slate-800/25 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-[350px] h-[350px] bg-slate-800/10 dark:bg-slate-900/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-[#2C3539]/10 dark:bg-black/30 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ── Top Header with 3D Headline ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          {/* 3D Extruded Title: WORK EXPERIENCE (Refined minimized text size) */}
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 tracking-wider uppercase font-sans select-none transition-transform duration-300 hover:scale-[1.02] text-[#1E252B] dark:text-[#E2E8F0]"
            style={{
              textShadow: `
                0 1px 0 #64748b,
                0 2px 0 #475569,
                0 3px 0 #334155,
                0 4px 0 #1e293b,
                0 5px 0 #1e252b,
                0 6px 1px rgba(0, 0, 0, 0.3),
                0 8px 18px rgba(30, 37, 43, 0.4)
              `,
            }}
          >
            Work Experience
          </h2>

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed px-4 font-normal">
            A 3D roadmap of my engineering journey, technical milestones, and team leadership.
          </p>

          {/* Decorative Diamond Accent Line: <> ◇ <> matching About page */}
          <div className="flex items-center justify-center gap-3 mt-5">
            <div className="h-[1.5px] w-14 sm:w-20 bg-slate-300 dark:bg-slate-700" />
            <div className="w-2.5 h-2.5 rotate-45 border-2 border-[#36454F] dark:border-slate-300 shadow-[0_0_12px_rgba(54,69,79,0.6)] dark:shadow-[0_0_12px_rgba(255,255,255,0.4)]" />
            <div className="h-[1.5px] w-14 sm:w-20 bg-slate-300 dark:bg-slate-700" />
          </div>
        </motion.div>

        {/* ── Centerpiece 3D Curved Roadmap Matching Reference Image ── */}
        <div className="w-full">
          <Experience3DRoadmap customExperiences={experienceData} />
        </div>

        {/* ── Testimonials & Recommendations within Experience Section ── */}
        <div className="mt-16 sm:mt-24 pt-12 sm:pt-16 border-t border-slate-200/80 dark:border-slate-800">
          <Testimonials embedded={true} />
        </div>
      </div>
    </section>
  )
}
