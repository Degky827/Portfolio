import { memo } from 'react'

/**
 * CinematicLighting
 *
 * Clean, subtle lighting system for all 3D sections:
 * - Primary light: soft blue (top-left direction)
 * - Rim light: subtle purple back glow
 * - Ambient light: low intensity cool gray-blue
 * - Consistent shadow direction across all sections
 * - All effects use solid colors, no gradients
 */
const CinematicLighting = memo(function CinematicLighting() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Primary Light (Top-Left Blue) */}
      <div
        className="absolute -top-[200px] -left-[100px] w-[700px] h-[700px]"
        style={{
          background: 'rgba(59, 130, 246, 0.03)',
          filter: 'blur(60px)',
          borderRadius: '50%',
        }}
      />

      {/* Rim Light (Purple/Pink Back Glow) */}
      <div
        className="absolute -top-[100px] right-[10%] w-[500px] h-[500px]"
        style={{
          background: 'rgba(139, 92, 246, 0.02)',
          filter: 'blur(50px)',
          borderRadius: '50%',
        }}
      />

      {/* Ambient Light (Cool Gray-Blue) */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px]"
        style={{
          background: 'rgba(148, 163, 184, 0.01)',
          filter: 'blur(80px)',
          borderRadius: '50%',
        }}
      />

      {/* Subtle Light Rays */}
      <div
        className="absolute -top-[300px] -left-[200px] w-[600px] h-[1200px] opacity-[0.01]"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          transform: 'rotate(-30deg)',
          filter: 'blur(40px)',
        }}
      />
    </div>
  )
})

export default CinematicLighting
