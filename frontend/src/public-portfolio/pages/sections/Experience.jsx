import { useState, memo } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Briefcase, MapPin, Calendar, ChevronDown, ChevronUp, ExternalLink, Code, Smartphone, Globe, Layers } from 'lucide-react'

const AskualsLogo = () => (
  <img
    src="/askuala-logo.png"
    alt="Askuala Link logo"
    width="48"
    height="48"
    className="w-12 h-12 rounded-xl object-cover"
    style={{ backgroundColor: '#0f1424', border: '1px solid #1e2640' }}
  />
)

const FreelanceLogo = () => (
  <svg viewBox="0 0 48 48" width="48" height="48" fill="none">
    <rect width="48" height="48" rx="12" fill="#8b5cf6" fillOpacity="0.15" />
    <rect x="1" y="1" width="46" height="46" rx="11" stroke="#8b5cf6" strokeOpacity="0.3" strokeWidth="1" />
    <path d="M16 18L24 14L32 18V30L24 34L16 30V18Z" stroke="#8b5cf6" strokeWidth="2" strokeLinejoin="round" />
    <path d="M24 14V34" stroke="#8b5cf6" strokeWidth="1.5" strokeOpacity="0.5" />
    <path d="M16 18L32 30" stroke="#8b5cf6" strokeWidth="1" strokeOpacity="0.3" />
    <path d="M32 18L16 30" stroke="#8b5cf6" strokeWidth="1" strokeOpacity="0.3" />
  </svg>
)

const StudentIllustration = () => (
  <svg viewBox="0 0 400 300" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Desk */}
    <rect x="80" y="200" width="240" height="12" rx="3" fill="#1e2640" />
    <rect x="90" y="212" width="8" height="60" rx="2" fill="#1e2640" />
    <rect x="302" y="212" width="8" height="60" rx="2" fill="#1e2640" />
    
    {/* Monitor */}
    <rect x="140" y="120" width="120" height="80" rx="6" fill="#111827" stroke="#2a3454" strokeWidth="2" />
    <rect x="148" y="128" width="104" height="64" rx="3" fill="#0a0e1a" />
    {/* Screen glow */}
    <rect x="148" y="128" width="104" height="64" rx="3" fill="url(#screenGlow)" fillOpacity="0.3" />
    {/* Code lines on screen */}
    <rect x="158" y="140" width="40" height="3" rx="1" fill="#6366f1" fillOpacity="0.7" />
    <rect x="158" y="148" width="60" height="3" rx="1" fill="#60a5fa" fillOpacity="0.5" />
    <rect x="158" y="156" width="30" height="3" rx="1" fill="#8b5cf6" fillOpacity="0.6" />
    <rect x="158" y="164" width="50" height="3" rx="1" fill="#6366f1" fillOpacity="0.4" />
    <rect x="158" y="172" width="35" height="3" rx="1" fill="#60a5fa" fillOpacity="0.5" />
    <rect x="158" y="180" width="45" height="3" rx="1" fill="#8b5cf6" fillOpacity="0.3" />
    {/* Monitor stand */}
    <rect x="190" y="200" width="20" height="8" rx="2" fill="#1e2640" />
    <rect x="185" y="206" width="30" height="4" rx="2" fill="#1e2640" />
    
    {/* Chair */}
    <ellipse cx="200" cy="250" rx="35" ry="8" fill="#1e2640" />
    <rect x="195" y="220" width="10" height="30" rx="3" fill="#1a2038" />
    <path d="M170 220 Q200 200 230 220 Q230 250 200 255 Q170 250 170 220Z" fill="#1a2038" stroke="#2a3454" strokeWidth="1" />
    
    {/* Person silhouette */}
    <circle cx="200" cy="160" r="18" fill="#2a3454" />
    <path d="M175 190 Q175 175 200 170 Q225 175 225 190 L225 220 Q225 225 220 225 L180 225 Q175 225 175 220Z" fill="#2a3454" />
    
    {/* Floating code symbols */}
    <text x="100" y="140" fontSize="14" fill="#6366f1" fillOpacity="0.4" fontFamily="monospace">&lt;/&gt;</text>
    <text x="290" y="160" fontSize="12" fill="#8b5cf6" fillOpacity="0.3" fontFamily="monospace">{"{ }"}</text>
    <text x="110" y="180" fontSize="10" fill="#60a5fa" fillOpacity="0.3" fontFamily="monospace">fn()</text>
    <text x="280" y="130" fontSize="11" fill="#6366f1" fillOpacity="0.3" fontFamily="monospace">{"=> "}</text>
    
    {/* Glow effect */}
    <circle cx="200" cy="160" r="60" fill="url(#personGlow)" fillOpacity="0.15" />
    
    <defs>
      <radialGradient id="screenGlow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="personGlow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
      </radialGradient>
    </defs>
  </svg>
)

