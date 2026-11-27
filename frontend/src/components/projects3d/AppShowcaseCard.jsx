import { useRef, useState, useCallback } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { Star, Smartphone, ExternalLink, Info } from 'lucide-react'
import SmartphoneDevice from './SmartphoneDevice'
import ProjectDetailsModal from './ProjectDetailsModal'

const SPRING = { stiffness: 300, damping: 25, mass: 0.5 }

// Flutter Icon
const FlutterIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M14.28 2.06L3.92 12.42l3.41 3.41 13.78-13.77h-6.83z" fill="#02569B" />
    <path d="M14.28 12.42L8.52 18.18l3.41 3.41 2.35-2.35 5.76-5.76h-5.76v-.06z" fill="#0175C2" />
    <path d="M10.87 15.83l2.84 2.84h5.68l-5.68-5.68-2.84 2.84z" fill="#29B6F6" />
  </svg>
)

// Apple Icon
const AppleIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.14c.66-.8 1.11-1.92.99-3.04-1 .04-2.16.66-2.83 1.45-.59.68-1.11 1.77-.97 2.87 1.11.09 2.19-.57 2.81-1.28z" />
  </svg>
)

// GitHub Icon
const GithubIcon = ({ size = 16, className = '' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
)

export default function AppShowcaseCard({ app, index = 0, shouldReduceMotion, getMediaUrl }) {
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

  const color = '#6C2BFF'
  const thumbUrl = app?.thumbnail ? (getMediaUrl ? getMediaUrl(app.thumbnail) : app.thumbnail) : ''
  const title = app?.title || 'Digital Grade Report Locker'
  const desc = app?.shortDescription || app?.description || 'A modern mobile application for grade reports and student services.'
  const rating = app?.rating || 4.5
  const liveUrl = app?.appUrl || app?.liveDemoUrl || app?.liveUrl || ''
  const repoUrl = app?.githubUrl || app?.repoUrl || ''

  const techs = (app?.features && app?.features.length > 0)
    ? app.features
    : (app?.tags || ['Flutter', 'Dart', 'Firebase', 'Mobile UI'])

  return (
    <>
      <div className="relative flex flex-col items-center justify-between p-1 sm:p-2 select-none w-full h-full">
        {/* ── 3D Thin Mobile-Shaped Card Container ── */}
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
          className="relative z-10 w-full max-w-[300px] sm:max-w-[315px] mx-auto flex-1 flex flex-col justify-between"
        >
          {/* Mobile Chassis Body - Thin Rounded Smartphone Silhouette */}
          <div
            className="w-full h-full rounded-[38px] p-3 sm:p-3.5 bg-[#f8fafc] dark:bg-[#111827] border-2 border-slate-300 dark:border-slate-800 flex flex-col justify-between transition-all duration-300"
            style={{
              boxShadow: isHovered
                ? '0 18px 40px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(0, 0, 0, 0.1)'
                : '0 10px 25px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)',
            }}
          >
            {/* Top: Mobile Speaker / Dynamic Island */}
            <div className="flex items-center justify-center mb-2">
              <div className="w-16 h-3.5 rounded-full bg-slate-900 dark:bg-black border border-slate-700/60 flex items-center justify-center gap-1.5 shadow-inner">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-800 ring-1 ring-slate-600/50" />
                <div className="w-4 h-1 rounded-full bg-slate-800" />
              </div>
            </div>

            {/* Top: 3D Smartphone Device Screen Stage */}
            <div className="relative w-full h-[255px] sm:h-[270px] rounded-[24px] overflow-hidden mb-3 bg-slate-950 flex items-center justify-center shadow-inner shrink-0 border border-slate-800">
              {/* Flutter badge */}
              <div className="absolute top-2 left-2 z-20">
                <div
                  className="w-6 h-6 rounded-lg bg-white/95 dark:bg-slate-800/95 shadow-sm flex items-center justify-center p-0.5 border border-white/60"
                  title="Built with Flutter"
                >
                  <FlutterIcon size={14} />
                </div>
              </div>

              {/* iOS badge */}
              <div className="absolute top-2 right-2 z-20">
                <div
                  className="w-6 h-6 rounded-lg bg-white/95 dark:bg-slate-800/95 shadow-sm flex items-center justify-center p-0.5 border border-white/60 text-slate-800 dark:text-slate-100"
                  title="iOS & Android Supported"
                >
                  <AppleIcon size={13} />
                </div>
              </div>

              {/* The 3D phone device scaled to fit the mobile frame */}
              <div className="transform scale-[0.56] sm:scale-[0.59] origin-center -my-20">
                <SmartphoneDevice
                  app={app}
                  isHovered={isHovered}
                  mouseX={mouseX}
                  mouseY={mouseY}
                  color={color}
                  thumbUrl={thumbUrl}
                />
              </div>
            </div>

            {/* Bottom: Card Content with Name, Status, and Action Buttons */}
            <div className="px-1 text-left flex-1 flex flex-col justify-between pt-1">
              <div>
                {/* Header Tag + Rating */}
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <Smartphone size={12} className="text-indigo-500" />
                    <span>Mobile App</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 font-extrabold text-xs">
                    <Star size={12} className="fill-amber-400 text-amber-500" />
                    <span>{rating}</span>
                  </div>
                </div>

                {/* Headline & Status Badge */}
                <div className="flex items-start justify-between gap-1.5 mb-2">
                  <h3
                    className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight select-none line-clamp-1 leading-snug flex-1"
                    title={title}
                  >
                    {title}
                  </h3>

                  {/* Status Indicator Badge */}
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{app?.status || 'Active'}</span>
                  </span>
                </div>
              </div>

              {/* Bottom Actions Section */}
              <div className="mt-2.5">
                {/* Inset Divider Line */}
                <div className="h-[1px] w-full bg-slate-200 dark:bg-slate-700/80 mb-2.5" />

                {/* 3D Action Buttons Row */}
                <div className="flex items-center gap-1.5">
                  {/* 1. View App Button */}
                  {liveUrl && liveUrl !== '#' && (
                    <a
                      href={liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 px-2.5 rounded-xl bg-[#1e293b] hover:bg-[#0f172a] text-white text-xs font-bold flex items-center justify-center gap-1 active:translate-y-0.5 transition-all select-none cursor-pointer"
                      style={{
                        boxShadow: '0 3.5px 0 #0a0d11, 0 5px 12px rgba(0,0,0,0.3)',
                      }}
                      aria-label={`View app ${title}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink size={13} />
                      <span>App</span>
                    </a>
                  )}

                  {/* 2. Circular Coin Button: [ GitHub ] */}
                  {repoUrl && repoUrl !== '#' && (
                    <a
                      href={repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full bg-white dark:bg-[#1e293b] text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center active:translate-y-0.5 transition-all select-none cursor-pointer shrink-0 border border-slate-200 dark:border-slate-700"
                      style={{
                        boxShadow: '0 3px 0 #cbd5e1, 0 3px 8px rgba(0,0,0,0.08)',
                      }}
                      title="View Source Code"
                      aria-label={`Source code for ${title}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <GithubIcon size={15} />
                    </a>
                  )}

                  {/* 3. Solid Pill Button: [ Details ] */}
                  <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="py-2 px-2.5 rounded-xl bg-white dark:bg-[#1e293b] text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold flex items-center gap-1 active:translate-y-0.5 transition-all select-none cursor-pointer shrink-0 border border-slate-200 dark:border-slate-700"
                    style={{
                      boxShadow: '0 3px 0 #cbd5e1, 0 3px 8px rgba(0,0,0,0.08)',
                    }}
                    title="View full project details"
                  >
                    <Info size={13} />
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
        project={app}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        getMediaUrl={getMediaUrl}
      />
    </>
  )
}
