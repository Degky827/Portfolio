import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  CheckCircle2,
  Cpu,
  Layers,
  Activity,
  ArrowRight,
  Database,
  Terminal,
  Monitor,
  Wrench,
  Sparkles,
} from 'lucide-react'
import TechLogo from './TechLogo'

const ENV_ICONS = {
  database: Database,
  backend: Terminal,
  frontend: Monitor,
  tools: Wrench,
}

export default function TechDetailModal({
  tech,
  env,
  isOpen,
  onClose,
  darkMode = true,
}) {
  useEffect(() => {
    if (!isOpen) return
    const origOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = origOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen || !tech) return null

  const EnvIcon = ENV_ICONS[env?.id] || Cpu
  const themeColor = env?.themeColor || '#2563EB'

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 backdrop-blur-md bg-black/60 transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className={`relative w-full max-w-2xl rounded-2xl shadow-2xl border overflow-hidden my-auto ${
            darkMode
              ? 'bg-[#121722] border-[#2A3447] text-white'
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* Top Color Accent Line */}
          <div
            className="h-1.5 w-full"
            style={{ backgroundColor: themeColor }}
          />

          {/* Header */}
          <div className="p-6 sm:p-7 border-b border-inherit/40 relative">
            <button
              onClick={onClose}
              className={`absolute top-5 right-5 p-2 rounded-xl transition-colors ${
                darkMode
                  ? 'hover:bg-slate-800 text-slate-400 hover:text-white'
                  : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
              }`}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <div className="flex items-start gap-4 sm:gap-5 pr-10">
              {/* Logo Box */}
              <div
                className={`p-3.5 rounded-2xl border flex items-center justify-center shrink-0 ${
                  darkMode
                    ? 'bg-[#182030] border-[#2E3C54]'
                    : 'bg-slate-50 border-slate-200'
                }`}
                style={{
                  boxShadow: `0 4px 20px -2px ${themeColor}33`,
                }}
              >
                <TechLogo techId={tech.id} size={42} darkMode={darkMode} />
              </div>

              {/* Title & Category Tags */}
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wider text-white"
                    style={{ backgroundColor: themeColor }}
                  >
                    <EnvIcon size={12} />
                    {env?.name || tech.category}
                  </span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-md font-medium border ${
                      darkMode
                        ? 'bg-slate-800/60 text-slate-300 border-slate-700/80'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {tech.tagline}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {tech.name}
                </h3>
                <p
                  className={`text-xs sm:text-sm mt-0.5 font-medium ${
                    darkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  {tech.storageType || tech.type}
                </p>
              </div>
            </div>

            {/* Proficiency & Experience Stat Bar */}
            <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-inherit/30">
              <div
                className={`p-2.5 rounded-xl border text-center ${
                  darkMode
                    ? 'bg-slate-900/40 border-slate-800'
                    : 'bg-slate-50 border-slate-100'
                }`}
              >
                <div
                  className={`text-[10px] uppercase tracking-wider font-semibold ${
                    darkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  Proficiency
                </div>
                <div
                  className="text-lg font-black mt-0.5"
                  style={{ color: themeColor }}
                >
                  {tech.proficiency}%
                </div>
              </div>

              <div
                className={`p-2.5 rounded-xl border text-center ${
                  darkMode
                    ? 'bg-slate-900/40 border-slate-800'
                    : 'bg-slate-50 border-slate-100'
                }`}
              >
                <div
                  className={`text-[10px] uppercase tracking-wider font-semibold ${
                    darkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  Experience
                </div>
                <div className="text-lg font-black mt-0.5">
                  {tech.experience}
                </div>
              </div>

              <div
                className={`p-2.5 rounded-xl border text-center ${
                  darkMode
                    ? 'bg-slate-900/40 border-slate-800'
                    : 'bg-slate-50 border-slate-100'
                }`}
              >
                <div
                  className={`text-[10px] uppercase tracking-wider font-semibold ${
                    darkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  Status
                </div>
                <div className="text-lg font-black mt-0.5 text-emerald-500 flex items-center justify-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Active
                </div>
              </div>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-7 space-y-6 max-h-[60vh] overflow-y-auto">
            {/* Visual Role in Ecosystem */}
            <div>
              <h4
                className={`text-xs uppercase tracking-wider font-bold mb-2 flex items-center gap-1.5 ${
                  darkMode ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                <Activity size={14} style={{ color: themeColor }} />
                What It Does in the Ecosystem
              </h4>
              <p
                className={`text-sm leading-relaxed p-3.5 rounded-xl border font-normal ${
                  darkMode
                    ? 'bg-slate-900/60 border-slate-800 text-slate-200'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                {tech.role}
              </p>
            </div>

            {/* Ecosystem Physical Connection Trace */}
            <div>
              <h4
                className={`text-xs uppercase tracking-wider font-bold mb-2 flex items-center gap-1.5 ${
                  darkMode ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                <Cpu size={14} style={{ color: themeColor }} />
                Ecosystem Connection Architecture
              </h4>
              <div
                className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-center gap-3 text-xs ${
                  darkMode
                    ? 'bg-slate-900/40 border-slate-800 text-slate-300'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 font-bold shrink-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: tech.color }}
                  />
                  {tech.name}
                </div>
                <ArrowRight
                  size={14}
                  className="hidden sm:block shrink-0"
                  style={{ color: themeColor }}
                />
                <div
                  className="px-2.5 py-1 rounded-md font-semibold text-white shrink-0"
                  style={{ backgroundColor: themeColor }}
                >
                  {env?.name} Pod
                </div>
                <ArrowRight
                  size={14}
                  className="hidden sm:block shrink-0"
                  style={{ color: themeColor }}
                />
                <div className="flex items-center gap-1.5 font-bold shrink-0 text-cyan-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                  Central Developer
                </div>
              </div>
              <p
                className={`text-[11px] mt-1.5 font-medium px-1 ${
                  darkMode ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                {tech.connectionRole}
              </p>
            </div>

            {/* Core Capabilities */}
            {tech.features && tech.features.length > 0 && (
              <div>
                <h4
                  className={`text-xs uppercase tracking-wider font-bold mb-2.5 flex items-center gap-1.5 ${
                    darkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  <Layers size={14} style={{ color: themeColor }} />
                  Key Technical Capabilities
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {tech.features.map((feature, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-2 p-2.5 rounded-lg border text-xs font-medium ${
                        darkMode
                          ? 'bg-slate-900/30 border-slate-800 text-slate-300'
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      <CheckCircle2
                        size={15}
                        className="shrink-0 mt-0.5"
                        style={{ color: themeColor }}
                      />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Real-World Portfolio Implementations */}
            {tech.portfolioUsage && tech.portfolioUsage.length > 0 && (
              <div>
                <h4
                  className={`text-xs uppercase tracking-wider font-bold mb-2 flex items-center gap-1.5 ${
                    darkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  <Sparkles size={14} style={{ color: themeColor }} />
                  Portfolio Applications & Deployments
                </h4>
                <ul className="space-y-1.5">
                  {tech.portfolioUsage.map((usage, i) => (
                    <li
                      key={i}
                      className={`text-xs p-2.5 rounded-lg border flex items-center gap-2 font-medium ${
                        darkMode
                          ? 'bg-slate-900/30 border-slate-800 text-slate-300'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: themeColor }}
                      />
                      <span>{usage}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            className={`p-4 sm:p-5 border-t flex items-center justify-between ${
              darkMode
                ? 'bg-slate-950/40 border-slate-800'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <span
              className={`text-xs font-medium ${
                darkMode ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              3D Developer Ecosystem • Live Architecture
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: themeColor }}
            >
              Done Inspecting
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
