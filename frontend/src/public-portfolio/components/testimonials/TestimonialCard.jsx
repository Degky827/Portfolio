import { useState, useRef, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { BadgeCheck, ChevronDown, Quote, ExternalLink } from 'lucide-react'
import { FaLinkedin } from 'react-icons/fa'
import { getMediaUrl } from '../../../shared/services/api'

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20,
      delay: i * 0.12,
    },
  }),
}

const RELATIONSHIP_STYLES = {
  'Direct Supervisor': {
    light: 'bg-[#0f172a]/5 text-[#0f172a] border-[#0f172a]/10',
    dark: 'bg-[#70b5f9]/8 text-[#70b5f9] border-[#70b5f9]/15',
  },
  'Supervisor': {
    light: 'bg-[#0f172a]/5 text-[#0f172a] border-[#0f172a]/10',
    dark: 'bg-[#70b5f9]/8 text-[#70b5f9] border-[#70b5f9]/15',
  },
  'Team Lead': {
    light: 'bg-[#1e293b]/5 text-[#1e293b] border-[#1e293b]/10',
    dark: 'bg-[#94a3b8]/8 text-[#94a3b8] border-[#94a3b8]/15',
  },
  'Colleague': {
    light: 'bg-slate-50 text-slate-600 border-slate-200',
    dark: 'bg-slate-800/40 text-slate-400 border-slate-700/50',
  },
  'Client': {
    light: 'bg-[#0f172a]/5 text-[#0f172a] border-[#0f172a]/10',
    dark: 'bg-[#70b5f9]/8 text-[#70b5f9] border-[#70b5f9]/15',
  },
  'Industry Inspiration': {
    light: 'bg-slate-50 text-slate-600 border-slate-200',
    dark: 'bg-slate-800/40 text-slate-400 border-slate-700/50',
  },
}

