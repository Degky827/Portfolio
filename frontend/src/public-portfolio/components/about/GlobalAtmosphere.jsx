import { memo, useMemo } from 'react'

/**
 * GlobalAtmosphere
 *
 * Clean, subtle environment layer:
 * - Animated subtle noise texture
 * - Light parallax movement on scroll
 * - Soft fog for distant elements
 * - Depth-based blur (far elements = more blur)
 * - All effects use solid colors, no gradients
 */
const GlobalAtmosphere = memo(function GlobalAtmosphere() {
  // Memoize particles to avoid re-creation
  const atmosphereParticles = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 1.5,
      duration: 25 + Math.random() * 35,
      delay: Math.random() * 20,
      opacity: 0.02 + Math.random() * 0.08,
    })), [])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Noise Texture */}
      <div
        className="absolute inset-0 opacity-[0.008]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
          animation: 'noiseShift 12s linear infinite',
        }}
      />

      {/* Floating Dust Particles - Solid Colors Only */}
      {atmosphereParticles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: `rgba(99, 102, 241, ${p.opacity})`,
            animation: `atmosphereFloat ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}

      {/* Depth Fog (Bottom) - Solid Color */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[200px]"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(11, 13, 16, 0.15) 60%, rgba(11, 13, 16, 0.3) 100%)',
        }}
      />

      {/* Depth Fog (Top) - Solid Color */}
      <div
        className="absolute top-0 left-0 right-0 h-[150px]"
        style={{
          background: 'linear-gradient(0deg, transparent 0%, rgba(11, 13, 16, 0.1) 100%)',
        }}
      />

      {/* Subtle Grid Lines - Solid Colors Only */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(99, 102, 241, 0.01) 1px, transparent 1px),
            linear-gradient(180deg, rgba(99, 102, 241, 0.01) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
          animation: 'parallaxGrid 30s linear infinite',
        }}
      />

      {/* CSS Animations */}
      <style>{`
        @keyframes noiseShift {
          0% { transform: translate(0, 0); }
          100% { transform: translate(128px, 128px); }
        }
        @keyframes atmosphereFloat {
          0%, 100% { transform: translateY(0) translateX(0); opacity: var(--tw-opacity, 0.05); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-40px) translateX(-5px); opacity: calc(var(--tw-opacity, 0.05) * 1.2); }
          75% { transform: translateY(-20px) translateX(-10px); }
        }
        @keyframes parallaxGrid {
          0% { transform: translate(0, 0); }
          100% { transform: translate(100px, 100px); }
        }
      `}</style>
    </div>
  )
})

export default GlobalAtmosphere
