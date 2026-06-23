import { motion } from 'framer-motion'
import { PORTFOLIO_SECTIONS, getActiveSection } from '../config/portfolioMode'

/**
 * ScrollIndicator
 *
 * Fixed sidebar navigation showing section dots.
 * Highlights the active section and allows click-to-scroll.
 */
export default function ScrollIndicator({ scrollProgress, activeSection, onNavigate }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-end gap-3"
    >
      {PORTFOLIO_SECTIONS.map((section, index) => {
        const isActive = index === activeSection
        return (
          <button
            key={section.id}
            onClick={() => onNavigate(index)}
            className="group flex items-center gap-3"
            aria-label={`Navigate to ${section.label}`}
          >
            <span
              className={`text-xs font-medium transition-all duration-300 ${
                isActive
                  ? 'opacity-100 text-white translate-x-0'
                  : 'opacity-0 text-gray-400 translate-x-2 group-hover:opacity-70 group-hover:translate-x-0'
              }`}
            >
              {section.label}
            </span>
            <span
              className={`block rounded-full transition-all duration-300 ${
                isActive
                  ? 'w-3 h-3 bg-indigo-500 shadow-lg shadow-indigo-500/50'
                  : 'w-2 h-2 bg-gray-500 group-hover:bg-gray-300'
              }`}
            />
          </button>
        )
      })}
    </motion.div>
  )
}
