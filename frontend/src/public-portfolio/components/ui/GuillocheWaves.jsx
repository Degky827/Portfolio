import { memo, useMemo } from 'react'

/**
 * GuillocheWaves
 * 
 * Elegant mathematical guilloche / sinusoidal ribbon waves in monochromatic purple (#6C2BFF).
 * Matches the reference visual layout:
 * - Left: harmonic concentric elliptical curves fanning out from the bottom-left behind the text.
 * - Top-Center: elegant oval loops arching over the workstation.
 * - Right: high-density sweeping ribbon curves descending from top-right.
 */
function GuillocheWavesComponent({ className = '' }) {
  // Generate concentric harmonic curves for the left fan (32 curves)
  const leftFanCurves = useMemo(() => {
    const curves = []
    const count = 30
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1)
      const startX = -120 + t * 90
      const startY = 820 - t * 140
      const cp1X = 60 + t * 120
      const cp1Y = 560 - t * 240
      const cp2X = 140 + t * 260
      const cp2Y = 220 - t * 180
      const endX = 380 + t * 320
      const endY = 40 + t * 160
      curves.push({
        d: `M ${startX.toFixed(1)},${startY.toFixed(1)} C ${cp1X.toFixed(1)},${cp1Y.toFixed(1)} ${cp2X.toFixed(1)},${cp2Y.toFixed(1)} ${endX.toFixed(1)},${endY.toFixed(1)}`,
        opacity: 0.18 + t * 0.42,
        strokeWidth: 1.1 + t * 0.4,
      })
    }
    return curves
  }, [])

  // Generate top-center nested loops (arching gracefully above the monitor)
  const centerLoops = useMemo(() => {
    const loops = []
    const count = 22
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1)
      const topY = -120 + t * 50
      const midY = 80 + t * 90
      const bottomY = 220 + t * 110
      const leftX = 760 - t * 70
      const rightX = 940 + t * 90
      const startX = 850 + (t - 0.5) * 35
      loops.push({
        d: `M ${startX.toFixed(1)},${topY.toFixed(1)} C ${leftX.toFixed(1)},${midY.toFixed(1)} ${leftX.toFixed(1)},${bottomY.toFixed(1)} ${startX.toFixed(1)},${bottomY.toFixed(1)} C ${(startX + 50).toFixed(1)},${bottomY.toFixed(1)} ${rightX.toFixed(1)},${midY.toFixed(1)} ${startX.toFixed(1)},${topY.toFixed(1)}`,
        opacity: 0.12 + t * 0.28,
        strokeWidth: 0.95 + t * 0.3,
      })
    }
    return loops
  }, [])

  // Generate dense right sweeping ribbon bundle (36 curves)
  const rightRibbonCurves = useMemo(() => {
    const curves = []
    const count = 38
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1)
      const startX = 1580 - t * 340
      const startY = -90 + t * 110
      const cp1X = 1380 - t * 320
      const cp1Y = 180 + t * 140
      const cp2X = 1120 - t * 180
      const cp2Y = 460 + t * 120
      const endX = 1620 - t * 120
      const endY = 820 + t * 80
      curves.push({
        d: `M ${startX.toFixed(1)},${startY.toFixed(1)} C ${cp1X.toFixed(1)},${cp1Y.toFixed(1)} ${cp2X.toFixed(1)},${cp2Y.toFixed(1)} ${endX.toFixed(1)},${endY.toFixed(1)}`,
        opacity: 0.22 + t * 0.52,
        strokeWidth: 1.15 + t * 0.45,
      })
    }
    return curves
  }, [])

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none z-0 ${className}`}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full object-cover"
        viewBox="0 0 1600 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="waveGradVivid" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6C2BFF" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#8B5CF6" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#A78BFA" stopOpacity="0.55" />
          </linearGradient>
          <linearGradient id="waveGradCenter" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#6C2BFF" stopOpacity="0.35" />
          </linearGradient>
        </defs>

        {/* Left fan harmonic curves */}
        <g>
          {leftFanCurves.map((curve, idx) => (
            <path
              key={`left-${idx}`}
              d={curve.d}
              stroke="url(#waveGradVivid)"
              strokeWidth={curve.strokeWidth}
              strokeOpacity={curve.opacity}
              strokeLinecap="round"
              fill="none"
            />
          ))}
        </g>

        {/* Center loops */}
        <g>
          {centerLoops.map((loop, idx) => (
            <path
              key={`loop-${idx}`}
              d={loop.d}
              stroke="url(#waveGradCenter)"
              strokeWidth={loop.strokeWidth}
              strokeOpacity={loop.opacity}
              strokeLinecap="round"
              fill="none"
            />
          ))}
        </g>

        {/* Right sweeping ribbon bundle */}
        <g>
          {rightRibbonCurves.map((curve, idx) => (
            <path
              key={`right-${idx}`}
              d={curve.d}
              stroke="url(#waveGradVivid)"
              strokeWidth={curve.strokeWidth}
              strokeOpacity={curve.opacity}
              strokeLinecap="round"
              fill="none"
            />
          ))}
        </g>
      </svg>
    </div>
  )
}

export default memo(GuillocheWavesComponent)
