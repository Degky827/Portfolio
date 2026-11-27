import { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useTransform, useSpring, useMotionTemplate } from 'framer-motion'

const SPRING = { stiffness: 300, damping: 30, mass: 0.5 }

function DynamicIsland({ isHovered }) {
  return (
    <motion.div
      className="absolute top-2.5 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center"
      animate={{
        width: isHovered ? 92 : 36,
        height: isHovered ? 26 : 11,
      }}
      transition={{ type: 'spring', stiffness: 420, damping: 28 }}
    >
      <div
        className="w-full h-full rounded-full flex items-center justify-between px-2 overflow-hidden"
        style={{
          background: '#000000',
          boxShadow: '0 2px 4px rgba(0,0,0,0.8), inset 0 0.5px 1px rgba(255,255,255,0.12)',
        }}
      >
        {/* Front Camera Lens Dot */}
        <div className="w-2.5 h-2.5 rounded-full bg-[#0a0a14] ring-1 ring-slate-800/80 flex items-center justify-center">
          <div className="w-1 h-1 rounded-full bg-[#1e2a4a]/60" />
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
            <span className="text-[8px] font-mono font-bold tracking-wider uppercase text-slate-200">
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
        className="absolute right-0 top-20 z-10"
        style={{
          width: 2.5,
          height: 32,
          background: 'linear-gradient(180deg, #3d3e48 0%, #202128 50%, #15161b 100%)',
          borderRadius: '0 2px 2px 0',
          boxShadow: '1px 0 2px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.15)',
        }}
      />
      {/* Action / Mute switch (left side) */}
      <div
        className="absolute left-0 top-14 z-10"
        style={{
          width: 2.5,
          height: 12,
          background: 'linear-gradient(180deg, #3d3e48 0%, #202128 50%, #15161b 100%)',
          borderRadius: '2px 0 0 2px',
          boxShadow: '-1px 0 2px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.15)',
        }}
      />
      {/* Volume Up (left side) */}
      <div
        className="absolute left-0 top-20 z-10"
        style={{
          width: 2.5,
          height: 22,
          background: 'linear-gradient(180deg, #3d3e48 0%, #202128 50%, #15161b 100%)',
          borderRadius: '2px 0 0 2px',
          boxShadow: '-1px 0 2px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.15)',
        }}
      />
      {/* Volume Down (left side) */}
      <div
        className="absolute left-0 top-28 z-10"
        style={{
          width: 2.5,
          height: 22,
          background: 'linear-gradient(180deg, #3d3e48 0%, #202128 50%, #15161b 100%)',
          borderRadius: '2px 0 0 2px',
          boxShadow: '-1px 0 2px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.15)',
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

  // iOS Home Screen System Apps grid
  const homeApps = [
    { name: 'Photos', bg: 'linear-gradient(135deg, #fbcfe8, #f43f5e)', icon: '🌸' },
    { name: 'Safari', bg: 'linear-gradient(135deg, #bae6fd, #0284c7)', icon: '🧭' },
    { name: 'Music', bg: 'linear-gradient(135deg, #fecdd3, #e11d48)', icon: '🎵' },
    { name: 'Settings', bg: 'linear-gradient(135deg, #cbd5e1, #64748b)', icon: '⚙️' },
  ]

  const dockApps = [
    { bg: 'linear-gradient(135deg, #86efac, #16a34a)', icon: '📞' },
    { bg: 'linear-gradient(135deg, #93c5fd, #2563eb)', icon: '✉️' },
    { bg: 'linear-gradient(135deg, #bae6fd, #0284c7)', icon: '🧭' },
    { bg: 'linear-gradient(135deg, #f472b6, #db2777)', icon: '💬' },
  ]

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0c0d14] flex flex-col justify-between">
      {/* ── iOS Wallpaper Background ── */}
      <div className="absolute inset-0 pointer-events-none opacity-60">
        <div className="absolute -top-10 -left-10 w-44 h-44 rounded-full bg-indigo-600/30 blur-2xl" />
        <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-purple-600/30 blur-2xl" />
      </div>

      {/* ── iOS Status Bar ── */}
      <div className="relative z-30 flex items-center justify-between px-5 pt-3 pb-1">
        <span className="text-[9px] font-bold text-white tracking-tight drop-shadow">9:41</span>
        <div className="flex items-center gap-1.5 text-white/90 drop-shadow">
          {/* Signal */}
          <div className="flex items-end gap-0.5 h-2">
            <span className="w-0.5 h-1 bg-white rounded-full" />
            <span className="w-0.5 h-1.5 bg-white rounded-full" />
            <span className="w-0.5 h-2 bg-white rounded-full" />
            <span className="w-0.5 h-2 bg-white/40 rounded-full" />
          </div>
          {/* Wifi */}
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" />
          </svg>
          {/* Battery */}
          <div className="w-4 h-2 border border-white/80 rounded-[3px] p-0.5 flex items-center">
            <div className="w-full h-full bg-emerald-400 rounded-[1px]" />
          </div>
        </div>
      </div>

      {/* ── iOS Home Screen Top Apps Row (Simulated iOS icons) ── */}
      <div className="relative z-20 grid grid-cols-4 gap-1 px-3 mt-1 pointer-events-none">
        {homeApps.map((a, i) => (
          <div key={i} className="flex flex-col items-center">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-xs shadow-md border border-white/10"
              style={{ background: a.bg }}
            >
              <span>{a.icon}</span>
            </div>
            <span className="text-[7px] text-white/80 font-medium mt-0.5 tracking-tight truncate max-w-[36px]">
              {a.name}
            </span>
          </div>
        ))}
      </div>

      {/* ── Auto-Playing Main App Window / Live Showcase Frame ── */}
      <div className="relative z-20 mx-2.5 my-1.5 flex-1 rounded-2xl overflow-hidden border border-white/15 bg-black/80 shadow-2xl flex flex-col">
        {/* App Mini Header inside phone */}
        <div className="h-5 bg-slate-900/90 border-b border-white/10 px-2 flex items-center justify-between text-[8px] text-white/90">
          <span className="font-bold truncate max-w-[110px]">{app.title}</span>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[7px] text-emerald-400 font-mono font-bold uppercase">LIVE</span>
          </div>
        </div>

        {/* Auto-Playing Project Screen View */}
        <div className="relative flex-1 w-full overflow-hidden bg-black">
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
            <div
              className="w-full h-full flex flex-col items-center justify-center p-3 text-center"
              style={{ background: `linear-gradient(135deg, ${color}20 0%, #0d0e18 100%)` }}
            >
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center mb-1 text-white font-bold text-sm shadow-lg"
                style={{ background: color }}
              >
                {app.title?.charAt(0)}
              </div>
              <h5 className="text-[10px] font-bold text-white line-clamp-1">{app.title}</h5>
              <p className="text-[8px] text-slate-300 line-clamp-2 mt-0.5">{app.description}</p>
            </div>
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

      {/* Screen reflections on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-30"
        animate={{
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        style={{
          background: 'linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.08) 45%, transparent 50%)',
        }}
      />
    </div>
  )
}

function PhoneReflection({ mouseX, mouseY, isHovered }) {
  const xPct = useSpring(useTransform(mouseX, [-0.5, 0.5], [0, 100]), SPRING)
  const yPct = useSpring(useTransform(mouseY, [-0.5, 0.5], [0, 100]), SPRING)
  const bg = useMotionTemplate`radial-gradient(ellipse at ${xPct}% ${yPct}%, rgba(255,255,255,0.15) 0%, transparent 50%)`

  return (
    <motion.div
      className="absolute inset-0 rounded-[2.5rem] pointer-events-none z-40"
      animate={{ opacity: isHovered ? 0.8 : 0.3 }}
      transition={{ duration: 0.3 }}
      style={{ background: bg }}
    />
  )
}

function HolographicGlow({ color, isHovered }) {
  return (
    <motion.div
      className="absolute -inset-3 rounded-[3rem] pointer-events-none z-[-1]"
      animate={isHovered ? {
        boxShadow: [
          `0 0 30px ${color}20, 0 0 60px ${color}10, 0 20px 60px rgba(0,0,0,0.4)`,
          `0 0 50px ${color}30, 0 0 100px ${color}15, 0 20px 60px rgba(0,0,0,0.4)`,
          `0 0 30px ${color}20, 0 0 60px ${color}10, 0 20px 60px rgba(0,0,0,0.4)`,
        ],
      } : {
        boxShadow: `0 10px 40px rgba(0,0,0,0.3)`,
      }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

export default function SmartphoneDevice({ app, isHovered, mouseX, mouseY, color, thumbUrl }) {
  const phoneRef = useRef(null)

  return (
    <div className="relative" style={{ perspective: '1200px' }}>
      {/* Shadow on surface */}
      <motion.div
        className="absolute -bottom-6 left-[10%] right-[10%] h-8 rounded-[50%] blur-xl z-0"
        style={{ background: `radial-gradient(ellipse, ${color}25 0%, transparent 70%)` }}
        animate={{
          opacity: isHovered ? 0.9 : 0.4,
          scaleX: isHovered ? 1.1 : 0.9,
          y: isHovered ? 6 : 0,
          blur: isHovered ? 20 : 15,
        }}
        transition={{ duration: 0.4 }}
      />

      {/* Phone body */}
      <motion.div
        ref={phoneRef}
        className="relative mx-auto"
        style={{
          width: 200,
          height: 400,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          y: isHovered ? -12 : 0,
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        {/* Precision Front Bezel Frame (Space Black / Natural Titanium) */}
        <div
          className="absolute inset-0 rounded-[2.5rem] overflow-hidden"
          style={{
            background: `linear-gradient(145deg, 
              #3a3b45 0%, 
              #22232a 20%, 
              #181920 40%, 
              #262730 60%, 
              #16171d 80%, 
              #2f303a 100%)`,
            padding: '2.5px',
            boxShadow: `
              0 14px 32px rgba(0,0,0,0.45),
              0 2px 6px rgba(0,0,0,0.3)
            `,
          }}
        >
          {/* Subtle Brushed Metal Texture Edge */}
          <div
            className="absolute inset-0 rounded-[2.5rem]"
            style={{
              boxShadow: `
                inset 0 1px 1px rgba(255,255,255,0.22),
                inset 0 -1px 2px rgba(0,0,0,0.8),
                inset 1px 0 1px rgba(255,255,255,0.08),
                inset -1px 0 1px rgba(0,0,0,0.5)
              `,
            }}
          />
        </div>

        {/* Side buttons */}
        <SideButtons />

        {/* Deep Black OLED Bezel & Display Face */}
        <div
          className="absolute inset-[3.5px] rounded-[2.15rem] overflow-hidden z-10 bg-black"
          style={{
            boxShadow: `
              inset 0 0 0 1px rgba(0,0,0,0.9),
              inset 0 1px 3px rgba(0,0,0,0.8)
            `,
          }}
        >
          <ScreenContent app={app} color={color} isHovered={isHovered} thumbUrl={thumbUrl} />
        </div>

        {/* Dynamic Island (Front Face) */}
        <DynamicIsland isHovered={isHovered} />

        {/* Phone Front Glass reflection */}
        <PhoneReflection mouseX={mouseX} mouseY={mouseY} isHovered={isHovered} />

        {/* Edge highlight */}
        <motion.div
          className="absolute inset-0 rounded-[2.5rem] pointer-events-none z-50"
          animate={{
            boxShadow: isHovered
              ? `inset 0 1px 1px rgba(255,255,255,0.25), inset 0 -1px 1px rgba(255,255,255,0.12)`
              : `inset 0 1px 1px rgba(255,255,255,0.15), inset 0 -1px 1px rgba(255,255,255,0.06)`,
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      {/* Subtle Phone Desk Shadow */}
      <HolographicGlow color={color} isHovered={isHovered} />
    </div>
  )
}
