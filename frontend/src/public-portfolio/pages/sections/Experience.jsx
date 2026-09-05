import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, MapPin, ExternalLink, Layers, Code, Users, ChevronDown, ChevronUp } from 'lucide-react'
import TechTile from '../../components/ui/TechTile'
import { getExperiences } from '../../../shared/services/experienceService'
import { usePublicSocket } from '../../../shared/context/PublicSocketContext'

/* ─── Inline SVG Logos ─────────────────────────────────────────── */
const AskualaLogo = () => (
  <svg viewBox="0 0 40 40" width="28" height="28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="10" fill="#6366f1"/>
    <text x="20" y="26" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" fontFamily="Arial,sans-serif">AL</text>
  </svg>
)

const FreelanceLogo = () => (
  <svg viewBox="0 0 40 40" width="28" height="28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="10" fill="#10b981"/>
    <text x="20" y="26" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" fontFamily="Arial,sans-serif">FP</text>
  </svg>
)

const BduLogo = () => (
  <svg viewBox="0 0 40 40" width="28" height="28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="10" fill="#f59e0b"/>
    <text x="20" y="26" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="Arial,sans-serif">BDU</text>
  </svg>
)

/* ─── 4 Stat Cards in 2x2 Grid ─────────────────────────────────── */
const statsData = [
  {
    id: 'years',
    value: '2+',
    line1: 'Years',
    line2: 'Experience',
    icon: Calendar,
  },
  {
    id: 'projects',
    value: '12+',
    line1: 'Projects',
    line2: 'Completed',
    icon: Layers,
  },
  {
    id: 'tech',
    value: '10+',
    line1: 'Technologies',
    line2: 'Mastered',
    icon: Code,
  },
  {
    id: 'clients',
    value: '5+',
    line1: 'Clients',
    line2: 'Worldwide',
    icon: Users,
  },
]

