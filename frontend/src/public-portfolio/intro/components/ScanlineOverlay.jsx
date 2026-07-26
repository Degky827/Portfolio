import { memo } from 'react'

function ScanlineOverlay({ opacity = 0.03, speed = 8 }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity }}>
      <div
        className="w-full h-full"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 1px,
            rgba(6, 182, 212, 0.1) 1px,
            rgba(6, 182, 212, 0.1) 2px
          )`,
          backgroundSize: '100% 4px',
          animation: `scanline-scroll ${speed}s linear infinite`,
        }}
      />
      <style>{`
        @keyframes scanline-scroll {
          from { background-position: 0 0; }
          to { background-position: 0 100vh; }
        }
      `}</style>
    </div>
  )
}

export default memo(ScanlineOverlay)
