import { useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'

export default function FuturisticInput({
  id,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  icon: Icon,
  error,
  label,
  required,
}) {
  const containerRef = useRef(null)
  const [isFocused, setIsFocused] = useState(false)
  const [rotate, setRotate] = useState({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setRotate({ x: y * -3, y: x * 3 })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setRotate({ x: 0, y: 0 })
  }, [])

  const handleFocus = useCallback(() => setIsFocused(true), [])
  const handleBlur = useCallback((e) => {
    setIsFocused(false)
    onBlur?.(e)
  }, [onBlur])

  return (
    <div className="space-y-2 sm:space-y-3">
      <label
        htmlFor={id}
        className="text-xs sm:text-sm font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] ml-1 block"
        style={{
          color: isFocused ? 'rgba(99,102,241,0.9)' : error ? 'rgba(239,68,68,0.7)' : 'rgba(99,102,241,0.5)',
          textShadow: isFocused ? '0 0 12px rgba(99,102,241,0.3)' : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        {label} {required && <span className="text-red-400">*</span>}
      </label>

      <motion.div
        ref={containerRef}
        className="relative group"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          perspective: '800px',
          transformStyle: 'preserve-3d',
        }}
      >
        <motion.div
          className="relative"
          animate={{
            rotateX: rotate.x,
            rotateY: rotate.y,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Outer glow on focus */}
          <motion.div
            className="absolute -inset-1 rounded-2xl sm:rounded-[1.5rem] pointer-events-none z-0"
            animate={{
              opacity: isFocused ? 0.6 : error ? 0.4 : 0,
              scale: isFocused ? 1 : 0.98,
            }}
            transition={{ duration: 0.3 }}
            style={{
              background: error
                ? 'radial-gradient(ellipse, rgba(239,68,68,0.3), transparent 70%)'
                : 'radial-gradient(ellipse, rgba(99,102,241,0.3), rgba(6,182,212,0.15), transparent 70%)',
              filter: 'blur(12px)',
            }}
          />

          {/* Holographic border */}
          <motion.div
            className="absolute inset-0 rounded-2xl sm:rounded-[1.5rem] pointer-events-none z-20"
            style={{ padding: '1px' }}
            animate={{ opacity: isFocused ? 1 : error ? 0.8 : 0.15 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="absolute inset-0 rounded-2xl sm:rounded-[1.5rem]"
              animate={isFocused ? {
                background: [
                  'conic-gradient(from 0deg, rgba(99,102,241,0.5), transparent 25%, rgba(6,182,212,0.4) 50%, transparent 75%, rgba(99,102,241,0.5))',
                  'conic-gradient(from 360deg, rgba(99,102,241,0.5), transparent 25%, rgba(6,182,212,0.4) 50%, transparent 75%, rgba(99,102,241,0.5))',
                ],
              } : error ? {
                background: 'conic-gradient(from 0deg, rgba(239,68,68,0.4), transparent 25%, rgba(239,68,68,0.3) 50%, transparent 75%, rgba(239,68,68,0.4))',
              } : {
                background: 'conic-gradient(from 0deg, rgba(99,102,241,0.1), transparent 25%, rgba(6,182,212,0.05) 50%, transparent 75%, rgba(99,102,241,0.1))',
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

          {/* Glass surface */}
          <div
            className="relative rounded-2xl sm:rounded-[1.5rem] overflow-hidden"
            style={{
              background: isFocused
                ? 'linear-gradient(165deg, rgba(255,255,255,0.07) 0%, rgba(99,102,241,0.04) 50%, rgba(255,255,255,0.03) 100%)'
                : 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: isFocused
                ? '0 8px 32px rgba(0,0,0,0.3), 0 0 20px rgba(99,102,241,0.1), inset 0 1px 0 rgba(255,255,255,0.08)'
                : '0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)',
              border: `1px solid ${isFocused ? 'rgba(99,102,241,0.2)' : error ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.06)'}`,
              transition: 'all 0.3s ease',
            }}
          >
            {/* Scan line on focus */}
            <motion.div
              className="absolute inset-0 pointer-events-none z-10"
              animate={isFocused ? {
                background: [
                  'linear-gradient(180deg, transparent 0%, rgba(99,102,241,0.06) 50%, transparent 100%)',
                  'linear-gradient(180deg, transparent -50%, rgba(99,102,241,0.06) 0%, transparent 50%)',
                ],
              } : {
                background: 'transparent',
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              style={{ backgroundSize: '100% 200%' }}
            />

            {/* Holographic reflection */}
            <motion.div
              className="absolute inset-0 pointer-events-none z-10"
              animate={{
                background: isFocused
                  ? `linear-gradient(135deg, rgba(99,102,241,0.05) 0%, transparent 40%, rgba(6,182,212,0.03) 60%, transparent 100%)`
                  : 'transparent',
                backgroundPosition: `${50 + rotate.y * 10}% ${50 + rotate.x * 10}%`,
              }}
              transition={{ duration: 0.2 }}
            />

            {/* Icon */}
            {Icon && (
              <span
                className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 z-10 transition-all duration-300"
                style={{
                  color: isFocused ? 'rgba(99,102,241,0.9)' : error ? 'rgba(239,68,68,0.7)' : 'rgba(255,255,255,0.35)',
                  filter: isFocused ? 'drop-shadow(0 0 6px rgba(99,102,241,0.4))' : 'none',
                }}
                aria-hidden="true"
              >
                <Icon size={18} className="w-4 h-4 sm:w-5 sm:h-5" />
              </span>
            )}

            {/* Actual input */}
            <input
              id={id}
              name={name}
              type={type}
              value={value}
              onChange={onChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={placeholder}
              className="w-full bg-transparent outline-none text-white font-medium text-sm sm:text-base relative z-10"
              style={{
                padding: Icon ? '1rem 1.5rem 1rem 3rem' : '1rem 1.5rem',
                caretColor: '#818cf8',
                color: 'rgba(255,255,255,0.9)',
              }}
            />

            {/* Animated placeholder glow */}
            {!value && (
              <motion.span
                className="absolute pointer-events-none z-5"
                animate={{
                  opacity: isFocused ? [0.4, 0.7, 0.4] : 0.3,
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  left: Icon ? '3rem' : '1.5rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'rgba(129,140,248,0.5)',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  filter: isFocused ? 'drop-shadow(0 0 4px rgba(99,102,241,0.3))' : 'none',
                }}
              >
                {placeholder}
              </motion.span>
            )}

            {/* Bottom glow line on focus */}
            <motion.div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] pointer-events-none z-20"
              animate={{
                width: isFocused ? '80%' : '0%',
                opacity: isFocused ? 1 : 0,
              }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.6), rgba(6,182,212,0.4), transparent)',
              }}
            />
          </div>
        </motion.div>

        {/* Floating shadow */}
        <motion.div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-3 rounded-full pointer-events-none"
          animate={{
            width: isFocused ? '70%' : '50%',
            opacity: isFocused ? 0.25 : 0.08,
          }}
          transition={{ duration: 0.3 }}
          style={{
            background: 'radial-gradient(ellipse, rgba(99,102,241,0.3), transparent)',
            filter: 'blur(4px)',
          }}
        />
      </motion.div>

      {/* Error message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-400 ml-1"
          style={{ textShadow: '0 0 8px rgba(239,68,68,0.3)' }}
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}
