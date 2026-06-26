import { useRef, useState, useCallback, useMemo } from 'react'
import { motion, useMotionValue, useTransform, useSpring, useMotionTemplate, AnimatePresence } from 'framer-motion'
import { Star, Download, Globe, Play, Apple, Smartphone, Heart, BookOpen, ShoppingBag, MessageCircle, Wallet } from 'lucide-react'
import SmartphoneDevice from './SmartphoneDevice'
import RotatingShowcasePlatform from './RotatingShowcasePlatform'
import HolographicLighting from './HolographicLighting'

const SPRING = { stiffness: 300, damping: 30, mass: 0.5 }

const mobileIconMap = { Smartphone, Heart, BookOpen, ShoppingBag, MessageCircle, Wallet }

function RatingStars({ rating, color }) {
  return (
    <div className="flex items-center justify-center gap-1.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.div
          key={star}
          whileHover={{ scale: 1.2, rotate: 15 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        >
          <Star
            size={12}
            className={star <= Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}
          />
        </motion.div>
      ))}
      <span className="text-[10px] font-bold text-slate-400 ml-1">{rating}</span>
    </div>
  )
}

function FeaturePills({ features, color, isHovered }) {
  return (
    <div className="flex flex-wrap justify-center gap-1.5" role="list" aria-label="App features">
      {features.map((feature, i) => (
        <motion.span
          key={i}
          role="listitem"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="px-2 py-0.5 text-[9px] font-medium rounded-full border transition-all duration-200"
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
  )
}

export default function AppShowcaseCard({ app, index, shouldReduceMotion, onOpen }) {
  const cardRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), SPRING)
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), SPRING)
  const scale = useSpring(isHovered ? 1.02 : 1, SPRING)
  const translateZ = useSpring(isHovered ? 30 : 0, SPRING)

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
  const floatDelay = useMemo(() => index * 0.4, [index])

  const platformIcon = app.platform === 'iOS' ? Apple : app.platform === 'Android' ? Play : Globe
  const platformLabel = app.platform === 'iOS' ? 'iOS' : app.platform === 'Android' ? 'Android' : 'Web'

  return (
    <motion.div
      ref={cardRef}
      variants={{
        hidden: { y: shouldReduceMotion ? 0 : 40, opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 },
        visible: {
          y: 0,
          opacity: 1,
          scale: 1,
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
      onClick={onOpen}
      style={{
        rotateX,
        rotateY,
        scale,
        translateZ,
        transformStyle: 'preserve-3d',
        perspective: '1200px',
      }}
      animate={{ y: [0, -6, 0] }}
      transition={{
        y: { duration: 5 + index * 0.5, repeat: Infinity, ease: 'easeInOut', delay: floatDelay },
      }}
      className="relative group cursor-pointer flex flex-col items-center"
      role="button"
      tabIndex={0}
      aria-label={app.title}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen() } }}
    >
      {/* Card container */}
      <div
        className="relative rounded-3xl overflow-hidden transition-all duration-500 w-full max-w-[280px]"
        style={{
          background: isHovered
            ? `linear-gradient(145deg, ${color}08 0%, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.03) 70%, ${color}05 100%)`
            : 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${isHovered ? `${color}30` : 'rgba(255,255,255,0.06)'}`,
        }}
      >
        {/* Holographic lighting */}
        <HolographicLighting color={color} isHovered={isHovered} />

        {/* Content */}
        <div className="relative z-10 pt-8 pb-6 px-4 flex flex-col items-center">
          {/* Smartphone device */}
          <div className="relative mb-6">
            <SmartphoneDevice
              app={app}
              isHovered={isHovered}
              mouseX={mouseX}
              mouseY={mouseY}
              color={color}
            />
          </div>

          {/* Rotating platform */}
          <div className="relative -mt-4 mb-4">
            <RotatingShowcasePlatform color={color} isHovered={isHovered} />
          </div>

          {/* App info */}
          <div className="text-center space-y-3 w-full">
            {/* Title */}
            <motion.h3
              className="text-sm sm:text-base font-bold leading-tight font-display line-clamp-2"
              animate={{ color: isHovered ? color : '#f1f5f9' }}
              transition={{ duration: 0.3 }}
            >
              {app.title}
            </motion.h3>

            {/* Platform badge */}
            <div className="flex items-center justify-center gap-2">
              <div
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider"
                style={{
                  background: `${color}15`,
                  color: color,
                  border: `1px solid ${color}25`,
                }}
              >
                {(() => {
                  const PlatformIcon = platformIcon
                  return <><PlatformIcon size={10} /> {platformLabel}</>
                })()}
              </div>
            </div>

            {/* Rating */}
            <RatingStars rating={app.rating} color={color} />

            {/* Features */}
            <FeaturePills features={app.features} color={color} isHovered={isHovered} />

            {/* CTA button */}
            <motion.a
              href={app.appUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-[11px] font-bold rounded-full transition-all duration-200 mt-2"
              style={{
                background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
                color: 'white',
                boxShadow: isHovered ? `0 8px 24px ${color}40` : `0 4px 12px ${color}25`,
              }}
              aria-label={`Open ${app.title}`}
              onClick={(e) => e.stopPropagation()}
            >
              <Download size={12} />
              Open App
            </motion.a>
          </div>
        </div>

        {/* Bottom ambient glow */}
        <motion.div
          className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-32 h-20 rounded-full pointer-events-none z-0"
          style={{
            background: `radial-gradient(ellipse, ${color}15 0%, transparent 70%)`,
            filter: 'blur(20px)',
          }}
          animate={{
            opacity: isHovered ? [0.3, 0.6, 0.3] : 0.1,
            scaleX: isHovered ? [1, 1.2, 1] : 1,
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </motion.div>
  )
}
