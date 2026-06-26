import { memo } from 'react'

/**
 * MonitorScreen
 *
 * Multi-layer glass display:
 *   Layer 1: Glass (physical glass appearance)
 *   Layer 2: Reflection (overhead lighting reflection)
 *   Layer 3: Content (children - code editor)
 *   Layer 4: Screen glow (ambient light emission)
 *   Layer 5: Noise texture (subtle grain)
 *   Layer 6: RGB edges (color fringing)
 */
const MonitorScreen = memo(function MonitorScreen({ children }) {
  return (
    <div className="relative w-full aspect-[16/10] overflow-hidden">
      {/* ── Layer 1: Glass ── */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: 'linear-gradient(180deg, rgba(20,20,40,0.3), rgba(10,10,20,0.1))',
        }}
      />

      {/* ── Layer 2: Reflection ── */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.02) 100%)',
        }}
      >
        {/* Moving reflection sweep */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.03) 45%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.03) 55%, transparent 60%)',
            animation: 'screenReflectionSweep 8s ease-in-out infinite',
          }}
        />
      </div>

      {/* ── Layer 3: Content ── */}
      <div className="relative z-[3] w-full h-full">
        {children}
      </div>

      {/* ── Layer 4: Screen Glow ── */}
      <div
        className="absolute inset-0 z-[4] pointer-events-none"
        style={{
          boxShadow: `
            inset 0 0 60px rgba(139,92,246,0.05),
            inset 0 0 120px rgba(99,102,241,0.03)
          `,
        }}
      />

      {/* ── Layer 5: Noise Texture ── */}
      <div
        className="absolute inset-0 z-[5] pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
        }}
      />

      {/* ── Layer 6: RGB Edges ── */}
      <div className="absolute inset-0 z-[6] pointer-events-none">
        {/* Top RGB fringe */}
        <div
          className="absolute top-0 left-0 right-0 h-[1px]"
          style={{
            background: 'linear-gradient(90deg, rgba(139,92,246,0.3), rgba(34,211,238,0.2), rgba(99,102,241,0.3))',
          }}
        />
        {/* Bottom RGB fringe */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[1px]"
          style={{
            background: 'linear-gradient(90deg, rgba(99,102,241,0.2), rgba(139,92,246,0.3), rgba(34,211,238,0.2))',
          }}
        />
        {/* Left RGB fringe */}
        <div
          className="absolute top-0 bottom-0 left-0 w-[1px]"
          style={{
            background: 'linear-gradient(180deg, rgba(139,92,246,0.25), rgba(99,102,241,0.15), rgba(34,211,238,0.25))',
          }}
        />
        {/* Right RGB fringe */}
        <div
          className="absolute top-0 bottom-0 right-0 w-[1px]"
          style={{
            background: 'linear-gradient(180deg, rgba(34,211,238,0.2), rgba(139,92,246,0.25), rgba(99,102,241,0.2))',
          }}
        />
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes screenReflectionSweep {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
})

export default MonitorScreen
