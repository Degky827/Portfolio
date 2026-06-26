import { useRef, useState, useCallback, useMemo } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { Award, ExternalLink, Building2, Calendar } from 'lucide-react'

const SPRING_CONFIG = { stiffness: 300, damping: 30, mass: 0.5 }

function AwardBadge({ color, isHovered }) {
  return (
    <motion.div
      className="relative w-16 h-16 flex-shrink-0"
      animate={{
        rotateY: isHovered ? 360 : 0,
      }}
      transition={{
        duration: 2,
        ease: 'easeInOut',
        repeat: isHovered ? Infinity : 0,
      }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Outer glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          boxShadow: [
            `0 0 20px ${color}40, 0 0 40px ${color}20`,
            `0 0 30px ${color}60, 0 0 60px ${color}30`,
            `0 0 20px ${color}40, 0 0 40px ${color}20`,
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Metallic badge background */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `linear-gradient(135deg, ${color}30 0%, ${color}10 50%, ${color}30 100%)`,
          border: `2px solid ${color}50`,
        }}
      />
      
      {/* Inner seal */}
      <div
        className="absolute inset-1 rounded-full flex items-center justify-center"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${color}40 0%, ${color}15 100%)`,
          border: `1px solid ${color}30`,
        }}
      >
        <Award
          size={24}
          style={{ color }}
          className="drop-shadow-[0_0_8px_var(--tw-shadow-color)]"
        />
      </div>
      
      {/* Rotating ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-transparent"
        style={{
          borderTopColor: color,
          borderRightColor: `${color}40`,
        }}
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      
      {/* Particle dots */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            backgroundColor: color,
            top: '50%',
            left: '50%',
          }}
          animate={{
            x: [
              Math.cos((i * Math.PI * 2) / 6) * 30,
              Math.cos((i * Math.PI * 2) / 6 + Math.PI) * 30,
              Math.cos((i * Math.PI * 2) / 6) * 30,
            ],
            y: [
              Math.sin((i * Math.PI * 2) / 6) * 30,
              Math.sin((i * Math.PI * 2) / 6 + Math.PI) * 30,
              Math.sin((i * Math.PI * 2) / 6) * 30,
            ],
            opacity: [0.3, 0.8, 0.3],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.2,
          }}
        />
      ))}
    </motion.div>
  )
}

function GlowingSeal({ color }) {
  return (
    <motion.div
      className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center"
      style={{
        background: `radial-gradient(circle, ${color} 0%, ${color}60 50%, transparent 70%)`,
      }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.6, 1, 0.6],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <div
        className="w-5 h-5 rounded-full flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${color} 0%, ${color}80 100%)`,
        }}
      >
        <Award size={12} className="text-white" />
      </div>
    </motion.div>
  )
}

