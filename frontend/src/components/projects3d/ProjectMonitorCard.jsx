import { useRef, useState, useCallback, useMemo } from 'react'
import { motion, useMotionValue, useTransform, useSpring, useMotionTemplate } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import HolographicBadge from '../HolographicBadge'

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
  const reflectionX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-20, 20]), SPRING)
  const reflectionY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-15, 15]), SPRING)
  const reflectionBg = useMotionTemplate`radial-gradient(ellipse at calc(50% + ${reflectionX}px) calc(30% + ${reflectionY}px), rgba(255,255,255,0.12) 0%, transparent 50%)`

  return (
    <div className="relative" style={{ perspective: '1200px' }}>
      {/* Monitor shadow on surface */}
      <motion.div
        className="absolute -bottom-4 left-[10%] right-[10%] h-6 rounded-[50%] blur-xl"
        style={{ background: `radial-gradient(ellipse, ${color}30 0%, transparent 70%)` }}
        animate={{
          opacity: isHovered ? 0.8 : 0.3,
          scaleX: isHovered ? 1.1 : 0.9,
          y: isHovered ? 4 : 0,
        }}
        transition={{ duration: 0.4 }}
      />

      {/* Monitor body */}
      <motion.div
        className="relative rounded-xl overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #1a1a2e 0%, #0d0d1a 50%, #1a1a2e 100%)',
          border: '2px solid rgba(255,255,255,0.08)',
          boxShadow: isHovered
            ? `0 30px 80px rgba(0,0,0,0.6), 0 0 40px ${color}20, inset 0 1px 0 rgba(255,255,255,0.05)`
            : '0 10px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
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
        <div className="relative bg-black aspect-[16/10] overflow-hidden">
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
                : 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 40%)',
            }}
          />

          {/* Screen glare line */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-20"
            animate={{
              opacity: isHovered ? 0.15 : 0.05,
            }}
            style={{
              background: 'linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.08) 45%, transparent 50%)',
            }}
          />

          {/* Edge glow */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-20 rounded-sm"
            animate={{
              boxShadow: isHovered
                ? `inset 0 0 30px ${color}15, inset 0 0 60px ${color}08`
                : 'inset 0 0 0px transparent',
            }}
            transition={{ duration: 0.4 }}
          />
        </div>

        {/* Bottom bezel with status LED */}
        <div className="relative h-5 sm:h-6 bg-gradient-to-t from-[#1e1e32] to-[#14142a] flex items-center justify-center border-t border-white/5">
          <motion.div
            className="w-2 h-2 rounded-full"
            animate={{
              backgroundColor: isHovered ? color : '#3a3a5a',
              boxShadow: isHovered ? `0 0 10px ${color}80` : '0 0 0px transparent',
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.div>

      {/* Monitor stand neck */}
      <div className="flex justify-center">
        <div
          className="w-10 h-6"
          style={{
            background: 'linear-gradient(180deg, #1a1a2e 0%, #0f0f1e 100%)',
            borderLeft: '1px solid rgba(255,255,255,0.05)',
            borderRight: '1px solid rgba(255,255,255,0.05)',
          }}
        />
      </div>

      {/* Monitor stand base */}
      <div className="flex justify-center">
        <motion.div
          className="h-2 rounded-b-xl"
          style={{
            width: '60%',
            background: 'linear-gradient(180deg, #1a1a2e 0%, #0d0d1a 100%)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderTop: 'none',
          }}
          animate={{
            boxShadow: isHovered ? `0 4px 20px ${color}15` : '0 2px 8px rgba(0,0,0,0.3)',
          }}
        />
      </div>
    </div>
  )
}

function ScreenContent({ thumbUrl, title, isHovered, getMediaUrl }) {
  return (
    <div className="relative w-full h-full bg-[#0a0a14]">
      {/* Project screenshot */}
      <img
        src={thumbUrl ? getMediaUrl(thumbUrl) : DEFAULT_THUMBNAIL}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-700"
        style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
        onError={(e) => { e.target.src = DEFAULT_THUMBNAIL }}
      />

      {/* Dark overlay on load */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

      {/* Scanline effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
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
            ? `linear-gradient(145deg, ${color}08 0%, rgba(255,255,255,0.06) 50%, ${color}05 100%)`
            : 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${isHovered ? `${color}35` : 'rgba(255,255,255,0.06)'}`,
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
          animate={{ opacity: isHovered ? 1 : 0.15 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="absolute inset-0 rounded-2xl"
            animate={isHovered ? {
              background: [
                `conic-gradient(from 0deg, ${color}50, transparent 25%, #8b5cf630 50%, transparent 75%, ${color}50)`,
                `conic-gradient(from 360deg, ${color}50, transparent 25%, #8b5cf630 50%, transparent 75%, ${color}50)`,
              ],
            } : {
              background: `conic-gradient(from 0deg, ${color}15, transparent 25%, #8b5cf608 50%, transparent 75%, ${color}15)`,
            }}
            transition={{ duration: isHovered ? 4 : 0, repeat: Infinity, ease: 'linear' }}
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
              <motion.a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                whileHover={{ scale: 1.03, x: 1 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-lg transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  color: '#94a3b8',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <GithubIcon size={12} />
                Source
              </motion.a>
            )}
            {liveUrl !== '#' && (
              <motion.a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                whileHover={{ scale: 1.03, x: 1 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-lg transition-all duration-200"
                style={{
                  background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
                  color: 'white',
                  boxShadow: isHovered ? `0 4px 16px ${color}35` : `0 2px 8px ${color}20`,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink size={12} />
                Live Demo
              </motion.a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
