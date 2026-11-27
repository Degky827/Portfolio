import { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useTransform, useSpring, useMotionTemplate } from 'framer-motion'

const SPRING = { stiffness: 300, damping: 30, mass: 0.5 }

function DynamicIsland({ isHovered }) {
  return (
    <motion.div
      className="absolute top-2.5 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center pointer-events-none"
      animate={{
        width: isHovered ? 88 : 42,
        height: isHovered ? 24 : 13,
      }}
      transition={{ type: 'spring', stiffness: 420, damping: 28 }}
    >
      <div
        className="w-full h-full rounded-full flex items-center justify-between px-2 overflow-hidden"
        style={{
          background: '#000000',
          boxShadow: '0 2px 4px rgba(0,0,0,0.8), inset 0 0.5px 1px rgba(255,255,255,0.18)',
        }}
      >
        {/* Front Camera Lens Dot */}
        <div className="w-2.5 h-2.5 rounded-full bg-[#0a0a14] ring-1 ring-slate-800/80 flex items-center justify-center">
          <div className="w-1 h-1 rounded-full bg-[#1e2a4a]/90" />
        </div>

        {/* Live Indicator on hover */}
        {isHovered && (
          <motion.div
            className="flex items-center gap-1.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
            <span className="text-[7.5px] font-mono font-bold tracking-wider uppercase text-slate-200">
              Active
            </span>
          </motion.div>
        )}

        {/* FaceID / Ambient Sensor Dot */}
        <div className="w-1.5 h-1.5 rounded-full bg-[#050508]" />
      </div>
    </motion.div>
  )
}

function SideButtons() {
  return (
    <>
      {/* Power / Lock button (right side) */}
      <div
        className="absolute -right-[3px] top-24 z-10"
        style={{
          width: 3,
          height: 38,
          background: 'linear-gradient(180deg, #8a8d9b 0%, #4a4d58 50%, #20222a 100%)',
          borderRadius: '0 2px 2px 0',
          boxShadow: '1px 0 3px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.4)',
        }}
      />
      {/* Action Switch (left side) */}
      <div
        className="absolute -left-[3px] top-16 z-10"
        style={{
          width: 3,
          height: 14,
          background: 'linear-gradient(180deg, #8a8d9b 0%, #4a4d58 50%, #20222a 100%)',
          borderRadius: '2px 0 0 2px',
          boxShadow: '-1px 0 3px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.4)',
        }}
      />
      {/* Volume Up (left side) */}
      <div
        className="absolute -left-[3px] top-24 z-10"
        style={{
          width: 3,
          height: 26,
          background: 'linear-gradient(180deg, #8a8d9b 0%, #4a4d58 50%, #20222a 100%)',
          borderRadius: '2px 0 0 2px',
          boxShadow: '-1px 0 3px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.4)',
        }}
      />
      {/* Volume Down (left side) */}
      <div
        className="absolute -left-[3px] top-34 z-10"
        style={{
          width: 3,
          height: 26,
          background: 'linear-gradient(180deg, #8a8d9b 0%, #4a4d58 50%, #20222a 100%)',
          borderRadius: '2px 0 0 2px',
          boxShadow: '-1px 0 3px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.4)',
        }}
      />
    </>
  )
}

