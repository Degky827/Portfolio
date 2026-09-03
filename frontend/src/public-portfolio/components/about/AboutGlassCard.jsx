import { memo, useRef, useState, useCallback, useMemo } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'

/**
 * AboutGlassCard
 *
 * Clean, professional card for the About section.
 *
 * Clean design with:
 *   - Solid card background
 *   - Subtle border
 *   - Clean hover effects
 *   - Subtle 3D tilt on mouse move
 *   - Icon + title + description
 *
 * Props:
 *   icon         – React node (lucide icon)
 *   title        – Card heading string
 *   description  – Card body text (may contain HTML)
 *   accentColor  – Hex color for subtle accents (default: '#6366f1')
 *   animationDelay – Stagger delay in seconds (default: 0)
 *   index        – Card index for numbering (default: 0)
 *   shouldReduceMotion – Disable entrance animation (default: false)
 */
const AboutGlassCard = memo(function AboutGlassCard({
  icon,
  title,
  description,
  accentColor = '#6366f1',
  animationDelay = 0,
  index = 0,
  shouldReduceMotion = false,
}) {
  const cardRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)

  // Mouse-tracking values for subtle 3D rotation
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [3, -3]), {
    stiffness: 100,
    damping: 15,
  })
  const rotateZ = useSpring(useTransform(mouseX, [-0.5, 0.5], [-1.5, 1.5]), {
    stiffness: 100,
    damping: 15,
  })

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }, [mouseX, mouseY])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    mouseX.set(0)
    mouseY.set(0)
  }, [mouseX, mouseY])

  // Clean HTML tags
  const cleanDescription = useMemo(() => {
    return description?.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() || ''
  }, [description])

  // Calculate alternating slide direction: even indices slide from left, odd from right
  const slideDirection = index % 2 === 0 ? -40 : 40

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, x: shouldReduceMotion ? 0 : slideDirection, y: 0 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 15,
        delay: animationDelay,
      }}
      whileHover={{
        y: -6,
        scale: 1.01,
        rotateX: -1,
        transition: { duration: 0.2, ease: 'easeOut' },
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onFocus={() => setIsHovered(true)}
      onBlur={handleMouseLeave}
      tabIndex={0}
      role="article"
      aria-label={title}
      className="group relative rounded-xl sm:rounded-2xl cursor-default outline-none"
      style={{
        rotateX,
        rotateZ,
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
    >
      {/* Clean Card Background */}
      <div
        className="relative rounded-xl sm:rounded-2xl overflow-hidden"
        style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          boxShadow: 'var(--card-shadow)',
          transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
        }}
      >
        {/* Subtle hover overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `rgba(99, 102, 241, 0.02)`,
          }}
        />

        {/* Inner highlight */}
        <div
          className="absolute inset-0 rounded-xl sm:rounded-2xl pointer-events-none"
          style={{
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -1px 0 rgba(0,0,0,0.03)',
          }}
        />

        {/* Content */}
        <div className="relative z-10 p-6 sm:p-7 md:p-8">
          <div className="flex items-start gap-4 sm:gap-5">
            {/* Icon Container */}
            <div className="shrink-0 relative">
              {/* Icon box */}
              <div
                className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl transition-all duration-300 group-hover:scale-105"
                style={{
                  background: `rgba(99, 102, 241, 0.08)`,
                  border: `1px solid rgba(99, 102, 241, 0.15)`,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                }}
              >
                <div
                  className="text-lg sm:text-xl transition-all duration-300 group-hover:scale-105"
                  style={{ color: accentColor }}
                >
                  {icon}
                </div>
              </div>
            </div>

            {/* Text Content */}
            <div className="flex-1 min-w-0">
              <h3
                className="text-lg sm:text-xl md:text-[22px] font-bold mb-2 sm:mb-3 leading-tight font-display transition-all duration-300 group-hover:tracking-wide"
                style={{ color: 'var(--text-primary)', opacity: 0.65 }}
              >
                {title}
              </h3>

              <p className="text-sm sm:text-[15px] leading-relaxed sm:leading-[1.7] transition-all duration-300 group-hover:opacity-100" style={{ color: 'var(--text-secondary)', opacity: 0.5 }}>
                {cleanDescription}
              </p>
            </div>
          </div>

          {/* Card index indicator */}
          <div className="absolute top-4 right-5 sm:top-5 sm:right-6">
            <span
              className="text-[11px] font-mono font-bold tracking-wider opacity-20 group-hover:opacity-40 transition-opacity duration-300"
              style={{ color: accentColor }}
            >
              {`0${index + 1}`}
            </span>
          </div>
        </div>

        {/* Subtle border accent on hover */}
        <div className="absolute inset-0 rounded-xl sm:rounded-2xl pointer-events-none overflow-hidden">
          <div
            className="absolute top-0 left-0 right-0 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `rgba(99, 102, 241, 0.3)`,
            }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-[1px] opacity-0 group-hover:opacity-50 transition-opacity duration-300"
            style={{
              background: `rgba(99, 102, 241, 0.15)`,
            }}
          />
        </div>
      </div>
    </motion.article>
  )
})

export default AboutGlassCard
