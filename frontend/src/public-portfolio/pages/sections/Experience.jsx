import { useState, memo, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Briefcase, MapPin, Calendar, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import { createContainerVariants, defaultViewport } from '../../shared/animations'

const experienceData = [
  {
    id: 1,
    role: 'Software Development Intern',
    company: 'Askuals Link',
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
    accent: '#6366f1',
  },
  {
    id: 2,
    role: 'Independent Software Developer',
    company: 'Freelance / Personal Projects',
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
    accent: '#8b5cf6',
  },
]

function TimelineDot({ accent, isActive }) {
  return (
    <div className="relative flex items-center justify-center">
      <div
        className="w-3 h-3 rounded-full shrink-0 transition-all duration-300"
        style={{
          backgroundColor: isActive ? accent : 'transparent',
          border: `2px solid ${isActive ? accent : 'var(--border-primary)'}`,
          boxShadow: isActive ? `0 0 12px ${accent}40` : 'none',
        }}
      />
      {isActive && (
        <motion.div
          className="absolute w-6 h-6 rounded-full"
          style={{ border: `1px solid ${accent}30` }}
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </div>
  )
}

function ExperienceCard({ experience, index, isExpanded, onToggle }) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="relative group"
    >
      <div
        className="relative rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: `1px solid var(--border-primary)`,
          boxShadow: isExpanded ? `0 8px 32px ${experience.accent}10` : 'none',
        }}
      >
        {/* Card header - always visible */}
        <button
          onClick={onToggle}
          className="w-full text-left p-5 sm:p-6 md:p-7 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{ focusVisibleRing: experience.accent }}
          aria-expanded={isExpanded}
          aria-controls={`experience-details-${experience.id}`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {/* Role */}
              <h3
                className="text-base sm:text-lg md:text-xl font-bold leading-tight mb-1.5 transition-all duration-300"
                style={{ color: 'var(--text-primary)' }}
              >
                {experience.role}
              </h3>

              {/* Company */}
              <p className="text-sm sm:text-[15px] font-semibold mb-2" style={{ color: experience.accent }}>
                {experience.company}
              </p>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] sm:text-xs" style={{ color: 'var(--text-tertiary)' }}>
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {experience.startDate} – {experience.endDate}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={12} />
                  {experience.location}
                </span>
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: `${experience.accent}15`,
                    color: experience.accent,
                    border: `1px solid ${experience.accent}25`,
                  }}
                >
                  {experience.type}
                </span>
              </div>

              {/* Summary */}
              <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {experience.summary}
              </p>
            </div>

            {/* Expand/collapse button */}
            <div
              className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg transition-all duration-300"
              style={{
                backgroundColor: isExpanded ? `${experience.accent}15` : 'var(--bg-primary)',
                border: `1px solid ${isExpanded ? `${experience.accent}30` : 'var(--border-primary)'}`,
                color: isExpanded ? experience.accent : 'var(--text-tertiary)',
              }}
              aria-hidden="true"
            >
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          </div>

          {/* Technology badges - always visible */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-4">
            {experience.technologies.slice(0, isExpanded ? undefined : 6).map((tech, i) => (
              <span
                key={tech}
                className="px-2 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-[11px] font-medium transition-all duration-300"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-primary)',
                  color: 'var(--text-secondary)',
                }}
              >
                {tech}
              </span>
            ))}
            {!isExpanded && experience.technologies.length > 6 && (
              <span
                className="px-2 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-[11px] font-medium"
                style={{
                  backgroundColor: `${experience.accent}10`,
                  color: experience.accent,
                }}
              >
                +{experience.technologies.length - 6}
              </span>
            )}
          </div>
        </button>

        {/* Expandable details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              id={`experience-details-${experience.id}`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0.1 : 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="overflow-hidden"
              role="region"
              aria-label={`${experience.role} details`}
            >
              <div className="px-5 sm:px-6 md:px-7 pb-5 sm:pb-6 md:pb-7">
                <div
                  className="h-px mb-5 sm:mb-6"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${experience.accent}20, transparent)`,
                  }}
                />

                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-[0.15em] mb-3 sm:mb-4" style={{ color: 'var(--text-primary)' }}>
                  Key Contributions
                </h4>

                <ul className="space-y-2.5 sm:space-y-3">
                  {experience.contributions.map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: shouldReduceMotion ? 0 : i * 0.05, duration: 0.3 }}
                      className="flex items-start gap-2.5 sm:gap-3 text-sm leading-relaxed"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full shrink-0 mt-2"
                        style={{ backgroundColor: experience.accent }}
                      />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default function Experience() {
  const [expandedId, setExpandedId] = useState(null)

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
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16 md:mb-20"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 mb-4 sm:mb-6 text-xs sm:text-sm font-bold tracking-[0.2em] uppercase rounded-full border"
            style={{
              color: '#6366f1',
              backgroundColor: 'rgba(99,102,241,0.08)',
              borderColor: 'rgba(99,102,241,0.2)',
            }}
          >
            <Briefcase size={14} />
            Experience
          </motion.span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 sm:mb-6" style={{ color: 'var(--text-primary)' }}>
            Professional Experience
          </h2>

          <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed px-4" style={{ color: 'var(--text-secondary)' }}>
            Building real-world software systems across mobile, web, backend, and distributed technologies.
          </p>

          <div className="mt-6 sm:mt-8 flex items-center justify-center gap-3">
            <div className="h-px w-16" style={{ backgroundColor: 'rgba(99,102,241,0.3)' }} />
            <div className="w-2 h-2 rotate-45" style={{ border: '1px solid rgba(99,102,241,0.3)' }} />
            <div className="h-px w-16" style={{ backgroundColor: 'rgba(99,102,241,0.3)' }} />
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Vertical timeline line */}
            <div
              className="absolute left-[18px] sm:left-[22px] top-0 bottom-0 w-px hidden sm:block"
              style={{
                background: 'linear-gradient(to bottom, transparent, var(--border-primary) 10%, var(--border-primary) 90%, transparent)',
              }}
              aria-hidden="true"
            />

            {/* Experience cards */}
            <div className="space-y-5 sm:space-y-6">
              {experienceData.map((exp, index) => (
                <div key={exp.id} className="relative flex gap-4 sm:gap-6">
                  {/* Timeline dot - hidden on mobile */}
                  <div className="hidden sm:flex flex-col items-center pt-6 sm:pt-7">
                    <TimelineDot accent={exp.accent} isActive={expandedId === exp.id} />
                  </div>

                  {/* Card */}
                  <div className="flex-1 min-w-0">
                    <ExperienceCard
                      experience={exp}
                      index={index}
                      isExpanded={expandedId === exp.id}
                      onToggle={() => toggleExpand(exp.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
