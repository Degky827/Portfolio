import { useState, useRef, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { BadgeCheck, ChevronDown, Quote, ExternalLink, Star } from 'lucide-react'
import { getMediaUrl } from '../../../shared/services/api'

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 80,
      damping: 18,
      delay: i * 0.1,
    },
  }),
}

const RELATIONSHIP_STYLES = {
  'Direct Supervisor': 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20',
  'Supervisor': 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20',
  'Team Lead': 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
  'Colleague': 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20',
  'Client': 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
  'Industry Inspiration': 'bg-[#0a66c2]/10 text-[#0a66c2] border-[#0a66c2]/20 dark:bg-[#70b5f9]/10 dark:text-[#70b5f9] dark:border-[#70b5f9]/20',
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
    rating,
  } = testimonial

  const avatarUrl = avatar ? getMediaUrl(avatar) : null
  const initials = getInitials(name)
  const dateLabel = formatPublishedDate(publishedAt)
  const displayRating = rating ?? 5

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
      whileHover={reduceMotion ? {} : { y: -6, transition: { duration: 0.25, ease: 'easeOut' } }}
      className={`
        group relative flex flex-col rounded-2xl
        bg-white dark:bg-[#111827]
        border border-slate-200 dark:border-[#1e293b]
        shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)]
        hover:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.5)]
        transition-shadow duration-300 ease-out
        overflow-hidden
        ${featured ? 'ring-1 ring-[#0a66c2]/15 dark:ring-[#70b5f9]/15' : ''}
      `}
      aria-label={`Recommendation from ${name}`}
    >
      {featured && (
        <div className="absolute top-0 inset-x-0 h-[2px] bg-[#0a66c2] dark:bg-[#70b5f9]" />
      )}

      <div className="flex flex-col flex-1 p-5 sm:p-6 items-center text-center">
        {/* Large centered avatar */}
        <div className="mb-4 relative">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={`${name}'s profile photo`}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-4 ring-slate-100 dark:ring-slate-800 group-hover:ring-[#0a66c2]/20 dark:group-hover:ring-[#70b5f9]/20 transition-all duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-100 dark:bg-slate-800 ring-4 ring-slate-200 dark:ring-slate-700 group-hover:ring-[#0a66c2]/20 dark:group-hover:ring-[#70b5f9]/20 flex items-center justify-center transition-all duration-300 group-hover:scale-105">
              <span className="text-2xl font-bold text-slate-500 dark:text-slate-400">
                {avatarFallback || initials}
              </span>
            </div>
          )}
          {featured && (
            <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-white dark:bg-[#111827] flex items-center justify-center">
              <BadgeCheck size={18} className="fill-[#0a66c2] dark:fill-[#70b5f9] text-white" aria-hidden="true" />
            </div>
          )}
        </div>

        {/* Quote mark */}
        <div className="mb-3" aria-hidden="true">
          <Quote
            size={28}
            className="text-slate-200 dark:text-slate-700 group-hover:text-[#0a66c2]/30 dark:group-hover:text-[#70b5f9]/30 transition-colors duration-300 mx-auto"
            strokeWidth={1.5}
          />
        </div>

        {/* Testimonial text */}
        <div className="relative flex-1 w-full mb-4">
          <div
            ref={textRef}
            className={`text-[15px] leading-relaxed text-slate-600 dark:text-slate-300 transition-all duration-300 ${
              !expanded && needsTruncation ? 'line-clamp-4' : ''
            }`}
          >
            {content}
          </div>

          {!expanded && needsTruncation && (
            <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-white dark:from-[#111827] to-transparent pointer-events-none" />
          )}
        </div>

        {needsTruncation && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center gap-1 text-sm font-medium text-[#0a66c2] dark:text-[#70b5f9] hover:underline mb-4 transition-colors self-center cursor-pointer"
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

        {/* Badges row */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          {project && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
              {project}
              {projectUrl && (
                <ExternalLink size={10} className="opacity-50" aria-hidden="true" />
              )}
            </span>
          )}
          {relationship && (
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${getRelationshipStyle(relationship)}`}>
              {relationship}
            </span>
          )}
        </div>

        {/* Author info */}
        <div className="w-full pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {name}
            </h3>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0a66c2] dark:text-[#70b5f9]" aria-label="Verified professional recommendation">
              <BadgeCheck size={14} className="fill-[#0a66c2] dark:fill-[#70b5f9] text-white" aria-hidden="true" />
            </span>
          </div>
          <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-0.5">
            {role}{organization ? ' at ' : ''}
            {organizationUrl ? (
              <a
                href={organizationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-slate-700 dark:text-slate-300 hover:text-[#0a66c2] dark:hover:text-[#70b5f9] hover:underline transition-colors"
              >
                {organization}
              </a>
            ) : organization ? (
              <span className="font-medium text-slate-700 dark:text-slate-300">{organization}</span>
            ) : null}
          </p>
          {dateLabel && (
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              {dateLabel}
            </p>
          )}
        </div>

        {/* Rating stars */}
        <div className="flex items-center gap-0.5 mt-3" aria-label={`Rated ${displayRating} out of 5 stars`}>
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              size={14}
              className={i < displayRating
                ? 'fill-amber-400 text-amber-400'
                : 'fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700'
              }
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
    </motion.article>
  )
}
