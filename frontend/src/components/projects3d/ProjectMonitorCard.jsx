import { useRef, useState, useCallback } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { ExternalLink, Info } from 'lucide-react'
import ProjectDetailsModal from './ProjectDetailsModal'
import WindowsOSScreen from './WindowsOSScreen'

const SPRING = { stiffness: 300, damping: 25, mass: 0.5 }

const GithubIcon = ({ size = 18, className = '' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
)

export default function ProjectMonitorCard({ project, index, shouldReduceMotion, getMediaUrl }) {
  const cardRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), SPRING)
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), SPRING)
  const scale = useSpring(isHovered ? 1.015 : 1, SPRING)

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

  const title = project?.title || 'SHQMS'
  const desc = project?.shortDescription || project?.description || 'A comprehensive Patient management system for tracking and managing quality processes.'
  const techs = project?.technologies?.length ? project.technologies : (project?.tags?.length ? project.tags : ['React', 'Vercel', 'QMS'])
  const liveUrl = project?.liveDemoUrl || project?.liveUrl || project?.appUrl || '#'
  const repoUrl = project?.githubUrl || project?.repoUrl || ''

  return (
    <>
      <div className="relative flex flex-col items-center justify-between p-1 sm:p-2 select-none w-full h-full">
        {/* ── Main Interactive 3D Card (Laptop Display) ── */}
        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: shouldReduceMotion ? 0 : Math.min(index * 0.08, 0.35),
            ease: [0.22, 1, 0.36, 1],
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX: shouldReduceMotion ? 0 : rotateX,
            rotateY: shouldReduceMotion ? 0 : rotateY,
            scale,
            transformStyle: 'preserve-3d',
            perspective: 1000,
          }}
          className="relative z-10 w-full max-w-md mx-auto flex-1 flex flex-col justify-between"
        >
          {/* Card Body - Clean Modern Solid Shadow (No White Gradient Halo) */}
          <div
            className="w-full h-full rounded-[2rem] p-4 sm:p-5 pt-4 bg-[#f8fafc] dark:bg-[#1a202c] border border-slate-200/90 dark:border-slate-800 flex flex-col justify-between transition-all duration-300"
            style={{
              boxShadow: isHovered
                ? '0 16px 36px rgba(0, 0, 0, 0.16), 0 4px 12px rgba(0, 0, 0, 0.08)'
                : '0 10px 25px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)',
            }}
          >
            {/* ── Top: Realistic Laptop Hardware Display ── */}
            <div className="relative w-full mb-4 flex flex-col items-center">
              {/* Laptop Lid (Screen Bezel) */}
              <div className="relative w-full rounded-t-2xl bg-slate-900 border-t border-x border-slate-700/80 shadow-2xl p-2 sm:p-2.5 pb-1">
                {/* Center Top Webcam Notch */}
                <div className="flex items-center justify-center mb-1.5">
                  <div className="w-2 h-2 rounded-full bg-black ring-1 ring-slate-600/60 flex items-center justify-center">
                    <div className="w-0.5 h-0.5 rounded-full bg-emerald-400/80" />
                  </div>
                </div>

                {/* Laptop Inner Screen */}
                <div className="relative w-full rounded-lg overflow-hidden border border-slate-950 bg-black">
                  <WindowsOSScreen
                    project={project}
                    index={index}
                    getMediaUrl={getMediaUrl}
                    autoPlay={true}
                  />
                </div>
              </div>

              {/* Laptop Hinge Connector */}
              <div className="w-28 sm:w-36 h-2 bg-slate-900 dark:bg-black rounded-t-sm -mb-0.5 z-20 shadow-inner" />

              {/* Laptop Lower Base / Keyboard Deck Lip */}
              <div className="relative w-[104%] h-3.5 sm:h-4 rounded-b-xl bg-slate-300 dark:bg-slate-800 border-b border-slate-400 dark:border-slate-950 shadow-md flex items-center justify-center z-10">
                {/* Center Opening Notch (MacBook Style Thumb Recess) */}
                <div className="w-14 sm:w-16 h-1.5 rounded-b-md bg-slate-400 dark:bg-slate-950" />
              </div>

              {/* Laptop Ground Contact Shadow */}
              <div className="w-[88%] h-2 bg-black/15 dark:bg-black/50 blur-[3px] rounded-full mx-auto -mt-0.5 pointer-events-none" />
            </div>

            {/* Bottom: Card Content with Name, Status, and Action Buttons */}
            <div className="px-1 text-left flex-1 flex flex-col justify-between pt-1">
              <div>
                {/* Headline & Status Badge */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3
                    className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight select-none line-clamp-1 leading-snug flex-1"
                    title={title}
                  >
                    {title}
                  </h3>

                  {/* Status Indicator Badge */}
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{project?.status || 'Online'}</span>
                  </span>
                </div>
              </div>

              {/* Bottom Actions Section */}
              <div className="mt-3">
                {/* Inset Divider Line */}
                <div className="h-[1px] w-full bg-slate-200 dark:bg-slate-700/80 mb-3" />

                {/* 3D Action Buttons Row */}
                <div className="flex items-center gap-2">
                  {/* 1. Wide Solid Dark Pill: [ ↗ Live Demo ] */}
                  {liveUrl && liveUrl !== '#' && (
                    <a
                      href={liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 px-3.5 rounded-2xl bg-[#1e293b] hover:bg-[#0f172a] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 active:translate-y-0.5 transition-all select-none cursor-pointer"
                      style={{
                        boxShadow: '0 4px 0 #0a0d11, 0 6px 14px rgba(0,0,0,0.35)',
                      }}
                      aria-label={`Live demo of ${title}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink size={14} />
                      <span>Live Demo</span>
                    </a>
                  )}

                  {/* 2. Circular Solid Coin Button: [ GitHub ] */}
                  {repoUrl && repoUrl !== '#' && (
                    <a
                      href={repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-white dark:bg-[#1e293b] text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center active:translate-y-0.5 transition-all select-none cursor-pointer shrink-0 border border-slate-200 dark:border-slate-700"
                      style={{
                        boxShadow: '0 3.5px 0 #cbd5e1, 0 4px 10px rgba(0,0,0,0.08)',
                      }}
                      title="View Source Code"
                      aria-label={`Source code for ${title}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <GithubIcon size={16} />
                    </a>
                  )}

                  {/* 3. Solid Pill Button: [ ⓘ Details ] */}
                  <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="py-2.5 px-3.5 rounded-2xl bg-white dark:bg-[#1e293b] text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 text-xs sm:text-sm font-bold flex items-center gap-1 active:translate-y-0.5 transition-all select-none cursor-pointer shrink-0 border border-slate-200 dark:border-slate-700"
                    style={{
                      boxShadow: '0 3.5px 0 #cbd5e1, 0 4px 10px rgba(0,0,0,0.08)',
                    }}
                    title="View full project details"
                  >
                    <Info size={14} />
                    <span>Details</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

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
