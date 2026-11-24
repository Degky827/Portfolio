import { memo } from 'react'
import { motion } from 'framer-motion'

function AboutCenterpiece({ isInView = true }) {
  return (
    <div className="relative w-full max-w-[420px] mx-auto py-4 sm:py-6 flex flex-col items-center justify-center select-none" style={{ perspective: '1200px' }}>
      {/* ── EXPANDING SHOCKWAVE / WAVE EFFECT (Charcoal & Smoked Graphite) ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
        {/* Wave Ring 1 (Immediate charcoal burst) */}
        <motion.div
          initial={{ scale: 0.1, opacity: 0 }}
          animate={
            isInView
              ? {
                  scale: [0.1, 1.6, 3.8],
                  opacity: [0.9, 0.6, 0],
                }
              : {}
          }
          transition={{
            duration: 2.2,
            delay: 0.25,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] rounded-full border-2 border-[#4A5568] dark:border-slate-400 shadow-[0_0_35px_rgba(54,69,79,0.7),inset_0_0_20px_rgba(71,85,105,0.5)]"
        />

        {/* Wave Ring 2 (Secondary ripple) */}
        <motion.div
          initial={{ scale: 0.1, opacity: 0 }}
          animate={
            isInView
              ? {
                  scale: [0.1, 1.9, 4.6],
                  opacity: [0.85, 0.45, 0],
                }
              : {}
          }
          transition={{
            duration: 2.5,
            delay: 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] rounded-full border-2 border-[#36454F] dark:border-slate-500 shadow-[0_0_40px_rgba(44,53,57,0.7),inset_0_0_20px_rgba(54,69,79,0.4)]"
        />

        {/* Wave Ring 3 (Wide panoramic shockwave across section) */}
        <motion.div
          initial={{ scale: 0.1, opacity: 0 }}
          animate={
            isInView
              ? {
                  scale: [0.1, 2.2, 5.5],
                  opacity: [0.8, 0.35, 0],
                }
              : {}
          }
          transition={{
            duration: 2.8,
            delay: 0.85,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] rounded-full border border-[#2C3539]/80 dark:border-slate-600 shadow-[0_0_45px_rgba(30,37,43,0.6)]"
        />

        {/* Luminous expanding charcoal aura disc */}
        <motion.div
          initial={{ scale: 0.1, opacity: 0 }}
          animate={
            isInView
              ? {
                  scale: [0.1, 2.0, 5.0],
                  opacity: [0.65, 0.25, 0],
                }
              : {}
          }
          transition={{
            duration: 2.6,
            delay: 0.35,
            ease: 'easeOut',
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-gradient-to-r from-[#36454F]/30 via-[#2C3539]/25 to-slate-900/20 blur-3xl"
        />

        {/* Continuous gentle ambient ripple pulse */}
        <motion.div
          animate={{
            scale: [1, 1.4, 1.8],
            opacity: [0.35, 0.15, 0],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: 'easeOut',
            delay: 2.8,
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-[#4A5568]/40"
        />
      </div>

      {/* ── 3D FLOOR PEDESTAL (Charcoal & Smoked Graphite) ── */}
      <div
        className="absolute -bottom-8 w-full flex items-center justify-center pointer-events-none z-0"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Ambient Pedestal Glow */}
        <div className="absolute w-[95%] max-w-[400px] h-28 bg-gradient-to-t from-[#36454F]/35 via-[#2C3539]/25 to-transparent rounded-[100%] blur-3xl" />

        {/* Tier 1: Ground Base Shadow Disc */}
        <div
          className="w-[90%] max-w-[360px] h-14 rounded-[100%] bg-slate-900/50 dark:bg-black/70 blur-md"
          style={{ transform: 'rotateX(72deg) translateZ(-25px)' }}
        />

        {/* Tier 2: Outer 3D Charcoal Neon Ring */}
        <div
          className="absolute w-[86%] max-w-[340px] h-12 rounded-[100%] border-2 border-[#4A5568] dark:border-slate-500 bg-gradient-to-b from-[#36454F]/30 via-[#2C3539]/35 to-[#1E252B]/20 shadow-[0_0_30px_rgba(54,69,79,0.6),inset_0_0_15px_rgba(71,85,105,0.4)]"
          style={{ transform: 'rotateX(72deg) translateZ(-10px)' }}
        />

        {/* Tier 3: Inner Glass Podium Surface */}
        <div
          className="absolute w-[76%] max-w-[300px] h-10 rounded-[100%] border border-slate-400/60 bg-gradient-to-t from-white/30 via-[#36454F]/20 to-transparent dark:from-slate-900/60 dark:via-slate-800/40 dark:to-transparent shadow-[0_0_20px_rgba(54,69,79,0.5)]"
          style={{ transform: 'rotateX(72deg) translateZ(0px)' }}
        />
      </div>

      {/* ── 3D CENTRAL HERO PORTRAIT CARD ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.75, y: 40, rotateX: 18 }}
        animate={
          isInView
            ? {
                opacity: 1,
                scale: 1,
                y: 0,
                rotateX: 4,
              }
            : {}
        }
        transition={{
          duration: 0.9,
          delay: 0.1,
          ease: [0.16, 1, 0.3, 1],
        }}
        whileHover={{
          scale: 1.03,
          y: -8,
          rotateX: 0,
          rotateY: 0,
          transition: { duration: 0.3 },
        }}
        className="relative z-10 flex flex-col items-center justify-center group cursor-pointer"
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Soft Ambient Backglow Aura (Charcoal / Smoked Slate) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#36454F]/35 via-[#2C3539]/25 to-transparent rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />

        {/* 3D Extruded Portrait Frame Container */}
        <div
          className="relative rounded-[32px] overflow-hidden p-2 sm:p-2.5
            /* Material & 3D Layered Lighting */
            bg-gradient-to-b from-white via-slate-50 to-slate-100
            dark:from-[#131b2e] dark:via-[#0f1626] dark:to-[#0a0f1c]
            border-2 border-slate-200/90 dark:border-[#4A5568]
            /* Physical 3D Box Shadow with Depth */
            shadow-[0_25px_60px_-10px_rgba(15,23,42,0.32),0_0_30px_rgba(54,69,79,0.22),inset_0_2px_4px_rgba(255,255,255,0.6)]
            dark:shadow-[0_30px_70px_-12px_rgba(0,0,0,0.85),0_0_35px_rgba(54,69,79,0.3),inset_0_1px_2px_rgba(255,255,255,0.1)]
            transition-all duration-300"
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Subtle 3D Glass Sheen Highlight across top */}
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/40 dark:from-white/10 to-transparent pointer-events-none z-20" />

          {/* Portrait Image Layered in 3D */}
          <div style={{ transform: 'translateZ(14px)' }}>
            <img
              src="/desalegn-editor.jpg"
              alt="Desalegn Kasaye - Fullstack and Flutter Developer, Bahirdar"
              className="h-[360px] sm:h-[420px] md:h-[460px] w-auto object-contain rounded-[24px] select-none transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </div>

          {/* 3D Floating Identity Badge in White Background */}
          <div
            className="absolute bottom-4 left-4 right-4 py-2.5 px-3 rounded-2xl bg-white border border-slate-200/95 shadow-[0_16px_36px_rgba(0,0,0,0.28),0_0_15px_rgba(54,69,79,0.15)] flex flex-col items-center justify-center text-center transition-all duration-300 group-hover:translate-y-[-2px]"
            style={{
              transform: 'translateZ(38px)',
            }}
          >
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981] animate-pulse" />
              <h4 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
                Desalegn Kasaye
              </h4>
            </div>
            <p className="text-[10px] sm:text-[11px] font-bold text-slate-700 tracking-tight leading-snug">
              Fullsatck and Flutter Developer , Bahirdar
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default memo(AboutCenterpiece)
