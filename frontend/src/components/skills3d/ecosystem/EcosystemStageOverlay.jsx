import { memo } from 'react'
import {
  Database,
  Terminal,
  Monitor,
  Wrench,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
} from 'lucide-react'
import TechLogo from './TechLogo'
import { ECOSYSTEM_ENVIRONMENTS } from './ecosystemData'

const ICON_MAP = {
  database: Database,
  backend: Terminal,
  frontend: Monitor,
  tools: Wrench,
}

export const EcosystemStageOverlay = memo(function EcosystemStageOverlay({
  onSelectTech,
  activeFilter = 'all',
  darkMode = true,
}) {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 pt-4">
      {ECOSYSTEM_ENVIRONMENTS.map((env) => {
        const Icon = ICON_MAP[env.id] || Database
        const isDimmed = activeFilter !== 'all' && activeFilter !== env.id

        return (
          <div
            key={env.id}
            className={`rounded-2xl border p-5 sm:p-6 transition-all duration-300 relative overflow-hidden backdrop-blur-md ${
              isDimmed ? 'opacity-40 grayscale-30' : 'opacity-100'
            } ${
              darkMode
                ? 'bg-[#101626]/85 border-slate-800 shadow-xl'
                : 'bg-white/90 border-slate-200 shadow-lg'
            }`}
            style={{
              borderTop: `4px solid ${env.themeColor}`,
            }}
          >
            {/* Top Signage & Cable Indicator */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2.5">
                <div
                  className="px-3 py-1.5 rounded-xl font-black text-xs sm:text-sm text-white flex items-center gap-2 shadow-sm"
                  style={{ backgroundColor: env.themeColor }}
                >
                  <Icon size={16} />
                  <span>{env.name}</span>
                </div>
                <span
                  className={`text-xs font-semibold ${
                    darkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  {env.subtitle}
                </span>
              </div>

              {/* Cable Tag */}
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                  darkMode
                    ? 'bg-slate-900/60 border-slate-700/80 text-slate-300'
                    : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: env.cableColor }}
                />
                <span className="hidden sm:inline">Connected</span>
              </div>
            </div>

            {/* Overhead Workflow / Function Placard Banner */}
            <div
              className={`text-xs px-3 py-2 rounded-xl mb-4 font-semibold tracking-wide border flex items-center justify-center text-center ${
                darkMode
                  ? 'bg-slate-900/60 border-slate-800 text-slate-300'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <span>{env.workflowBanner}</span>
            </div>

            {/* Individual Technology Modules */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              {env.technologies.map((tech) => (
                <button
                  key={tech.id}
                  onClick={() => onSelectTech(tech.id)}
                  className={`p-3 rounded-xl border text-left transition-all duration-200 group flex flex-col justify-between hover:scale-[1.02] ${
                    darkMode
                      ? 'bg-slate-900/50 border-slate-800/80 hover:border-slate-600 hover:bg-slate-800/60'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                  style={{
                    borderLeft: `3px solid ${tech.color}`,
                  }}
                >
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <div className="p-1.5 rounded-lg border bg-inherit border-inherit/40 flex items-center justify-center shrink-0">
                      <TechLogo techId={tech.id} size={20} darkMode={darkMode} />
                    </div>
                    <span
                      className="text-[10px] font-black px-1.5 py-0.5 rounded"
                      style={{
                        backgroundColor: `${env.themeColor}1A`,
                        color: env.themeColor,
                      }}
                    >
                      {tech.proficiency}%
                    </span>
                  </div>

                  <div>
                    <div className="text-xs sm:text-sm font-bold group-hover:text-indigo-400 transition-colors flex items-center gap-1 truncate">
                      <span>{tech.name}</span>
                      <ChevronRight
                        size={12}
                        className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                      />
                    </div>
                    <div
                      className={`text-[10px] truncate font-medium mt-0.5 ${
                        darkMode ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      {tech.tagline}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Footer with Small Branching Note */}
            <div
              className={`mt-4 pt-3 border-t flex items-center justify-between text-[11px] font-medium ${
                darkMode
                  ? 'border-slate-800 text-slate-400'
                  : 'border-slate-200 text-slate-500'
              }`}
            >
              <span className="truncate">Branching bus: {env.branchingConnectorType}</span>
              <span
                className="font-bold shrink-0 ml-2"
                style={{ color: env.themeColor }}
              >
                4 Connected Units
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
})

export default EcosystemStageOverlay
