import { useState, useRef, useEffect, useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { BadgeCheck, ChevronDown, ExternalLink, Briefcase, CalendarDays } from 'lucide-react'
import { FaLinkedin } from 'react-icons/fa'
import { getMediaUrl } from '../../../shared/services/api'

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 90,
      damping: 18,
      delay: i * 0.1,
    },
  }),
}

const RELATIONSHIP_STYLES = {
  Supervisor: 'bg-[#0f172a] text-white border-[#0f172a] dark:bg-[#70b5f9] dark:text-[#0f172a] dark:border-[#70b5f9]',
  'Direct Supervisor': 'bg-[#0f172a] text-white border-[#0f172a] dark:bg-[#70b5f9] dark:text-[#0f172a] dark:border-[#70b5f9]',
  'Team Lead': 'bg-[#1e293b]/8 text-[#1e293b] border-[#1e293b]/15 dark:bg-slate-700/50 dark:text-slate-200 dark:border-slate-600',
  Mentor: 'bg-[#1e293b]/8 text-[#1e293b] border-[#1e293b]/15 dark:bg-slate-700/50 dark:text-slate-200 dark:border-slate-600',
  Client: 'bg-[#0a66c2]/8 text-[#0a66c2] border-[#0a66c2]/20 dark:bg-[#70b5f9]/10 dark:text-[#70b5f9] dark:border-[#70b5f9]/25',
  Colleague: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700',
}

function getRelationshipStyle(relationship) {
  return RELATIONSHIP_STYLES[relationship] || RELATIONSHIP_STYLES.Colleague
}

