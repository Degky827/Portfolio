import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'

export default function ConfirmModal({ open, title, message, onConfirm, onCancel, loading, confirmText = 'Delete', variant = 'danger' }) {
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape' && !loading) onCancel?.()
  }, [loading, onCancel])

  useEffect(() => {
    if (open) document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, handleKeyDown])

  const isDanger = variant === 'danger'
  const accentColor = isDanger ? 'red' : 'primary'

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={!loading ? onCancel : undefined}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/80 dark:border-slate-700/80 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isDanger
                          ? 'bg-red-100 dark:bg-red-900/30'
                          : 'bg-primary/10 dark:bg-primary/20'
                      }`}
                    >
                      <AlertTriangle size={20} className={`${isDanger ? 'text-red-600 dark:text-red-400' : 'text-primary'}`} />
                    </motion.div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
                  </div>
                  {!loading && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={onCancel}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      aria-label="Close modal"
                    >
                      <X size={20} />
                    </motion.button>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">{message}</p>
                <div className="flex gap-3 justify-end">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onCancel}
                    disabled={loading}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 border border-gray-200 dark:border-slate-700"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onConfirm}
                    disabled={loading}
                    className={`px-5 py-2 rounded-xl text-sm font-medium text-white transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm ${
                      isDanger
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-primary hover:bg-primary/90'
                    }`}
                  >
                    {loading && (
                      <div className={`w-4 h-4 border-2 border-white/30 rounded-full animate-spin ${
                        isDanger ? 'border-t-white' : 'border-t-white'
                      }`}
                      />
                    )}
                    {loading ? 'Processing...' : confirmText}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
