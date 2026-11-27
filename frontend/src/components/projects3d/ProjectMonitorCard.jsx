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
        {/* ── Studio Stage Background: Orbital Rings & Floating Chrome Balls ── */}
        <div className="absolute inset-0 pointer-events-none overflow-visible">
          {/* Upper Left Floating Chrome Ball */}
          <motion.div
            animate={{ y: [-4, 4, -4] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 w-7 h-7 sm:w-9 sm:h-9 rounded-full z-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 35% 30%, #ffffff 0%, #cbd5e1 50%, #64748b 100%)',
              boxShadow: '0 8px 18px rgba(0,0,0,0.25), inset -2px -2px 4px rgba(0,0,0,0.3)',
            }}
          />

          {/* Mid Right Floating Chrome Ball */}
          <motion.div
            animate={{ y: [5, -5, 5] }}
            transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="absolute top-1/3 -right-2 sm:-right-4 w-8 h-8 sm:w-10 sm:h-10 rounded-full z-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 35% 30%, #ffffff 0%, #cbd5e1 50%, #64748b 100%)',
              boxShadow: '0 10px 22px rgba(0,0,0,0.25), inset -2px -2px 4px rgba(0,0,0,0.3)',
            }}
          />

          {/* Lower Left Floating Chrome Ball */}
          <motion.div
            animate={{ y: [-3, 3, -3] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute bottom-12 -left-2 sm:-left-3 w-5 h-5 sm:w-6 sm:h-6 rounded-full z-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 35% 30%, #ffffff 0%, #cbd5e1 50%, #64748b 100%)',
              boxShadow: '0 6px 14px rgba(0,0,0,0.25)',
            }}
          />

          {/* Lower Right Chrome Ball on Ground */}
          <div
            className="absolute bottom-3 right-2 sm:right-4 w-5 h-5 rounded-full z-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 35% 30%, #ffffff 0%, #cbd5e1 50%, #64748b 100%)',
              boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
            }}
          />

          {/* SVG Orbital Wire Rings looping around the card */}
          <svg className="absolute -inset-6 w-[calc(100%+48px)] h-[calc(100%+48px)] pointer-events-none z-0 overflow-visible" viewBox="0 0 600 600">
            <ellipse
              cx="300"
              cy="230"
              rx="270"
              ry="110"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="2.5"
              transform="rotate(-15 300 230)"
              className="opacity-75 dark:opacity-35"
            />
            <ellipse
              cx="300"
              cy="230"
              rx="275"
              ry="90"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="1.8"
              transform="rotate(20 300 230)"
              className="opacity-60 dark:opacity-25"
            />
          </svg>
        </div>

        {/* ── Main Interactive 3D Card (Equal Height & Pinned Actions) ── */}
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
            perspective: 1000,
          }}
          className="relative z-10 w-full max-w-md mx-auto flex-1 flex flex-col justify-between"
        >
          {/* 3D Porcelain / Claymorphic Body */}
          <div
            className="w-full h-full rounded-[2.25rem] p-4 sm:p-5 pt-4 bg-[#f8fafc] dark:bg-[#1a202c] flex flex-col justify-between transition-all duration-300"
            style={{
              boxShadow: isHovered
                ? `0 12px 0 #cfd8e5,
                   0 28px 48px rgba(145, 165, 190, 0.5),
                   -10px -10px 28px rgba(255, 255, 255, 0.98),
                   inset 1px 1px 2px #ffffff`
                : `0 8px 0 #d9e2ee,
                   0 20px 38px rgba(155, 172, 195, 0.4),
                   -8px -8px 24px rgba(255, 255, 255, 0.95),
                   inset 1px 1px 2px #ffffff`,
              border: '1.5px solid rgba(255, 255, 255, 0.95)',
            }}
          >
            {/* Top: 3D Windows PC Monitor Screen */}
            <div className="relative w-full rounded-2xl overflow-hidden mb-3.5 shadow-xl shrink-0">
              <WindowsOSScreen
                project={project}
                index={index}
                getMediaUrl={getMediaUrl}
                autoPlay={true}
              />
            </div>

            {/* Bottom: Card Content with Equalized Heights */}
            <div className="px-1 text-left flex-1 flex flex-col justify-between">
              <div>
                {/* Bold 3D Headline (Fixed min-height for clean alignment across cards) */}
                <h3
                  className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-1 select-none min-h-[3.6rem] line-clamp-2 leading-snug"
                  style={{
                    textShadow: '0 1px 0 rgba(255,255,255,0.8)',
                  }}
                  title={title}
                >
                  {title}
                </h3>

                {/* Description (Fixed 2 lines) */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-3 min-h-[2.6rem] line-clamp-2">
                  {desc}
                </p>

                {/* Raised 3D Soft Clay Tech Pills (Fixed min-height) */}
                <div className="flex flex-wrap items-center gap-1.5 mb-3.5 min-h-[32px]" role="list">
                  {techs.slice(0, 4).map((tech, i) => (
                    <span
                      key={i}
                      role="listitem"
                      className="px-3 py-1 text-[11px] sm:text-xs font-bold rounded-xl text-slate-800 dark:text-slate-200 bg-[#edf2f7] dark:bg-slate-800/90 select-none transition-transform hover:scale-105"
                      style={{
                        boxShadow: '2px 3px 6px rgba(160, 175, 195, 0.45), -2px -2px 6px rgba(255, 255, 255, 0.95), inset 0 1px 1px #fff',
                        border: '1px solid rgba(255, 255, 255, 0.85)',
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Actions Section */}
              <div className="mt-auto">
                {/* Inset Divider Line */}
                <div className="h-[1.5px] w-full bg-slate-200/90 dark:bg-slate-700/60 mb-3" />

                {/* 3D Action Buttons Row */}
                <div className="flex items-center gap-2">
                  {/* 1. Wide Dark Claymorphic Pill: [ ↗ Live Demo ] */}
                  {liveUrl && liveUrl !== '#' && (
                    <a
                      href={liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 px-3.5 rounded-2xl bg-gradient-to-r from-[#2b313a] via-[#1f242b] to-[#14181d] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 hover:brightness-110 active:translate-y-0.5 transition-all select-none cursor-pointer"
                      style={{
                        boxShadow: '0 4px 0 #0a0d11, 0 6px 14px rgba(0,0,0,0.35), inset 0 1px 1px rgba(255,255,255,0.25)',
                      }}
                      aria-label={`Live demo of ${title}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink size={14} />
                      <span>Live Demo</span>
                    </a>
                  )}

                  {/* 2. Circular 3D White Coin Button: [ GitHub ] */}
                  {repoUrl && repoUrl !== '#' && (
                    <a
                      href={repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-white to-[#edf2f7] dark:from-[#252b37] dark:to-[#1a202c] text-slate-800 dark:text-white flex items-center justify-center hover:brightness-105 active:translate-y-0.5 transition-all select-none cursor-pointer shrink-0"
                      style={{
                        boxShadow: '0 3.5px 0 #cbd5e1, 0 4px 10px rgba(0,0,0,0.08), inset 0 1.5px 2px #fff',
                        border: '1px solid rgba(255, 255, 255, 0.9)',
                      }}
                      title="View Source Code"
                      aria-label={`Source code for ${title}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <GithubIcon size={16} />
                    </a>
                  )}

                  {/* 3. White 3D Pill Button: [ ⓘ Details ] */}
                  <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="py-2.5 px-3.5 rounded-2xl bg-gradient-to-br from-white to-[#edf2f7] dark:from-[#252b37] dark:to-[#1a202c] text-slate-800 dark:text-white text-xs sm:text-sm font-bold flex items-center gap-1 hover:brightness-105 active:translate-y-0.5 transition-all select-none cursor-pointer shrink-0"
                    style={{
                      boxShadow: '0 3.5px 0 #cbd5e1, 0 4px 10px rgba(0,0,0,0.08), inset 0 1.5px 2px #fff',
                      border: '1px solid rgba(255, 255, 255, 0.9)',
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

        {/* ── Studio Stage Base: Brushed Chrome Circular Pedestal (Clearly Visible under Card) ── */}
        <div className="relative w-full flex flex-col items-center pointer-events-none -mt-3.5 z-0">
          {/* Top Brushed Metal Disc Extending Outward */}
          <div
            className="w-[88%] sm:w-[94%] max-w-[380px] h-5 rounded-full border-t border-white"
            style={{
              background: 'linear-gradient(180deg, #ffffff 0%, #e2e8f0 40%, #cbd5e1 100%)',
              boxShadow: '0 6px 16px rgba(100, 116, 139, 0.4), inset 0 1px 1px #fff',
            }}
          />
          {/* Beveled Bottom Dark Washer */}
          <div
            className="w-[94%] sm:w-[100%] max-w-[420px] h-3.5 rounded-full -mt-2.5 border-t border-slate-300"
            style={{
              background: 'linear-gradient(180deg, #94a3b8 0%, #64748b 100%)',
              boxShadow: '0 10px 24px rgba(0,0,0,0.3)',
            }}
          />
        </div>
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
