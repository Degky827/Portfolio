import { motion } from 'framer-motion'

export default function ThemeToggle({ darkMode, onToggle }) {
  return (
    <motion.button
      className="fixed top-20 right-4 sm:right-6 z-[9998] w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-full bg-white dark:bg-slate-800 shadow-xl border border-gray-100 dark:border-slate-700 flex items-center justify-center text-lg sm:text-2xl hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      onClick={onToggle}
      aria-label={`Switch to ${darkMode ? 'light' : 'dark'} theme`}
    >
      {darkMode ? '\u2600\uFE0F' : '\uD83C\uDF19'}
    </motion.button>
  )
}
