import { memo, useRef, useState, useCallback } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { Award } from 'lucide-react'

/**
 * CertificateCard
 *
 * Premium 3D floating glass frame for certificates:
 * - Glassmorphism surface
 * - Soft neon glow (cyan / violet)
 * - 3D rotation variation per item (-10° to +10°)
 * - Hover: scale 1.08, lift -10px, glow increase
 * - Staggered fade-in + zoom-in from depth on scroll
 * - Reflection highlight
 */
const CertificateCard = memo(function CertificateCard({
  title,
  verificationUrl,
  index = 0,
  total = 1,
}) {
  const cardRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)

  // Calculate rotation variation based on position
  const rotationBase = ((index - (total - 1) / 2) / total) * 12
  const rotationZ = rotationBase * 0.8
  const rotationY = rotationBase * 0.5

  // Mouse-tracking for subtle 3D rotation
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [3, -3]), {
    stiffness: 120,
    damping: 18,
  })
  const rotateZSpring = useSpring(rotationZ, {
    stiffness: 80,
    damping: 12,
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

  // Staggered animation delay
  const staggerDelay = index * 0.1

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 60, scale: 0.85, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.7,
        delay: staggerDelay,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{
        y: -10,
        scale: 1.08,
        transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onFocus={() => setIsHovered(true)}
      onBlur={handleMouseLeave}
      tabIndex={0}
      role="article"
      aria-label={title}
      className="group relative cursor-default outline-none"
      style={{
        rotateX,
        rotateZ: rotateZSpring,
        transformStyle: 'preserve-3d',
        perspective: '800px',
      }}
    >
      {/* ═══════════ Glass Frame ═══════════ */}
      <div
        className="relative rounded-[16px] sm:rounded-[20px] overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, rgba(18,12,50,0.85), rgba(10,6,30,0.92))',
          border: '1px solid rgba(139,92,246,0.2)',
          boxShadow: isHovered
            ? '0 20px 50px rgba(0,0,0,0.5), 0 0 40px rgba(139,92,246,0.15), inset 0 1px 0 rgba(255,255,255,0.06)'
            : '0 8px 30px rgba(0,0,0,0.3), 0 0 20px rgba(139,92,246,0.08), inset 0 1px 0 rgba(255,255,255,0.04)',
          transition: 'box-shadow 0.3s ease',
        }}
      >
        {/* ═══════════ Content ═══════════ */}
        <div className="relative z-10 p-5 sm:p-6 md:p-7">
          {/* Icon */}
          <div className="flex items-center justify-center mb-3">
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(34,211,238,0.15), rgba(139,92,246,0.1))',
                border: '1px solid rgba(34,211,238,0.25)',
                boxShadow: isHovered
                  ? '0 0 20px rgba(34,211,238,0.3), 0 4px 12px rgba(0,0,0,0.3)'
                  : '0 0 10px rgba(34,211,238,0.15), 0 2px 8px rgba(0,0,0,0.2)',
              }}
            >
              <Award
                size={18}
                className="text-cyan-400 transition-all duration-300"
                style={{
                  filter: isHovered ? 'drop-shadow(0 0 8px rgba(34,211,238,0.6))' : 'none',
                }}
              />
            </div>
          </div>

          {/* Title */}
          <h3
            className="text-sm sm:text-base md:text-lg font-bold text-center leading-tight transition-all duration-300"
            style={{
              color: isHovered ? '#e2e8f0' : '#cbd5e1',
              textShadow: isHovered ? '0 0 16px rgba(34,211,238,0.3)' : 'none',
            }}
          >
            {title}
          </h3>

          {/* Link indicator */}
          {verificationUrl && (
            <div className="mt-3 flex justify-center">
              <span
                className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.15em] px-3 py-1 rounded-full transition-all duration-300"
                style={{
                  color: '#22d3ee',
                  background: 'rgba(34,211,238,0.08)',
                  border: '1px solid rgba(34,211,238,0.2)',
                  boxShadow: isHovered ? '0 0 12px rgba(34,211,238,0.2)' : 'none',
                }}
              >
                View Certificate
              </span>
            </div>
          )}
        </div>

        {/* ═══════════ Neon Border Pulse ═══════════ */}
        <div className="absolute inset-0 rounded-[16px] sm:rounded-[20px] pointer-events-none overflow-hidden">
          <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
            <defs>
              <linearGradient id={`cert-border-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
                <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
              </linearGradient>
            </defs>
            <rect
              x="0.5"
              y="0.5"
              width="calc(100% - 1px)"
              height="calc(100% - 1px)"
              rx="16"
              ry="16"
              fill="none"
              stroke={`url(#cert-border-${index})`}
              strokeWidth="1"
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                animation: 'certBorderPulse 3s ease-in-out infinite',
                animationDelay: `${index * 0.4}s`,
              }}
            />
          </svg>
        </div>

        {/* ═══════════ Reflection Sweep ═══════════ */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden rounded-[16px] sm:rounded-[20px]"
          aria-hidden="true"
        >
          <div
            className="absolute -top-full -left-full w-[200%] h-[200%] opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{
              background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.03) 45%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 55%, transparent 60%)',
              animation: 'certReflectionSweep 6s ease-in-out infinite',
              animationDelay: `${index * 0.8}s`,
            }}
          />
        </div>

        {/* ═══════════ Top Glow ═══════════ */}
        <div
          className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.5), rgba(139,92,246,0.4), transparent)',
          }}
        />
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes certBorderPulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.7; }
        }
        @keyframes certReflectionSweep {
          0% { transform: translateX(-30%) translateY(-30%) rotate(25deg); }
          100% { transform: translateX(30%) translateY(30%) rotate(25deg); }
        }
      `}</style>
    </motion.article>
  )
})

export default CertificateCard
