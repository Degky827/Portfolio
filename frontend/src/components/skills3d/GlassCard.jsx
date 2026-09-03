import { useRef, useState, useCallback, useMemo } from 'react'
import { motion, useMotionValue, useTransform, useSpring, useMotionTemplate, AnimatePresence } from 'framer-motion'
import { Code2, Award } from 'lucide-react'
import AnimatedSkillIcon from './AnimatedSkillIcon'
import CertificateCard3D from './CertificateCard3D'

const SPRING_CONFIG = { stiffness: 300, damping: 30, mass: 0.5 }

export default function GlassCard({
  card,
  itemVariants,
  onCertClick,
  SkillIcon,
  getMediaUrl,
  index = 0,
}) {
  const color = card.color
  const cardRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), SPRING_CONFIG)
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), SPRING_CONFIG)
  const translateZ = useSpring(isHovered ? 30 : 0, SPRING_CONFIG)
  const glareX = useSpring(useTransform(mouseX, [-0.5, 0.5], [0, 100]), SPRING_CONFIG)
  const glareY = useSpring(useTransform(mouseY, [-0.5, 0.5], [0, 100]), SPRING_CONFIG)
  const glareBg = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.15) 0%, transparent 60%)`

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

  const floatDelay = useMemo(() => index * 0.4, [index])

  if (card.type === 'certificates') {
    return (
      <CertificateCard3D
        card={card}
        itemVariants={itemVariants}
        onCertClick={onCertClick}
        getMediaUrl={getMediaUrl}
        index={index}
      />
    )
  }

  return (
    <motion.div
      variants={itemVariants}
      custom={index}
      style={{ perspective: '1200px' }}
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
          transformStyle: 'preserve-3d',
        }}
        animate={{
          y: [0, -6, 0],
        }}
        transition={{
          y: {
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: floatDelay,
          },
        }}
        className="relative rounded-2xl overflow-hidden cursor-pointer group"
      >
        {/* Animated border */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(135deg, ${color}40, transparent 40%, transparent 60%, ${color}40)`,
            padding: '1px',
          }}
        />

        {/* Glass background */}
        <div className="absolute inset-0 rounded-2xl backdrop-blur-xl" style={{ background: 'linear-gradient(135deg, var(--surface-glass), var(--surface))' }} />

        {/* Card border */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ border: '1px solid var(--border-default)', opacity: 0.5 }}
        />

        {/* Neon edge glow */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            boxShadow: `inset 0 0 30px ${color}15, 0 0 20px ${color}20, 0 0 40px ${color}10`,
          }}
        />

        {/* Glare effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none"
          style={{ background: glareBg }}
        />

        {/* Breathing glow */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          animate={{
            boxShadow: [
              `0 0 20px ${color}10, inset 0 0 20px ${color}05`,
              `0 0 30px ${color}20, inset 0 0 30px ${color}10`,
              `0 0 20px ${color}10, inset 0 0 20px ${color}05`,
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: floatDelay,
          }}
        />

        {/* Content */}
        <div className="relative z-10 p-5 sm:p-6 flex flex-col flex-1">
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                color,
                backgroundColor: `${color}15`,
                boxShadow: `0 0 20px ${color}30`,
              }}
              animate={{
                boxShadow: [
                  `0 0 15px ${color}20`,
                  `0 0 25px ${color}40`,
                  `0 0 15px ${color}20`,
                ],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: floatDelay,
              }}
            >
              <Code2 size={20} />
            </motion.div>
            <h3 className="text-sm sm:text-base font-bold tracking-wide transition-all duration-300"
              style={{ color: 'var(--text-primary)' }}
            >
              {card.category}
            </h3>
          </div>

          <div className="space-y-2.5 flex-1">
            {card.skills.map((skill, i) => (
              <div
                key={skill._id}
                className="flex items-center gap-2.5 group/skill cursor-pointer"
              >
                <div className="relative flex-shrink-0 group-hover/skill:scale-110 transition-transform duration-200">
                  <AnimatedSkillIcon
                    skill={skill}
                    size={20}
                    color={color}
                    className="group-hover/skill:drop-shadow-[0_0_8px_var(--tw-shadow-color)]"
                  />
                </div>
                <span className="text-sm font-medium leading-tight group-hover:text-[var(--text-primary)] transition-colors duration-200" style={{ color: 'var(--text-secondary)' }}>
                  {skill.name}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t" style={{ borderColor: 'var(--border-default)' }}>
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
            <span className="text-[11px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
              {card.skills.length} {card.skills.length === 1 ? 'skill' : 'skills'}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
