import { memo, useRef, useState, useCallback, useMemo } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'

/**
 * AboutGlassCard
 *
 * Premium futuristic 3D glass panel for the About section.
 *
 * Multi-layer structure:
 *   Layer 1: Outer metallic frame
 *   Layer 2: Glass panel
 *   Layer 3: Gradient overlay
 *   Layer 4: Inner shadow
 *   Layer 5: Content (icon + title + description)
 *   Layer 6: Animated neon border
 *
 * Props:
 *   icon         – React node (lucide icon)
 *   title        – Card heading string
 *   description  – Card body text (may contain HTML)
 *   accentColor  – Hex color for neon accents (default: '#8b5cf6')
 *   animationDelay – Stagger delay in seconds (default: 0)
 *   index        – Card index for numbering (default: 0)
 */
const AboutGlassCard = memo(function AboutGlassCard({
  icon,
  title,
  description,
  accentColor = '#8b5cf6',
  animationDelay = 0,
  index = 0,
}) {
  const cardRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)

  // Mouse-tracking values for subtle 3D rotation
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), {
    stiffness: 150,
    damping: 20,
  })
  const rotateZ = useSpring(useTransform(mouseX, [-0.5, 0.5], [-2, 2]), {
    stiffness: 150,
    damping: 20,
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

  // Neon border animation key (unique per card)
  const borderId = useMemo(() => `neon-border-${index}`, [index])

  // Clean HTML tags
  const cleanDescription = useMemo(() => {
    return description?.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() || ''
  }, [description])

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 50, scale: 0.95, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.6,
        delay: animationDelay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{
        y: -8,
        scale: 1.02,
        rotateX: -2,
        transition: { duration: 0.25, ease: 'easeOut' },
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onFocus={() => setIsHovered(true)}
      onBlur={handleMouseLeave}
      tabIndex={0}
      role="article"
      aria-label={title}
      className="group relative rounded-[20px] sm:rounded-[24px] cursor-default outline-none"
      style={{
        rotateX,
        rotateZ,
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
    >
      {/* ═══════════ LAYER 1: Outer Metallic Frame ═══════════ */}
      <div
        className="absolute -inset-[1px] rounded-[21px] sm:rounded-[25px] opacity-40 group-hover:opacity-70 transition-opacity duration-300"
        style={{
          background: `linear-gradient(135deg, ${accentColor}40, transparent 40%, transparent 60%, ${accentColor}30)`,
        }}
      />

      {/* ═══════════ LAYER 2: Glass Panel ═══════════ */}
      <div
        className="relative rounded-[20px] sm:rounded-[24px] overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, rgba(18,8,48,0.85), rgba(12,5,32,0.92))',
          backdropFilter: 'blur(24px) saturate(1.2)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.2)',
        }}
      >
        {/* ═══════════ LAYER 3: Gradient Overlay ═══════════ */}
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(135deg, ${accentColor}08 0%, transparent 40%, ${accentColor}05 100%)`,
          }}
        />

        {/* ═══════════ LAYER 4: Inner Shadow ═══════════ */}
        <div
          className="absolute inset-0 rounded-[20px] sm:rounded-[24px] pointer-events-none"
          style={{
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.04), inset 0 -1px 0 rgba(0,0,0,0.2)',
          }}
        />

        {/* ═══════════ LAYER 5: Content ═══════════ */}
        <div className="relative z-10 p-6 sm:p-7 md:p-8">
          <div className="flex items-start gap-4 sm:gap-5">
            {/* Icon Container */}
            <div className="shrink-0 relative">
              {/* Icon box glow */}
              <div
                className="absolute -inset-2 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md"
                style={{ background: `${accentColor}20` }}
              />
              {/* Icon box */}
              <div
                className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl transition-all duration-300 group-hover:scale-110"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}18, ${accentColor}08)`,
                  border: `1px solid ${accentColor}30`,
                  boxShadow: `0 4px 16px ${accentColor}15, inset 0 1px 0 rgba(255,255,255,0.05)`,
                }}
              >
                <div
                  className="text-lg sm:text-xl transition-all duration-300 group-hover:scale-110"
                  style={{ color: accentColor, filter: `drop-shadow(0 0 6px ${accentColor}60)` }}
                >
                  {icon}
                </div>
              </div>
            </div>

            {/* Text Content */}
            <div className="flex-1 min-w-0">
              <h3
                className="text-lg sm:text-xl md:text-[22px] font-bold mb-2 sm:mb-3 leading-tight font-display transition-all duration-300"
                style={{
                  color: '#f1f5f9',
                  textShadow: isHovered ? `0 0 20px ${accentColor}40` : 'none',
                }}
              >
                {title}
              </h3>

              <p className="text-sm sm:text-[15px] leading-relaxed sm:leading-[1.7] text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
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

        {/* ═══════════ LAYER 6: Animated Neon Border ═══════════ */}
        <div className="absolute inset-0 rounded-[20px] sm:rounded-[24px] pointer-events-none overflow-hidden">
          {/* Top border glow */}
          <div
            className="absolute top-0 left-0 right-0 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `linear-gradient(90deg, transparent, ${accentColor}80, transparent)`,
            }}
          />
          {/* Bottom border glow */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[1px] opacity-20 group-hover:opacity-50 transition-opacity duration-500"
            style={{
              background: `linear-gradient(90deg, transparent, ${accentColor}50, transparent)`,
            }}
          />
          {/* Left border glow */}
          <div
            className="absolute top-0 bottom-0 left-0 w-[1px] opacity-20 group-hover:opacity-60 transition-opacity duration-500"
            style={{
              background: `linear-gradient(180deg, ${accentColor}60, transparent 50%, ${accentColor}30)`,
            }}
          />
          {/* Right border glow */}
          <div
            className="absolute top-0 bottom-0 right-0 w-[1px] opacity-10 group-hover:opacity-40 transition-opacity duration-500"
            style={{
              background: `linear-gradient(180deg, transparent, ${accentColor}40 50%, transparent)`,
            }}
          />

          {/* Pulsing neon border overlay */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
            <defs>
              <linearGradient id={`${borderId}-grad`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={accentColor} stopOpacity="0" />
                <stop offset="50%" stopColor={accentColor} stopOpacity="0.6" />
                <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
              </linearGradient>
            </defs>
            <rect
              x="0.5"
              y="0.5"
              width="calc(100% - 1px)"
              height="calc(100% - 1px)"
              rx="20"
              ry="20"
              fill="none"
              stroke={`url(#${borderId}-grad)`}
              strokeWidth="1"
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                animation: 'neonPulse 3s ease-in-out infinite',
                animationDelay: `${index * 0.5}s`,
              }}
            />
          </svg>
        </div>

        {/* ═══════════ Reflection Sweep ═══════════ */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden rounded-[20px] sm:rounded-[24px]"
          aria-hidden="true"
        >
          <div
            className="absolute -top-full -left-full w-[200%] h-[200%] opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{
              background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.03) 45%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 55%, transparent 60%)',
              animation: 'reflectionSweep 4s ease-in-out infinite',
              animationDelay: `${index * 0.8}s`,
            }}
          />
        </div>

        {/* ═══════════ Bottom Shadow ═══════════ */}
        <div
          className="absolute -bottom-2 left-[10%] right-[10%] h-4 rounded-[20px] opacity-0 group-hover:opacity-60 transition-all duration-300 blur-lg pointer-events-none"
          style={{ background: `${accentColor}30` }}
        />
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes neonPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        @keyframes reflectionSweep {
          0% { transform: translateX(-30%) translateY(-30%) rotate(25deg); }
          100% { transform: translateX(30%) translateY(30%) rotate(25deg); }
        }
      `}</style>
    </motion.article>
  )
})

export default AboutGlassCard
