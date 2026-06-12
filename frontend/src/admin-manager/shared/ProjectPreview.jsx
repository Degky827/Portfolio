import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, ExternalLink, ChevronLeft, ChevronRight,
  CheckCircle, Clock, AlertCircle, Star,
} from 'lucide-react'

const statusConfig = {
  completed: { label: 'Completed', classes: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  in_progress: { label: 'In Progress', classes: 'bg-amber-100 text-amber-700', icon: Clock },
  planned: { label: 'Planned', classes: 'bg-blue-100 text-blue-700', icon: AlertCircle },
}

function GithubIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
    </svg>
  )
}

export default function ProjectPreview({ project, onClose }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  if (!project) return null

  const allImages = []
  if (project.thumbnail) allImages.push(project.thumbnail)
  if (project.images && project.images.length > 0) {
    project.images.forEach((img) => {
      if (img !== project.thumbnail) allImages.push(img)
    })
  }

  const currentImage = allImages[currentImageIndex] || null
  const statusInfo = statusConfig[project.status] || statusConfig.completed
  const StatusIcon = statusInfo.icon

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Project Preview</h2>
                {project.featured && (
                  <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-amber-100 text-amber-700">
                    <Star size={10} />
                    Featured
                  </span>
                )}
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400">
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Image Gallery */}
              {allImages.length > 0 && (
                <div className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-800">
                  <img
                    src={currentImage.startsWith('http') ? currentImage : `http://localhost:5000${currentImage}`}
                    alt={project.title}
                    className="w-full aspect-video object-cover"
                  />
                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentImageIndex((i) => (i > 0 ? i - 1 : allImages.length - 1))}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        onClick={() => setCurrentImageIndex((i) => (i < allImages.length - 1 ? i + 1 : 0))}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                      >
                        <ChevronRight size={18} />
                      </button>
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {allImages.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setCurrentImageIndex(i)}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              i === currentImageIndex ? 'bg-white' : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Title & Status */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-xl font-black text-gray-900 dark:text-white">{project.title}</h3>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full shrink-0 ${statusInfo.classes}`}>
                    <StatusIcon size={14} />
                    {statusInfo.label}
                  </span>
                </div>
                <p className="text-sm text-gray-400">{project.category}</p>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Short Description</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{project.shortDescription}</p>
              </div>

              {project.fullDescription && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Full Description</h4>
                  <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: project.fullDescription }} />
                </div>
              )}

              {/* Technologies */}
              {(project.technologies || []).length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Technologies</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-primary/10 text-primary border border-primary/20">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              <div className="flex gap-3">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <GithubIcon size={16} />
                    View Source
                  </a>
                )}
                {project.liveDemoUrl && (
                  <a
                    href={project.liveDemoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors"
                  >
                    <ExternalLink size={16} />
                    Live Demo
                  </a>
                )}
              </div>

              {/* SEO Info */}
              {(project.metaTitle || project.metaDescription || project.keywords) && (
                <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">SEO Preview</h4>
                  {project.metaTitle && (
                    <p className="text-sm text-primary font-medium truncate">{project.metaTitle}</p>
                  )}
                  {project.metaDescription && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{project.metaDescription}</p>
                  )}
                  {project.keywords && (
                    <p className="text-[10px] text-gray-400">{project.keywords}</p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
