import { useRef, useState, useCallback, useMemo } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { Star, Globe, Play, Apple, Smartphone, Info, ExternalLink } from 'lucide-react'
import SmartphoneDevice from './SmartphoneDevice'
import RotatingShowcasePlatform from './RotatingShowcasePlatform'
import ProjectDetailsModal from './ProjectDetailsModal'

const SPRING = { stiffness: 300, damping: 25, mass: 0.5 }

const GithubIcon = ({ size = 15, className = '' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
  </svg>
)

export default function AppShowcaseCard({ app, index, shouldReduceMotion, getMediaUrl }) {
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

  const color = '#6C2BFF'
  const thumbUrl = app.thumbnail ? (getMediaUrl ? getMediaUrl(app.thumbnail) : app.thumbnail) : ''
  const platformIcon = app.platform === 'iOS' ? Apple : app.platform === 'Android' ? Play : Globe
  const platformLabel = app.platform || 'Web App'
  const features = app.features || []

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

        {/* 3D Smartphone Device Mockup Container */}
        <div className="relative pt-6 pb-2 px-4 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/60">
          <SmartphoneDevice
            app={app}
            isHovered={isHovered}
            mouseX={mouseX}
            mouseY={mouseY}
            color={color}
            thumbUrl={thumbUrl}
          />
          <div className="relative -mt-2 mb-2">
            <RotatingShowcasePlatform color={color} isHovered={isHovered} />
          </div>

          {/* Hover Floating "Open Live" Quick Button on Phone Preview */}
          {app.appUrl && app.appUrl !== '#' && (
            <motion.div
              initial={false}
              animate={{
                opacity: isHovered ? 1 : 0,
                y: isHovered ? 0 : 8,
                scale: isHovered ? 1 : 0.92,
              }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 z-30 flex items-center justify-center bg-black/35 backdrop-blur-[2px] pointer-events-none rounded-t-2xl"
            >
              <a
                href={app.appUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white shadow-xl shadow-cyan-500/30 bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-teal-400 hover:scale-105 active:scale-95 transition-all border border-cyan-300/40"
                aria-label={`Open live app ${app.title}`}
              >
                <ExternalLink size={15} className="animate-pulse" />
                Open Live
              </a>
            </motion.div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[var(--accent-projects)]/10 text-[var(--accent-projects)] border border-[var(--accent-projects)]/20">
                {(() => {
                  const PlatformIcon = platformIcon
                  return (
                    <>
                      <PlatformIcon size={11} /> {platformLabel}
                    </>
                  )
                })()}
              </span>

              {app.rating ? (
                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                  <Star size={12} className="fill-amber-400 text-amber-400" />
                  <span>{app.rating}</span>
                </div>
              ) : null}
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-[var(--accent-projects)] transition-colors mb-1">
              {app.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-4">
              {app.description}
            </p>

            {/* Features Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4" role="list" aria-label="App features">
              {features.slice(0, 4).map((f, i) => (
                <span
                  key={i}
                  role="listitem"
                  className="px-2.5 py-0.5 text-[11px] font-semibold rounded-md bg-[var(--accent-projects)]/10 text-[var(--accent-projects)] border border-[var(--accent-projects)]/20"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="flex items-center gap-2 pt-3 border-t border-slate-200/80 dark:border-slate-800/80 mt-auto">
            {app.appUrl && app.appUrl !== '#' && (
              <a
                href={app.appUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl text-white bg-[var(--accent-projects)] hover:opacity-95 shadow-sm transition-all"
                aria-label={`Open ${app.title}`}
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink size={13} />
                Open App
              </a>
            )}

            {app.repoUrl && app.repoUrl !== '#' && (
              <a
                href={app.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-slate-700 dark:text-slate-300 hover:text-[var(--accent-projects)] dark:hover:text-[var(--accent-projects)] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 rounded-xl border border-slate-200 dark:border-slate-700 transition-all"
                title="View Source Code"
                aria-label={`Source code for ${app.title}`}
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
        project={app}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        getMediaUrl={getMediaUrl}
      />
    </>
  )
}
