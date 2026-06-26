import { useRef, useState, useCallback, useMemo } from 'react'
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import { Star, Download, Globe, Play, Apple, Smartphone, Heart, BookOpen, ShoppingBag, MessageCircle, Wallet } from 'lucide-react'

const SPRING = { stiffness: 300, damping: 30, mass: 0.5 }

const mobileIconMap = { Smartphone, Heart, BookOpen, ShoppingBag, MessageCircle, Wallet }

function GlowBorder({ color, isHovered }) {
  return (
    <motion.div
      className="absolute inset-0 rounded-2xl pointer-events-none z-10"
      animate={isHovered ? {
        boxShadow: [
          `0 0 20px ${color}40, 0 0 40px ${color}20, inset 0 0 20px ${color}10`,
          `0 0 35px ${color}60, 0 0 70px ${color}30, inset 0 0 35px ${color}15`,
          `0 0 20px ${color}40, 0 0 40px ${color}20, inset 0 0 20px ${color}10`,
        ],
      } : {
        boxShadow: `0 0 0px transparent`,
      }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

function HolographicBorder({ color, isHovered }) {
  return (
    <motion.div
      className="absolute inset-0 rounded-2xl pointer-events-none z-10"
      style={{ padding: '1px' }}
      animate={{ opacity: isHovered ? 1 : 0.2 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="absolute inset-0 rounded-2xl"
        animate={isHovered ? {
          background: [
            `conic-gradient(from 0deg, ${color}60, transparent 25%, #8b5cf640 50%, transparent 75%, ${color}60)`,
            `conic-gradient(from 360deg, ${color}60, transparent 25%, #8b5cf640 50%, transparent 75%, ${color}60)`,
          ],
        } : {
          background: `conic-gradient(from 0deg, ${color}20, transparent 25%, #8b5cf610 50%, transparent 75%, ${color}20)`,
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
  )
}

function ReflectionLayer({ mouseX, mouseY, isHovered }) {
  const x = useSpring(useTransform(mouseX, [-0.5, 0.5], [0, 100]), SPRING)
  const y = useSpring(useTransform(mouseY, [-0.5, 0.5], [0, 100]), SPRING)

  return (
    <motion.div
      className="absolute inset-0 rounded-2xl pointer-events-none z-10"
      animate={{ opacity: isHovered ? 0.4 : 0 }}
      transition={{ duration: 0.3 }}
      style={{
        background: `radial-gradient(circle at ${x.get()}% ${y.get()}%, rgba(255,255,255,0.15) 0%, transparent 50%)`,
      }}
    />
  )
}

function ScanLine({ color, isHovered }) {
  if (!isHovered) return null
  return (
    <motion.div
      className="absolute left-0 right-0 h-px pointer-events-none z-20"
      initial={{ top: '-5%', opacity: 0 }}
      animate={{ top: ['0%', '105%'], opacity: [0, 0.6, 0] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: 0.3 }}
      style={{
        background: `linear-gradient(90deg, transparent, ${color}80, transparent)`,
        boxShadow: `0 0 10px ${color}50`,
      }}
    />
  )
}

function FloatingParticles({ color, isHovered }) {
  if (!isHovered) return null
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl z-10">
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 1.5 + Math.random() * 2.5,
            height: 1.5 + Math.random() * 2.5,
            backgroundColor: i % 3 === 0 ? color : i % 3 === 1 ? '#8b5cf6' : '#06b6d4',
            left: `${5 + Math.random() * 90}%`,
            top: `${5 + Math.random() * 90}%`,
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-12, 12, -12],
            opacity: [0, 0.7, 0],
            scale: [0.4, 1.4, 0.4],
          }}
          transition={{
            duration: 2 + Math.random() * 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.12,
          }}
        />
      ))}
    </div>
  )
}

function RatingStars({ rating, color }) {
  return (
    <div className="flex items-center gap-1.5 mb-3">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.div
          key={star}
          whileHover={{ scale: 1.2, rotate: 15 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        >
          <Star
            size={14}
            className={star <= Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}
          />
        </motion.div>
      ))}
      <span className="text-xs font-bold text-slate-400 ml-1">{rating}</span>
    </div>
  )
}

