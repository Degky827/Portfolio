import { memo } from 'react'

/**
 * DashboardPlatform
 *
 * Futuristic platform base for statistics cards:
 * - Rounded metallic base
 * - Purple LED strips
 * - Glass edges
 * - Soft reflections
 * - Contact shadows
 * - Depth
 */
const DashboardPlatform = memo(function DashboardPlatform({ children }) {
  return (
    <div className="relative">
      {/* ── Platform Surface ── */}
      <div
        className="relative rounded-[20px] sm:rounded-[28px] p-[3px] sm:p-[4px]"
        style={{
          background: 'linear-gradient(145deg, rgba(26,26,50,0.9), rgba(15,15,30,0.95))',
          boxShadow: `
            0 8px 40px rgba(0,0,0,0.4),
            0 0 60px rgba(139,92,246,0.06),
            inset 0 1px 0 rgba(255,255,255,0.04),
            inset 0 -1px 0 rgba(0,0,0,0.3)
          `,
        }}
      >
        {/* Top LED strip */}
        <div
          className="absolute top-0 left-[30px] right-[30px] h-[1px] rounded-full opacity-40"
          style={{
            background: 'linear-gradient(90deg, transparent, #8b5cf6, #a78bfa, #8b5cf6, transparent)',
            boxShadow: '0 0 10px rgba(139,92,246,0.5), 0 0 20px rgba(139,92,246,0.25)',
          }}
        />

        {/* Left LED strip */}
        <div
          className="absolute left-0 top-[20px] bottom-[20px] w-[1px] rounded-full opacity-30"
          style={{
            background: 'linear-gradient(180deg, transparent, #6366f1, #8b5cf6, #6366f1, transparent)',
            boxShadow: '0 0 8px rgba(99,102,241,0.4)',
          }}
        />

        {/* Right LED strip */}
        <div
          className="absolute right-0 top-[20px] bottom-[20px] w-[1px] rounded-full opacity-25"
          style={{
            background: 'linear-gradient(180deg, transparent, #22d3ee, #3b82f6, #22d3ee, transparent)',
            boxShadow: '0 0 8px rgba(34,211,238,0.35)',
          }}
        />

        {/* Inner content area */}
        <div
          className="relative rounded-[17px] sm:rounded-[25px] overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, rgba(12,6,35,0.6), rgba(8,4,24,0.7))',
          }}
        >
          {/* Glass edge effect */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.1) 100%)',
            }}
          />

          {/* Content */}
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </div>

      {/* ── Contact Shadow ── */}
      <div
        className="absolute -bottom-4 left-[10%] right-[10%] h-8 rounded-[20px]"
        style={{
          background: 'radial-gradient(ellipse, rgba(139,92,246,0.12), transparent 70%)',
          filter: 'blur(8px)',
        }}
        aria-hidden="true"
      />

      {/* ── Platform Reflection ── */}
      <div
        className="absolute -bottom-[30px] left-[5%] right-[5%] h-[30px]"
        style={{
          background: 'linear-gradient(180deg, rgba(139,92,246,0.04), transparent)',
          maskImage: 'linear-gradient(180deg, rgba(0,0,0,0.4), transparent)',
          WebkitMaskImage: 'linear-gradient(180deg, rgba(0,0,0,0.4), transparent)',
        }}
        aria-hidden="true"
      />
    </div>
  )
})

export default DashboardPlatform
