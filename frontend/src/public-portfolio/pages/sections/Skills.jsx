import EcosystemInteractiveView from '../../../components/skills3d/ecosystem/EcosystemInteractiveView'
import GuillocheWaves from '../../components/ui/GuillocheWaves'

export default function Skills() {
  return (
    <section
      id="skills"
      className="relative w-full min-h-[calc(100vh-5.5rem)] py-2 sm:py-3 lg:py-4 bg-white dark:bg-[#1a1a2e] text-slate-900 dark:text-white transition-colors duration-300 overflow-hidden flex flex-col justify-center"
      aria-label="3D Developer Ecosystem"
    >
      {/* ── Monochromatic Purple Guilloche Ribbon Wave Background (matching About page) ── */}
      <GuillocheWaves className="absolute inset-0 z-0 opacity-45 dark:opacity-35 pointer-events-none" />

      {/* Subtle background glow orbs matching About page */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-slate-700/15 dark:bg-slate-800/25 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-[350px] h-[350px] bg-slate-800/10 dark:bg-slate-900/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-[#2C3539]/10 dark:bg-black/30 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full relative z-10 flex-1 flex flex-col items-center justify-center">
        <EcosystemInteractiveView />
      </div>
    </section>
  )
}
