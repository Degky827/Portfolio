import { useState, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Briefcase, MapPin, Calendar, ChevronDown, ChevronUp, ExternalLink, Code, Smartphone, Layers, Globe } from 'lucide-react'
import Experience3DScene from './Experience3DScene'

/* ─── Experience Data (separate from UI) ──────────────────────── */
const experienceData = [
  {
    id: 1,
    role: 'Software Development Intern',
    company: 'Askuals Link',
    companyUrl: 'https://askuals.link',
    companyInitials: 'AL',
    location: 'Bahir Dar, Ethiopia',
    startDate: 'January 2026',
    endDate: 'Present',
    type: 'Internship',
    summary: 'Working on real-world software solutions across mobile, web, and backend systems, with a focus on transportation technology and scalable application architecture.',
    contributions: [
      'Developed and enhanced the Menged Transport Driver App using Flutter and Dart.',
      'Implemented workflows for driver registration, license services, document submission, verification, citations, payments, notifications, and offline operations.',
      'Contributed to a microservices-based backend architecture using Node.js, Express.js, PostgreSQL, Prisma, JWT, RabbitMQ, and Docker.',
      'Designed and integrated RESTful APIs connecting mobile applications with backend services.',
      'Worked on traffic-officer workflows including driver and license verification and digital citation management.',
      'Improved application usability through responsive interfaces, structured navigation, multilingual support, and offline/error handling.',
    ],
    technologies: ['Flutter', 'Dart', 'Node.js', 'Express.js', 'PostgreSQL', 'Prisma', 'RabbitMQ', 'Docker', 'JWT', 'REST APIs'],
    accent: 'var(--accent-experience)',
    icon: Smartphone,
  },
  {
    id: 2,
    role: 'Independent Software Developer',
    company: 'Freelance / Personal Projects',
    companyInitials: 'FP',
    location: 'Ethiopia',
    startDate: '2024',
    endDate: 'Present',
    type: 'Independent',
    summary: 'Building and experimenting with modern software products across web, mobile, backend, and emerging technologies.',
    contributions: [
      'Built full-stack applications using React, Node.js, Express.js, MongoDB, and PostgreSQL.',
      'Modernized applications toward scalable architectures using microservices, Prisma, Docker, message queues, and real-time communication.',
      'Developed cross-platform mobile applications using Flutter and Dart.',
      'Built interactive portfolio experiences using React, Three.js, React Three Fiber, and Framer Motion.',
      'Developed software solutions for transportation, education, indoor navigation, digital document management, and tourism.',
      'Applied software engineering practices including API design, authentication, database modeling, containerization, Git, and CI/CD.',
    ],
    technologies: ['React', 'Three.js', 'React Three Fiber', 'Flutter', 'Node.js', 'Express.js', 'PostgreSQL', 'MongoDB', 'Prisma', 'Docker', 'RabbitMQ', 'REST APIs', 'Framer Motion'],
    accent: 'var(--accent-experience)',
    icon: Code,
  },
]

const stats = [
  { label: 'Years', value: '2+', icon: Calendar },
  { label: 'Projects', value: '12+', icon: Layers },
  { label: 'Technologies', value: '10+', icon: Code },
  { label: 'Clients', value: '5+', icon: Globe },
]

/* ─── Image with Fallback ─────────────────────────────────────── */
function ImageWithFallback({ src, alt, className, fallbackInitials, style }) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  if (hasError || !imgSrc) {
    return (
      <div
        className={className}
        style={{
          ...style,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          fontWeight: 700,
          letterSpacing: '0.05em',
          color: 'var(--accent-experience)',
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border-default)',
        }}
        role="img"
        alt={alt}
      >
        {fallbackInitials}
      </div>
    )
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      style={style}
      loading="lazy"
      width="40"
      height="40"
      onError={() => {
        setHasError(true)
        console.warn(`[Experience] Failed to load image: ${imgSrc}`)
      }}
    />
  )
}

/* ─── Logo Components ──────────────────────────────────────────── */
function AskualsLogo() {
  return (
    <ImageWithFallback
      src="/askuala-logo.png"
      alt="Askuals Link logo"
      className="w-10 h-10 rounded-lg object-cover"
      fallbackInitials="AL"
      style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border-default)' }}
    />
  )
}

function FreelanceLogo() {
  return (
    <div
      className="w-10 h-10 rounded-lg flex items-center justify-center"
      style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border-default)' }}
      role="img"
      aria-label="Freelance projects"
    >
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--accent-experience)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    </div>
  )
}

