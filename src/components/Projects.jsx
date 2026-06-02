import { motion, useReducedMotion } from 'framer-motion'
import { ExternalLink, Monitor, Wifi, Layers, Globe, Rocket, Code, Search, X, Smartphone, Heart, BookOpen, ShoppingBag, MessageCircle, Wallet, Star, Download, Apple, Play } from 'lucide-react'
import { useState, useMemo } from 'react'
import projectsData from '../data/projects.json'
import mobileAppsData from '../data/mobileApps.json'

const iconMap = {
  Globe,
  Rocket,
  Wifi,
  Layers,
  Monitor,
  Code
}

const mobileIconMap = {
  Smartphone,
  Heart,
  BookOpen,
  ShoppingBag,
  MessageCircle,
  Wallet
}

const GithubIcon = ({ size = 24, className = '' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
  </svg>
)

export default function Projects() {
  const shouldReduceMotion = useReducedMotion()
  const [activeTab, setActiveTab] = useState('web')
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTag, setActiveTag] = useState('All')
  const filteredProjects = useMemo(() => {
    return projectsData.filter(project => {
      if (!searchTerm) return true
      const term = searchTerm.toLowerCase()
      return project.title.toLowerCase().includes(term) ||
        project.description.toLowerCase().includes(term) ||
        project.tags.some(tag => tag.toLowerCase().includes(term))
    })
  }, [searchTerm])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.15,
      },
    },
  }

  const itemVariants = {
    hidden: { y: shouldReduceMotion ? 0 : 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: shouldReduceMotion ? 'tween' : 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  }

  const renderIcon = (iconName, color) => {
    const IconComponent = iconMap[iconName] || Globe
    return <IconComponent size={32} />
  }

  const renderMobileIcon = (iconName, color) => {
    const IconComponent = mobileIconMap[iconName] || Smartphone
    return <IconComponent size={28} className="text-white" />
  }

  const filteredMobileApps = useMemo(() => {
    if (!searchTerm) return mobileAppsData
    const term = searchTerm.toLowerCase()
    return mobileAppsData.filter(app =>
      app.title.toLowerCase().includes(term) ||
      app.description.toLowerCase().includes(term) ||
      app.features.some(f => f.toLowerCase().includes(term)) ||
      app.platform.toLowerCase().includes(term)
    )
  }, [searchTerm])

  return (
    <section id="projects" className="py-16 sm:py-20 md:py-24 bg-white dark:bg-black transition-colors duration-500 overflow-hidden" aria-label="Projects section">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: shouldReduceMotion ? 0.1 : 0.8 }}
          className="text-center mb-12 sm:mb-16 md:mb-20"
        >
          <motion.span
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 sm:px-5 py-2 mb-4 sm:mb-6 text-xs sm:text-sm font-bold tracking-[0.2em] text-primary uppercase bg-primary/10 rounded-full"
          >
            Portfolio
          </motion.span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-4 sm:mb-6 tracking-tight">
            Featured Projects
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed px-4">
            A showcase of my recent work across web development and enterprise network architecture.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8 sm:mb-10">
          <div className="inline-flex bg-gray-100 dark:bg-slate-800 rounded-2xl p-1.5 shadow-inner">
            <button
              onClick={() => setActiveTab('web')}
              className={`px-6 sm:px-8 py-2.5 rounded-xl text-sm sm:text-base font-bold transition-all duration-300 ${
                activeTab === 'web'
                  ? 'bg-white dark:bg-slate-700 text-primary shadow-lg'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <Code size={16} className="inline mr-2 -mt-0.5" />
              Website Projects
            </button>
            <button
              onClick={() => setActiveTab('mobile')}
              className={`px-6 sm:px-8 py-2.5 rounded-xl text-sm sm:text-base font-bold transition-all duration-300 ${
                activeTab === 'mobile'
                  ? 'bg-white dark:bg-slate-700 text-primary shadow-lg'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <Smartphone size={16} className="inline mr-2 -mt-0.5" />
              Applications
              <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-primary/10 text-primary rounded-full">{mobileAppsData.length}</span>
            </button>
          </div>
        </div>

        {activeTab === 'web' ? (
        <>


        {/* Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-5xl lg:max-w-7xl mx-auto"
          role="tabpanel"
        >
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={shouldReduceMotion ? {} : { y: -6, scale: 1.02 }}
                className="group relative glass-panel noise-bg rounded-3xl p-5 sm:p-6 border border-transparent hover:border-primary/30 hover:shadow-xl transition-all duration-500 overflow-hidden cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label={`View ${project.title} project`}
                onClick={() => window.open(project.liveUrl, '_blank', 'noopener noreferrer')}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.open(project.liveUrl, '_blank', 'noopener noreferrer') } }}
              >
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 pointer-events-none rounded-3xl" />

                {/* Background Glow */}
                  <div
                    className="absolute -bottom-12 -right-12 w-32 h-32 blur-[80px] opacity-0 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none"
                    style={{ backgroundColor: project.color }}
                  />

                {/* View Project Overlay Text */}
                <div className="absolute inset-0 flex items-center justify-center z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <span className="text-white font-black text-lg sm:text-xl font-display tracking-wide flex items-center gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    View Project
                    <ExternalLink size={20} />
                  </span>
                </div>

                {/* Top Section: Icon & Actions */}
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <motion.div
                    whileHover={shouldReduceMotion ? {} : { rotate: 5, scale: 1.15 }}
                    className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-xl transition-all duration-300 shadow-sm"
                    style={{ color: project.color, backgroundColor: `${project.color}14`, borderColor: `${project.color}30` }}
                  >
                    {renderIcon(project.icon, project.color)}
                  </motion.div>
                  <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="p-1.5 rounded-lg transition-all duration-200 text-gray-400 hover:text-white"
                      style={{ backgroundColor: 'transparent' }}
                      onMouseEnter={e => { e.currentTarget.style.background = project.color; e.currentTarget.style.borderColor = 'transparent' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '' }}
                      title={`View ${project.title} source code`}
                      aria-label={`View ${project.title} source code on GitHub`}
                    >
                      <GithubIcon size={16} />
                    </a>
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="p-1.5 rounded-lg transition-all duration-200 text-gray-400 hover:text-white"
                      style={{ backgroundColor: 'transparent' }}
                      onMouseEnter={e => { e.currentTarget.style.background = project.color; e.currentTarget.style.borderColor = 'transparent' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '' }}
                      title={`View ${project.title} live site`}
                      aria-label={`View ${project.title} live demo`}
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white mb-1.5 group-hover:text-primary transition-colors leading-tight font-display">
                    {project.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3 sm:mb-4 leading-relaxed line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-3 sm:mb-4" role="list" aria-label="Project technologies">
                    {project.tags.map((tag, i) => (
                      <span
                        key={i}
                        role="listitem"
                        className="px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider rounded-full border transition-all duration-200 hover:scale-105"
                        style={{ color: project.color, borderColor: `${project.color}40`, backgroundColor: `${project.color}10` }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <motion.a
                    whileHover={shouldReduceMotion ? {} : { x: 5 }}
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-bold text-xs sm:text-sm group/btn transition-colors font-display"
                    style={{ color: project.color }}
                    aria-label={`View ${project.title} project details`}
                    onClick={e => e.stopPropagation()}
                  >
                    View Project
                    <ExternalLink size={14} />
                    <span className="group-hover/btn:translate-x-2 transition-transform duration-300">→</span>
                  </motion.a>
                </div>

                {/* Bottom Accent Line */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileHover={shouldReduceMotion ? {} : { scaleX: 1 }}
                  className="absolute bottom-0 left-0 w-full h-0.5 origin-left z-10"
                  style={{ backgroundColor: project.color }}
                />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">No projects found</p>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Try adjusting your search or filter criteria</p>
              <button
                onClick={() => { setSearchTerm(''); setActiveTag('All') }}
                className="px-6 py-3 bg-primary text-white font-bold rounded-full hover:opacity-90 transition-opacity"
              >
                Clear Filters
              </button>
            </div>
          )}
        </motion.div>
        </>
      ) : (
        /* Mobile Apps Section */
        <div className="max-w-5xl lg:max-w-7xl mx-auto">
          {/* Mobile Apps Search */}
          <div className="relative max-w-md mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search mobile apps..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-10 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              aria-label="Search mobile apps"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Results Count */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
            Showing {filteredMobileApps.length} of {mobileAppsData.length} apps
          </p>

          {/* Mobile Apps Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            {filteredMobileApps.length > 0 ? (
              filteredMobileApps.map((app, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={shouldReduceMotion ? {} : { y: -6, scale: 1.02 }}
                  className="group relative glass-panel noise-bg rounded-3xl p-5 sm:p-6 border border-transparent hover:border-primary/30 hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col cursor-pointer"
                  role="button"
                  tabIndex={0}
                  aria-label={`Open ${app.title} app`}
                  onClick={() => window.open(app.appUrl, '_blank', 'noopener noreferrer')}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.open(app.appUrl, '_blank', 'noopener noreferrer') } }}
                >
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 pointer-events-none rounded-3xl" />

                  {/* Background Glow */}
                  <div
                    className="absolute -bottom-16 -right-16 w-32 h-32 blur-[80px] opacity-0 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none"
                    style={{ backgroundColor: app.color }}
                  />

                  {/* Open App Overlay Text */}
                  <div className="absolute inset-0 flex items-center justify-center z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <span className="text-white font-black text-lg sm:text-xl font-display tracking-wide flex items-center gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      Open App
                      <ExternalLink size={20} />
                    </span>
                  </div>

                  {/* App Icon */}
                  <div className="flex items-start gap-4 mb-4 relative z-10">
                    <motion.div
                      whileHover={shouldReduceMotion ? {} : { rotate: 3, scale: 1.05 }}
                      className="w-16 h-16 flex-shrink-0 rounded-[22px] flex items-center justify-center shadow-lg"
                      style={{ backgroundColor: app.color }}
                    >
                      {renderMobileIcon(app.icon, app.color)}
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-black text-gray-900 dark:text-white group-hover:text-primary transition-colors truncate font-display">
                        {app.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                        {app.description}
                      </p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1.5 mb-3 relative z-10">
                    {[1,2,3,4,5].map(star => (
                      <Star
                        key={star}
                        size={14}
                        className={star <= Math.floor(app.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-600'}
                      />
                    ))}
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1">{app.rating}</span>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1.5 mb-4 relative z-10" role="list" aria-label="App features">
                    {app.features.map((feature, i) => (
                      <span
                        key={i}
                        role="listitem"
                        className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Bottom: Platform badge + Open button */}
                  <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-700 relative z-10">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 dark:text-gray-500">
                      {app.platform === 'iOS' ? (
                        <><Apple size={14} /> iOS</>
                      ) : app.platform === 'Android' ? (
                        <><Play size={14} /> Android</>
                      ) : (
                        <><Globe size={14} /> Web</>
                      )}
                    </div>
                    <a
                      href={app.appUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-300"
                      aria-label={`Open ${app.title}`}
                      onClick={e => e.stopPropagation()}
                    >
                      <Download size={14} />
                      Open
                    </a>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                  <Smartphone className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">No apps found</p>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Try adjusting your search</p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="px-6 py-3 bg-primary text-white font-bold rounded-full hover:opacity-90 transition-opacity"
                >
                  Clear Search
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
      </div>
    </section>
  )
}
