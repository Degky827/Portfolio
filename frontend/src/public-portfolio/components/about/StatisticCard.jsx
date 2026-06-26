import { memo, useRef, useState, useCallback, useMemo } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import StatisticIcon from './StatisticIcon'
import StatisticCounter from './StatisticCounter'

/**
 * StatisticCard
 *
 * Premium futuristic dashboard module with:
 * - Glass surface
 * - Metallic frame
 * - Visible depth
 * - Purple/blue edge lighting
 * - Animated neon border
 * - Moving reflection
 * - Hover effects (lift, glow, scale)
 * - Mouse-reactive rotation (max 3°)
 */
const StatisticCard = memo(function StatisticCard({
  icon,
  title,
  value,
  color = '#8b5cf6',
  animationDelay = 0,
  index = 0,
}) {
  const cardRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)

  // Mouse-tracking for subtle 3D rotation
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [2, -2]), {
    stiffness: 120,
    damping: 18,
  })
  const rotateZ = useSpring(useTransform(mouseX, [-0.5, 0.5], [-1.5, 1.5]), {
    stiffness: 120,
    damping: 18,
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

  const borderId = useMemo(() => `stat-border-${index}`, [index])

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 40, scale: 0.95, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{
        duration: 0.6,
        delay: animationDelay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{
        y: -6,
        scale: 1.03,
        transition: { duration: 0.25, ease: 'easeOut' },
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onFocus={() => setIsHovered(true)}
      onBlur={handleMouseLeave}
      tabIndex={0}
      role="article"
      aria-label={`${title}: ${value}`}
      className="group relative rounded-[18px] sm:rounded-[22px] cursor-default outline-none"
      style={{
        rotateX,
        rotateZ,
        transformStyle: 'preserve-3d',
        perspective: '800px',
      }}
    >
      {/* ═══════════ Outer Metallic Frame ═══════════ */}
      <div
        className="absolute -inset-[1px] rounded-[19px] sm:rounded-[23px] opacity-30 group-hover:opacity-60 transition-opacity duration-300"
        style={{
          background: `linear-gradient(145deg, ${color}30, transparent 50%, ${color}20)`,
        }}
      />

      {/* ═══════════ Glass Surface ═══════════ */}
      <div
        className="relative rounded-[18px] sm:rounded-[22px] overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, rgba(18,10,50,0.85), rgba(12,6,35,0.92))',
          backdropFilter: 'blur(20px) saturate(1.1)',
          WebkitBackdropFilter: 'blur(20px) saturate(1.1)',
        }}
      >
        {/* ═══════════ Inner Gradient ═══════════ */}
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(135deg, ${color}06, transparent 50%, ${color}04)`,
          }}
        />

        {/* ═══════════ Content ═══════════ */}
        <div className="relative z-10 flex flex-col items-center py-6 sm:py-7 md:py-8 px-4 sm:px-6">
          {/* Icon */}
          <div className="mb-3 sm:mb-4">
            <StatisticIcon icon={icon} color={color} delay={index * 0.3} />
          </div>

          {/* Animated Number */}
          <div className="mb-2 sm:mb-3">
            <span
              className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight transition-all duration-300"
              style={{
                color: '#f8fafc',
                textShadow: isHovered ? `0 0 20px ${color}40` : 'none',
              }}
            >
              <StatisticCounter value={value} color="#f8fafc" />
            </span>
          </div>

          {/* Title */}
          <h3
            className="text-[11px] sm:text-xs md:text-sm font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-center leading-tight transition-colors duration-300"
            style={{ color: `${color}cc` }}
          >
            {title}
          </h3>
        </div>

        {/* ═══════════ Neon Border Pulse ═══════════ */}
        <div className="absolute inset-0 rounded-[18px] sm:rounded-[22px] pointer-events-none overflow-hidden">
          <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
            <defs>
              <linearGradient id={`${borderId}-grad`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={color} stopOpacity="0" />
                <stop offset="50%" stopColor={color} stopOpacity="0.5" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
              </linearGradient>
            </defs>
            <rect
              x="0.5"
              y="0.5"
              width="calc(100% - 1px)"
              height="calc(100% - 1px)"
              rx="18"
              ry="18"
              fill="none"
              stroke={`url(#${borderId}-grad)`}
              strokeWidth="1"
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                animation: 'statNeonPulse 3s ease-in-out infinite',
                animationDelay: `${index * 0.4}s`,
              }}
            />
          </svg>
        </div>

        {/* ═══════════ Reflection Sweep ═══════════ */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden rounded-[18px] sm:rounded-[22px]"
          aria-hidden="true"
        >
          <div
            className="absolute -top-full -left-full w-[200%] h-[200%] opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{
              background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.03) 45%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 55%, transparent 60%)',
              animation: 'statReflectionSweep 5s ease-in-out infinite',
              animationDelay: `${index * 0.7}s`,
            }}
          />
        </div>

        {/* ═══════════ Bottom Shadow ═══════════ */}
        <div
          className="absolute -bottom-3 left-[15%] right-[15%] h-6 rounded-[18px] opacity-0 group-hover:opacity-50 transition-all duration-300 blur-lg pointer-events-none"
          style={{ background: `${color}25` }}
        />
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes statNeonPulse {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 0.7; }
        }
        @keyframes statReflectionSweep {
          0% { transform: translateX(-30%) translateY(-30%) rotate(25deg); }
          100% { transform: translateX(30%) translateY(30%) rotate(25deg); }
        }
      `}</style>
    </motion.article>
  )
})

export default StatisticCard
