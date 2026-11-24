import { memo } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

/**
 * Photorealistic 3D Curled Paper Dog-Ear Corner in Charcoal
 */
function CurledCorner() {
  return (
    <div
      className="absolute -top-[1px] -right-[1px] w-11 h-11 pointer-events-none z-30 overflow-visible"
      style={{ transform: 'translateZ(30px)' }}
    >
      {/* Realistic cast shadow from the folded flap onto paper body */}
      <div className="absolute top-1 right-1 w-8 h-8 bg-black/20 dark:bg-black/60 blur-[4px] rounded-bl-sm pointer-events-none" />

      {/* Folded paper flap SVG */}
      <svg
        viewBox="0 0 40 40"
        className="absolute top-0 right-0 w-11 h-11 drop-shadow-[-4px_5px_6px_rgba(0,0,0,0.22)]"
      >
        <defs>
          <linearGradient id="paperFlapLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#f1f5f9" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>
          <linearGradient id="paperFlapDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="50%" stopColor="#172033" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
        </defs>

        {/* Flap triangle */}
        <path
          d="M 2 2 L 38 38 L 2 38 Z"
          fill="url(#paperFlapLight)"
          className="dark:hidden"
          stroke="rgba(54,69,79,0.35)"
          strokeWidth="1"
        />
        <path
          d="M 2 2 L 38 38 L 2 38 Z"
          fill="url(#paperFlapDark)"
          className="hidden dark:block"
          stroke="rgba(100,116,139,0.4)"
          strokeWidth="1"
        />

        {/* Diagonal crease line */}
        <line
          x1="2"
          y1="2"
          x2="38"
          y2="38"
          stroke="rgba(71,85,105,0.5)"
          strokeWidth="1.2"
        />
      </svg>
    </div>
  )
}

