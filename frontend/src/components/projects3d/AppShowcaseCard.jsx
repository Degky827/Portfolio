import { useRef, useState, useCallback, useMemo } from 'react'
import { motion, useMotionValue, useTransform, useSpring, useMotionTemplate, AnimatePresence } from 'framer-motion'
import { Star, Download, Globe, Play, Apple, Smartphone, Heart, BookOpen, ShoppingBag, MessageCircle, Wallet, Info, X, ExternalLink } from 'lucide-react'
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
            style={{ color: 'var(--text-primary)', fill: star <= Math.floor(rating) ? 'var(--text-primary)' : 'none' }}
          />
        </motion.div>
      ))}
      <span className="text-[10px] font-bold ml-1" style={{ color: 'var(--text-primary)' }}>{rating}</span>
    </div>
  )
}

function FeaturePills({ features, color }) {
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
            background: `${color}12`,
            color: `${color}cc`,
            borderColor: `${color}25`,
          }}
        >
          {feature}
        </motion.span>
      ))}
    </div>
  )
}

export default function AppShowcaseCard({ app, index, shouldReduceMotion, onOpen, getMediaUrl }) {
  const cardRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

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

  const color = '#6366f1'
  const thumbUrl = app.thumbnail ? (getMediaUrl ? getMediaUrl(app.thumbnail) : app.thumbnail) : ''
  const floatDelay = useMemo(() => index * 0.4, [index])

  const platformIcon = app.platform === 'iOS' ? Apple : app.platform === 'Android' ? Play : Globe
  const platformLabel = app.platform === 'iOS' ? 'iOS' : app.platform === 'Android' ? 'Android' : 'Web'

  // Calculate alternating slide direction: even indices slide from left, odd from right
  const slideDirection = index % 2 === 0 ? -60 : 60

  return (
    <motion.div
      ref={cardRef}
      variants={{
        hidden: { 
          opacity: 0, 
          x: shouldReduceMotion ? 0 : slideDirection,
          y: 0 
        },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: {
            type: 'spring',
            stiffness: 100,
            damping: 15,
            delay: shouldReduceMotion ? 0 : index * 0.15,
          },
        },
      }}
      custom={index}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        scale,
        translateZ,
        transformStyle: 'preserve-3d',
      }}
      animate={{ y: [0, -6, 0] }}
      transition={{
        y: { duration: 5 + index * 0.5, repeat: Infinity, ease: 'easeInOut', delay: floatDelay },
      }}
      className="relative group cursor-pointer flex flex-col items-center"
      role="button"
      tabIndex={0}
      aria-label={app.title}
    >
      {/* Card container */}
      <div
        className="relative rounded-3xl overflow-hidden transition-all duration-500 w-full max-w-[280px]"
        style={{
          background: `linear-gradient(145deg, ${color}08 0%, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.03) 70%, ${color}05 100%)`,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${isHovered ? `${color}30` : 'rgba(255,255,255,0.08)'}`,
          boxShadow: isHovered
            ? `0 20px 60px rgba(0,0,0,0.3), 0 0 30px ${color}10`
            : '0 8px 32px rgba(0,0,0,0.2)',
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
              thumbUrl={thumbUrl}
            />
          </div>

          {/* Rotating platform */}
          <div className="relative -mt-4 mb-4">
            <RotatingShowcasePlatform color={color} isHovered={isHovered} />
          </div>

          {/* App info */}
          <div className="text-center space-y-3 w-full">
            {/* Title */}
            <h3 className="text-sm sm:text-base font-bold leading-tight font-display line-clamp-2 text-white">
              {app.title}
            </h3>

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
            <FeaturePills features={app.features} color={color} />

            {/* Action buttons */}
            <div className="flex items-center justify-center gap-2 mt-3">
              {app.repoUrl && app.repoUrl !== '#' && (
                <a
                  href={app.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold rounded-lg transition-all duration-200 hover:scale-105"
                  style={{
                    background: `${color}15`,
                    color: color,
                    border: `1px solid ${color}25`,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
                  </svg>
                  GitHub
                </a>
              )}
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold rounded-lg transition-all duration-200 hover:scale-105"
                style={{
                  background: showDetails ? `${color}25` : `${color}15`,
                  color: color,
                  border: `1px solid ${showDetails ? `${color}40` : `${color}25`}`,
                }}
                onClick={(e) => { e.stopPropagation(); setShowDetails(!showDetails) }}
              >
                {showDetails ? <X size={12} /> : <Info size={12} />}
                {showDetails ? 'Close' : 'Details'}
              </button>
            </div>

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

        {/* Expanded Details Card */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="relative z-10 overflow-hidden"
            >
              <div className="px-4 pb-6 pt-4 border-t border-white/10">
                {/* Full Description */}
                <div className="mb-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: color }}>
                    Description
                  </h4>
                  <p className="text-[11px] leading-relaxed whitespace-pre-wrap" style={{ color: '#d1d5db' }}>
                    {app.description}
                  </p>
                </div>

                {/* All Features */}
                {app.features && app.features.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: color }}>
                      Features
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {app.features.map((feature, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 text-[9px] font-medium rounded-full"
                          style={{
                            background: `${color}12`,
                            color: `${color}cc`,
                            border: `1px solid ${color}25`,
                          }}
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* App Links */}
                <div className="flex items-center gap-2">
                  {app.repoUrl && app.repoUrl !== '#' && (
                    <a
                      href={app.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-semibold rounded-lg transition-all duration-200 hover:scale-105"
                      style={{
                        background: `${color}15`,
                        color: color,
                        border: `1px solid ${color}25`,
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
                      </svg>
                      GitHub
                    </a>
                  )}
                  <a
                    href={app.appUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-semibold rounded-lg transition-all duration-200 hover:scale-105"
                    style={{
                      background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
                      color: 'white',
                    }}
                  >
                    <ExternalLink size={12} />
                    Open App
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
