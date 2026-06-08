import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'

const variants = {
  success: { icon: CheckCircle, bg: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400' },
  error: { icon: XCircle, bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400' },
  info: { icon: AlertCircle, bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400' },
}

export default function Toast({ message, type = 'success', onClose, duration = 4000 }) {
  const { icon: Icon, bg } = variants[type] || variants.info

  useEffect(() => {
    if (!duration) return
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className={`fixed top-4 right-4 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl border shadow-lg ${bg}`}
        >
          <Icon size={20} />
          <span className="text-sm font-medium">{message}</span>
          <button onClick={onClose} className="ml-2 p-0.5 hover:opacity-70">
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
