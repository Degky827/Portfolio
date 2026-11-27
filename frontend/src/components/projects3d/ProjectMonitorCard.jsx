import { useRef, useState, useCallback } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { ExternalLink, Info, CheckCircle2, Clock, AlertCircle, Monitor } from 'lucide-react'
import ProjectDetailsModal from './ProjectDetailsModal'
import WindowsOSScreen from './WindowsOSScreen'

const SPRING = { stiffness: 300, damping: 25, mass: 0.5 }

const GithubIcon = ({ size = 15, className = '' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
  </svg>
)

const statusMap = {
  completed: { label: 'Completed', color: 'emerald', icon: CheckCircle2 },
  in_progress: { label: 'In Progress', color: 'amber', icon: Clock },
  planned: { label: 'Planned', color: 'blue', icon: AlertCircle },
}

export default function ProjectMonitorCard({ project, index, shouldReduceMotion, getMediaUrl }) {
  const cardRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), SPRING)
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), SPRING)
  const scale = useSpring(isHovered ? 1.02 : 1, SPRING)

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }, [mouseX, mouseY])

  const handleMouseEnter = useCallback(() => setIsHovered(true), [])
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    mouseX.set(0)
    mouseY.set(0)
  }, [mouseX, mouseY])

  const title = project.title || 'Untitled Project'
  const desc = project.shortDescription || project.description || ''
  const techs = project.technologies || project.tags || []
  const liveUrl = project.liveDemoUrl || project.liveUrl || project.appUrl || '#'
  const repoUrl = project.githubUrl || project.repoUrl || ''
  const statusInfo = statusMap[project.status] || null

  return (
    <>
      <motion.div
        ref={cardRef}
        variants={{
          hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 25 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.5,
              delay: shouldReduceMotion ? 0 : (index % 6) * 0.08,
            },
          },
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: shouldReduceMotion ? 0 : rotateX,
          rotateY: shouldReduceMotion ? 0 : rotateY,
          scale,
          transformStyle: 'preserve-3d',
        }}
        className="group relative flex flex-col h-full rounded-2xl overflow-hidden bg-white/90 dark:bg-[#1e2a3a]/90 backdrop-blur-md border border-slate-200/90 dark:border-[#2a3050] shadow-md hover:shadow-2xl hover:border-[var(--accent-projects)]/40 dark:hover:border-[var(--accent-projects)]/50 transition-all duration-300"
      >
        {/* Subtle Ambient Hover Glow */}
        <div
          className="absolute -inset-px rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
          style={{
            background: 'radial-gradient(circle at 50% 0%, rgba(108, 43, 255, 0.15) 0%, transparent 70%)',
          }}
        />

        {/* ── 3D Windows PC / Monitor Screen Frame Top ── */}
        <div className="relative p-3 sm:p-4 pb-0">
          <div className="relative rounded-t-xl overflow-hidden border border-slate-700/80 bg-slate-950 shadow-2xl">
            {/* Top Monitor Bezel with Status / Webcam */}
            <div className="h-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 flex items-center justify-between px-3 border-b border-slate-700/50">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-blue-500/90 shadow-[0_0_4px_#3b82f6]" />
                <span className="text-[8.5px] font-mono text-slate-400">DESKTOP-{String(index + 1).padStart(2, '0')}</span>
              </div>
              {/* Webcam */}
              <div className="w-1.5 h-1.5 rounded-full bg-slate-950 ring-1 ring-slate-600/80 flex items-center justify-center">
                <div className="w-0.5 h-0.5 rounded-full bg-blue-400/80" />
              </div>
              {/* Windows OS Badge */}
              <div className="flex items-center gap-1 text-[9px] font-mono text-slate-300">
                <Monitor size={10} className="text-blue-400" />
                <span>Windows 11</span>
              </div>
            </div>

            {/* Windows OS Desktop Screen Showing Running Project Window & Auto-Play */}
            <WindowsOSScreen
              project={project}
              index={index}
              getMediaUrl={getMediaUrl}
              autoPlay={true}
            />

            {/* Hover Floating "Open Live" Quick Button on Media Frame */}
            {liveUrl && liveUrl !== '#' && (
              <motion.div
                initial={false}
                animate={{
                  opacity: isHovered ? 1 : 0,
                  y: isHovered ? 0 : 8,
                  scale: isHovered ? 1 : 0.92,
                }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-[2px] pointer-events-none"
              >
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white shadow-xl shadow-emerald-500/30 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 hover:scale-105 active:scale-95 transition-all border border-emerald-300/40"
                  aria-label={`Open live demo of ${title}`}
                >
                  <ExternalLink size={15} className="animate-pulse" />
                  Open Live
                </a>
              </motion.div>
            )}

            {/* Bottom Monitor Chin with Brand Badge */}
            <div className="h-4 bg-slate-900 flex items-center justify-between px-3 border-t border-slate-800 text-[9px] font-mono text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-[1px] bg-blue-400" />
                <span>MICROSOFT WINDOWS</span>
              </span>
              <div className="w-8 h-1 rounded-full bg-slate-700/60" />
              <span>4K UHD</span>
            </div>
          </div>
        </div>

        {/* ── Card Content ── */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-[var(--accent-projects)] transition-colors">
                {title}
              </h3>
              {statusInfo && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    statusInfo.color === 'emerald' ? 'bg-emerald-500' : statusInfo.color === 'amber' ? 'bg-amber-500' : 'bg-blue-500'
                  }`} />
                  {statusInfo.label}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-4">
              {desc}
            </p>

            {/* Technology Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4" role="list" aria-label="Project technologies">
              {techs.slice(0, 4).map((tag, i) => (
                <span
                  key={i}
                  role="listitem"
                  className="px-2.5 py-0.5 text-[11px] font-semibold rounded-md bg-[var(--accent-projects)]/10 text-[var(--accent-projects)] border border-[var(--accent-projects)]/20"
                >
                  {tag}
                </span>
              ))}
              {techs.length > 4 && (
                <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                  +{techs.length - 4}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="flex items-center gap-2 pt-3 border-t border-slate-200/80 dark:border-slate-800/80 mt-auto">
            {liveUrl && liveUrl !== '#' && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl text-white bg-[var(--accent-projects)] hover:opacity-95 shadow-sm transition-all"
                aria-label={`Live demo of ${title}`}
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink size={13} />
                Live Demo
              </a>
            )}

            {repoUrl && repoUrl !== '#' && (
              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-slate-700 dark:text-slate-300 hover:text-[var(--accent-projects)] dark:hover:text-[var(--accent-projects)] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 rounded-xl border border-slate-200 dark:border-slate-700 transition-all"
                title="View Source Code"
                aria-label={`Source code for ${title}`}
                onClick={(e) => e.stopPropagation()}
              >
                <GithubIcon size={16} />
              </a>
            )}

            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 transition-all"
              title="View full project details"
            >
              <Info size={13} />
              Details
            </button>
          </div>
        </div>
      </motion.div>

      {/* Details Modal */}
      <ProjectDetailsModal
        project={project}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        getMediaUrl={getMediaUrl}
      />
    </>
  )
}