/* ─── Experience Card ──────────────────────────────────────────── */
function ExperienceCard({ experience, index, isExpanded, onToggle }) {
  const shouldReduceMotion = useReducedMotion()
  const Icon = experience.icon
  const Logo = experience.id === 1 ? AskualsLogo : FreelanceLogo

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: shouldReduceMotion ? 0.1 : 0.45, delay: index * 0.1 }}
      className="relative"
      aria-label={`${experience.role} at ${experience.company}`}
    >
      <div
        className="relative rounded-xl overflow-hidden transition-all duration-300 cursor-pointer"
        style={{
          backgroundColor: 'var(--card-bg)',
          border: `1px solid ${isExpanded ? 'var(--border-strong)' : 'var(--border-default)'}`,
          boxShadow: isExpanded ? 'var(--card-shadow-hover)' : 'var(--card-shadow)',
        }}
        onClick={onToggle}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle() } }}
        tabIndex={0}
        role="button"
        aria-expanded={isExpanded}
        aria-controls={`exp-details-${experience.id}`}
      >
        {/* Card Header */}
        <div className="p-4 sm:p-5">
          <div className="flex items-start gap-3">
            {/* Logo */}
            <div className="shrink-0 transition-transform duration-200 hover:scale-105">
              <Logo />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Icon size={13} style={{ color: 'var(--accent-experience)' }} />
                <span
                  className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                  style={{
                    backgroundColor: 'var(--surface)',
                    color: 'var(--accent-experience)',
                    border: '1px solid var(--border-default)',
                  }}
                >
                  {experience.type}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold leading-tight mb-0.5" style={{ color: 'var(--text-primary)' }}>
                {experience.role}
              </h3>

              {experience.companyUrl ? (
                <a
                  href={experience.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-medium transition-opacity hover:opacity-80"
                  style={{ color: 'var(--accent-experience)' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {experience.company}
                  <ExternalLink size={11} />
                </a>
              ) : (
                <span className="text-sm font-medium" style={{ color: 'var(--accent-experience)' }}>
                  {experience.company}
                </span>
              )}

              <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1 text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                <span className="flex items-center gap-1">
                  <Calendar size={10} />
                  {experience.startDate} – {experience.endDate}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={10} />
                  {experience.location}
                </span>
              </div>
            </div>

            {/* Expand button */}
            <button
              className="shrink-0 w-7 h-7 flex items-center justify-center rounded-md transition-all duration-200"
              style={{
                backgroundColor: isExpanded ? 'var(--surface-elevated)' : 'var(--surface)',
                border: `1px solid ${isExpanded ? 'var(--border-strong)' : 'var(--border-default)'}`,
                color: 'var(--text-secondary)',
              }}
              aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
              onClick={(e) => { e.stopPropagation(); onToggle() }}
            >
              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>

          {/* Summary */}
          <p className="mt-2.5 text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {experience.summary}
          </p>

          {/* Technology tags */}
          <div className="flex flex-wrap gap-1 mt-3">
            {experience.technologies.slice(0, isExpanded ? undefined : 4).map((tech) => (
              <span
                key={tech}
                className="px-1.5 py-0.5 rounded text-[10px] font-medium"
                style={{
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border-default)',
                  color: 'var(--text-secondary)',
                }}
              >
                {tech}
              </span>
            ))}
            {!isExpanded && experience.technologies.length > 4 && (
              <span
                className="px-1.5 py-0.5 rounded text-[10px] font-medium"
                style={{ color: 'var(--accent-experience)' }}
              >
                +{experience.technologies.length - 4}
              </span>
            )}
          </div>
        </div>

        {/* Expanded details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              id={`exp-details-${experience.id}`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0.1 : 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="overflow-hidden"
              role="region"
              aria-label={`Details for ${experience.role}`}
            >
              <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                <div className="h-px mb-4" style={{ backgroundColor: 'var(--border-default)' }} />

                <h4 className="text-[11px] font-bold uppercase tracking-[0.12em] mb-3 flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--accent-experience)' }} />
                  Key Contributions
                </h4>

                <div className="grid gap-1.5">
                  {experience.contributions.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: shouldReduceMotion ? 0 : i * 0.04, duration: 0.25 }}
                      className="flex items-start gap-2.5 p-2 rounded-md transition-colors duration-150 hover:bg-black/[0.03] dark:hover:bg-white/[0.03]"
                    >
                      <div
                        className="w-4 h-4 rounded flex items-center justify-center shrink-0 mt-0.5 text-[9px] font-bold"
                        style={{ backgroundColor: 'var(--surface)', color: 'var(--accent-experience)', border: '1px solid var(--border-default)' }}
                      >
                        {i + 1}
                      </div>
                      <span className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  )
}

/* ─── Stats Block ──────────────────────────────────────────────── */
function StatBlock({ stat, index }) {
  const shouldReduceMotion = useReducedMotion()
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: shouldReduceMotion ? 0.1 : 0.35, delay: index * 0.08 }}
      className="flex items-center gap-2 py-2"
    >
      <stat.icon size={14} style={{ color: 'var(--accent-experience)' }} />
      <div>
        <span className="text-sm font-bold block leading-tight" style={{ color: 'var(--text-primary)' }}>{stat.value}</span>
        <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{stat.label}</span>
      </div>
    </motion.div>
  )
}