const experienceData = [
  {
    id: 1,
    role: 'Software Development Intern',
    company: 'Askuals Link',
    companyUrl: 'https://askuals.link',
    LogoComponent: AskualsLogo,
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
    icon: Smartphone,
  },
  {
    id: 2,
    role: 'Independent Software Developer',
    company: 'Freelance / Personal Projects',
    LogoComponent: FreelanceLogo,
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
    icon: Code,
  },
]

function ExperienceCard({ experience, index, isExpanded, onToggle }) {
  const shouldReduceMotion = useReducedMotion()
  const Icon = experience.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="relative group"
    >
      <div
        className="relative rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer"
        style={{
          backgroundColor: '#0f1424',
          border: `1px solid ${isExpanded ? `${experience.accent}40` : '#1e2640'}`,
          boxShadow: isExpanded ? `0 8px 40px ${experience.accent}15, 0 0 80px ${experience.accent}08` : 'none',
        }}
        onClick={onToggle}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = `${experience.accent}50`
          e.currentTarget.style.boxShadow = `0 8px 40px ${experience.accent}20, 0 0 60px ${experience.accent}10`
        }}
        onMouseLeave={(e) => {
          if (!isExpanded) {
            e.currentTarget.style.borderColor = '#1e2640'
            e.currentTarget.style.boxShadow = 'none'
          }
        }}
      >
        {/* Hover gradient overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${experience.accent}08 0%, transparent 50%, ${experience.accent}05 100%)`,
          }}
        />

        {/* Card content */}
        <div className="relative p-5 sm:p-6 md:p-7">
          <div className="flex items-start gap-4">
            {/* Logo */}
            <div className="shrink-0 relative">
              <div className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <experience.LogoComponent />
              </div>
              {/* Glow behind logo */}
              <div
                className="absolute inset-0 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ backgroundColor: `${experience.accent}20` }}
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Icon size={16} style={{ color: experience.accent }} />
                <span
                  className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${experience.accent}15`,
                    color: experience.accent,
                    border: `1px solid ${experience.accent}25`,
                  }}
                >
                  {experience.type}
                </span>
              </div>

              <h3
                className="text-lg sm:text-xl md:text-2xl font-bold leading-tight mb-1 transition-all duration-300"
                style={{ color: '#ffffff' }}
              >
                {experience.role}
              </h3>

              <div className="flex items-center gap-2 mb-2">
                {experience.companyUrl ? (
                  <a
                    href={experience.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 group/link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="text-sm font-semibold transition-colors duration-200" style={{ color: experience.accent }}>
                      {experience.company}
                    </span>
                    <ExternalLink size={12} style={{ color: experience.accent }} className="opacity-0 group-hover/link:opacity-100 transition-opacity" />
                  </a>
                ) : (
                  <span className="text-sm font-semibold" style={{ color: experience.accent }}>
                    {experience.company}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] sm:text-xs" style={{ color: '#7a8599' }}>
                <span className="flex items-center gap-1">
                  <Calendar size={11} />
                  {experience.startDate} – {experience.endDate}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={11} />
                  {experience.location}
                </span>
              </div>
            </div>

            {/* Expand indicator */}
            <div
              className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-300"
              style={{
                backgroundColor: isExpanded ? `${experience.accent}15` : '#111827',
                border: `1px solid ${isExpanded ? `${experience.accent}30` : '#1e2640'}`,
                color: isExpanded ? experience.accent : '#7a8599',
              }}
            >
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          </div>

          {/* Summary */}
          <p className="mt-3 text-sm leading-relaxed" style={{ color: '#c8d0e0' }}>
            {experience.summary}
          </p>

          {/* Technology badges */}
          <div className="flex flex-wrap gap-1.5 mt-4">
            {experience.technologies.slice(0, isExpanded ? undefined : 5).map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-medium transition-all duration-200 hover:scale-105"
                style={{
                  backgroundColor: '#111827',
                  border: '1px solid #1e2640',
                  color: '#c8d0e0',
                }}
              >
                {tech}
              </span>
            ))}
            {!isExpanded && experience.technologies.length > 5 && (
              <span
                className="px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-medium"
                style={{
                  backgroundColor: `${experience.accent}15`,
                  color: experience.accent,
                }}
              >
                +{experience.technologies.length - 5}
              </span>
            )}
          </div>
        </div>

        {/* Expandable details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0.1 : 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="overflow-hidden"
            >
              <div className="px-5 sm:px-6 md:px-7 pb-5 sm:pb-6 md:pb-7">
                <div
                  className="h-px mb-5"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${experience.accent}30, transparent)`,
                  }}
                />

                <h4 className="text-xs font-bold uppercase tracking-[0.15em] mb-4 flex items-center gap-2" style={{ color: '#ffffff' }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: experience.accent }} />
                  Key Contributions
                </h4>

                <div className="grid gap-2.5">
                  {experience.contributions.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: shouldReduceMotion ? 0 : i * 0.05, duration: 0.3 }}
                      className="flex items-start gap-3 p-2.5 rounded-lg transition-all duration-200 hover:bg-white/[0.02]"
                    >
                      <div
                        className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold"
                        style={{ backgroundColor: `${experience.accent}15`, color: experience.accent }}
                      >
                        {i + 1}
                      </div>
                      <span className="text-sm leading-relaxed" style={{ color: '#c8d0e0' }}>{item}</span>
                    </motion.div>
                  ))}
                </div>
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

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  return (
    <section
      id="experience"
      className="relative py-12 sm:py-16 md:py-20 lg:py-24"
      style={{ backgroundColor: '#0a0e1a' }}
      aria-label="Experience section"
    >
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 mb-4 sm:mb-6 text-xs sm:text-sm font-bold tracking-[0.2em] uppercase rounded-full"
            style={{
              color: '#6366f1',
              backgroundColor: 'rgba(99,102,241,0.1)',
              border: '1px solid rgba(99,102,241,0.2)',
            }}
          >
            <Briefcase size={14} />
            Experience
          </motion.span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 sm:mb-6" style={{ color: '#ffffff' }}>
            Professional Experience
          </h2>

          <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed px-4" style={{ color: '#c8d0e0' }}>
            Building real-world software systems across mobile, web, backend, and distributed technologies.
          </p>

          <div className="mt-6 sm:mt-8 flex items-center justify-center gap-3">
            <div className="h-px w-16" style={{ backgroundColor: 'rgba(99,102,241,0.3)' }} />
            <div className="w-2 h-2 rotate-45" style={{ border: '1px solid rgba(99,102,241,0.3)' }} />
            <div className="h-px w-16" style={{ backgroundColor: 'rgba(99,102,241,0.3)' }} />
          </div>
        </motion.div>

        {/* Content grid: illustration + experience cards */}
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-10 items-start">
            {/* Left: Student illustration */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-1 hidden lg:block"
            >
              <div className="sticky top-24">
                <div
                  className="rounded-2xl overflow-hidden p-6"
                  style={{
                    backgroundColor: '#0f1424',
                    border: '1px solid #1e2640',
                  }}
                >
                  <StudentIllustration />
                  <div className="mt-4 text-center">
                    <p className="text-sm font-semibold" style={{ color: '#ffffff' }}>Building Solutions</p>
                    <p className="text-xs mt-1" style={{ color: '#7a8599' }}>Crafting code that makes a difference</p>
                  </div>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {[
                    { label: 'Years', value: '2+', icon: Calendar },
                    { label: 'Projects', value: '12+', icon: Layers },
                    { label: 'Technologies', value: '10+', icon: Code },
                    { label: 'Clients', value: '5+', icon: Globe },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-3 rounded-xl transition-all duration-200 hover:scale-105"
                      style={{
                        backgroundColor: '#0f1424',
                        border: '1px solid #1e2640',
                      }}
                    >
                      <stat.icon size={14} style={{ color: '#6366f1' }} />
                      <div>
                        <span className="text-sm font-bold block" style={{ color: '#ffffff' }}>{stat.value}</span>
                        <span className="text-[9px]" style={{ color: '#7a8599' }}>{stat.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right: Experience cards */}
            <div className="lg:col-span-2">
              <div className="space-y-4 sm:space-y-5">
                {experienceData.map((exp, index) => (
                  <ExperienceCard
                    key={exp.id}
                    experience={exp}
                    index={index}
                    isExpanded={expandedId === exp.id}
                    onToggle={() => toggleExpand(exp.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
