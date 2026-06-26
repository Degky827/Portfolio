import { memo } from 'react'

/**
 * ScreenEffects
 *
 * Ambient light effects around the monitor:
 * - Monitor glow (light emission)
 * - Desk platform reflection
 * - Ambient light spread
 */
const ScreenEffects = memo(function ScreenEffects() {
  return (
    <>
      {/* ── Monitor Glow (light emission onto surroundings) ── */}
      <div
        className="absolute -inset-[40px] pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.06) 0%, rgba(99,102,241,0.03) 40%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* ── Desk Platform ── */}
      <div className="relative z-0">
        {/* Desk surface */}
        <div
          className="w-full max-w-[480px] mx-auto h-[3px] rounded-full"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(26,26,46,0.8), rgba(139,92,246,0.2), rgba(26,26,46,0.8), transparent)',
            boxShadow: '0 0 20px rgba(139,92,246,0.08)',
          }}
        />
        {/* Desk reflection */}
        <div
          className="w-full max-w-[400px] mx-auto h-[20px] mt-1"
          style={{
            background: 'linear-gradient(180deg, rgba(139,92,246,0.04), transparent)',
            maskImage: 'linear-gradient(180deg, rgba(0,0,0,0.5), transparent)',
            WebkitMaskImage: 'linear-gradient(180deg, rgba(0,0,0,0.5), transparent)',
          }}
        />
      </div>

      {/* ── Ambient Light Spread ── */}
      <div
        className="absolute -bottom-[60px] left-1/2 -translate-x-1/2 w-[300px] h-[80px] pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse, rgba(139,92,246,0.08), transparent 70%)',
        }}
        aria-hidden="true"
      />
    </>
  )
})

export default ScreenEffects
