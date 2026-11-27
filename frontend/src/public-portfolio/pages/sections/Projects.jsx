import { useState, useMemo, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Search, Filter, Layers, Globe, Smartphone, Sparkles, RefreshCw } from 'lucide-react'
import projectsData from '../../../shared/data/projects.json'
import mobileAppsData from '../../../shared/data/mobileApps.json'
import { getProjects } from '../../../shared/services/projectService'
import { getMediaUrl } from '../../../shared/services/api'
import { useSocketRefresh } from '../../../shared/hooks/useSocketRefresh'
import { ProjectsScene } from '../../../components/projects3d'
import HolographicTabs from '../../../components/projects3d/HolographicTabs'
import HolographicSearch from '../../../components/projects3d/HolographicSearch'
import AppShowcaseCard from '../../../components/projects3d/AppShowcaseCard'
import ProjectMonitorCard from '../../../components/projects3d/ProjectMonitorCard'

export default function Projects() {
  const shouldReduceMotion = useReducedMotion()
  const [activeTab, setActiveTab] = useState('all') // 'all' | 'web' | 'mobile'
  const [searchTerm, setSearchTerm] = useState('')
  const [dbProjects, setDbProjects] = useState([])
  const [projectsLoading, setProjectsLoading] = useState(true)

  const fetchProjects = useCallback(() => {
    (async () => {
      try {
        const res = await getProjects({ public: true, limit: 100 })
        setDbProjects(res.projects || [])
      } catch {
        setDbProjects([])
      } finally {
        setProjectsLoading(false)
      }
    })()
  }, [])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  useSocketRefresh('content:updated', fetchProjects, { type: 'projects' })

  const isMobileProject = useCallback((p) => {
    const cat = (p?.category || '').toLowerCase()
    const plat = (p?.platform || '').toLowerCase()
    const title = (p?.title || '').toLowerCase()
    return (
      cat.includes('mobile') ||
      cat.includes('app') ||
      cat.includes('flutter') ||
      cat.includes('android') ||
      cat.includes('ios') ||
      plat.includes('mobile') ||
      plat.includes('app') ||
      p?.isMobile === true
    )
  }, [])

  // Standardized Web Projects
  const webProjects = useMemo(() => {
    const fromDb = dbProjects.filter((p) => !isMobileProject(p))
    if (fromDb.length > 0) return fromDb
    return projectsData
  }, [dbProjects, isMobileProject])

  // Standardized Mobile/Application Projects
  const mobileProjects = useMemo(() => {
    const fromDb = dbProjects.filter(isMobileProject)
    if (fromDb.length > 0) {
      return fromDb.map((p) => ({
        title: p.title || '',
        description: p.shortDescription || p.description || '',
        features: p.features?.length ? p.features : (p.technologies || []).slice(0, 4),
        platform: p.platform || 'Mobile App',
        icon: p.icon || 'Smartphone',
        color: '#6C2BFF',
        appUrl: p.appUrl || p.liveDemoUrl || '#',
        repoUrl: p.githubUrl || '',
        rating: p.rating || 4.8,
        thumbnail: p.thumbnail || (p.images && p.images[0]) || '',
        _id: p._id,
        isMobile: true,
      }))
    }
    return mobileAppsData.map((app) => ({
      ...app,
      color: '#6C2BFF',
      isMobile: true,
    }))
  }, [dbProjects, isMobileProject])

  // Combined and filtered project list
  const filteredList = useMemo(() => {
    let list = []
    if (activeTab === 'all') {
      list = [
        ...webProjects.map((p) => ({ ...p, isMobile: false })),
        ...mobileProjects,
      ]
    } else if (activeTab === 'web') {
      list = webProjects.map((p) => ({ ...p, isMobile: false }))
    } else {
      list = mobileProjects
    }

    // Apply Search Term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      list = list.filter((item) => {
        const title = (item.title || '').toLowerCase()
        const desc = (item.shortDescription || item.description || '').toLowerCase()
        const techs = item.technologies || item.tags || item.features || []
        return (
          title.includes(term) ||
          desc.includes(term) ||
          techs.some((t) => t.toLowerCase().includes(term))
        )
      })
    }

    return list
  }, [activeTab, webProjects, mobileProjects, searchTerm])

  const clearAllFilters = useCallback(() => {
    setSearchTerm('')
    setActiveTab('all')
  }, [])

  return (
    <section
      id="projects"
      className="relative min-h-screen py-16 sm:py-20 lg:py-24 bg-white dark:bg-[#1a1a2e] text-slate-900 dark:text-white transition-colors duration-300 overflow-hidden"
      aria-label="Projects showcase"
    >
      {/* ── 3D Scene Layer (Transparent Canvas with Stars, Floating Particles & Holographic Lines) ── */}
      <ProjectsScene>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10 w-full">
          {/* ── Header with 3D Extruded Title ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            {/* 3D Extruded Title: What have I done ? (Refined minimized text size) */}
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
              What have I done ?
            </h2>

            {/* Subtitle */}
            <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed px-4 font-normal">
              A showcase of my recent work across full-stack web applications, mobile architectures, and enterprise systems.
            </p>

            {/* Decorative Diamond Accent Line: <> ◇ <> matching other pages */}
            <div className="flex items-center justify-center gap-3 mt-5">
              <div className="h-[1.5px] w-14 sm:w-20 bg-slate-300 dark:bg-slate-700" />
              <div className="w-2.5 h-2.5 rotate-45 border-2 border-[#36454F] dark:border-slate-300 shadow-[0_0_12px_rgba(54,69,79,0.6)] dark:shadow-[0_0_12px_rgba(255,255,255,0.4)]" />
              <div className="h-[1.5px] w-14 sm:w-20 bg-slate-300 dark:bg-slate-700" />
            </div>
          </motion.div>

          {/* ── Structured Controls: Holographic Category Tabs ── */}
          <HolographicTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            allCount={webProjects.length + mobileProjects.length}
            webCount={webProjects.length}
            mobileCount={mobileProjects.length}
          />

          {/* ── Holographic Search Bar ── */}
          <HolographicSearch
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm('')}
            placeholder="Search projects, stacks, or keywords..."
            ariaLabel="Search all projects"
          />

          {/* ── Active Filters Status Bar ── */}
          {(searchTerm || activeTab !== 'all') && (
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 max-w-6xl mx-auto mb-6 px-2">
              <span>
                Showing <strong className="text-slate-900 dark:text-white">{filteredList.length}</strong> {filteredList.length === 1 ? 'project' : 'projects'}
                {searchTerm && <> matching &quot;{searchTerm}&quot;</>}
              </span>
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs font-semibold text-[var(--accent-projects)] hover:underline flex items-center gap-1"
              >
                <RefreshCw size={12} />
                Reset Filters
              </button>
            </div>
          )}

          {/* ── Responsive 3D Project Cards Grid ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              role="region"
              aria-label="Projects grid"
            >
              {filteredList.length > 0 ? (
              activeTab === 'all' ? (
                <div className="space-y-12">
                  {/* Web Applications (3 columns) */}
                  {filteredList.some((p) => !p.isMobile) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
                      {filteredList
                        .filter((p) => !p.isMobile)
                        .map((project, index) => (
                          <div
                            key={project._id || `web-${index}`}
                            className="col-span-1 w-full flex justify-center h-full"
                          >
                            <ProjectMonitorCard
                              project={project}
                              index={index}
                              shouldReduceMotion={shouldReduceMotion}
                              getMediaUrl={getMediaUrl}
                            />
                          </div>
                        ))}
                    </div>
                  )}

                  {/* Mobile Applications (Showcase Stages Matching Reference) */}
                  {filteredList.some((p) => p.isMobile) && (
                    <div>
                      <div className="flex items-center gap-3 my-8 max-w-5xl mx-auto">
                        <div className="h-[1.5px] flex-1 bg-slate-300 dark:bg-slate-700" />
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-[#36454F] dark:text-slate-400">
                          // Mobile Applications
                        </span>
                        <div className="h-[1.5px] flex-1 bg-slate-300 dark:bg-slate-700" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
                        {filteredList
                          .filter((p) => p.isMobile)
                          .map((project, index) => (
                            <div
                              key={project._id || `mobile-${index}`}
                              className="col-span-1 w-full flex justify-center h-full"
                            >
                              <AppShowcaseCard
                                app={project}
                                index={index}
                                shouldReduceMotion={shouldReduceMotion}
                                getMediaUrl={getMediaUrl}
                              />
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : activeTab === 'mobile' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
                  {filteredList.map((project, index) => (
                    <div
                      key={project._id || `mobile-${index}`}
                      className="col-span-1 w-full flex justify-center h-full"
                    >
                      <AppShowcaseCard
                        app={project}
                        index={index}
                        shouldReduceMotion={shouldReduceMotion}
                        getMediaUrl={getMediaUrl}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
                  {filteredList.map((project, index) => (
                    <div
                      key={project._id || `web-${index}`}
                      className="col-span-1 w-full flex justify-center h-full"
                    >
                      <ProjectMonitorCard
                        project={project}
                        index={index}
                        shouldReduceMotion={shouldReduceMotion}
                        getMediaUrl={getMediaUrl}
                      />
                    </div>
                  ))}
                </div>
              )
            ) : (
                <div className="col-span-full text-center py-16 px-4 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#6C2BFF]/10 text-[#6C2BFF] flex items-center justify-center">
                    <Search className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                    No matching projects found
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
                    Try adjusting your search keywords, clear stack filters, or switch categories.
                  </p>
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="px-6 py-2.5 text-xs font-bold rounded-xl text-white bg-[#6C2BFF] hover:bg-[#5b21b6] active:translate-y-0.5 transition-all cursor-pointer shadow-md shadow-[#6C2BFF]/20"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </ProjectsScene>
    </section>
  )
}
