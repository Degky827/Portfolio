import { useRef, useState, useCallback, useEffect } from 'react'
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import { Search, X } from 'lucide-react'

const SPRING = { stiffness: 300, damping: 30, mass: 0.5 }

export default function HolographicSearch({ value, onChange, onClear, placeholder, ariaLabel }) {
  const containerRef = useRef(null)
  const inputRef = useRef(null)
  const [isFocused, setIsFocused] = useState(false)
  const [isDark, setIsDark] = useState(() =>
    typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : true
  )

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'))
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [2, -2]), SPRING)
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-2, 2]), SPRING)

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }, [mouseX, mouseY])

  const handleMouseEnter = useCallback(() => {}, [])
  const handleMouseLeave = useCallback(() => {
    mouseX.set(0)
    mouseY.set(0)
  }, [mouseX, mouseY])

  const accentColor = isDark ? '#8B5CF6' : '#6C2BFF'

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
      }}
      className="relative w-full max-w-xl mx-auto mb-8 px-4"
    >
      {/* Search Input Container */}
      <div
        className={`relative rounded-2xl overflow-hidden transition-all duration-300 flex items-center ${
          isFocused ? 'ring-2' : ''
        }`}
        style={{
          background: isDark
            ? isFocused
              ? 'rgba(30, 42, 58, 0.95)'
              : 'rgba(30, 42, 58, 0.7)'
            : isFocused
              ? 'rgba(255, 255, 255, 0.98)'
              : 'rgba(255, 255, 255, 0.85)',
          borderColor: isFocused
            ? accentColor
            : isDark
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(0, 0, 0, 0.1)',
          borderWidth: '1px',
          boxShadow: isFocused
            ? `0 10px 30px -5px ${accentColor}25`
            : isDark
              ? '0 4px 20px rgba(0, 0, 0, 0.2)'
              : '0 4px 20px rgba(0, 0, 0, 0.05)',
          backdropFilter: 'blur(16px)',
        }}
      >
        {/* Search Icon */}
        <div className="pl-4 pr-2 flex items-center justify-center text-slate-400 dark:text-slate-400 pointer-events-none">
          <Search size={18} style={{ color: isFocused ? accentColor : undefined }} />
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder || 'Search by title, technology, stack...'}
          aria-label={ariaLabel || 'Search projects'}
          className="w-full py-3.5 pr-10 bg-transparent text-sm sm:text-base font-medium outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400"
        />

        {/* Clear Button */}
        <AnimatePresence>
          {value && (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={onClear}
              className="absolute right-3 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors"
              aria-label="Clear search"
            >
              <X size={16} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
