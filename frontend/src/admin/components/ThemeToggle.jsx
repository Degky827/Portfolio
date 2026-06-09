import { motion } from 'framer-motion'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const options = [
  { value: 'light', icon: Sun, label: 'Light' },
  { value: 'dark', icon: Moon, label: 'Dark' },
  { value: 'system', icon: Monitor, label: 'System' },
]

export default function ThemeToggle({ compact }) {
  const { theme, setTheme } = useTheme()

  if (compact) {
    const current = options.find((o) => o.value === theme) || options[0]
    const Icon = current.icon
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          const idx = options.findIndex((o) => o.value === theme)
          setTheme(options[(idx + 1) % options.length].value)
        }}
        className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
        title={`Theme: ${current.label}`}
      >
        <Icon size={20} />
      </motion.button>
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
