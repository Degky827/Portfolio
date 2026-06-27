import { useRef, useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function FuturisticTextarea({
  id,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  icon: Icon,
  error,
  label,
  required,
  rows = 5,
}) {
  const containerRef = useRef(null)
  const textareaRef = useRef(null)
  const [isFocused, setIsFocused] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [rotate, setRotate] = useState({ x: 0, y: 0 })
  const [charCount, setCharCount] = useState(0)
  const typingTimeout = useRef(null)

  useEffect(() => {
    setCharCount(value?.length || 0)
  }, [value])

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
    setIsTyping(false)
    onBlur?.(e)
  }, [onBlur])

  const handleChange = useCallback((e) => {
    onChange?.(e)
    setIsTyping(true)
    clearTimeout(typingTimeout.current)
    typingTimeout.current = setTimeout(() => setIsTyping(false), 800)
  }, [onChange])

  useEffect(() => {
    return () => clearTimeout(typingTimeout.current)
  }, [])

  return (
    <div className="space-y-2 sm:space-y-3">
      <label
        htmlFor={id}
        className="text-xs sm:text-sm font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] ml-1 block"
        style={{
          color: isFocused ? 'rgba(6,182,212,0.9)' : error ? 'rgba(239,68,68,0.7)' : 'rgba(6,182,212,0.5)',
          textShadow: isFocused ? '0 0 12px rgba(6,182,212,0.3)' : 'none',
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
          {/* Outer glow on focus / typing */}
          <motion.div
            className="absolute -inset-1 rounded-2xl sm:rounded-[1.5rem] pointer-events-none z-0"
            animate={{
              opacity: isFocused ? (isTyping ? 0.7 : 0.5) : error ? 0.4 : 0,
              scale: isFocused ? 1 : 0.98,
            }}
            transition={{ duration: 0.3 }}
            style={{
              background: error
                ? 'radial-gradient(ellipse, rgba(239,68,68,0.3), transparent 70%)'
                : isTyping
                  ? 'radial-gradient(ellipse, rgba(6,182,212,0.3), rgba(34,211,238,0.2), transparent 70%)'
                  : 'radial-gradient(ellipse, rgba(6,182,212,0.25), rgba(34,211,238,0.12), transparent 70%)',
              filter: isTyping ? 'blur(16px)' : 'blur(12px)',
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
                  'conic-gradient(from 0deg, rgba(6,182,212,0.55), transparent 30%, rgba(6,182,212,0.2) 50%, transparent 70%, rgba(6,182,212,0.55))',
                  'conic-gradient(from 360deg, rgba(6,182,212,0.55), transparent 30%, rgba(6,182,212,0.2) 50%, transparent 70%, rgba(6,182,212,0.55))',
                ],
              } : error ? {
                background: 'conic-gradient(from 0deg, rgba(239,68,68,0.4), transparent 25%, rgba(239,68,68,0.3) 50%, transparent 75%, rgba(239,68,68,0.4))',
              } : {
                background: 'conic-gradient(from 0deg, rgba(6,182,212,0.15), transparent 30%, rgba(6,182,212,0.06) 50%, transparent 70%, rgba(6,182,212,0.15))',
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
                ? 'linear-gradient(165deg, rgba(255,255,255,0.07) 0%, rgba(6,182,212,0.04) 50%, rgba(255,255,255,0.03) 100%)'
                : 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: isFocused
                ? '0 8px 32px rgba(0,0,0,0.3), 0 0 20px rgba(6,182,212,0.1), inset 0 1px 0 rgba(255,255,255,0.08)'
                : '0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)',
              border: `1px solid ${isFocused ? 'rgba(6,182,212,0.2)' : error ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.06)'}`,
              transition: 'all 0.3s ease',
            }}
          >
            {/* Animated scan lines */}
            <motion.div
              className="absolute inset-0 pointer-events-none z-10"
              animate={isFocused ? {
                opacity: [0.02, 0.05, 0.02],
              } : { opacity: 0 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(6,182,212,0.08) 3px, rgba(6,182,212,0.08) 4px)',
              }}
            />

            {/* Moving scan line on typing */}
            <motion.div
              className="absolute left-0 right-0 h-8 pointer-events-none z-10"
              animate={isTyping ? {
                top: ['-5%', '105%'],
                opacity: [0, 0.15, 0],
              } : {
                top: '-5%',
                opacity: 0,
              }}
              transition={{ duration: isTyping ? 1.5 : 0, repeat: Infinity, ease: 'linear' }}
              style={{
                background: 'linear-gradient(180deg, transparent, rgba(6,182,212,0.15), transparent)',
                filter: 'blur(2px)',
              }}
            />

            {/* Cursor glow indicator */}
            <motion.div
              className="absolute right-3 top-3 w-2 h-2 rounded-full pointer-events-none z-10"
              animate={{
                opacity: isFocused ? [0.4, 0.8, 0.4] : 0,
                scale: isFocused ? [0.8, 1.2, 0.8] : 0.8,
                boxShadow: isFocused
                  ? ['0 0 6px rgba(6,182,212,0.6)', '0 0 12px rgba(6,182,212,0.9)', '0 0 6px rgba(6,182,212,0.6)']
                  : '0 0 0px transparent',
              }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ background: 'rgba(6,182,212,0.8)' }}
            />

            {/* Holographic reflection */}
            <motion.div
              className="absolute inset-0 pointer-events-none z-10"
              animate={{
                background: isFocused
                  ? 'linear-gradient(135deg, rgba(6,182,212,0.05) 0%, transparent 40%, rgba(34,211,238,0.03) 60%, transparent 100%)'
                  : 'transparent',
                backgroundPosition: `${50 + rotate.y * 8}% ${50 + rotate.x * 8}%`,
              }}
              transition={{ duration: 0.2 }}
            />

            {/* Depth layers */}
            <motion.div
              className="absolute inset-0 pointer-events-none z-0"
              animate={{
                boxShadow: isFocused
                  ? 'inset 0 2px 20px rgba(6,182,212,0.06), inset 0 -2px 20px rgba(34,211,238,0.04)'
                  : 'inset 0 1px 10px rgba(0,0,0,0.1)',
              }}
              transition={{ duration: 0.3 }}
            />

            {/* Icon */}
            {Icon && (
              <span
                className="absolute left-4 sm:left-5 top-5 sm:top-6 z-10 transition-all duration-300"
                style={{
                  color: isFocused ? 'rgba(6,182,212,0.9)' : error ? 'rgba(239,68,68,0.7)' : 'rgba(255,255,255,0.35)',
                  filter: isFocused ? 'drop-shadow(0 0 6px rgba(6,182,212,0.4))' : 'none',
                }}
                aria-hidden="true"
              >
                <Icon size={18} className="w-4 h-4 sm:w-5 sm:h-5" />
              </span>
            )}

            {/* Actual textarea */}
            <textarea
              ref={textareaRef}
              id={id}
              name={name}
              value={value}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              rows={rows}
              placeholder={placeholder}
              className="w-full bg-transparent outline-none text-white font-medium text-sm sm:text-base relative z-10 resize-none"
              style={{
                padding: Icon ? '1.25rem 1.5rem 1.25rem 3rem' : '1.25rem 1.5rem',
                caretColor: '#06b6d4',
                color: 'rgba(255,255,255,0.9)',
                lineHeight: '1.6',
              }}
            />

            {/* Character count */}
            {isFocused && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-3 right-4 text-[10px] font-mono z-20"
                style={{
                  color: charCount > 0 ? 'rgba(6,182,212,0.6)' : 'rgba(255,255,255,0.2)',
                  textShadow: charCount > 0 ? '0 0 6px rgba(6,182,212,0.3)' : 'none',
                }}
              >
                {charCount} chars
              </motion.div>
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
                background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.6), rgba(34,211,238,0.4), transparent)',
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
            background: 'radial-gradient(ellipse, rgba(6,182,212,0.3), transparent)',
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
