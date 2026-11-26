import { memo } from 'react'
import { motion } from 'framer-motion'
import {
  Database,
  Terminal,
  Monitor,
  Wrench,
  CheckCircle2,
  ExternalLink,
  Cpu,
} from 'lucide-react'
import TechLogo from './TechLogo'
import { ECOSYSTEM_ENVIRONMENTS } from './ecosystemData'

const ICON_MAP = {
  database: Database,
  backend: Terminal,
  frontend: Monitor,
  tools: Wrench,
}

export const ArchitectureListView = memo(function ArchitectureListView({
  onSelectTech,
  darkMode = true,
  activeFilter = 'all',
}) {
  const filteredEnvs =
    activeFilter === 'all'
      ? ECOSYSTEM_ENVIRONMENTS
      : ECOSYSTEM_ENVIRONMENTS.filter((e) => e.id === activeFilter)

  return (
    <div className="space-y-8 sm:space-y-12">
      {filteredEnvs.map((env, envIdx) => {
        const Icon = ICON_MAP[env.id] || Cpu
        return (
          <motion.div
            key={env.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4, delay: envIdx * 0.1 }}
            className={`rounded-3xl border p-6 sm:p-8 transition-shadow relative overflow-hidden ${
              darkMode
                ? 'bg-[#101522] border-slate-800 shadow-xl'
                : 'bg-white border-slate-200 shadow-lg'
            }`}
          >
            {/* Left Accent Stripe */}
            <div
              className="absolute top-0 left-0 bottom-0 w-2"
              style={{ backgroundColor: env.themeColor }}
            />

            {/* Header of Pod */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-inherit/40">
              <div className="flex items-center gap-3.5">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md"
                  style={{ backgroundColor: env.themeColor }}
                >
                  <Icon size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                      {env.name} Environment
                    </h3>
                    <span
                      className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white uppercase tracking-wider"
                      style={{ backgroundColor: env.themeColor }}
                    >
                      {env.subtitle}
                    </span>
                  </div>
                  <p
                    className={`text-xs sm:text-sm mt-1 font-medium ${
                      darkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    {env.workflowBanner}
                  </p>
                </div>
              </div>

              {/* Physical Cable Connection Badge */}
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold ${
                  darkMode
                    ? 'bg-slate-900/60 border-slate-700/60 text-slate-300'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: env.cableColor }}
                />
                <span>Direct Cable to Central Developer</span>
              </div>
            </div>

            {/* Technologies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
              {env.technologies.map((tech) => (
                <div
                  key={tech.id}
                  onClick={() => onSelectTech(tech.id)}
                  className={`group p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    darkMode
                      ? 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/50'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100/70'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2.5 rounded-xl border flex items-center justify-center shrink-0 ${
                            darkMode
                              ? 'bg-slate-800/80 border-slate-700'
                              : 'bg-white border-slate-200'
                          }`}
                        >
                          <TechLogo
                            techId={tech.id}
                            size={28}
                            darkMode={darkMode}
                          />
                        </div>
                        <div>
                          <h4 className="text-base font-extrabold group-hover:text-indigo-400 transition-colors">
                            {tech.name}
                          </h4>
                          <span
                            className={`text-xs font-medium ${
                              darkMode ? 'text-slate-400' : 'text-slate-500'
                            }`}
                          >
                            {tech.tagline}
                          </span>
                        </div>
                      </div>

                      <div
                        className="text-xs font-black px-2 py-0.5 rounded-md"
                        style={{
                          backgroundColor: `${env.themeColor}1A`,
                          color: env.themeColor,
                        }}
                      >
                        {tech.proficiency}%
                      </div>
                    </div>

                    <p
                      className={`text-xs leading-relaxed mb-3 line-clamp-2 ${
                        darkMode ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      {tech.role}
                    </p>

                    {/* Small Branching Line Indicator */}
                    <div
                      className={`text-[11px] font-medium flex items-center gap-1.5 pt-2 border-t border-inherit/30 ${
                        darkMode ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: env.themeColor }}
                      />
                      <span className="truncate">{tech.storageType || tech.type}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-inherit/30 flex items-center justify-between">
                    <span
                      className="text-[11px] font-bold group-hover:underline flex items-center gap-1"
                      style={{ color: env.themeColor }}
                    >
                      Inspect Tech Details
                      <ExternalLink size={12} />
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                        darkMode
                          ? 'bg-slate-950/40 border-slate-800 text-slate-400'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      {tech.experience}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
})

export default ArchitectureListView