export default function AppShowcaseCard({ app, index, shouldReduceMotion, onOpen }) {
  const cardRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), SPRING)
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), SPRING)
  const scale = useSpring(isHovered ? 1.04 : 1, SPRING)
  const translateZ = useSpring(isHovered ? 40 : 0, SPRING)

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

  const color = app.color || '#06b6d4'
  const IconComponent = mobileIconMap[app.icon] || Smartphone
  const floatDelay = useMemo(() => index * 0.4, [index])

  const platformIcon = app.platform === 'iOS' ? Apple : app.platform === 'Android' ? Play : Globe
  const platformLabel = app.platform === 'iOS' ? 'iOS' : app.platform === 'Android' ? 'Android' : 'Web'

  return (
    <motion.div
      ref={cardRef}
      variants={{
        hidden: { y: shouldReduceMotion ? 0 : 30, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1,
          transition: {
            type: shouldReduceMotion ? 'tween' : 'spring',
            stiffness: 100,
            damping: 15,
            delay: index * 0.08,
          },
        },
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onOpen}
      style={{
        rotateX,
        rotateY,
        scale,
        translateZ,
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      animate={{ y: [0, -5, 0] }}
      transition={{
        y: { duration: 4 + index * 0.5, repeat: Infinity, ease: 'easeInOut', delay: floatDelay },
      }}
      className="relative group cursor-pointer flex flex-col"
      role="button"
      tabIndex={0}
      aria-label={app.title}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen() } }}
    >
      {/* Main card container */}
      <div
        className="relative rounded-2xl overflow-hidden transition-all duration-300 flex flex-col flex-1"
        style={{
          background: isHovered
            ? `linear-gradient(145deg, ${color}12 0%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.04) 60%, ${color}08 100%)`
            : 'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${isHovered ? `${color}40` : 'rgba(255,255,255,0.08)'}`,
          boxShadow: isHovered
            ? `0 20px 60px rgba(0,0,0,0.4), 0 0 30px ${color}15`
            : '0 4px 20px rgba(0,0,0,0.2)',
        }}
      >
        {/* Effects */}
        <HolographicBorder color={color} isHovered={isHovered} />
        <GlowBorder color={color} isHovered={isHovered} />
        <ScanLine color={color} isHovered={isHovered} />
        <FloatingParticles color={color} isHovered={isHovered} />
        <ReflectionLayer mouseX={mouseX} mouseY={mouseY} isHovered={isHovered} />

        {/* Ambient glow */}
        <motion.div
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full pointer-events-none z-0"
          style={{
            background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
            filter: 'blur(30px)',
          }}
          animate={{ opacity: isHovered ? [0.4, 0.7, 0.4] : 0.15 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Content */}
        <div className="relative z-10 p-5 sm:p-6 flex flex-col flex-1">
          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            <motion.div
              whileHover={shouldReduceMotion ? {} : { rotate: [0, 5, -5, 0], scale: 1.08 }}
              transition={{ duration: 0.5 }}
              className="w-14 h-14 flex-shrink-0 rounded-[18px] flex items-center justify-center shadow-lg border border-white/10 relative overflow-hidden"
              style={{ backgroundColor: color }}
            >
              {/* Icon shimmer */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)',
                }}
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: index * 0.3 }}
              />
              <IconComponent size={26} className="text-white relative z-10 drop-shadow-lg" />
            </motion.div>

            <div className="flex-1 min-w-0">
              <motion.h3
                className="text-lg font-bold text-white truncate font-display leading-tight"
                animate={{ color: isHovered ? color : '#f1f5f9' }}
                transition={{ duration: 0.3 }}
              >
                {app.title}
              </motion.h3>
              <p className="text-sm text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                {app.description}
              </p>
            </div>
          </div>

          {/* Rating */}
          <RatingStars rating={app.rating} color={color} />

          {/* Features */}
          <div className="flex flex-wrap gap-1.5 mb-4" role="list" aria-label="App features">
            {app.features.map((feature, i) => (
              <motion.span
                key={i}
                role="listitem"
                whileHover={{ scale: 1.05, y: -1 }}
                className="px-2.5 py-1 text-[10px] font-medium rounded-md border transition-all duration-200"
                style={{
                  background: isHovered ? `${color}12` : 'rgba(255,255,255,0.05)',
                  color: isHovered ? `${color}cc` : '#94a3b8',
                  borderColor: isHovered ? `${color}25` : 'rgba(255,255,255,0.08)',
                }}
              >
                {feature}
              </motion.span>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-auto pt-3 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                {(() => {
                  const PlatformIcon = platformIcon
                  return <><PlatformIcon size={14} /> {platformLabel}</>
                })()}
              </div>

              <motion.a
                href={app.appUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                whileHover={{ scale: 1.05, x: 2 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200"
                style={{
                  background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
                  color: 'white',
                  boxShadow: isHovered ? `0 4px 20px ${color}40` : `0 2px 8px ${color}20`,
                }}
                aria-label={`Open ${app.title}`}
                onClick={(e) => e.stopPropagation()}
              >
                <Download size={14} />
                Open App
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