function AboutPillarCard({
  number,
  title,
  description,
  icon: Icon,
  onOpenDetails,
  rhombusSide = 'left', // 'left' | 'right'
  position = 'top-left', // 'top-left' | 'bottom-left' | 'top-right' | 'bottom-right'
  className = '',
  delay = 0.9,
  isInView = true,
}) {
  const isLeft = rhombusSide === 'left' || position.includes('left')
  const isTop = position.includes('top')

  // Side-specific 3D resting angles
  const restingRotateY = isLeft ? 11 : -11
  const restingRotateX = isTop ? -5 : 5

  // Directional swooping vectors for sequential entrance
  const initialX = isLeft ? -280 : 280
  const initialY = isTop ? -50 : 70
  const initialRotateY = isLeft ? 50 : -50
  const initialRotateX = isTop ? -15 : 15

  return (
    <div
      className={`relative ${className}`}
      style={{
        perspective: '1400px',
      }}
    >
      <motion.div
        initial={{
          opacity: 0,
          x: initialX,
          y: initialY,
          rotateY: initialRotateY,
          rotateX: initialRotateX,
          scale: 0.65,
        }}
        animate={
          isInView
            ? {
                opacity: 1,
                x: 0,
                y: 0,
                rotateY: restingRotateY,
                rotateX: restingRotateX,
                scale: 1,
              }
            : {}
        }
        transition={{
          duration: 0.95,
          delay: delay,
          ease: [0.16, 1, 0.3, 1],
        }}
        whileHover={{
          scale: 1.04,
          y: -10,
          rotateY: 0,
          rotateX: 0,
          transition: { duration: 0.3, ease: 'easeOut' },
        }}
        className="relative group cursor-pointer"
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Ambient hover glow aura (Charcoal / Smoked Slate) */}
        <div className="absolute -inset-2 rounded-[30px] bg-gradient-to-br from-[#36454F]/30 via-slate-700/20 to-black/30 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-300 pointer-events-none" />

        {/* 3D Paper Card Body with Slashed Chamfers */}
        <div
          style={{
            clipPath: 'polygon(0 0, calc(100% - 38px) 0, 100% 38px, 100% calc(100% - 18px), calc(100% - 18px) 100%, 0 100%)',
            transformStyle: 'preserve-3d',
          }}
          className={`relative flex flex-col justify-between p-5 sm:p-6 overflow-hidden
            /* 3D Tactile Paper Material (Light Theme) */
            bg-gradient-to-b from-[#ffffff] via-[#fbfcfe] to-[#f3f7fb]
            border border-slate-200/90
            ${
              isLeft
                ? 'shadow-[18px_24px_45px_-8px_rgba(15,23,42,0.18),0_4px_12px_rgba(54,69,79,0.1),inset_0_1px_3px_rgba(255,255,255,0.95)]'
                : 'shadow-[-18px_24px_45px_-8px_rgba(15,23,42,0.18),0_4px_12px_rgba(54,69,79,0.1),inset_0_1px_3px_rgba(255,255,255,0.95)]'
            }
            rounded-l-[24px] rounded-br-[6px]

            /* Blueprint/Cardstock 3D Paper Material (Dark Theme) */
            dark:bg-gradient-to-b dark:from-[#131b2e] dark:via-[#0f1626] dark:to-[#0a0f1c]
            dark:border-[#3E4A52]
            ${
              isLeft
                ? 'dark:shadow-[22px_28px_55px_-10px_rgba(0,0,0,0.8),0_0_20px_rgba(54,69,79,0.2),inset_0_1px_1px_rgba(255,255,255,0.1)]'
                : 'dark:shadow-[-22px_28px_55px_-10px_rgba(0,0,0,0.8),0_0_20px_rgba(54,69,79,0.2),inset_0_1px_1px_rgba(255,255,255,0.1)]'
            }
            group-hover:shadow-[0_28px_60px_-10px_rgba(54,69,79,0.35)]
            transition-shadow duration-300`}
        >
          {/* Curled Top-Right Dog-Ear Corner in 3D */}
          <CurledCorner />

          {/* 3D Diagonal Slash Watermark in Background */}
          <div
            className="absolute -right-2 -bottom-4 text-slate-200/50 dark:text-slate-700/20 font-black text-6xl font-mono select-none pointer-events-none tracking-tighter"
            style={{ transform: 'translateZ(6px)' }}
          >
            //
          </div>

          {/* Card Content with Layered 3D Depth */}
          <div style={{ transformStyle: 'preserve-3d' }}>
            {/* Header Row: Charcoal Icon Badge + Slashed Number Badge */}
            <div className="flex items-center justify-between mb-3.5" style={{ transform: 'translateZ(24px)' }}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#36454F] via-[#283238] to-[#1E252B] dark:from-[#36454F] dark:via-[#242D38] dark:to-[#181E24] border border-[#4A5568] dark:border-slate-600 flex items-center justify-center text-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.35)] shrink-0 group-hover:scale-110 transition-transform">
                {Icon && <Icon size={20} className="drop-shadow-[0_0_4px_rgba(255,255,255,0.25)]" />}
              </div>

              {/* Slash Style Number Badge */}
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 font-mono text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100 shadow-sm">
                <span className="text-[#36454F] dark:text-slate-300 font-bold">//</span>
                <span>{number}</span>
              </div>
            </div>

            {/* Slashed Title in 3D */}
            <h3
              className="text-base sm:text-lg font-black text-slate-900 dark:text-white mb-2 tracking-tight group-hover:text-[#36454F] dark:group-hover:text-slate-200 transition-colors"
              style={{ transform: 'translateZ(18px)' }}
            >
              {title}
            </h3>

            {/* Body Description Text in 3D */}
            <p
              className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal"
              style={{ transform: 'translateZ(12px)' }}
            >
              {description}
            </p>
          </div>

          {/* Bottom Action Row: Slashed Pill Button in 3D */}
          <div
            className="mt-4 pt-2.5 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80"
            style={{ transform: 'translateZ(22px)' }}
          >
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Details /
            </span>

            <button
              type="button"
              onClick={onOpenDetails}
              aria-label={`Learn more about ${title}`}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#36454F]/10 dark:bg-slate-800/80 hover:bg-[#36454F] dark:hover:bg-slate-700 text-[#2C3539] dark:text-slate-200 hover:text-white border border-[#4A5568]/30 dark:border-slate-600 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm group/btn hover:scale-115 active:scale-95"
            >
              <ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default memo(AboutPillarCard)
