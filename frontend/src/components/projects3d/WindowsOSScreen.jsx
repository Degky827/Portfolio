import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ExternalLink,
  Minus,
  Square,
  X,
  Search,
  Globe,
  Wifi,
  Volume2,
  Folder,
  Terminal,
  Code2,
  Compass,
  FileCode,
  LayoutGrid,
  RefreshCw,
} from 'lucide-react'

const DEFAULT_THUMBNAIL = 'https://placehold.co/800x500/1E293B/94A3B8?text=Project+Preview'

export default function WindowsOSScreen({
  project,
  index = 0,
  getMediaUrl,
  autoPlay = true,
  className = '',
}) {
  const [videoProgress, setVideoProgress] = useState(0)
  const [showInteractiveIframe, setShowInteractiveIframe] = useState(false)
  const [iframeError, setIframeError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const progressIntervalRef = useRef(null)

  const title = project?.title || 'Web Application'
  const liveUrl = project?.liveDemoUrl || project?.liveUrl || project?.appUrl || ''
  const hasLiveUrl = liveUrl && liveUrl !== '#'
  const thumbUrl = project?.thumbnail || (project?.images && project?.images[0]) || ''
  const imageSrc = thumbUrl ? (getMediaUrl ? getMediaUrl(thumbUrl) : thumbUrl) : DEFAULT_THUMBNAIL

  // Auto-play simulated scroll animation
  useEffect(() => {
    if (autoPlay && !showInteractiveIframe) {
      progressIntervalRef.current = setInterval(() => {
        setVideoProgress((prev) => (prev >= 100 ? 0 : prev + 0.4))
      }, 100)
    } else {
      clearInterval(progressIntervalRef.current)
    }
    return () => clearInterval(progressIntervalRef.current)
  }, [autoPlay, showInteractiveIframe])

  const panOffset = (Math.sin((videoProgress / 100) * Math.PI * 2 - Math.PI / 2) + 1) * 20 // 0% to 40%

  // Simulated Windows desktop icons
  const desktopApps = [
    { name: 'This PC', icon: Folder, color: '#38bdf8' },
    { name: 'Browser', icon: Compass, color: '#f59e0b' },
    { name: 'VS Code', icon: Code2, color: '#3b82f6' },
    { name: 'Terminal', icon: Terminal, color: '#10b981' },
  ]

  return (
    <div
      className={`relative w-full aspect-[16/10] overflow-hidden rounded-t-xl select-none group/win ${className}`}
      style={{
        background: 'radial-gradient(ellipse at center, #1b263b 0%, #0d1b2a 60%, #080d16 100%)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Windows Desktop Wallpaper Elements ── */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/4 w-40 h-40 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-44 h-44 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      {/* ── Windows Desktop Icons (Left Side) ── */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-2 pointer-events-none opacity-80">
        {desktopApps.map((app, i) => {
          const Icon = app.icon
          return (
            <div key={i} className="flex flex-col items-center w-11 p-1 rounded hover:bg-white/10 transition-colors">
              <div
                className="w-6 h-6 rounded flex items-center justify-center shadow-sm"
                style={{ background: 'rgba(255,255,255,0.08)' }}
              >
                <Icon size={13} style={{ color: app.color }} />
              </div>
              <span className="text-[7.5px] font-medium text-slate-200 mt-0.5 tracking-tight text-center leading-none drop-shadow">
                {app.name}
              </span>
            </div>
          )
        })}
      </div>

      {/* ── Active App Window (Running Project Auto-play) ── */}
      <div className="absolute inset-x-12 top-2 bottom-7 z-20 flex flex-col rounded-lg overflow-hidden border border-slate-700/80 bg-slate-900 shadow-2xl backdrop-blur-md">
        {/* Windows Title Bar / Browser Window Header */}
        <div className="h-6 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between px-2.5">
          {/* Tab */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-t bg-slate-800/80 text-[9px] text-slate-200 font-mono max-w-[150px] truncate border-t border-x border-slate-700/60">
            <Globe size={10} className="text-blue-400 shrink-0" />
            <span className="truncate">{title}</span>
          </div>

          {/* Window Controls (Minimize, Maximize, Close) */}
          <div className="flex items-center gap-2 text-slate-400">
            <Minus size={9} className="hover:text-white cursor-pointer" />
            <Square size={8} className="hover:text-white cursor-pointer" />
            <X size={10} className="hover:text-rose-400 cursor-pointer" />
          </div>
        </div>

        {/* Address / URL Bar */}
        <div className="h-5 bg-slate-900/90 border-b border-slate-800/80 flex items-center px-2 gap-2 text-[8.5px] text-slate-400 font-mono">
          <div className="flex items-center gap-1 text-slate-500">
            <span className="text-emerald-400 font-bold">https://</span>
            <span className="text-slate-300 truncate max-w-[160px]">
              {liveUrl ? liveUrl.replace(/^https?:\/\//, '') : `${title.toLowerCase().replace(/\s+/g, '-')}.app`}
            </span>
          </div>
          <div className="ml-auto flex items-center gap-1 text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[7.5px] text-emerald-400 uppercase font-bold tracking-wider">Auto-Playing</span>
          </div>
        </div>

        {/* Browser Content Area (Auto-Playing Project Demo Video/Scroll) */}
        <div className="relative flex-1 w-full overflow-hidden bg-slate-950">
          {showInteractiveIframe && hasLiveUrl && !iframeError ? (
            <iframe
              src={liveUrl}
              title={`${title} Live Demo`}
              className="w-full h-full border-0 pointer-events-auto"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              loading="lazy"
              onError={() => setIframeError(true)}
            />
          ) : (
            <img
              src={imageSrc}
              alt={title}
              className="w-full h-[160%] object-cover object-top transition-transform duration-300 ease-linear pointer-events-none"
              style={{
                transform: `translateY(-${panOffset}%) scale(1.01)`,
                filter: 'brightness(1.05) contrast(1.02)',
              }}
              onError={(e) => {
                e.target.src = DEFAULT_THUMBNAIL
              }}
            />
          )}

          {/* Windows Window Subtle Shadow & Glass Highlight */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>
      </div>

      {/* ── Windows Taskbar at Bottom ── */}
      <div className="absolute bottom-0 inset-x-0 h-6 bg-slate-950/95 backdrop-blur-md border-t border-slate-800/90 flex items-center justify-between px-3 z-30">
        {/* Centered Taskbar Icons (Windows 11 Style) */}
        <div className="flex items-center gap-2 mx-auto">
          {/* Windows Start Logo */}
          <div className="w-4 h-4 grid grid-cols-2 gap-0.5 p-0.5 rounded hover:bg-white/10 cursor-pointer">
            <div className="bg-blue-400 rounded-[0.5px]" />
            <div className="bg-blue-400 rounded-[0.5px]" />
            <div className="bg-blue-400 rounded-[0.5px]" />
            <div className="bg-blue-400 rounded-[0.5px]" />
          </div>

          {/* Search Icon */}
          <div className="w-4 h-4 flex items-center justify-center rounded hover:bg-white/10 text-slate-300 cursor-pointer">
            <Search size={11} />
          </div>

          {/* Active Running App Tab with blue indicator dot */}
          <div className="flex flex-col items-center justify-center px-1.5 py-0.5 rounded bg-white/10 border border-white/10">
            <Compass size={11} className="text-amber-400" />
            <span className="w-1.5 h-0.5 rounded-full bg-blue-400 mt-0.5" />
          </div>

          {/* Secondary Pinned App Icons */}
          <div className="w-4 h-4 flex items-center justify-center rounded hover:bg-white/10 text-slate-400 cursor-pointer">
            <Code2 size={11} />
          </div>
          <div className="w-4 h-4 flex items-center justify-center rounded hover:bg-white/10 text-slate-400 cursor-pointer">
            <Terminal size={11} />
          </div>
        </div>

        {/* Windows System Tray (Right Side) */}
        <div className="flex items-center gap-1.5 text-[8px] font-mono text-slate-300">
          <Wifi size={10} className="text-slate-400" />
          <Volume2 size={10} className="text-slate-400" />
          <span>12:00 PM</span>
        </div>
      </div>
    </div>
  )
}
