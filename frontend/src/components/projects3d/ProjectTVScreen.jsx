import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, ExternalLink, Tv, Radio, Maximize2, Sparkles, Volume2, VolumeX, Globe } from 'lucide-react'

const DEFAULT_THUMBNAIL = 'https://placehold.co/800x500/1E293B/94A3B8?text=Live+Demo+Preview'

export default function ProjectTVScreen({
  project,
  channelNumber = 1,
  getMediaUrl,
  autoPlay = true,
  className = '',
}) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [showInteractiveIframe, setShowInteractiveIframe] = useState(false)
  const [iframeError, setIframeError] = useState(false)
  const [videoProgress, setVideoProgress] = useState(0)
  const [isMuted, setIsMuted] = useState(true)
  const [showControls, setShowControls] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const progressIntervalRef = useRef(null)
  const controlsTimeoutRef = useRef(null)

  const title = project?.title || 'Live Demo'
  const liveUrl = project?.liveDemoUrl || project?.liveUrl || project?.appUrl || ''
  const hasLiveUrl = liveUrl && liveUrl !== '#'
  const thumbUrl = project?.thumbnail || (project?.images && project?.images[0]) || ''
  const imageSrc = thumbUrl ? (getMediaUrl ? getMediaUrl(thumbUrl) : thumbUrl) : DEFAULT_THUMBNAIL

  // Format channel number (e.g. 1 -> "CH 01")
  const channelTag = `CH ${String(channelNumber).padStart(2, '0')}`

  // Simulate TV video playback progress when playing in video mode
  useEffect(() => {
    if (isPlaying && !showInteractiveIframe) {
      progressIntervalRef.current = setInterval(() => {
        setVideoProgress((prev) => (prev >= 100 ? 0 : prev + 0.5))
      }, 100)
    } else {
      clearInterval(progressIntervalRef.current)
    }
    return () => clearInterval(progressIntervalRef.current)
  }, [isPlaying, showInteractiveIframe])

  // Auto-hide controls when playing and not hovering
  const handleUserActivity = useCallback(() => {
    setShowControls(true)
    clearTimeout(controlsTimeoutRef.current)
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        if (!isHovered) setShowControls(false)
      }, 3500)
    }
  }, [isPlaying, isHovered])

  const togglePlay = useCallback((e) => {
    e?.stopPropagation()
    setIsPlaying((prev) => !prev)
    handleUserActivity()
  }, [handleUserActivity])

  const resetPlayback = useCallback((e) => {
    e?.stopPropagation()
    setVideoProgress(0)
    setIsPlaying(true)
  }, [])

  const toggleIframeMode = useCallback((e) => {
    e?.stopPropagation()
    setShowInteractiveIframe((prev) => !prev)
    setIsPlaying(true)
  }, [])

  // Calculate simulated video scroll offset based on video progress
  // Panning from top of webpage downwards, then smooth reverse
  const panOffset = (Math.sin((videoProgress / 100) * Math.PI * 2 - Math.PI / 2) + 1) * 22 // 0% to 44%

  return (
    <div
      className={`relative w-full aspect-[16/10] overflow-hidden rounded-t-xl bg-slate-950 select-none group/tv ${className}`}
      onMouseMove={handleUserActivity}
      onMouseEnter={() => {
        setIsHovered(true)
        setShowControls(true)
      }}
      onMouseLeave={() => {
        setIsHovered(false)
        if (isPlaying) setShowControls(false)
      }}
    >
      {/* ── TV Screen Background / Video Display ── */}
      {showInteractiveIframe && hasLiveUrl && !iframeError ? (
        /* Real Interactive Live Demo in TV Frame */
        <div className="absolute inset-0 w-full h-full bg-slate-900 z-10">
          <iframe
            src={liveUrl}
            title={`${title} Live Demo`}
            className="w-full h-full border-0 pointer-events-auto"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            loading="lazy"
            onError={() => setIframeError(true)}
          />
        </div>
      ) : (
        /* Simulated Video Stream of the Website */
        <div className="absolute inset-0 w-full h-full overflow-hidden bg-slate-950">
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-[145%] object-cover object-top transition-transform duration-300 ease-linear pointer-events-none"
            style={{
              transform: isPlaying
                ? `translateY(-${panOffset}%) scale(1.02)`
                : 'translateY(0%) scale(1)',
              filter: isPlaying
                ? 'brightness(1.06) contrast(1.04)'
                : 'brightness(0.92)',
            }}
            onError={(e) => {
              e.target.src = DEFAULT_THUMBNAIL
            }}
          />
        </div>
      )}

      {/* ── TV Broadcast Aesthetics (CRT Scanlines & Phosphor Glow) ── */}
      <div
        className="absolute inset-0 pointer-events-none z-20 opacity-35"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.4) 2px, rgba(0, 0, 0, 0.4) 4px)',
        }}
      />

      {/* TV Vignette & Curved Glass Reflection */}
      <div className="absolute inset-0 pointer-events-none z-20 bg-gradient-to-t from-black/75 via-transparent to-black/45" />
      <div className="absolute inset-0 pointer-events-none z-20 bg-gradient-to-tr from-transparent via-white/5 to-white/15" />

      {/* ── TV Broadcast Top Header Bar ── */}
      <div className="absolute top-2 left-2 right-2 z-30 flex items-center justify-between text-[10px] text-white/90 font-mono tracking-wider pointer-events-none">
        {/* Channel & Live Indicator */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/10 shadow-sm">
          <span className="font-bold text-amber-400">{channelTag}</span>
          <span className="text-white/40">•</span>
          <span className="flex items-center gap-1 font-bold text-rose-400">
            <span className={`w-1.5 h-1.5 rounded-full bg-rose-500 ${isPlaying ? 'animate-ping' : ''}`} />
            {isPlaying ? 'LIVE DEMO' : 'STANDBY'}
          </span>
        </div>

        {/* TV Signal / Resolution Badge */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-emerald-400 font-bold">
          <Radio size={10} className="animate-pulse" />
          <span>1080p HD</span>
        </div>
      </div>

      {/* ── TV Video Playback Scrubber & Minimal Info Bar (Auto-plays smoothly without pause button) ── */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-0 left-0 right-0 z-30 p-2 sm:p-2.5 bg-gradient-to-t from-black/90 via-black/70 to-transparent flex flex-col gap-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Scrubber Progress Bar */}
            <div
              className="relative w-full h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer group/scrub"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const clickX = e.clientX - rect.left
                const newPct = (clickX / rect.width) * 100
                setVideoProgress(Math.min(100, Math.max(0, newPct)))
              }}
            >
              <div
                className="h-full bg-rose-500 rounded-full transition-all duration-100"
                style={{ width: `${videoProgress}%` }}
              />
            </div>

            {/* Bottom Controls Row */}
            <div className="flex items-center justify-between text-white text-xs">
              <div className="flex items-center gap-2">
                {/* Auto-Playing Indicator */}
                <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>AUTOPLAY</span>
                </div>

                {/* Restart Video */}
                <button
                  type="button"
                  onClick={resetPlayback}
                  className="p-1 rounded-md hover:bg-white/20 text-white/80 hover:text-white transition-colors"
                  title="Replay from start"
                >
                  <RotateCcw size={12} />
                </button>

                {/* Timestamp */}
                <span className="text-[10px] font-mono text-white/80">
                  {String(Math.floor((videoProgress / 100) * 80)).padStart(2, '0')}:
                  {String(Math.floor((((videoProgress / 100) * 80) % 1) * 60)).padStart(2, '0')} / 01:20
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Interactive Web / TV Video Switcher */}
                {hasLiveUrl && (
                  <button
                    type="button"
                    onClick={toggleIframeMode}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 transition-all ${
                      showInteractiveIframe
                        ? 'bg-[var(--accent-projects)] text-white shadow'
                        : 'bg-white/10 hover:bg-white/20 text-white/90'
                    }`}
                    title={showInteractiveIframe ? 'Switch to TV Video' : 'Switch to Interactive Live App'}
                  >
                    {showInteractiveIframe ? (
                      <>
                        <Tv size={11} /> TV Video
                      </>
                    ) : (
                      <>
                        <Globe size={11} /> Interactive
                      </>
                    )}
                  </button>
                )}

                {/* Simulated Volume Icon */}
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1 rounded-md hover:bg-white/20 text-white/70 hover:text-white transition-colors"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
                </button>

                {/* External Link */}
                {hasLiveUrl && (
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 rounded-md hover:bg-white/20 text-white/80 hover:text-white transition-colors"
                    title="Open Live Website in New Tab"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