function getInitials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function formatPublishedDate(dateString) {
  if (!dateString) return null
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function highlightContent(text, highlights) {
  if (!text) return null
  const terms = (highlights || []).filter(Boolean)
  if (terms.length === 0) return text
  const pattern = new RegExp(`(${terms.map(escapeRegExp).join('|')})`, 'gi')
  const lower = new Set(terms.map((t) => t.toLowerCase()))
  return text.split(pattern).map((part, i) =>
    lower.has(part.toLowerCase()) ? (
      <mark
        key={i}
        className="bg-transparent font-semibold text-[#0f172a] dark:text-white"
      >
        {part}
      </mark>
    ) : (
      part
    )
  )
}

export default function TestimonialCard({ testimonial, index = 0, shouldReduceMotion }) {
  const prefersReducedMotion = useReducedMotion()
  const reduceMotion = shouldReduceMotion ?? prefersReducedMotion
  const [expanded, setExpanded] = useState(false)
  const [needsTruncation, setNeedsTruncation] = useState(false)
  const [imgFailed, setImgFailed] = useState(false)
  const [logoFailed, setLogoFailed] = useState(false)
  const textRef = useRef(null)

  const {
    name,
    role,
    organization,
    organizationUrl,
    organizationLogo,
    linkedinUrl,
    relationship,
    avatar,
    avatarFallback,
    content,
    highlights,
    project,
    projectUrl,
    verified,
    featured,
    publishedAt,
  } = testimonial

  const avatarUrl = avatar ? getMediaUrl(avatar) : null
  const logoUrl = organizationLogo ? getMediaUrl(organizationLogo) : null
  const initials = getInitials(name)
  const dateLabel = formatPublishedDate(publishedAt)
  const relStyle = getRelationshipStyle(relationship)
  const isVerified = verified ?? featured ?? false
  const renderedContent = useMemo(() => highlightContent(content, highlights), [content, highlights])

  useEffect(() => {
    const el = textRef.current
    if (!el || expanded) return
    const measure = () => setNeedsTruncation(el.scrollHeight > el.clientHeight + 2)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [content, expanded])

  return (
    <motion.article
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      whileHover={reduceMotion ? {} : { y: -6, transition: { duration: 0.25, ease: 'easeOut' } }}
      className="group relative flex flex-col w-full h-full bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-[#1e293b] shadow-[0_1px_2px_rgba(15,23,42,0.04),0_4px_16px_-4px_rgba(15,23,42,0.06)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)] hover:shadow-[0_2px_4px_rgba(15,23,42,0.04),0_16px_40px_-8px_rgba(15,23,42,0.14)] dark:hover:shadow-[0_16px_40px_-8px_rgba(0,0,0,0.6)] transition-shadow duration-300 ease-out rounded-[20px]"
      aria-label={`Recommendation from ${name}`}
    >
      <div className="flex flex-col flex-1 p-6">
        {/* Header */}
        <header className="flex items-start gap-4 mb-5">
          <div className="relative shrink-0">
            <div className="w-[80px] h-[80px] rounded-full overflow-hidden ring-2 ring-slate-100 dark:ring-slate-800 group-hover:ring-[#0f172a]/15 dark:group-hover:ring-[#70b5f9]/30 transition-all duration-300 bg-slate-100 dark:bg-slate-800">
              {avatarUrl && !imgFailed ? (
                <img
                  src={avatarUrl}
                  alt={`${name}, ${role}${organization ? ` at ${organization}` : ''}`}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  loading="lazy"
                  onError={() => setImgFailed(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-xl font-bold text-slate-500 dark:text-slate-400">
                    {avatarFallback || initials}
                  </div>
                </div>
              )}
            </div>
            {logoUrl && !logoFailed && (
              <div
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white dark:bg-[#111827] ring-2 ring-white dark:ring-[#111827] shadow-sm flex items-center justify-center overflow-hidden"
                title={organization}
              >
                <img
                  src={logoUrl}
                  alt={`${organization} logo`}
                  className="w-5 h-5 object-contain"
                  loading="lazy"
                  onError={() => setLogoFailed(true)}
                />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-[16px] font-bold text-[#0f172a] dark:text-white leading-tight truncate">
                  {name}
                </h3>
                <div className="text-[13px] font-medium text-[#1e293b] dark:text-slate-300 mt-1 leading-snug">
                  {role}
                </div>
                {organization && (
                  <div className="text-[13px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug truncate">
                    {organizationUrl ? (
                      <a
                        href={organizationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#0a66c2] dark:hover:text-[#70b5f9] hover:underline transition-colors"
                      >
                        {organization}
                      </a>
                    ) : (
                      organization
                    )}
                  </div>
                )}
              </div>

              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-[#0a66c2] dark:text-[#70b5f9] bg-[#0a66c2]/6 dark:bg-[#70b5f9]/10 hover:bg-[#0a66c2] hover:text-white dark:hover:bg-[#70b5f9] dark:hover:text-[#0f172a] transition-colors"
                  aria-label={`${name}'s LinkedIn profile`}
                >
                  <FaLinkedin size={16} />
                </a>
              )}
            </div>

            {isVerified && (
              <div className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-md text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 dark:text-emerald-300 dark:bg-emerald-500/10 dark:border-emerald-500/20">
                <BadgeCheck size={12} aria-hidden="true" />
                Verified recommendation
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="relative flex-1 text-slate-600 dark:text-slate-300">
          <div
            className="absolute -top-3 -left-1 font-serif text-[64px] leading-none text-[#0f172a]/8 dark:text-white/8 select-none pointer-events-none"
            aria-hidden="true"
          >
            &ldquo;
          </div>

          <blockquote
            ref={textRef}
            className={`relative pl-6 text-[14.5px] leading-[1.7] ${
              !expanded ? 'line-clamp-4' : ''
            }`}
          >
            {renderedContent}
          </blockquote>

          {needsTruncation && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="inline-flex items-center gap-1 mt-2 ml-6 text-[13px] font-semibold text-[#0a66c2] dark:text-[#70b5f9] hover:underline transition-colors cursor-pointer"
              aria-expanded={expanded}
            >
              {expanded ? 'Show less' : 'Read more'}
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </button>
          )}
        </div>

        {/* Footer */}
        <footer className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          {project && (
            projectUrl ? (
              <a
                href={projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11.5px] font-semibold bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-100 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700/60 dark:hover:border-slate-600 transition-colors max-w-full"
              >
                <Briefcase size={12} className="shrink-0 opacity-70" aria-hidden="true" />
                <span className="truncate">{project}</span>
                <ExternalLink size={10} className="shrink-0 opacity-50" aria-hidden="true" />
              </a>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11.5px] font-semibold bg-slate-50 text-slate-700 border border-slate-200 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700/60 max-w-full">
                <Briefcase size={12} className="shrink-0 opacity-70" aria-hidden="true" />
                <span className="truncate">{project}</span>
              </div>
            )
          )}

          {relationship && (
            <div className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11.5px] font-semibold border ${relStyle}`}>
              {relationship}
            </div>
          )}

          <div className="ml-auto flex items-center gap-2 text-slate-400 dark:text-slate-500">
            {dateLabel && (
              <time
                dateTime={publishedAt}
                className="inline-flex items-center gap-1 text-[11.5px] font-medium whitespace-nowrap"
              >
                <CalendarDays size={12} aria-hidden="true" />
                {dateLabel}
              </time>
            )}
            {linkedinUrl && (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#0a66c2] dark:hover:text-[#70b5f9] transition-colors"
                aria-label={`View ${name}'s recommendation on LinkedIn`}
                title="Recommendation on LinkedIn"
              >
                <FaLinkedin size={14} />
              </a>
            )}
          </div>
        </footer>
      </div>
    </motion.article>
  )
}