/* ─── Main Component ────────────────────────────────────────────── */
export default function Experience() {
  const [expandedId, setExpandedId] = useState(null)
  const shouldReduceMotion = useReducedMotion()

  const toggleExpand = useCallback((id) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }, [])

  return (
    <section
      id="experience"
      className="relative py-12 sm:py-16 md:py-20 lg:py-24"
      style={{ backgroundColor: 'var(--bg-primary)' }}
      aria-label="Experience section"
    >
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: shouldReduceMotion ? 0.1 : 0.6 }}
          className="text-center mb-10 sm:mb-14"
        >
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 mb-3 text-[11px] sm:text-xs font-bold tracking-[0.18em] uppercase rounded-md"
            style={{
              color: 'var(--accent-experience)',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border-default)',
            }}
          >
            <Briefcase size={13} />
            Experience
          </span>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mb-3" style={{ color: 'var(--text-primary)' }}>
            Professional Experience
          </h2>

          <p className="text-sm sm:text-base md:text-lg max-w-xl mx-auto leading-relaxed px-4" style={{ color: 'var(--text-secondary)' }}>
            Building real-world software systems across mobile, web, backend, and distributed technologies.
          </p>

          <div className="mt-5 flex items-center justify-center gap-2">
            <div className="h-px w-12" style={{ backgroundColor: 'var(--border-default)' }} />
            <div className="w-1.5 h-1.5 rotate-45" style={{ border: '1px solid var(--border-strong)' }} />
            <div className="h-px w-12" style={{ backgroundColor: 'var(--border-default)' }} />
          </div>
        </motion.div>

        {/* Content grid: 3D visual + experience cards */}
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-[36%_1fr] gap-6 lg:gap-8 items-start">

            {/* Left: 3D Scene + Stats */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: shouldReduceMotion ? 0.1 : 0.6 }}
              className="hidden lg:block"
            >
              <div className="sticky top-24">
                {/* 3D Container */}
                <div
                  className="rounded-xl overflow-hidden"
                  style={{
                    backgroundColor: 'var(--card-bg)',
                    border: '1px solid var(--border-default)',
                    boxShadow: 'var(--card-shadow)',
                    aspectRatio: '4 / 3',
                  }}
                >
                  <Experience3DScene className="w-full h-full" />
                </div>

                {/* Title below 3D */}
                <div className="mt-3 text-center">
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Building Solutions</p>
                  <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>Crafting software that makes a difference</p>
                </div>

                {/* Compact Stats */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-3 pt-3" style={{ borderTop: '1px solid var(--border-default)' }}>
                  {stats.map((stat, i) => (
                    <StatBlock key={i} stat={stat} index={i} />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Mobile: 3D Scene */}
            <div className="lg:hidden">
              <div
                className="rounded-xl overflow-hidden mb-4"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  border: '1px solid var(--border-default)',
                  boxShadow: 'var(--card-shadow)',
                  aspectRatio: '16 / 10',
                }}
              >
                <Experience3DScene className="w-full h-full" />
              </div>
              <div className="text-center mb-2">
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Building Solutions</p>
                <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>Crafting software that makes a difference</p>
              </div>
              <div className="flex justify-center gap-6 pb-4" style={{ borderBottom: '1px solid var(--border-default)' }}>
                {stats.map((stat, i) => (
                  <StatBlock key={i} stat={stat} index={i} />
                ))}
              </div>
            </div>

            {/* Right: Experience Cards with Timeline */}
            <div className="lg:col-span-1">
              <div className="relative">
                {/* Timeline line */}
                <div
                  className="absolute left-[15px] top-0 bottom-0 w-px hidden sm:block"
                  style={{ backgroundColor: 'var(--border-default)' }}
                  aria-hidden="true"
                />

                <div className="space-y-3 sm:space-y-4 sm:pl-10">
                  {experienceData.map((exp, index) => (
                    <div key={exp.id} className="relative">
                      {/* Timeline node */}
                      <div
                        className="absolute -left-[25px] top-5 w-[11px] h-[11px] rounded-full border-2 hidden sm:block"
                        style={{
                          borderColor: expandedId === exp.id ? 'var(--accent-experience)' : 'var(--border-strong)',
                          backgroundColor: expandedId === exp.id ? 'var(--accent-experience)' : 'var(--card-bg)',
                        }}
                        aria-hidden="true"
                      />

                      <ExperienceCard
                        experience={exp}
                        index={index}
                        isExpanded={expandedId === exp.id}
                        onToggle={() => toggleExpand(exp.id)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
