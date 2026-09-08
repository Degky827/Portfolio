import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, Github } from 'lucide-react'
import { useEffect } from 'react'

const GithubIcon = ({ size = 16, className = '' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
  </svg>
)

const DEFAULT_THUMBNAIL = 'https://placehold.co/800x500/0f172a/475569?text=Project+Screenshot'

export default function ProjectDetailsModal({ project, isOpen, onClose, getMediaUrl }) {
  const title = project?.title || ''
  const desc = project?.description || project?.shortDescription || ''
  const techs = project?.technologies || project?.tags || []
  const liveUrl = project?.liveDemoUrl || project?.liveUrl || '#'
  const repoUrl = project?.githubUrl || project?.repoUrl || ''
  const thumbUrl = project?.thumbnail || (project?.images && project?.images[0]) || ''
  const allImages = project?.images || []
  const color = '#6366f1'

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl"
            style={{
              background: 'linear-gradient(165deg, #1a1a2e 0%, #0f0f1a 50%, #16162a 100%)',
              border: `1px solid ${color}30`,
              boxShadow: `0 40px 100px rgba(0,0,0,0.7), 0 0 60px ${color}10`,
            }}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full transition-all duration-200 hover:scale-110"
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <X size={20} className="text-white" />
            </button>

            {/* Screenshot */}
            <div className="relative w-full aspect-[16/10] overflow-hidden rounded-t-2xl">
              <img
                src={thumbUrl ? (getMediaUrl ? getMediaUrl(thumbUrl) : thumbUrl) : DEFAULT_THUMBNAIL}
                alt={title}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = DEFAULT_THUMBNAIL }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8">
              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">{title}</h2>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: color }}>
                  Description
                </h3>
                <p className="text-sm leading-relaxed text-gray-300 whitespace-pre-wrap">{desc}</p>
              </div>

              {/* Technologies */}
              {techs.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: color }}>
                    Technologies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {techs.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-xs font-medium rounded-full"
                        style={{
                          background: `${color}15`,
                          color: `${color}dd`,
                          border: `1px solid ${color}25`,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional images */}
              {allImages.length > 1 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: color }}>
                    Screenshots
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {allImages.slice(1, 5).map((img, i) => (
                      <div key={i} className="relative aspect-[16/10] rounded-lg overflow-hidden">
                        <img
                          src={getMediaUrl ? getMediaUrl(img) : img}
                          alt={`${title} screenshot ${i + 2}`}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = 'none' }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                {repoUrl && repoUrl !== '#' && (
                  <a
                    href={repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 hover:scale-105"
                    style={{
                      background: `${color}15`,
                      color: color,
                      border: `1px solid ${color}30`,
                    }}
                  >
                    <GithubIcon size={16} />
                    View Source
                  </a>
                )}
                {liveUrl !== '#' && (
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 hover:scale-105"
                    style={{
                      background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
                      color: 'white',
                    }}
                  >
                    <ExternalLink size={16} />
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
