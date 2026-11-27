import { motion } from 'framer-motion'
import EcosystemInteractiveView from '../../../components/skills3d/ecosystem/EcosystemInteractiveView'
import GuillocheWaves from '../../components/ui/GuillocheWaves'

export default function Skills() {
  return (
    <section
      id="skills"
      className="relative w-full min-h-screen py-12 sm:py-16 bg-white dark:bg-[#1a1a2e] text-slate-900 dark:text-white transition-colors duration-300 overflow-hidden flex flex-col justify-start"
      aria-label="3D Developer Ecosystem"
    >
      {/* ── Monochromatic Purple Guilloche Ribbon Wave Background (matching other pages) ── */}
      <GuillocheWaves className="absolute inset-0 z-0 opacity-45 dark:opacity-35 pointer-events-none" />

      {/* Subtle background glow orbs matching other pages */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-slate-700/15 dark:bg-slate-800/25 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-[350px] h-[350px] bg-slate-800/10 dark:bg-slate-900/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-[#2C3539]/10 dark:bg-black/30 rounded-full blur-[100px] pointer-events-none" />

      {/* ── Fixed Top Header Matching About, Experience & Testimonials ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 sm:mb-8"
        >
          {/* 3D Extruded Title: What am I know? (Refined minimized text size) */}
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 tracking-wider uppercase font-sans select-none transition-transform duration-300 hover:scale-[1.02] text-[#1E252B] dark:text-[#E2E8F0]"
            style={{
              textShadow: `
                0 1px 0 #64748b,
                0 2px 0 #475569,
                0 3px 0 #334155,
                0 4px 0 #1e293b,
                0 5px 0 #1e252b,
                0 6px 1px rgba(0, 0, 0, 0.3),
                0 8px 18px rgba(30, 37, 43, 0.4)
              `,
            }}
          >
            What am I know?
          </h2>

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed px-4 font-normal">
            A 3D developer ecosystem of my core competencies, programming languages, and architecture tools.
          </p>

          {/* Decorative Diamond Accent Line: <> ◇ <> matching other pages */}
          <div className="flex items-center justify-center gap-3 mt-5">
            <div className="h-[1.5px] w-14 sm:w-20 bg-gradient-to-r from-transparent via-[#36454F] dark:via-slate-400 to-transparent" />
            <div className="w-2.5 h-2.5 rotate-45 border-2 border-[#36454F] dark:border-slate-300 shadow-[0_0_12px_rgba(54,69,79,0.6)] dark:shadow-[0_0_12px_rgba(255,255,255,0.4)]" />
            <div className="h-[1.5px] w-14 sm:w-20 bg-gradient-to-r from-transparent via-[#36454F] dark:via-slate-400 to-transparent" />
          </div>
        </motion.div>
      </div>

      {/* ── 3D Interactive Ecosystem Canvas ── */}
      <div className="w-full relative z-10 flex-1 flex flex-col items-center justify-center">
        <EcosystemInteractiveView />
      </div>
    </section>
  )
}