function getRelationshipStyle(relationship) {
  if (!relationship) return RELATIONSHIP_STYLES['Colleague']
  return RELATIONSHIP_STYLES[relationship] || RELATIONSHIP_STYLES['Colleague']
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
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export default function TestimonialCard({ testimonial, index = 0, shouldReduceMotion }) {
  const prefersReducedMotion = useReducedMotion()
  const reduceMotion = shouldReduceMotion ?? prefersReducedMotion
  const [expanded, setExpanded] = useState(false)
  const [needsTruncation, setNeedsTruncation] = useState(false)
  const textRef = useRef(null)

  const {
    name,
    role,
    organization,
    organizationUrl,
    relationship,
    avatar,
    avatarFallback,
    content,
    project,
    projectUrl,
    featured,
    publishedAt,
  } = testimonial

  const avatarUrl = avatar ? getMediaUrl(avatar) : null
  const initials = getInitials(name)
  const dateLabel = formatPublishedDate(publishedAt)
  const relStyle = getRelationshipStyle(relationship)

  useEffect(() => {
    const el = textRef.current
    if (el) {
      setNeedsTruncation(el.scrollHeight > el.clientHeight + 2)
    }
  }, [content])

  return (
    <motion.article
      custom={index}
      variants={cardVariants}
      whileHover={reduceMotion ? {} : { y: -4, transition: { duration: 0.25, ease: 'easeOut' } }}
      className={`
        group relative flex flex-col
        bg-white dark:bg-[#111827]
        border border-slate-200 dark:border-[#1e293b]
        shadow-[0_1px_3px_rgba(0,0,0,0.06)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)]
        hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.5)]
        transition-shadow duration-300 ease-out
        overflow-hidden
        rounded-[20px]
        ${featured ? 'ring-1 ring-[#0a66c2]/10 dark:ring-[#70b5f9]/10' : ''}
      `}
      aria-label={`Recommendation from ${name}`}
    >
      {featured && (
        <div className="absolute top-0 inset-x-0 h-[2px] bg-[#0a66c2] dark:bg-[#70b5f9]" />
      )}

      <div className="flex flex-col flex-1 p-5 sm:p-6">
        {/* Card Header: Photo + Author Info */}
        <div className="flex items-start gap-3.5 mb-4">
          <div className="relative shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={`${name}'s profile photo`}
                className="w-[80px] h-[80px] rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800 group-hover:ring-[#0a66c2]/20 dark:group-hover:ring-[#70b5f9]/20 transition-all duration-300 group-hover:scale-[1.03]"
                loading="lazy"
              />
            ) : (
              <div className="w-[80px] h-[80px] rounded-full bg-slate-100 dark:bg-slate-800 ring-2 ring-slate-200 dark:ring-slate-700 group-hover:ring-[#0a66c2]/20 dark:group-hover:ring-[#70b5f9]/20 flex items-center justify-center transition-all duration-300 group-hover:scale-[1.03]">
                <span className="text-xl font-bold text-slate-500 dark:text-slate-400">
                  {avatarFallback || initials}
                </span>
              </div>
            )}
            {featured && (
              <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-white dark:bg-[#111827] flex items-center justify-center">
                <BadgeCheck size={16} className="fill-[#0a66c2] dark:fill-[#70b5f9] text-white" aria-hidden="true" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 pt-0.5">
            <div className="flex items-center gap-2">
              <h3 className="text-[15px] font-bold text-[#0f172a] dark:text-white truncate">
                {name}
              </h3>
              {featured && (
                <BadgeCheck
                  size={16}
                  className="fill-[#0a66c2] dark:fill-[#70b5f9] text-white shrink-0"
                  aria-label="Verified recommendation"
                />
              )}
            </div>
            <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
              {role}
              {organization && (
                <>
                  {' at '}
                  {organizationUrl ? (
                    <a
                      href={organizationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[#0f172a] dark:text-slate-200 hover:text-[#0a66c2] dark:hover:text-[#70b5f9] hover:underline transition-colors"
                    >
                      {organization}
                    </a>
                  ) : (
                    <span className="font-semibold text-[#0f172a] dark:text-slate-200">{organization}</span>
                  )}
                </>
              )}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              {relationship && (
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${relStyle.light} dark:${relStyle.dark}`}>
                  {relationship}
                </span>
              )}
              {dateLabel && (
                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                  {dateLabel}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Recommendation Content */}
        <div className="relative flex-1 mb-4">
          {/* Decorative open quote */}
          <Quote
            size={32}
            className="absolute -top-1 -left-1 text-slate-200 dark:text-slate-700/70 select-none pointer-events-none"
            strokeWidth={1}
            aria-hidden="true"
          />

          <div
            ref={textRef}
            className={`pl-7 text-[14.5px] leading-[1.65] text-slate-600 dark:text-slate-300 transition-all duration-300 ${
              !expanded && needsTruncation ? 'line-clamp-3' : ''
            }`}
          >
            {content}
          </div>

          {!expanded && needsTruncation && (
            <div className="absolute bottom-0 inset-x-0 pl-7 h-6 bg-gradient-to-t from-white dark:from-[#111827] to-transparent pointer-events-none" />
          )}
        </div>

        {needsTruncation && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center gap-1 text-[13px] font-medium text-[#0a66c2] dark:text-[#70b5f9] hover:underline mb-4 transition-colors self-start cursor-pointer"
            aria-expanded={expanded}
          >
            {expanded ? 'Show less' : 'Read more'}
            <ChevronDown
              size={13}
              className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
          </button>
        )}

        {/* Footer: Project + Relationship Badges */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2">
            {project && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-50 text-slate-600 border border-slate-200 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700/60">
                {project}
                {projectUrl && (
                  <ExternalLink size={9} className="opacity-50" aria-hidden="true" />
                )}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* LinkedIn icon */}
            {organizationUrl && (
              <a
                href={organizationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-[#0a66c2] dark:hover:text-[#70b5f9] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label={`${name}'s LinkedIn profile`}
              >
                <FaLinkedin size={14} />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  )
}
