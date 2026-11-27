import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Globe, Code2, Sparkles, Monitor } from 'lucide-react'

export default function WindowsOSScreen({
  project,
  index = 0,
  getMediaUrl,
  autoPlay = true,
  className = '',
}) {
  const [videoProgress, setVideoProgress] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [imageError, setImageError] = useState(false)

  const progressIntervalRef = useRef(null)

  const title = project?.title || 'Web Application'
  const liveUrl = project?.liveDemoUrl || project?.liveUrl || project?.appUrl || ''
  const hasLiveUrl = liveUrl && liveUrl !== '#'
  const thumbUrl = project?.thumbnail || (project?.images && project?.images[0]) || ''
  const hasRealImage = Boolean(thumbUrl) && !imageError
  const imageSrc = thumbUrl ? (getMediaUrl ? getMediaUrl(thumbUrl) : thumbUrl) : ''
  const tags = project?.technologies || project?.tags || ['React', 'Fullstack']

  // Auto-play simulated scroll animation for screenshots
  useEffect(() => {
    if (autoPlay && hasRealImage) {
      progressIntervalRef.current = setInterval(() => {
        setVideoProgress((prev) => (prev >= 100 ? 0 : prev + 0.4))
      }, 100)
    } else {
      clearInterval(progressIntervalRef.current)
    }
    return () => clearInterval(progressIntervalRef.current)
  }, [autoPlay, hasRealImage])

  const panOffset = (Math.sin((videoProgress / 100) * Math.PI * 2 - Math.PI / 2) + 1) * 20

  return (
    <div
      className={`relative w-full aspect-[16/10] overflow-hidden rounded-2xl select-none group/screen border-[2px] border-slate-700/80 bg-slate-950 shadow-2xl ${className}`}
      style={{
        boxShadow: '0 20px 40px rgba(0,0,0,0.6), inset 0 1px 2px rgba(255,255,255,0.25)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Sleek Minimal Monitor Top Bezel (No OS text/windows) ── */}
      <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-800/80 flex items-center justify-between px-3 z-30">
        <div className="flex items-center gap-1.5 opacity-80">
          <div className="w-2 h-2 rounded-full bg-[#ef4444]" />
          <div className="w-2 h-2 rounded-full bg-[#eab308]" />
          <div className="w-2 h-2 rounded-full bg-[#22c55e]" />
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-slate-950 ring-1 ring-slate-600/80 flex items-center justify-center">
          <div className="w-0.5 h-0.5 rounded-full bg-blue-400" />
        </div>
        <div className="w-2 h-2" />
      </div>

      {/* ── Pure Project Preview Area ── */}
      <div className="absolute inset-0 pt-4 w-full h-full bg-slate-950 overflow-hidden flex items-center justify-center">
        {hasRealImage ? (
          /* High-Fidelity Project Screenshot Preview */
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <img
              src={imageSrc}
              alt={title}
              className="w-full h-[160%] object-cover object-top transition-transform duration-300 ease-linear pointer-events-none"
              style={{
                transform: `translateY(-${panOffset}%) scale(1.01)`,
                filter: 'brightness(1.02) contrast(1.02)',
              }}
              onError={() => setImageError(true)}
            />
          </div>
        ) : (
          /* Clean Editor / Canvas Preview (No text clutter, no Windows UI) */
          <div className="relative w-full h-full p-6 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#090d16] flex flex-col justify-between overflow-hidden">
            {/* Ambient Background Grid */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
                backgroundSize: '20px 20px',
              }}
            />

            {/* Subtle Glowing Radial Accent */}
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />

            {/* Top Row: Clean Project Indicator */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                  <Code2 size={15} />
                </div>
                <span className="text-xs font-bold text-white tracking-wide truncate max-w-[180px]">
                  {title}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 text-[9px] font-mono font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live Project</span>
              </div>
            </div>

            {/* Center: Sleek Project Code / Mock Canvas */}
            <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center py-2">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 mb-2 shadow-inner">
                <Monitor size={24} />
              </div>
              <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-[260px]">
                {tags.slice(0, 3).map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 text-[10px] font-mono font-medium rounded-md bg-white/10 text-slate-300 border border-white/5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Subtle Domain Tag */}
            <div className="relative z-10 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span className="truncate max-w-[220px]">
                {liveUrl ? liveUrl.replace(/^https?:\/\//, '') : 'Ready to deploy'}
              </span>
            </div>
          </div>
        )}

        {/* ── Hover Overlay (Only shows on hover) ── */}
        <motion.div
          initial={false}
          animate={{
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 8,
          }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-[3px] pointer-events-none"
        >
          {hasLiveUrl ? (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="pointer-events-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:brightness-110 active:translate-y-0.5 transition-all shadow-[0_4px_0_#312e81,0_8px_18px_rgba(79,70,229,0.45),inset_0_1px_1px_rgba(255,255,255,0.4)] border border-indigo-300/40 select-none cursor-pointer"
              aria-label={`Open preview of ${title}`}
            >
              <ExternalLink size={15} />
              <span>Open Project Preview</span>
            </a>
          ) : (
            <div className="px-4 py-2 rounded-xl text-xs font-semibold text-white/90 bg-white/10 backdrop-blur-md border border-white/20">
              Project Preview Active
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
