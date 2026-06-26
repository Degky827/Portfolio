import { useRef, useState, useCallback, useMemo } from 'react'
import { motion, useMotionValue, useTransform, useSpring, useMotionTemplate } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import HolographicBadge from '../HolographicBadge'
import FuturisticButton from './FuturisticButton'

const SPRING = { stiffness: 300, damping: 30, mass: 0.5 }

const GithubIcon = ({ size = 16, className = '' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
  </svg>
)

const DEFAULT_THUMBNAIL = 'https://placehold.co/600x400/0f172a/475569?text=Project'

const statusColorMap = {
  completed: '#10b981',
  in_progress: '#f59e0b',
  planned: '#3b82f6',
}

function MonitorFrame({ children, color, isHovered, mouseX, mouseY }) {
  const reflectionX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-25, 25]), SPRING)
  const reflectionY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-18, 18]), SPRING)
  const reflectionBg = useMotionTemplate`radial-gradient(ellipse at calc(50% + ${reflectionX}px) calc(30% + ${reflectionY}px), rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.04) 30%, transparent 60%)`
  const edgeGlow = useMotionTemplate`radial-gradient(ellipse at calc(50% + ${reflectionX}px) calc(50% + ${reflectionY}px), ${color}18 0%, transparent 50%)`

  return (
    <div className="relative" style={{ perspective: '1200px' }}>
      {/* Monitor shadow on surface */}
      <motion.div
        className="absolute -bottom-6 left-[8%] right-[8%] h-8 rounded-[50%] blur-2xl"
        style={{ background: `radial-gradient(ellipse, ${color}35 0%, transparent 70%)` }}
        animate={{
          opacity: isHovered ? 0.9 : 0.35,
          scaleX: isHovered ? 1.15 : 0.85,
          y: isHovered ? 6 : 0,
        }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />

      {/* Ambient glow behind monitor */}
      <motion.div
        className="absolute -inset-8 rounded-3xl pointer-events-none"
        style={{
          background: `radial-gradient(ellipse, ${color}10 0%, transparent 70%)`,
        }}
        animate={{ opacity: isHovered ? 1 : 0.3 }}
        transition={{ duration: 0.6 }}
      />

      {/* Monitor body */}
      <motion.div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(165deg, #1c1c34 0%, #0e0e1c 40%, #141428 70%, #1a1a30 100%)',
          border: `1.5px solid ${isHovered ? `${color}30` : 'rgba(255,255,255,0.07)'}`,
          boxShadow: isHovered
            ? `0 35px 90px rgba(0,0,0,0.65), 0 0 50px ${color}18, 0 0 100px ${color}08, inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.3)`
            : '0 12px 45px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.2)',
        }}
        transition={{ duration: 0.4 }}
      >
        {/* Top bezel with camera dot */}
        <div className="relative h-4 sm:h-5 bg-gradient-to-b from-[#1e1e32] to-[#14142a] flex items-center justify-center border-b border-white/5">
          <motion.div
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: isHovered
                ? `radial-gradient(circle, ${color} 0%, ${color}60 100%)`
                : 'radial-gradient(circle, #4a4a6a 0%, #2a2a3a 100%)',
              boxShadow: isHovered ? `0 0 8px ${color}60` : 'none',
            }}
            animate={{ opacity: isHovered ? [0.6, 1, 0.6] : 0.4 }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>

        {/* Screen area */}
        <div className="relative bg-[#050510] aspect-[16/10] overflow-hidden">
          {/* Screen content */}
          <div className="absolute inset-0">
            {children}
          </div>

          {/* Screen reflection overlay */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              background: isHovered
                ? reflectionBg
                : 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 35%)',
            }}
          />

          {/* Edge glow */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-20"
            animate={{
              boxShadow: isHovered
                ? `inset 0 0 40px ${color}12, inset 0 0 80px ${color}06, inset 0 1px 0 rgba(255,255,255,0.08)`
                : 'inset 0 0 0px transparent',
            }}
            transition={{ duration: 0.5 }}
          />

          {/* Holographic color shift on hover */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-20 mix-blend-overlay"
            style={{ background: edgeGlow }}
            animate={{ opacity: isHovered ? 0.6 : 0 }}
            transition={{ duration: 0.4 }}
          />

          {/* Fine scanlines */}
          <div
            className="absolute inset-0 pointer-events-none z-20 opacity-[0.02]"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.4) 1px, rgba(0,0,0,0.4) 2px)',
            }}
          />

          {/* Screen glare line */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-20"
            animate={{ opacity: isHovered ? 0.12 : 0.04 }}
            style={{
              background: 'linear-gradient(120deg, transparent 25%, rgba(255,255,255,0.06) 42%, rgba(255,255,255,0.1) 44%, rgba(255,255,255,0.06) 46%, transparent 65%)',
            }}
          />
        </div>

        {/* Bottom bezel with status LED */}
        <div className="relative h-5 sm:h-6 bg-gradient-to-t from-[#1a1a30] to-[#141428] flex items-center justify-center border-t border-white/[0.04]">
          <div className="flex items-center gap-2">
            <motion.div
              className="w-1.5 h-1.5 rounded-full"
              animate={{
                backgroundColor: isHovered ? color : '#3a3a5a',
                boxShadow: isHovered ? `0 0 8px ${color}80, 0 0 16px ${color}40` : '0 0 0px transparent',
              }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="w-1 h-1 rounded-full"
              animate={{
                backgroundColor: isHovered ? '#4ade80' : '#2a2a3a',
                boxShadow: isHovered ? '0 0 6px #4ade8060' : 'none',
              }}
              transition={{ duration: 0.3, delay: 0.1 }}
            />
          </div>
        </div>
      </motion.div>

      {/* Monitor stand neck */}
      <div className="flex justify-center">
        <div
          className="w-10 h-7"
          style={{
            background: 'linear-gradient(180deg, #1a1a30 0%, #10101e 100%)',
            borderLeft: '1px solid rgba(255,255,255,0.04)',
            borderRight: '1px solid rgba(255,255,255,0.04)',
          }}
        />
      </div>

      {/* Monitor stand base */}
      <div className="flex justify-center">
        <motion.div
          className="h-2.5 rounded-b-xl"
          style={{
            width: '55%',
            background: 'linear-gradient(180deg, #1a1a30 0%, #0e0e1c 100%)',
            border: '1px solid rgba(255,255,255,0.04)',
            borderTop: 'none',
          }}
          animate={{
            boxShadow: isHovered ? `0 6px 25px ${color}12, 0 2px 8px rgba(0,0,0,0.4)` : '0 3px 10px rgba(0,0,0,0.35)',
          }}
        />
      </div>
    </div>
  )
}

