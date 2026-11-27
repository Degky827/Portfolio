import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, Globe, Layers, Tag, CheckCircle2 } from 'lucide-react'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'

const GithubIcon = ({ size = 16, className = '' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
  </svg>
)

const DEFAULT_THUMBNAIL = 'https://placehold.co/800x500/1E293B/94A3B8?text=Project+Preview'

export default function ProjectDetailsModal({ project, isOpen, onClose, getMediaUrl }) {
  const title = project?.title || ''
  const desc = project?.description || project?.shortDescription || ''
  const techs = project?.technologies || project?.tags || project?.features || []
  const liveUrl = project?.liveDemoUrl || project?.liveUrl || project?.appUrl || ''
  const repoUrl = project?.githubUrl || project?.repoUrl || ''
  const thumbUrl = project?.thumbnail || (project?.images && project?.images[0]) || ''
  const allImages = project?.images || []
  const category = project?.category || 'Project'
  const status = project?.status || ''

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal Container */}
          <motion.div
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#1a1a2e] border border-slate-200 dark:border-slate-800 shadow-2xl z-10 my-auto"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border border-white/20 transition-all hover:scale-110"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {/* Main Preview Image / Screenshot */}
            <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] bg-slate-900 overflow-hidden rounded-t-3xl">
              <img
                src={thumbUrl ? (getMediaUrl ? getMediaUrl(thumbUrl) : thumbUrl) : DEFAULT_THUMBNAIL}
                alt={title}
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  e.target.src = DEFAULT_THUMBNAIL
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#1a1a2e] via-transparent to-black/30" />
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8">
              {/* Header Details */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[var(--accent-projects)]/10 text-[var(--accent-projects)] border border-[var(--accent-projects)]/20">
                  {category}
                </span>
                {status && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold capitalize bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {status.replace('_', ' ')}
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
                {title}
              </h2>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                  Overview
                </h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {desc}
                </p>
              </div>

              {/* Technologies */}
              {techs.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                    Technologies & Stacks
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {techs.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
                      >
                        <Tag size={12} className="text-[var(--accent-projects)]" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional gallery if present */}
              {allImages.length > 1 && (
                <div className="mb-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                    Gallery
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {allImages.slice(1, 6).map((img, i) => (
                      <div key={i} className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                        <img
                          src={getMediaUrl ? getMediaUrl(img) : img}
                          alt={`${title} screenshot ${i + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none'
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons (3D Physical Buttons) */}
              <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-slate-200 dark:border-slate-800">
                {liveUrl && liveUrl !== '#' && (
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl text-white bg-gradient-to-r from-[var(--accent-projects)] via-[#7c3aed] to-[#6d28d9] hover:brightness-110 active:translate-y-0.5 transition-all select-none cursor-pointer"
                    style={{
                      boxShadow: '0 3.5px 0 #4c1d95, 0 6px 14px rgba(108, 43, 255, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
                    }}
                  >
                    <ExternalLink size={16} />
                    Live Preview
                  </a>
                )}
                {repoUrl && repoUrl !== '#' && (
                  <a
                    href={repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-[#1e2532] hover:bg-slate-200 dark:hover:bg-[#283244] border border-slate-200/90 dark:border-slate-700/80 active:translate-y-0.5 transition-all select-none cursor-pointer"
                    style={{
                      boxShadow: '0 3px 0 #cbd5e1, 0 3px 6px rgba(0,0,0,0.06), inset 0 1px 1px rgba(255,255,255,0.8)',
                    }}
                  >
                    <GithubIcon size={16} />
                    View Source
                  </a>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="ml-auto px-4 py-2 text-sm font-bold rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:translate-y-0.5 transition-all border border-slate-200 dark:border-slate-700 select-none cursor-pointer"
                  style={{
                    boxShadow: '0 3px 0 #cbd5e1, 0 3px 6px rgba(0,0,0,0.06)',
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )

  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body)
  }

  return modalContent
}