function ScreenContent({ app, color, isHovered, thumbUrl }) {
  const [videoProgress, setVideoProgress] = useState(0)
  const progressIntervalRef = useRef(null)

  // Auto-play preview scroll simulation
  useEffect(() => {
    progressIntervalRef.current = setInterval(() => {
      setVideoProgress((prev) => (prev >= 100 ? 0 : prev + 0.5))
    }, 100)
    return () => clearInterval(progressIntervalRef.current)
  }, [])

  const panOffset = (Math.sin((videoProgress / 100) * Math.PI * 2 - Math.PI / 2) + 1) * 18 // 0% to 36%

  // iOS Home Screen System Apps matching reference (Pink Camera, Cyan Compass, Coral Music, Purple ?)
  const homeApps = [
    { bg: 'linear-gradient(135deg, #f43f5e 0%, #fb7185 100%)', icon: '🎯' },
    { bg: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)', icon: '🧭' },
    { bg: 'linear-gradient(135deg, #e11d48 0%, #f43f5e 100%)', icon: '🎵' },
    { bg: 'linear-gradient(135deg, #a855f7 0%, #c084fc 100%)', icon: '❓' },
  ]

  // Dock Apps matching reference (Phone, Messages, Safari, Chat)
  const dockApps = [
    { bg: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', icon: '📞' },
    { bg: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', icon: '✉️' },
    { bg: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)', icon: '🧭' },
    { bg: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)', icon: '💬' },
  ]

  const firstLetter = (app?.title || 'D').trim().charAt(0).toUpperCase()

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0c0d18] flex flex-col justify-between select-none">
      {/* ── iOS Wallpaper Background Glow ── */}
      <div className="absolute inset-0 pointer-events-none opacity-50">
        <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-indigo-600/35 blur-2xl" />
        <div className="absolute -bottom-10 -right-10 w-52 h-52 rounded-full bg-purple-600/35 blur-2xl" />
      </div>

      {/* ── iOS Status Bar (9:41, Signal, Wifi, Green Battery) ── */}
      <div className="relative z-30 flex items-center justify-between px-5 pt-3.5 pb-1">
        <span className="text-[10px] font-bold text-white tracking-tight drop-shadow">9:41</span>
        <div className="flex items-center gap-1.5 text-white/90 drop-shadow">
          {/* Signal bars */}
          <div className="flex items-end gap-0.5 h-2.5">
            <span className="w-0.5 h-1 bg-white rounded-full" />
            <span className="w-0.5 h-1.5 bg-white rounded-full" />
            <span className="w-0.5 h-2 bg-white rounded-full" />
            <span className="w-0.5 h-2.5 bg-white rounded-full" />
          </div>
          {/* Wifi */}
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" />
          </svg>
          {/* Battery with green charge */}
          <div className="w-4.5 h-2.5 border border-white/80 rounded-[4px] p-0.5 flex items-center">
            <div className="w-full h-full bg-emerald-400 rounded-[2px]" />
          </div>
        </div>
      </div>

      {/* ── iOS Home Screen Top Apps Row (No labels, clean icons like reference) ── */}
      <div className="relative z-20 flex items-center justify-around px-3 mt-1.5 pointer-events-none">
        {homeApps.map((a, i) => (
          <div
            key={i}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-xs shadow-md border border-white/20"
            style={{ background: a.bg }}
          >
            <span>{a.icon}</span>
          </div>
        ))}
      </div>

      {/* ── Auto-Playing Main App Window / Live Showcase Frame (Matching Reference) ── */}
      <div className="relative z-20 mx-2.5 my-1.5 flex-1 rounded-2xl overflow-hidden border border-white/15 bg-[#121422]/95 shadow-2xl flex flex-col">
        {/* App Mini Header inside phone: [ Title ... 🟢 1.2k ] */}
        <div className="h-5 bg-slate-900/90 border-b border-white/10 px-2.5 flex items-center justify-between text-[8px] text-white/90">
          <span className="font-bold truncate max-w-[110px]">{app.title}</span>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[7.5px] text-emerald-400 font-mono font-bold">1.2k</span>
          </div>
        </div>

        {/* Center App Showcase Screen View */}
        <div className="relative flex-1 w-full overflow-hidden bg-gradient-to-b from-[#131526] to-[#0a0b12] flex flex-col items-center justify-center p-3 text-center">
          {thumbUrl ? (
            <img
              src={thumbUrl}
              alt={app.title}
              className="w-full h-[145%] object-cover object-top transition-transform duration-300 ease-linear pointer-events-none"
              style={{
                transform: `translateY(-${panOffset}%) scale(1.02)`,
                filter: 'brightness(1.04) contrast(1.02)',
              }}
            />
          ) : (
            <>
              {/* Purple squircle badge with initial "D" matching reference */}
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-2 text-white font-black text-xl shadow-lg border border-purple-300/40"
                style={{
                  background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
                  boxShadow: '0 8px 18px rgba(124, 58, 237, 0.45)',
                }}
              >
                {firstLetter}
              </div>
              <h5 className="text-[11px] font-bold text-white line-clamp-1 px-1 tracking-tight">
                {app.title}
              </h5>
              <p className="text-[8px] text-slate-400 line-clamp-2 mt-1 px-2 leading-relaxed">
                {app.description || 'Access your academic records anytime, anywhere.'}
              </p>
            </>
          )}

          {/* Hover Floating "Open App" Quick Button */}
          {app?.appUrl && app.appUrl !== '#' && (
            <motion.div
              initial={false}
              animate={{
                opacity: isHovered ? 1 : 0,
                y: isHovered ? 0 : 8,
                scale: isHovered ? 1 : 0.95,
              }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-[2px] pointer-events-none rounded-xl"
            >
              <a
                href={app.appUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="pointer-events-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:translate-y-0.5 transition-all shadow-[0_4px_0_#1d4ed8,0_8px_16px_rgba(37,99,235,0.4)] border border-blue-400/40 select-none cursor-pointer"
                aria-label={`Open app ${app.title}`}
              >
                <span>↗ Open App</span>
              </a>
            </motion.div>
          )}

          {/* Screen Glass Gradient Sheen */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/50 via-transparent to-black/20" />
        </div>
      </div>

      {/* ── iOS Dock Bar (Bottom) ── */}
      <div className="relative z-20 mx-3 mb-2 p-1.5 rounded-2xl bg-white/15 backdrop-blur-xl border border-white/20 flex items-center justify-around">
        {dockApps.map((d, i) => (
          <div
            key={i}
            className="w-7 h-7 rounded-xl flex items-center justify-center text-xs shadow-md border border-white/10"
            style={{ background: d.bg }}
          >
            <span>{d.icon}</span>
          </div>
        ))}
      </div>

      {/* ── iOS Home Indicator Bar ── */}
      <div className="relative z-30 flex justify-center pb-1">
        <div className="w-20 h-1 rounded-full bg-white/70 shadow-sm" />
      </div>

      {/* Screen reflection highlight */}
      <div
        className="absolute inset-0 pointer-events-none z-30 opacity-40"
        style={{
          background: 'linear-gradient(135deg, transparent 35%, rgba(255,255,255,0.12) 48%, transparent 52%)',
        }}
      />
    </div>
  )
}

export default function SmartphoneDevice({ app, isHovered, mouseX, mouseY, color, thumbUrl }) {
  const phoneRef = useRef(null)

  return (
    <div
      className="relative"
      style={{
        perspective: '1200px',
      }}
    >
      {/* 3D Angled Phone Chassis matching reference photo */}
      <motion.div
        ref={phoneRef}
        className="relative mx-auto"
        style={{
          width: 220,
          height: 440,
          transformStyle: 'preserve-3d',
          transform: 'rotateY(-14deg) rotateX(4deg) rotateZ(-2deg)',
        }}
        animate={{
          y: isHovered ? -8 : 0,
        }}
        transition={{ type: 'spring', stiffness: 220, damping: 22 }}
      >
        {/* Precision Outer Titanium Frame with 3D Depth Edges */}
        <div
          className="absolute inset-0 rounded-[2.6rem] overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, #4b5260 0%, #2b303a 25%, #181a20 50%, #303642 75%, #1b1d24 100%)',
            padding: '3px',
            boxShadow: `
              -6px 8px 18px rgba(0, 0, 0, 0.45),
              0 22px 42px rgba(0, 0, 0, 0.4),
              inset 0 1px 1px rgba(255, 255, 255, 0.35),
              inset -2px 0 3px rgba(0, 0, 0, 0.8)
            `,
          }}
        >
          {/* Subtle Brushed Metal Texture Edge */}
          <div
            className="absolute inset-0 rounded-[2.6rem]"
            style={{
              boxShadow: `
                inset 0 1px 1px rgba(255,255,255,0.25),
                inset 0 -1px 2px rgba(0,0,0,0.8),
                inset 1px 0 1px rgba(255,255,255,0.1),
                inset -2px 0 2px rgba(0,0,0,0.6)
              `,
            }}
          />
        </div>

        {/* Side physical buttons (Power, Action, Volume) */}
        <SideButtons />

        {/* OLED Screen Bezel & Display Face */}
        <div
          className="absolute inset-[3.5px] rounded-[2.3rem] overflow-hidden z-10 bg-black"
          style={{
            boxShadow: `
              inset 0 0 0 1px rgba(0,0,0,0.95),
              inset 0 2px 4px rgba(0,0,0,0.85)
            `,
          }}
        >
          <ScreenContent app={app} color={color} isHovered={isHovered} thumbUrl={thumbUrl} />
        </div>

        {/* Dynamic Island (Front Face) */}
        <DynamicIsland isHovered={isHovered} />

        {/* Gloss Glass Edge Highlight */}
        <div
          className="absolute inset-0 rounded-[2.6rem] pointer-events-none z-50"
          style={{
            boxShadow: 'inset 0 1px 1.5px rgba(255,255,255,0.3), inset 0 -1px 1px rgba(255,255,255,0.1)',
          }}
        />
      </motion.div>
    </div>
  )
}
