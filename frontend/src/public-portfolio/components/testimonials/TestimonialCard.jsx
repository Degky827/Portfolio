import { useState, useRef, useEffect, useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { BadgeCheck, ChevronDown, ExternalLink, Briefcase, CalendarDays, Star } from 'lucide-react'
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
      delay: i * 0.08,
    },
  }),
}

const RELATIONSHIP_STYLES = {
  Supervisor: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800',
  'Direct Supervisor': 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800',
  'Team Lead': 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800',
  Mentor: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800',
  Client: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800/60',
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
        className="bg-purple-100/80 dark:bg-purple-900/40 text-purple-900 dark:text-purple-200 font-semibold px-1 rounded"
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
    rating = 5,
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
      className="group relative flex flex-col w-full h-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-purple-900/30 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)] hover:border-purple-400/60 dark:hover:border-purple-500/50 hover:shadow-[0_15px_35px_-5px_rgba(147,51,234,0.18)] dark:hover:shadow-[0_15px_35px_-5px_rgba(147,51,234,0.25)] transition-all duration-300 ease-out rounded-2xl"
      aria-label={`Recommendation from ${name}`}
    >
      <div className="flex flex-col flex-1 p-6">
        {/* Header */}
        <header className="flex items-start gap-4 mb-4">
          <div className="relative shrink-0">
            <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-purple-200 dark:ring-purple-800/60 group-hover:ring-purple-500 transition-all duration-300 bg-purple-50 dark:bg-purple-950/40">
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
                  <div className="text-base font-bold text-purple-600 dark:text-purple-300">
                    {avatarFallback || initials}
                  </div>
                </div>
              )}
            </div>
            {logoUrl && !logoFailed && (
              <div
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white dark:bg-slate-900 ring-2 ring-white dark:ring-slate-900 shadow-sm flex items-center justify-center overflow-hidden"
                title={organization}
              >
                <img
                  src={logoUrl}
                  alt={`${organization} logo`}
                  className="w-4 h-4 object-contain"
                  loading="lazy"
                  onError={() => setLogoFailed(true)}
                />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-[16px] font-bold text-slate-900 dark:text-white leading-tight truncate">
                  {name}
                </h3>
                <div className="text-[13px] font-medium text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">
                  {role}
                </div>
                {organization && (
                  <div className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug truncate">
                    {organizationUrl ? (
                      <a
                        href={organizationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-purple-600 dark:hover:text-purple-400 hover:underline transition-colors"
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
                  className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-500 dark:hover:text-white transition-colors"
                  aria-label={`${name}'s LinkedIn profile`}
                >
                  <FaLinkedin size={16} />
                </a>
              )}
            </div>

            {/* 5 Purple Stars */}
            <div className="flex items-center gap-1 mt-2 text-purple-600 dark:text-purple-400">
              {Array.from({ length: rating }, (_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-purple-600 text-purple-600 dark:fill-purple-400 dark:text-purple-400" />
              ))}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="relative flex-1 text-slate-600 dark:text-slate-300">
          <div
            className="absolute -top-3 -left-1 font-serif text-[56px] leading-none text-purple-500/15 dark:text-purple-400/20 select-none pointer-events-none"
            aria-hidden="true"
          >
            &ldquo;
          </div>

          <blockquote
            ref={textRef}
            className={`relative pl-5 text-[14px] leading-relaxed ${
              !expanded ? 'line-clamp-4' : ''
            }`}
          >
            {renderedContent}
          </blockquote>

          {needsTruncation && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="inline-flex items-center gap-1 mt-2 ml-5 text-[12px] font-semibold text-purple-600 dark:text-purple-400 hover:underline transition-colors cursor-pointer"
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
        <footer className="flex flex-wrap items-center gap-2 mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800">
          {project && (
            projectUrl ? (
              <a
                href={projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200 hover:border-purple-300 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/60 transition-colors max-w-full"
              >
                <Briefcase size={11} className="shrink-0 opacity-70" aria-hidden="true" />
                <span className="truncate">{project}</span>
                <ExternalLink size={9} className="shrink-0 opacity-50" aria-hidden="true" />
              </a>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-50 text-slate-700 border border-slate-200 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700/60 max-w-full">
                <Briefcase size={11} className="shrink-0 opacity-70" aria-hidden="true" />
                <span className="truncate">{project}</span>
              </div>
            )
          )}

          {relationship && (
            <div className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${relStyle}`}>
              {relationship}
            </div>
          )}

          <div className="ml-auto flex items-center gap-2 text-slate-400 dark:text-slate-500">
            {isVerified && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-purple-600 dark:text-purple-400">
                <BadgeCheck size={13} />
                Verified
              </span>
            )}
            {dateLabel && (
              <time
                dateTime={publishedAt}
                className="inline-flex items-center gap-1 text-[11px] font-medium whitespace-nowrap"
              >
                <CalendarDays size={11} aria-hidden="true" />
                {dateLabel}
              </time>
            )}
          </div>
        </footer>
      </div>
    </motion.article>
  )
}
