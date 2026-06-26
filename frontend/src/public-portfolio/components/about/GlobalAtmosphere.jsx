import { memo, useMemo } from 'react'

/**
 * GlobalAtmosphere
 *
 * Cinematic environment layer:
 * - Animated subtle noise texture
 * - Light parallax movement on scroll
 * - Soft fog for distant elements
 * - Depth-based blur (far elements = more blur)
 */
const GlobalAtmosphere = memo(function GlobalAtmosphere() {
  // Memoize particles to avoid re-creation
  const atmosphereParticles = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2,
      duration: 20 + Math.random() * 30,
      delay: Math.random() * 15,
      opacity: 0.05 + Math.random() * 0.15,
    })), [])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* ═══════════ Noise Texture ═══════════ */}
      <div
        className="absolute inset-0 opacity-[0.012]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
          animation: 'noiseShift 8s linear infinite',
        }}
      />

      {/* ═══════════ Floating Dust Particles ═══════════ */}
      {atmosphereParticles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: `radial-gradient(circle, rgba(139,92,246,${p.opacity}), transparent)`,
            animation: `atmosphereFloat ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}

      {/* ═══════════ Depth Fog (Bottom) ═══════════ */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[200px]"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(5,2,16,0.4) 60%, rgba(5,2,16,0.8) 100%)',
        }}
      />

      {/* ═══════════ Depth Fog (Top) ═══════════ */}
      <div
        className="absolute top-0 left-0 right-0 h-[150px]"
        style={{
          background: 'linear-gradient(0deg, transparent 0%, rgba(5,2,16,0.3) 100%)',
        }}
      />

      {/* ═══════════ Parallax Grid Lines ═══════════ */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(139,92,246,0.02) 1px, transparent 1px),
            linear-gradient(180deg, rgba(139,92,246,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          animation: 'parallaxGrid 20s linear infinite',
        }}
      />

      {/* CSS Animations */}
      <style>{`
        @keyframes noiseShift {
          0% { transform: translate(0, 0); }
          100% { transform: translate(128px, 128px); }
        }
        @keyframes atmosphereFloat {
          0%, 100% { transform: translateY(0) translateX(0); opacity: var(--tw-opacity, 0.1); }
          25% { transform: translateY(-30px) translateX(15px); }
          50% { transform: translateY(-60px) translateX(-10px); opacity: calc(var(--tw-opacity, 0.1) * 1.3); }
          75% { transform: translateY(-30px) translateX(-15px); }
        }
        @keyframes parallaxGrid {
          0% { transform: translate(0, 0); }
          100% { transform: translate(80px, 80px); }
        }
      `}</style>
    </div>
  )
})

export default GlobalAtmosphere
