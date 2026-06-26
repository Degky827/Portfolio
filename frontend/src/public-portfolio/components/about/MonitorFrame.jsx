import { memo } from 'react'

/**
 * MonitorFrame
 *
 * Premium futuristic monitor frame with:
 * - Metallic matte black finish
 * - Purple RGB edge lighting
 * - Blue neon reflections
 * - Visible thickness (bezel depth)
 * - Bottom LED strip
 * - Power indicator
 * - Premium stand with metal arm, circular base, shadow
 */
const MonitorFrame = memo(function MonitorFrame({ children }) {
  return (
    <div className="relative w-full max-w-[560px] mx-auto">
      {/* ── Monitor Body ── */}
      <div className="relative">
        {/* Outer metallic frame */}
        <div
          className="relative rounded-[16px] sm:rounded-[20px] p-[6px] sm:p-[8px]"
          style={{
            background: 'linear-gradient(145deg, #1a1a2e 0%, #0d0d1a 50%, #1a1a2e 100%)',
            boxShadow: `
              0 0 30px rgba(139,92,246,0.12),
              0 0 60px rgba(99,102,241,0.06),
              inset 0 1px 0 rgba(255,255,255,0.04),
              inset 0 -1px 0 rgba(0,0,0,0.5)
            `,
          }}
        >
          {/* Purple RGB edge lighting - top */}
          <div
            className="absolute top-0 left-[20px] right-[20px] h-[2px] rounded-full opacity-50"
            style={{
              background: 'linear-gradient(90deg, transparent, #8b5cf6, #a78bfa, #8b5cf6, transparent)',
              boxShadow: '0 0 12px rgba(139,92,246,0.6), 0 0 24px rgba(139,92,246,0.3)',
            }}
          />

          {/* Purple RGB edge lighting - left */}
          <div
            className="absolute left-0 top-[20px] bottom-[20px] w-[2px] rounded-full opacity-40"
            style={{
              background: 'linear-gradient(180deg, transparent, #6366f1, #8b5cf6, #6366f1, transparent)',
              boxShadow: '0 0 12px rgba(99,102,241,0.5), 0 0 24px rgba(99,102,241,0.25)',
            }}
          />

          {/* Blue neon reflection - right */}
          <div
            className="absolute right-0 top-[30px] bottom-[30px] w-[2px] rounded-full opacity-30"
            style={{
              background: 'linear-gradient(180deg, transparent, #22d3ee, #3b82f6, #22d3ee, transparent)',
              boxShadow: '0 0 12px rgba(34,211,238,0.4), 0 0 24px rgba(34,211,238,0.2)',
            }}
          />

          {/* Inner bezel */}
          <div
            className="relative rounded-[12px] sm:rounded-[14px] overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, #0a0a14, #080810)',
              boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.8), inset 0 0 2px rgba(0,0,0,0.6)',
            }}
          >
            {/* Screen content */}
            {children}
          </div>

          {/* Bottom LED strip */}
          <div className="flex items-center justify-center gap-3 pt-3 pb-1">
            <div
              className="w-8 h-[2px] rounded-full"
              style={{
                background: 'linear-gradient(90deg, transparent, #8b5cf6, transparent)',
                boxShadow: '0 0 8px rgba(139,92,246,0.5)',
              }}
            />
            {/* Power indicator */}
            <div className="w-2 h-2 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
            <div
              className="w-8 h-[2px] rounded-full"
              style={{
                background: 'linear-gradient(90deg, transparent, #8b5cf6, transparent)',
                boxShadow: '0 0 8px rgba(139,92,246,0.5)',
              }}
            />
          </div>
        </div>

        {/* ── Monitor Stand ── */}
        <div className="relative flex flex-col items-center">
          {/* Metal arm */}
          <div
            className="w-[3px] h-[28px] sm:h-[36px]"
            style={{
              background: 'linear-gradient(180deg, #1a1a2e, #2a2a3e, #1a1a2e)',
              boxShadow: '1px 0 2px rgba(0,0,0,0.5), -1px 0 2px rgba(0,0,0,0.3)',
            }}
          />

          {/* Circular base */}
          <div className="relative">
            <div
              className="w-[100px] sm:w-[120px] h-[8px] sm:h-[10px] rounded-full"
              style={{
                background: 'linear-gradient(180deg, #1a1a2e, #0d0d1a)',
                boxShadow: `
                  0 2px 8px rgba(0,0,0,0.5),
                  0 4px 16px rgba(0,0,0,0.3),
                  inset 0 1px 0 rgba(255,255,255,0.05)
                `,
              }}
            />
            {/* Base LED strip */}
            <div
              className="absolute top-0 left-[15px] right-[15px] h-[1px] rounded-full"
              style={{
                background: 'linear-gradient(90deg, transparent, #8b5cf6, transparent)',
                boxShadow: '0 0 8px rgba(139,92,246,0.4)',
              }}
            />
          </div>

          {/* Contact shadow */}
          <div
            className="w-[140px] sm:w-[160px] h-[6px] rounded-full mt-1"
            style={{
              background: 'radial-gradient(ellipse, rgba(139,92,246,0.15), transparent 70%)',
            }}
          />
        </div>
      </div>
    </div>
  )
})

export default MonitorFrame
