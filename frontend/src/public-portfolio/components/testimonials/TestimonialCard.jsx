import { motion, useReducedMotion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { getMediaUrl } from '../../../shared/services/api'

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
}

function getInitials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function RatingStars({ rating }) {
  if (!rating || rating < 1 || rating > 5) return null
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rating ? 'fill-amber-400 text-amber-400' : 'text-[var(--border-default)]'}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

export default function TestimonialCard({ testimonial, shouldReduceMotion }) {
  const prefersReducedMotion = useReducedMotion()
  const reduceMotion = shouldReduceMotion ?? prefersReducedMotion

  const {
    name,
    role,
    organization,
    relationship,
    avatar,
    content,
    project,
    rating,
    featured,
  } = testimonial

  const avatarUrl = avatar ? getMediaUrl(avatar) : null
  const initials = getInitials(name)

  return (
    <motion.article
      variants={itemVariants}
      whileHover={reduceMotion ? {} : { y: -4, transition: { duration: 0.2 } }}
      className={`
        group relative rounded-2xl bg-[var(--card-bg)] border p-5 sm:p-6
        transition-all duration-300
        ${featured
          ? 'border-[var(--accent-testimonials)]/30 shadow-lg shadow-[var(--accent-testimonials)]/5'
          : 'border-[var(--card-border)] shadow-[var(--card-shadow)]'
        }
        hover:border-[var(--accent-testimonials)]/40
        hover:shadow-[var(--card-shadow-hover)]
      `}
      aria-label={`Testimonial from ${name}`}
    >
      {featured && (
        <div className="absolute -top-px -left-px -right-px h-[2px] rounded-t-2xl bg-gradient-to-r from-transparent via-[var(--accent-testimonials)] to-transparent opacity-60" />
      )}

      <div className="flex items-start gap-4 mb-4">
        <div className="shrink-0">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={`${name}'s avatar`}
              className="w-11 h-11 rounded-full object-cover border-2 border-[var(--border-default)] group-hover:border-[var(--accent-testimonials)]/30 transition-colors"
              loading="lazy"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-[var(--surface)] border-2 border-[var(--border-default)] group-hover:border-[var(--accent-testimonials)]/30 flex items-center justify-center transition-colors">
              <span className="text-sm font-bold text-[var(--text-secondary)]">
                {initials}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-[var(--text-primary)] truncate">
            {name}
          </h3>
          <p className="text-xs text-[var(--text-secondary)] truncate mt-0.5">
            {role}{organization ? ` · ${organization}` : ''}
          </p>
        </div>

        <Quote
          size={20}
          className="shrink-0 text-[var(--accent-testimonials)] opacity-20 group-hover:opacity-40 transition-opacity"
          aria-hidden="true"
        />
      </div>

      <blockquote className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4 line-clamp-5">
        {content}
      </blockquote>

      <div className="flex items-center justify-between gap-2 pt-3 border-t border-[var(--border-subtle)]">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          {project && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-medium bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border-default)] truncate max-w-[180px]">
              {project}
            </span>
          )}
          {relationship && (
            <span className="text-[11px] text-[var(--text-tertiary)]">
              {relationship}
            </span>
          )}
        </div>
        <RatingStars rating={rating} />
      </div>
    </motion.article>
  )
}
