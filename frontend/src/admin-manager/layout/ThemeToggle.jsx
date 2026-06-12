import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const options = [
  { value: 'light', icon: Sun, label: 'Light' },
  { value: 'dark', icon: Moon, label: 'Dark' },
  { value: 'system', icon: Monitor, label: 'System' },
]

export default function ThemeToggle({ compact }) {
  const { theme, setTheme } = useTheme()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!dropdownOpen) return
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setDropdownOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [dropdownOpen])

  if (compact) {
    const current = options.find((o) => o.value === theme) || options[0]
    const Icon = current.icon
    return (
      <div className="relative" ref={ref}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          aria-label={`Theme: ${current.label}`}
        >
          <Icon size={20} />
        </motion.button>
        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-1 w-32 z-50 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-200 dark:border-slate-800 overflow-hidden"
            >
              {options.map(({ value, icon: OptIcon, label }) => (
                <motion.button
                  key={value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setTheme(value); setDropdownOpen(false) }}
                  className={`flex items-center gap-2 px-3 py-2 text-sm w-full text-left transition-colors ${
                    theme === value
                      ? 'bg-primary/10 text-primary dark:bg-primary/20'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <OptIcon size={14} />
                  {label}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100 dark:bg-slate-800">
      {options.map(({ value, icon: Icon, label }) => (
        <motion.button
          key={value}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setTheme(value)}
          className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            theme === value
              ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          {theme === value && (
            <motion.div
              layoutId="themeTab"
              className="absolute inset-0 bg-white dark:bg-slate-700 rounded-lg shadow-sm"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">
            <Icon size={14} />
          </span>
          <span className="relative z-10">{label}</span>
        </motion.button>
      ))}
    </div>
  )
}