function ScreenContent({ thumbUrl, title, isHovered, getMediaUrl }) {
  return (
    <div className="relative w-full h-full bg-[#060612]">
      {/* Project screenshot */}
      <img
        src={thumbUrl ? getMediaUrl(thumbUrl) : DEFAULT_THUMBNAIL}
        alt={title}
        className="w-full h-full object-cover transition-all duration-700"
        style={{
          transform: isHovered ? 'scale(1.06)' : 'scale(1)',
          filter: isHovered ? 'brightness(1.1) contrast(1.05)' : 'brightness(0.95)',
        }}
        onError={(e) => { e.target.src = DEFAULT_THUMBNAIL }}
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/25" />

      {/* Color tint overlay on hover */}
      <motion.div
        className="absolute inset-0 mix-blend-overlay"
        animate={{ opacity: isHovered ? 0.08 : 0 }}
        transition={{ duration: 0.5 }}
      />

      {/* CRT scanlines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)',
        }}
      />
    </div>
  )
}

export default function ProjectMonitorCard({ project, index, shouldReduceMotion, getMediaUrl: getMediaUrlFn }) {
  const cardRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), SPRING)
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), SPRING)
  const translateZ = useSpring(isHovered ? 30 : 0, SPRING)
  const scale = useSpring(isHovered ? 1.02 : 1, SPRING)

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }, [mouseX, mouseY])

  const handleMouseEnter = useCallback(() => setIsHovered(true), [])
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    mouseX.set(0)
    mouseY.set(0)
  }, [mouseX, mouseY])

  const color = project.color || statusColorMap[project.status] || '#6366f1'
  const title = project.title || ''
  const desc = project.shortDescription || project.description || ''
  const techs = project.technologies || project.tags || []
  const liveUrl = project.liveDemoUrl || project.liveUrl || '#'
  const repoUrl = project.githubUrl || project.repoUrl || ''
  const thumbUrl = project.thumbnail || (project.images && project.images[0]) || ''
  const status = project.status || null
  const floatDelay = useMemo(() => index * 0.5, [index])

  return (
    <motion.div
      ref={cardRef}
      variants={{
        hidden: { y: shouldReduceMotion ? 0 : 40, opacity: 0, rotateX: shouldReduceMotion ? 0 : 10 },
        visible: {
          y: 0,
          opacity: 1,
          rotateX: 0,
          transition: {
            type: shouldReduceMotion ? 'tween' : 'spring',
            stiffness: 80,
            damping: 15,
            delay: index * 0.1,
          },
        },
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        translateZ,
        scale,
        transformStyle: 'preserve-3d',
        perspective: '1200px',
      }}
      animate={{ y: [0, -6, 0] }}
      transition={{
        y: { duration: 5 + index * 0.3, repeat: Infinity, ease: 'easeInOut', delay: floatDelay },
      }}
      className="group relative cursor-pointer"
    >
      {/* Card container */}
      <div
        className="relative rounded-2xl overflow-hidden p-4 sm:p-5 transition-all duration-500"
        style={{
          background: isHovered
            ? `linear-gradient(165deg, ${color}06 0%, rgba(255,255,255,0.05) 30%, rgba(255,255,255,0.03) 60%, ${color}04 100%)`
            : 'linear-gradient(165deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.01) 100%)',
          backdropFilter: 'blur(24px)',
          border: `1px solid ${isHovered ? `${color}28` : 'rgba(255,255,255,0.05)'}`,
          boxShadow: isHovered
            ? `0 20px 60px rgba(0,0,0,0.3), 0 0 30px ${color}08`
            : '0 8px 32px rgba(0,0,0,0.2)',
        }}
      >
        {/* Ambient glow */}
        <motion.div
          className="absolute -top-24 -right-24 w-48 h-48 rounded-full pointer-events-none z-0"
          style={{
            background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`,
            filter: 'blur(40px)',
          }}
          animate={{ opacity: isHovered ? [0.4, 0.7, 0.4] : 0.1 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Holographic border */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none z-10"
          style={{ padding: '1px' }}
          animate={{ opacity: isHovered ? 1 : 0.1 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="absolute inset-0 rounded-2xl"
            animate={isHovered ? {
              background: [
                `conic-gradient(from 0deg, ${color}60, transparent 20%, #8b5cf640 40%, transparent 60%, ${color}60)`,
                `conic-gradient(from 360deg, ${color}60, transparent 20%, #8b5cf640 40%, transparent 60%, ${color}60)`,
              ],
            } : {
              background: `conic-gradient(from 0deg, ${color}12, transparent 25%, #8b5cf606 50%, transparent 75%, ${color}12)`,
            }}
            transition={{ duration: isHovered ? 3 : 0, repeat: Infinity, ease: 'linear' }}
            style={{
              padding: '1px',
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
            }}
          />
        </motion.div>

        {/* Monitor */}
        <div className="relative z-10 mb-4">
          <MonitorFrame color={color} isHovered={isHovered} mouseX={mouseX} mouseY={mouseY}>
            <ScreenContent thumbUrl={thumbUrl} title={title} isHovered={isHovered} getMediaUrl={getMediaUrlFn} />
          </MonitorFrame>
        </div>

        {/* Content below monitor */}
        <div className="relative z-10">
          {/* Title + Status */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <motion.h3
              className="text-base sm:text-lg font-bold leading-tight font-display"
              animate={{ color: isHovered ? color : '#f1f5f9' }}
              transition={{ duration: 0.3 }}
            >
              {title}
            </motion.h3>
            {status && (
              <HolographicBadge status={status} size="sm" />
            )}
          </div>

          {/* Description */}
          <p className="text-xs text-slate-400 mb-3 leading-relaxed line-clamp-2">
            {desc}
          </p>

          {/* Technologies */}
          <div className="flex flex-wrap gap-1 mb-3" role="list" aria-label="Project technologies">
            {techs.slice(0, 5).map((tag, i) => (
              <motion.span
                key={i}
                role="listitem"
                whileHover={{ scale: 1.08, y: -1 }}
                className="px-2 py-0.5 text-[10px] font-medium rounded-md transition-all duration-200"
                style={{
                  background: isHovered ? `${color}15` : 'rgba(255,255,255,0.05)',
                  color: isHovered ? `${color}dd` : '#94a3b8',
                  border: `1px solid ${isHovered ? `${color}25` : 'rgba(255,255,255,0.08)'}`,
                }}
              >
                {tag}
              </motion.span>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-3 border-t border-white/8">
            {repoUrl && repoUrl !== '#' && (
              <FuturisticButton
                href={repoUrl}
                icon={GithubIcon}
                label="Source"
                color={color}
                variant="ghost"
              />
            )}
            {liveUrl !== '#' && (
              <FuturisticButton
                href={liveUrl}
                icon={ExternalLink}
                label="Live Demo"
                color={color}
                variant="primary"
              />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