function LightSweep({ color, isHovered }) {
  return (
    <motion.div
      className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"
      style={{ zIndex: 5 }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(105deg, transparent 40%, ${color}20 45%, ${color}40 50%, ${color}20 55%, transparent 60%)`,
        }}
        animate={{
          x: isHovered ? ['-100%', '200%'] : '-100%',
        }}
        transition={{
          duration: 1.5,
          ease: 'easeInOut',
          repeat: isHovered ? Infinity : 0,
          repeatDelay: 0.5,
        }}
      />
    </motion.div>
  )
}

function HolographicBorder({ color, isHovered }) {
  return (
    <motion.div
      className="absolute inset-0 rounded-2xl pointer-events-none"
      style={{ zIndex: 4 }}
      animate={{
        opacity: isHovered ? 1 : 0.3,
      }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: `linear-gradient(135deg, ${color}60, transparent 30%, transparent 70%, ${color}60)`,
          padding: '1px',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
        }}
      />
      
      <motion.div
        className="absolute inset-0 rounded-2xl"
        animate={{
          background: [
            `conic-gradient(from 0deg, ${color}60, transparent 25%, ${color}40 50%, transparent 75%, ${color}60)`,
            `conic-gradient(from 360deg, ${color}60, transparent 25%, ${color}40 50%, transparent 75%, ${color}60)`,
          ],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          padding: '1px',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          opacity: isHovered ? 0.8 : 0.2,
        }}
      />
    </motion.div>
  )
}

function FloatingParticles({ color }) {
  const particles = useMemo(() => {
    return [...Array(8)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 3,
      delay: Math.random() * 2,
    }))
  }, [])

  return (
    <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none" style={{ zIndex: 3 }}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: color,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [-10, 10, -10],
            x: [-5, 5, -5],
            opacity: [0.2, 0.6, 0.2],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: particle.delay,
          }}
        />
      ))}
    </div>
  )
}

export default function CertificateCard3D({
  card,
  itemVariants,
  onCertClick,
  getMediaUrl,
  t,
  index = 0,
}) {
  const color = card.color
  const cardRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), SPRING_CONFIG)
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), SPRING_CONFIG)
  const translateZ = useSpring(isHovered ? 50 : 0, SPRING_CONFIG)
  const scale = useSpring(isHovered ? 1.02 : 1, SPRING_CONFIG)

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }, [mouseX, mouseY])

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    mouseX.set(0)
    mouseY.set(0)
  }, [mouseX, mouseY])

  const floatDelay = useMemo(() => index * 0.3, [index])

  return (
    <motion.div
      variants={itemVariants}
      style={{ perspective: '1500px' }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          translateZ,
          scale,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          y: {
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: floatDelay,
          },
        }}
        className="relative rounded-2xl overflow-hidden cursor-pointer group"
      >
        {/* Glass background with metallic gradient */}
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: `linear-gradient(145deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.08) 100%)`,
            backdropFilter: 'blur(20px)',
          }}
        />

        {/* Metallic reflection overlay */}
        <div
          className="absolute inset-0 rounded-2xl opacity-30"
          style={{
            background: `linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)`,
          }}
        />

        {/* Animated effects */}
        <FloatingParticles color={color} />
        <HolographicBorder color={color} isHovered={isHovered} />
        <LightSweep color={color} isHovered={isHovered} />

        {/* Neon glow */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          animate={{
            boxShadow: isHovered
              ? [
                  `0 0 30px ${color}40, 0 0 60px ${color}20, inset 0 0 30px ${color}10`,
                  `0 0 40px ${color}50, 0 0 80px ${color}30, inset 0 0 40px ${color}15`,
                  `0 0 30px ${color}40, 0 0 60px ${color}20, inset 0 0 30px ${color}10`,
                ]
              : `0 0 20px ${color}15, inset 0 0 20px ${color}05`,
          }}
          transition={{
            duration: 2,
            repeat: isHovered ? Infinity : 0,
            ease: 'easeInOut',
          }}
        />

        {/* Content */}
        <div className="relative z-10 p-5 sm:p-6">
          {/* Header with badge */}
          <div className="flex items-start gap-4 mb-5">
            <AwardBadge color={color} isHovered={isHovered} />
            <GlowingSeal color={color} />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-[10px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 rounded-full"
                  style={{
                    color,
                    backgroundColor: `${color}20`,
                    border: `1px solid ${color}30`,
                  }}
                >
                  {t('skills.certificateLabel')}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                {card.category}
              </h3>
              <p className="text-xs text-white/40 mt-1">
                {t('skills.certificateCount', { count: card.skills.length })}
              </p>
            </div>
          </div>

          {/* Certificate list */}
          <div className="space-y-2">
            {card.skills.map((cert, i) => (
              <motion.button
                key={cert._id}
                onClick={() => onCertClick(cert)}
                className="w-full text-left flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group/cert"
                style={{
                  background: `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)`,
                  border: `1px solid rgba(255,255,255,0.08)`,
                }}
                whileHover={{
                  background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
                  borderColor: `${color}40`,
                  x: 4,
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                {cert.icon ? (
                  <div className="relative flex-shrink-0">
                    <img
                      src={getMediaUrl(cert.icon)}
                      alt=""
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div
                      className="absolute inset-0 rounded-lg opacity-0 group-hover/cert:opacity-100 transition-opacity duration-300"
                      style={{
                        boxShadow: `0 0 15px ${color}40`,
                      }}
                    />
                  </div>
                ) : (
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${color}25 0%, ${color}10 100%)`,
                      border: `1px solid ${color}30`,
                    }}
                  >
                    <Award size={18} style={{ color }} />
                  </div>
                )}
                
                <div className="min-w-0 flex-1">
                  <span className="text-sm font-semibold text-white/80 group-hover/cert:text-white transition-colors duration-200 block truncate">
                    {cert.name}
                  </span>
                  {cert.issuer && (
                    <span className="text-[11px] text-white/40 block truncate mt-0.5">
                      {cert.issuer}
                    </span>
                  )}
                </div>
                
                <motion.div
                  className="flex-shrink-0 opacity-0 group-hover/cert:opacity-100 transition-opacity duration-200"
                  whileHover={{ scale: 1.2 }}
                >
                  <ExternalLink size={14} style={{ color }} />
                </motion.div>
              </motion.button>
            ))}
          </div>

          {/* Bottom stats */}
          <div className="mt-5 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: color }}
                  animate={{
                    boxShadow: [
                      `0 0 6px ${color}60`,
                      `0 0 12px ${color}90`,
                      `0 0 6px ${color}60`,
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                <span className="text-[11px] font-medium text-white/40 uppercase tracking-wider">
                  Certified
                </span>
              </div>
              
              <motion.div
                className="flex items-center gap-1 px-2 py-1 rounded-full"
                style={{
                  background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
                  border: `1px solid ${color}30`,
                }}
                animate={{
                  borderColor: [`${color}30`, `${color}50`, `${color}30`],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Award size={10} style={{ color }} />
                <span className="text-[10px] font-bold" style={{ color }}>
                  {card.skills.length}
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
