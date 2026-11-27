import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tv, Radio, Play, Pause, ExternalLink, ChevronRight, Sparkles, Layers, Monitor, RotateCcw } from 'lucide-react'
import ProjectTVScreen from './ProjectTVScreen'

export default function ProjectLiveTVShowcase({ projects = [], getMediaUrl }) {
  const [currentChannelIndex, setCurrentChannelIndex] = useState(0)
  const [isExpanded, setIsExpanded] = useState(true)

  // Filter projects with live demo URLs
  const tvChannels = useMemo(() => {
    return projects.filter(
      (p) => (p.liveDemoUrl || p.liveUrl || p.appUrl) && (p.liveDemoUrl !== '#' && p.liveUrl !== '#' && p.appUrl !== '#')
    )
  }, [projects])

  if (tvChannels.length === 0) return null

  const activeProject = tvChannels[currentChannelIndex] || tvChannels[0]
  const channelNumber = currentChannelIndex + 1
  const liveUrl = activeProject.liveDemoUrl || activeProject.liveUrl || activeProject.appUrl || '#'

  return (
    <div className="w-full max-w-6xl mx-auto mb-14 px-2 sm:px-4">
      {/* ── TV Showcase Outer Enclosure ── */}
      <div
        className="relative rounded-3xl overflow-hidden border border-slate-200/90 dark:border-[#2a3050] bg-white/95 dark:bg-[#151c2e]/95 backdrop-blur-xl shadow-2xl p-4 sm:p-6 lg:p-8"
        style={{
          boxShadow: '0 25px 70px -15px rgba(108, 43, 255, 0.2), 0 0 40px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Top TV Header Bar with Channel Selector */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[var(--accent-projects)]/15 text-[var(--accent-projects)] flex items-center justify-center border border-[var(--accent-projects)]/30 shadow-inner">
              <Tv size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  Live Demo TV Station
                </h3>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20 uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                  ON AIR
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Streaming live demonstrations of full-stack projects in real-time
              </p>
            </div>
          </div>

          {/* Quick External Launch Button */}
          {liveUrl && liveUrl !== '#' && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl text-white bg-[var(--accent-projects)] hover:opacity-95 shadow-md shadow-[var(--accent-projects)]/25 transition-all"
            >
              <ExternalLink size={13} />
              Open Live Site
            </a>
          )}
        </div>

        {/* ── Main TV Chassis + Channel Control Panel ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left/Main Column: Futuristic 3D TV Screen */}
          <div className="lg:col-span-8 flex flex-col items-center">
            {/* TV Screen Outer Frame */}
            <div className="relative w-full rounded-2xl p-2.5 sm:p-3 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 border-2 border-slate-700/80 shadow-2xl">
              {/* TV Screen Top Bezel with Camera / Power Dot */}
              <div className="h-5 flex items-center justify-between px-3 pb-1 text-slate-400 text-[10px] font-mono">
                <span className="text-amber-400 font-bold">DES-TV 4K BROADCAST</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 font-bold">SIGNAL LOCKED</span>
                </div>
              </div>

              {/* Live TV Screen Component */}
              <ProjectTVScreen
                key={activeProject._id || activeProject.title}
                project={activeProject}
                channelNumber={channelNumber}
                getMediaUrl={getMediaUrl}
                autoPlay={true}
              />

              {/* TV Screen Bottom Bezel with Speaker Grille */}
              <div className="h-6 flex items-center justify-between px-4 pt-1 border-t border-slate-800/80 text-[10px] text-slate-500 font-mono">
                <span>STEREO DOLBY AUDIO</span>
                <div className="flex items-center gap-1">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-1 h-2 rounded-full bg-slate-700" />
                  ))}
                </div>
                <span>CH {String(channelNumber).padStart(2, '0')} / {String(tvChannels.length).padStart(2, '0')}</span>
              </div>
            </div>

            {/* TV Stand Legs */}
            <div className="flex items-center justify-center gap-16 -mt-1 w-full max-w-sm pointer-events-none">
              <div className="w-10 h-3 bg-slate-800 border-x border-b border-slate-600 rounded-b-md shadow-md" />
              <div className="w-10 h-3 bg-slate-800 border-x border-b border-slate-600 rounded-b-md shadow-md" />
            </div>
          </div>

          {/* Right Column: TV Remote & Channel Selector */}
          <div className="lg:col-span-4 flex flex-col justify-between h-full space-y-4">
            {/* Currently Playing Channel Info Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#1e2a3a]/70 border border-slate-200/90 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs font-bold text-[var(--accent-projects)] uppercase tracking-wider mb-1">
                <span>NOW BROADCASTING</span>
                <span className="font-mono">CH {String(channelNumber).padStart(2, '0')}</span>
              </div>
              <h4 className="text-lg font-black text-slate-900 dark:text-white line-clamp-1 mb-2">
                {activeProject.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed mb-3">
                {activeProject.shortDescription || activeProject.description}
              </p>

              {/* Technologies Badges */}
              <div className="flex flex-wrap gap-1 mb-1">
                {(activeProject.technologies || activeProject.tags || activeProject.features || []).slice(0, 4).map((tech, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-[var(--accent-projects)]/10 text-[var(--accent-projects)] border border-[var(--accent-projects)]/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Channel Guide / Station Selector */}
            <div className="space-y-1.5">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center justify-between px-1">
                <span>TV Channels</span>
                <span>{tvChannels.length} STATIONS</span>
              </div>
              <div className="max-h-48 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                {tvChannels.map((proj, idx) => {
                  const isActive = idx === currentChannelIndex
                  return (
                    <button
                      key={proj._id || idx}
                      type="button"
                      onClick={() => setCurrentChannelIndex(idx)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-semibold transition-all duration-200 ${
                        isActive
                          ? 'bg-[var(--accent-projects)] text-white shadow-md'
                          : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className={`font-mono text-[11px] font-bold ${isActive ? 'text-white' : 'text-slate-400'}`}>
                          CH {String(idx + 1).padStart(2, '0')}
                        </span>
                        <span className="truncate">{proj.title}</span>
                      </div>
                      {isActive && (
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
