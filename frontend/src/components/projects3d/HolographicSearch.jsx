import { useRef, useState, useCallback } from 'react'
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import { Search, X } from 'lucide-react'

const SPRING = { stiffness: 300, damping: 30, mass: 0.5 }

function ScanLine({ isFocused }) {
  return (
    <AnimatePresence>
      {isFocused && (
        <motion.div
          className="absolute left-0 right-0 h-px pointer-events-none z-20"
          initial={{ top: '0%', opacity: 0 }}
          animate={{ top: ['0%', '100%'], opacity: [0, 0.8, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          style={{
            background: 'linear-gradient(90deg, transparent, #06b6d4 30%, #8b5cf6 70%, transparent)',
            boxShadow: '0 0 12px #06b6d460, 0 0 24px #8b5cf630',
          }}
        />
      )}
    </AnimatePresence>
  )
}

function FloatingIcon({ isFocused, isHovered }) {
  return (
    <motion.div
      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none"
      animate={{
        y: isFocused ? [0, -2, 0, 2, 0] : isHovered ? [0, -1, 0] : 0,
        scale: isFocused ? 1.15 : isHovered ? 1.05 : 1,
        rotate: isFocused ? [0, -5, 5, 0] : 0,
      }}
      transition={{
        y: { duration: isFocused ? 1.5 : 2, repeat: Infinity, ease: 'easeInOut' },
        scale: { duration: 0.3 },
        rotate: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
      }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300"
        style={{
          background: isFocused
            ? 'linear-gradient(135deg, #06b6d430 0%, #8b5cf620 100%)'
            : 'rgba(255,255,255,0.05)',
          boxShadow: isFocused ? '0 0 20px #06b6d430' : 'none',
        }}
      >
        <Search
          size={16}
          style={{ color: isFocused ? '#06b6d4' : '#94a3b8' }}
          className="transition-colors duration-300"
        />
      </div>
    </motion.div>
  )
}

function GlowBorder({ isFocused, color }) {
  return (
    <motion.div
      className="absolute inset-0 rounded-2xl pointer-events-none z-10"
      animate={isFocused ? {
        boxShadow: [
          `0 0 15px ${color}30, 0 0 30px ${color}15, inset 0 0 15px ${color}10`,
          `0 0 25px ${color}50, 0 0 50px ${color}25, inset 0 0 25px ${color}15`,
          `0 0 15px ${color}30, 0 0 30px ${color}15, inset 0 0 15px ${color}10`,
        ],
      } : {
        boxShadow: '0 0 0px transparent',
      }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

function ParticleField({ isFocused }) {
  if (!isFocused) return null
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl z-10">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 1.5 + Math.random() * 2,
            height: 1.5 + Math.random() * 2,
            backgroundColor: i % 2 === 0 ? '#06b6d4' : '#8b5cf6',
            left: `${5 + Math.random() * 90}%`,
            top: `${5 + Math.random() * 90}%`,
          }}
          animate={{
            y: [-15, 15, -15],
            x: [-8, 8, -8],
            opacity: [0, 0.7, 0],
            scale: [0.5, 1.3, 0.5],
          }}
          transition={{
            duration: 2 + Math.random() * 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  )
}

function AnimatedPlaceholder({ text, isFocused }) {
  return (
    <AnimatePresence mode="wait">
      {!isFocused && (
        <motion.span
          key="placeholder"
          className="absolute left-12 top-1/2 -translate-y-1/2 text-sm text-slate-500 pointer-events-none z-10"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ duration: 0.2 }}
        >
          {text}
        </motion.span>
      )}
    </AnimatePresence>
  )
}

export default function HolographicSearch({ value, onChange, onClear, placeholder, ariaLabel }) {
  const containerRef = useRef(null)
  const inputRef = useRef(null)
  const [isFocused, setIsFocused] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [3, -3]), SPRING)
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-3, 3]), SPRING)

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
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

  const handleFocus = useCallback(() => setIsFocused(true), [])
  const handleBlur = useCallback(() => setIsFocused(false), [])

  const color = '#06b6d4'

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      className="relative max-w-lg mx-auto mb-8 sm:mb-10"
    >
      {/* Ambient glow */}
      <motion.div
        className="absolute -inset-3 rounded-3xl pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(6,182,212,0.08) 0%, transparent 70%)',
          filter: 'blur(16px)',
        }}
        animate={{
          opacity: isFocused ? [0.6, 1, 0.6] : 0.3,
          scale: isFocused ? [1, 1.05, 1] : 1,
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Main container */}
      <div
        className="relative rounded-2xl overflow-hidden transition-all duration-300"
        style={{
          background: isFocused
            ? 'linear-gradient(135deg, rgba(6,182,212,0.08) 0%, rgba(255,255,255,0.06) 50%, rgba(139,92,246,0.06) 100%)'
            : 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
          backdropFilter: 'blur(24px)',
          border: `1px solid ${isFocused ? `${color}40` : 'rgba(255,255,255,0.08)'}`,
          boxShadow: isFocused
            ? `0 0 30px ${color}15, 0 8px 32px rgba(0,0,0,0.3)`
            : '0 4px 16px rgba(0,0,0,0.2)',
        }}
      >
        {/* Holographic border */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none z-10"
          animate={isFocused ? { opacity: 1 } : { opacity: 0.15 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="absolute inset-0 rounded-2xl"
            animate={isFocused ? {
              background: [
                `conic-gradient(from 0deg, ${color}50, transparent 25%, #8b5cf640 50%, transparent 75%, ${color}50)`,
                `conic-gradient(from 360deg, ${color}50, transparent 25%, #8b5cf640 50%, transparent 75%, ${color}50)`,
              ],
            } : {
              background: `conic-gradient(from 0deg, ${color}20, transparent 25%, #8b5cf615 50%, transparent 75%, ${color}20)`,
            }}
            transition={{ duration: isFocused ? 3 : 0, repeat: Infinity, ease: 'linear' }}
            style={{
              padding: '1px',
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
            }}
          />
        </motion.div>

        <GlowBorder isFocused={isFocused} color={color} />
        <ScanLine isFocused={isFocused} />
        <ParticleField isFocused={isFocused} />

        {/* Input row */}
        <div className="relative flex items-center">
          <FloatingIcon isFocused={isFocused} isHovered={isHovered} />

          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="w-full pl-14 pr-12 py-4 bg-transparent text-white text-sm font-medium outline-none relative z-10"
            placeholder=" "
            aria-label={ariaLabel}
          />

          <AnimatedPlaceholder text={placeholder} isFocused={isFocused || !!value} />

          {/* Clear button */}
          <AnimatePresence>
            {value && (
              <motion.button
                initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                transition={{ duration: 0.2 }}
                onClick={onClear}
                className="absolute right-3 p-1.5 rounded-lg z-20 transition-colors duration-200"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#94a3b8',
                }}
                whileHover={{
                  background: 'rgba(239,68,68,0.15)',
                  borderColor: 'rgba(239,68,68,0.3)',
                  color: '#ef4444',
                  scale: 1.1,
                }}
                aria-label="Clear search"
              >
                <X size={14} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom status bar */}
        <motion.div
          className="flex items-center justify-between px-4 py-1.5 border-t"
          style={{
            borderColor: isFocused ? `${color}20` : 'rgba(255,255,255,0.05)',
            background: 'rgba(0,0,0,0.15)',
          }}
          animate={{
            borderColor: isFocused ? [`${color}20`, `${color}35`, `${color}20`] : 'rgba(255,255,255,0.05)',
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="flex items-center gap-2">
            <motion.div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: isFocused ? '#22c55e' : '#64748b' }}
              animate={isFocused ? {
                boxShadow: [
                  '0 0 4px rgba(34,197,94,0.4)',
                  '0 0 8px rgba(34,197,94,0.8)',
                  '0 0 4px rgba(34,197,94,0.4)',
                ],
              } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-[10px] font-medium tracking-wider uppercase" style={{ color: isFocused ? '#94a3b8' : '#475569' }}>
              {isFocused ? 'SEARCHING' : 'STANDBY'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-slate-600 font-mono">AI</span>
            <motion.div
              className="w-1 h-1 rounded-full bg-cyan-500"
              animate={isFocused ? { opacity: [0.3, 1, 0.3] } : { opacity: 0.2 }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
