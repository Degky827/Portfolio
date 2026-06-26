import { memo } from 'react'

/**
 * CinematicLighting
 *
 * Unified lighting system for all 3D sections:
 * - Primary light: soft blue (top-left direction)
 * - Rim light: purple/pink back glow
 * - Ambient light: low intensity cool gray-blue
 * - Consistent shadow direction across all sections
 */
const CinematicLighting = memo(function CinematicLighting() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* ═══════════ Primary Light (Top-Left Blue) ═══════════ */}
      <div
        className="absolute -top-[200px] -left-[100px] w-[700px] h-[700px]"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(59,130,246,0.08) 0%, transparent 60%)',
          filter: 'blur(60px)',
        }}
      />

      {/* ═══════════ Rim Light (Purple/Pink Back Glow) ═══════════ */}
      <div
        className="absolute -top-[100px] right-[10%] w-[500px] h-[500px]"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(168,85,247,0.06) 0%, transparent 55%)',
          filter: 'blur(50px)',
        }}
      />

      {/* ═══════════ Ambient Light (Cool Gray-Blue) ═══════════ */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px]"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(148,163,184,0.03) 0%, transparent 60%)',
          filter: 'blur(80px)',
        }}
      />

      {/* ═══════════ Consistent Shadow Direction ═══════════ */}
      {/* All shadows cast from top-left to bottom-right */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(59,130,246,0.02) 0%, transparent 30%, transparent 70%, rgba(168,85,247,0.02) 100%)',
        }}
      />

      {/* ═══════════ Light Rays (Subtle) ═══════════ */}
      <div
        className="absolute -top-[300px] -left-[200px] w-[600px] h-[1200px] opacity-[0.02]"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1), transparent 40%)',
          transform: 'rotate(-30deg)',
          filter: 'blur(40px)',
        }}
      />
    </div>
  )
})

export default CinematicLighting