export default function Experience() {
  const [expandedId, setExpandedId] = useState(null)
  const [experienceData, setExperienceData] = useState([])
  const { on, off } = usePublicSocket()

  const fetchExperiences = useCallback(async () => {
    try {
      const data = await getExperiences({ status: 'PUBLISHED' })
      setExperienceData(data.experiences || [])
    } catch {
      // Keep empty array on error
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

  const toggleExpand = useCallback((id) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }, [])

  return (
    <section
      id="experience"
      className="relative min-h-screen py-16 sm:py-20 lg:py-24 bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden transition-colors duration-300"
      aria-label="Experience section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[380px_1fr] xl:grid-cols-[410px_1fr] gap-8 lg:gap-12 xl:gap-16 items-start">

          {/* ═══════════════════════════════════════════════════════════
              LEFT COLUMN: Solution Card (3D Illustration + 4 Stats)
              ═══════════════════════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            <div className="rounded-3xl bg-[var(--card-bg)] border border-[var(--card-border)] p-5 sm:p-6 shadow-2xl backdrop-blur-xl transition-colors duration-300">
              
              {/* 3D Developer Scene Illustration */}
              <div className="rounded-2xl overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border-subtle)] aspect-[4/4.6] relative flex items-center justify-center">
                <img
                  src="/experience-character.png"
                  alt="3D Developer workstation"
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />
              </div>

              {/* Title & Subtitle */}
              <div className="text-center mt-4 mb-5 px-2">
                <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] tracking-tight mb-1">
                  Building Solutions
                </h3>
                <p className="text-[10px] sm:text-xs text-[var(--text-secondary)] leading-relaxed max-w-[260px] mx-auto">
                  Turning ideas into impactful digital experiences.
                </p>
              </div>

              {/* 2x2 Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                {statsData.map((stat) => {
                  const Icon = stat.icon
                  return (
                    <div
                      key={stat.id}
                      className="rounded-2xl bg-[var(--surface)] border border-[var(--border-default)] p-3.5 sm:p-4 flex flex-col justify-between hover:border-purple-500/30 transition-colors duration-200"
                    >
                      {/* Top row: Icon + Value */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-purple-500 dark:text-purple-400">
                          <Icon size={20} strokeWidth={1.75} />
                        </div>
                        <span className="text-lg sm:text-xl font-black text-[var(--text-primary)] tracking-tight">
                          {stat.value}
                        </span>
                      </div>

                      {/* Bottom row: 2-line Label */}
                      <div className="text-xs text-[var(--text-secondary)] font-medium leading-tight">
                        <span>{stat.line1}</span>
                        <br />
                        <span>{stat.line2}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>

          {/* ═══════════════════════════════════════════════════════════
              RIGHT COLUMN: Header + Timeline Experience Cards
              ═══════════════════════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="w-full"
          >
            {/* Header */}
            <div className="mb-6 sm:mb-8">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 dark:text-[#818CF8] mb-1.5 block">
                MY JOURNEY
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[var(--text-primary)] tracking-tight mb-2">
                EXPERIENCE
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-xl leading-relaxed">
                A timeline of my professional journey and the impact I've created.
              </p>
            </div>

            {/* Timeline Container */}
            <div className="relative space-y-6 sm:space-y-8">
              
              {/* Continuous vertical timeline track line (desktop) */}
              <div
                className="absolute left-[85px] sm:left-[105px] top-6 bottom-6 w-[1px] bg-[var(--border-default)] hidden sm:block pointer-events-none"
                aria-hidden="true"
              />

              {experienceData.map((item, index) => {
                const isExpanded = expandedId === item._id
                const LogoComponent = typeof item.logo === 'function' ? item.logo : null
                return (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.45, delay: index * 0.1 }}
                    className="relative sm:flex sm:items-start gap-4 sm:gap-6"
                  >
                    {/* Left: Date column (sm+) */}
                    <div className="w-[80px] sm:w-[95px] shrink-0 text-right pt-5 hidden sm:block">
                      <span className="text-sm font-semibold text-[var(--text-primary)] block leading-tight">
                        {item.dateYear}
                      </span>
                      <span className="text-xs text-[var(--text-tertiary)] font-medium block mt-1">
                        {item.dateSub}
                      </span>
                    </div>

                    {/* Middle: Glowing Purple Timeline Node (sm+) */}
                    <div
                      className="relative z-10 shrink-0 mt-5 w-5 h-5 rounded-full border-2 border-indigo-500 dark:border-[#818CF8] bg-[var(--bg-primary)] hidden sm:flex items-center justify-center shadow-[0_0_10px_rgba(129,140,248,0.5)]"
                      aria-hidden="true"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-[#818CF8]" />
                    </div>

                    {/* Right: Card */}
                    <div className="flex-1 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-indigo-500/40 p-5 sm:p-6 transition-all duration-300 shadow-xl relative group">
                      
                      {/* Top Header: Badge + External Link */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          {LogoComponent && <LogoComponent />}
                          <span className="px-3 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-indigo-100 dark:bg-[#1D1E3A] text-indigo-700 dark:text-[#939BF4] border border-indigo-200 dark:border-[#3B3E75]/70">
                            {item.badge}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {item.companyUrl && (
                            <a
                              href={item.companyUrl}
                              target={item.companyUrl.startsWith('http') ? '_blank' : undefined}
                              rel={item.companyUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1 rounded-md transition-colors"
                              aria-label={`Visit ${item.company}`}
                            >
                              <ExternalLink size={15} />
                            </a>
                          )}
                          <button
                            onClick={() => toggleExpand(item._id)}
                            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1 rounded-md transition-colors cursor-pointer"
                            aria-label={isExpanded ? 'Collapse contributions' : 'Expand contributions'}
                          >
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                        </div>
                      </div>

                      {/* Job Title */}
                      <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] mt-2.5 mb-1 tracking-tight">
                        {item.role}
                      </h3>

                      {/* Company Name */}
                      <div>
                        {item.companyUrl ? (
                          <a
                            href={item.companyUrl}
                            target={item.companyUrl.startsWith('http') ? '_blank' : undefined}
                            rel={item.companyUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                            className="text-sm font-semibold text-indigo-600 dark:text-[#818CF8] hover:underline mb-2.5 inline-block"
                          >
                            {item.company}
                          </a>
                        ) : (
                          <span className="text-sm font-semibold text-indigo-600 dark:text-[#818CF8] mb-2.5 inline-block">
                            {item.company}
                          </span>
                        )}
                      </div>

                      {/* Meta Information Row */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--text-secondary)] mb-3.5">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-[var(--text-tertiary)] shrink-0" />
                          {item.period}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin size={13} className="text-[var(--text-tertiary)] shrink-0" />
                          {item.location}
                        </span>
                      </div>

                      {/* Description Summary */}
                      <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
                        {item.summary}
                      </p>

                      {/* Technology Pills */}
                      <div className="flex flex-wrap items-start gap-2.5 sm:gap-3">
                        {item.primaryTags.map((tech) => (
                          <TechTile key={tech} name={tech} size="sm" />
                        ))}

                        {item.extraTags && item.extraTags.length > 0 && (
                          <TechTile
                            name="More"
                            icon="more"
                            size="sm"
                            label={isExpanded ? 'Less' : `+${item.extraTags.length} More`}
                            onClick={() => toggleExpand(item._id)}
                          />
                        )}
                      </div>

                      {/* Expandable Key Contributions */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden mt-4 pt-4 border-t border-[var(--border-default)]"
                          >
                            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2.5">
                              Key Contributions & Stack Details
                            </h4>
                            <ul className="space-y-2 mb-3">
                              {item.contributions.map((point, i) => (
                                <li key={i} className="text-xs text-[var(--text-secondary)] flex items-start gap-2 leading-relaxed">
                                  <span className="text-indigo-600 dark:text-[#818CF8] font-bold mt-0.5">•</span>
                                  <span>{point}</span>
                                </li>
                              ))}
                            </ul>
                            {item.extraTags && (
                              <div className="flex flex-wrap gap-2.5 sm:gap-3 pt-1">
                                {item.extraTags.map((tech) => (
                                  <TechTile key={tech} name={tech} size="sm" />
                                ))}
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
