import { memo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle2, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function AboutPillarModal({ pillar, isOpen, onClose }) {
  const navigate = useNavigate()

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!pillar) return null

  const { number, title, icon: Icon, description, details = [], targetUrl, targetLabel } = pillar

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-md"
          />

          {/* Modal Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg max-h-[85vh] flex flex-col bg-white dark:bg-[#111728] border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 overflow-hidden"
          >
            {/* Top decorative gradient glow (Charcoal) */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#4A5568] via-[#36454F] to-[#1E252B]" />

            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#36454F] via-[#283238] to-[#1E252B] border border-[#4A5568] flex items-center justify-center text-slate-100 shadow-sm">
                  {Icon && <Icon size={24} />}
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-[#36454F] dark:text-slate-400">
                    // Pillar {number}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {title}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Reading Content Body */}
            <div className="overflow-y-auto pr-2 custom-scrollbar flex-1 my-2">
              {/* Main Description */}
              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed mb-5 font-medium">
                {description}
              </p>

              {/* Key Highlights */}
              {details.length > 0 && (
                <div className="space-y-3 mb-4 bg-slate-50 dark:bg-white/[0.03] p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                    Key Focus & Core Competencies
                  </h4>
                  {details.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                      <CheckCircle2 size={16} className="text-[#36454F] dark:text-slate-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-white/5 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
              >
                Close
              </button>

              {targetUrl && (
                <button
                  type="button"
                  onClick={() => {
                    onClose()
                    navigate(targetUrl)
                    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-[#36454F] via-[#2C3539] to-[#1E252B] hover:from-[#435460] hover:to-[#36454F] text-white flex items-center gap-2 transition-all shadow-md shadow-black/35 hover:scale-105 active:scale-95 cursor-pointer border border-[#4A5568]"
                >
                  <span>{targetLabel || 'Explore More'}</span>
                  <ArrowRight size={15} />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default memo(AboutPillarModal)
