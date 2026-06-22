import { motion, useReducedMotion } from 'framer-motion'
import { ExternalLink, Monitor, Wifi, Layers, Globe, Rocket, Code, Search, X, Smartphone, Heart, BookOpen, ShoppingBag, MessageCircle, Wallet, Star, Download, Apple, Play, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import projectsData from '../../../shared/data/projects.json'
import mobileAppsData from '../../../shared/data/mobileApps.json'
import { getProjects } from '../../../shared/services/projectService'
import { usePortfolioSettings } from '../../../shared/hooks/usePortfolioSettings'

const iconMap = {
  Globe,
  Rocket,
  Wifi,
  Layers,
  Monitor,
  Code,
}

const statusIconMap = {
  completed: CheckCircle,
  in_progress: Clock,
  planned: AlertCircle,
}

const statusLabels = {
  completed: 'Completed',
  in_progress: 'In Progress',
  planned: 'Planned',
}

const statusColors = {
  completed: '#10b981',
  in_progress: '#f59e0b',
  planned: '#3b82f6',
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

const DEFAULT_THUMBNAIL = 'https://placehold.co/600x400/1E293B/94A3B8?text=Project'

export default function Projects() {
  const { t } = useTranslation()
  const shouldReduceMotion = useReducedMotion()
  const { settings } = usePortfolioSettings()
  const [activeTab, setActiveTab] = useState('web')
  const [searchTerm, setSearchTerm] = useState('')
  const [dbProjects, setDbProjects] = useState([])
  const [projectsLoading, setProjectsLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const data = await getProjects({ public: true, limit: settings.projectsPerPage })
        setDbProjects(data.projects || [])
      } catch {
        setDbProjects([])
      } finally {
        setProjectsLoading(false)
      }
    })()
  }, [settings.projectsPerPage])

  const hasDbProjects = dbProjects.length > 0
  const displayProjects = hasDbProjects ? dbProjects : projectsData

  const filteredProjects = useMemo(() => {
    return displayProjects.filter(project => {
      if (!searchTerm) return true
      const term = searchTerm.toLowerCase()
      const title = (project.title || '').toLowerCase()
      const desc = (project.shortDescription || project.description || '').toLowerCase()
      const techs = project.technologies || project.tags || []
      return title.includes(term) || desc.includes(term) || techs.some(tag => tag.toLowerCase().includes(term))
    })
  }, [searchTerm, displayProjects])

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
    <section id="projects" className="py-16 sm:py-20 md:py-24 bg-white dark:bg-black transition-colors duration-500 overflow-hidden" aria-label={t('projects.ariaLabel')}>
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
            {t('projects.badge')}
          </motion.span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-4 sm:mb-6 tracking-tight">
            {t('projects.title')}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-500 dark:text-[#94A3B8] max-w-2xl mx-auto leading-relaxed px-4">
            {t('projects.description')}
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8 sm:mb-10">
          <div className="inline-flex bg-gray-100 dark:bg-neutral-900 rounded-2xl p-1.5 shadow-inner">
            <button
              onClick={() => setActiveTab('web')}
                className={`px-6 sm:px-8 py-2.5 rounded-xl text-sm sm:text-base font-bold transition-all duration-300 ${
                activeTab === 'web'
                  ? 'bg-white dark:bg-neutral-900 text-primary shadow-lg'
                  : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <Code size={16} className="inline mr-2 -mt-0.5" />
              {t('projects.tabWeb')}
            </button>
            <button
              onClick={() => setActiveTab('mobile')}
                className={`px-6 sm:px-8 py-2.5 rounded-xl text-sm sm:text-base font-bold transition-all duration-300 ${
                activeTab === 'mobile'
                  ? 'bg-white dark:bg-neutral-900 text-primary shadow-lg'
                  : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <Smartphone size={16} className="inline mr-2 -mt-0.5" />
              {t('projects.tabApps')}
              <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-primary/10 text-primary rounded-full">{mobileAppsData.length}</span>
            </button>
          </div>
        </div>

        {activeTab === 'web' ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 max-w-6xl mx-auto"
          role="tabpanel"
        >
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => {
              const color = project.color || statusColors[project.status] || '#6366f1'
              const title = project.title || ''
              const desc = project.shortDescription || project.description || ''
              const techs = project.technologies || project.tags || []
              const liveUrl = project.liveDemoUrl || project.liveUrl || '#'
              const repoUrl = project.githubUrl || project.repoUrl || ''
              const thumbUrl = project.thumbnail || (project.images && project.images[0]) || ''

              return (
              <motion.div
                key={project._id || index}
                variants={itemVariants}
                whileHover={shouldReduceMotion ? {} : { y: -4 }}
                className="group bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20"
              >
                {/* Thumbnail Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-neutral-900">
                  <img
                    src={thumbUrl ? (thumbUrl.startsWith('http') ? thumbUrl : `http://localhost:5000${thumbUrl}`) : DEFAULT_THUMBNAIL}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { e.target.src = DEFAULT_THUMBNAIL }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {repoUrl && repoUrl !== '#' && (
                      <a
                        href={repoUrl}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="p-2 bg-white dark:bg-neutral-900 rounded-lg text-gray-700 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors shadow-lg"
                        title={t('projects.viewSourceCode', { title })}
                        aria-label={t('projects.viewSourceCodeAria', { title })}
                        onClick={e => e.stopPropagation()}
                      >
                        <GithubIcon size={16} />
                      </a>
                    )}
                    {liveUrl !== '#' && (
                      <a
                          href={liveUrl}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          className="p-2 bg-white dark:bg-neutral-900 rounded-lg text-gray-700 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors shadow-lg"
                        title={t('projects.viewLiveSite', { title })}
                        aria-label={t('projects.viewLiveDemoAria', { title })}
                        onClick={e => e.stopPropagation()}
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className="text-base font-bold text-gray-900 dark:text-[#F8FAFC] group-hover:text-primary transition-colors leading-tight font-display">
                      {title}
                    </h3>
                    {project.status && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full whitespace-nowrap shrink-0"
                        style={{ color: statusColors[project.status], backgroundColor: `${statusColors[project.status]}20` }}
                      >
                        {t(`projects.status${project.status}`)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-[#94A3B8] mb-2 leading-relaxed line-clamp-2">
                    {desc}
                  </p>
                  {project.fullDescription && (
                    <div
                      className="text-xs text-gray-600 dark:text-[#94A3B8] mb-2 leading-relaxed prose prose-sm dark:prose-invert max-w-none line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: project.fullDescription }}
                    />
                  )}

                  <div className="flex flex-wrap gap-1 mb-3" role="list" aria-label={t('projects.projectTechnologies')}>
                    {techs.slice(0, 5).map((tag, i) => (
                      <span
                        key={i}
                        role="listitem"
                        className="px-2.5 py-1 text-[10px] font-medium rounded-md bg-primary/5 text-primary dark:text-primary/90 border border-primary/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 pt-2 border-t border-gray-100 dark:border-[#334155]">
                    {repoUrl && repoUrl !== '#' && (
                      <a
                        href={repoUrl}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-[#94A3B8] hover:text-primary dark:hover:text-primary transition-colors"
                        onClick={e => e.stopPropagation()}
                      >
                        <GithubIcon size={14} />
                        {t('projects.github')}
                      </a>
                    )}
                    {liveUrl !== '#' && (
                      <a
                        href={liveUrl}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-[#94A3B8] hover:text-primary dark:hover:text-primary transition-colors"
                        onClick={e => e.stopPropagation()}
                      >
                        <ExternalLink size={14} />
                        {t('projects.liveDemo')}
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
              )
            })
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 dark:bg-neutral-900 rounded-full flex items-center justify-center">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-[#F8FAFC] mb-2">{t('projects.noProjectsFound')}</p>
              <p className="text-gray-500 dark:text-[#94A3B8] mb-6">{t('projects.noProjectsHint')}</p>
              <button
                onClick={() => { setSearchTerm('') }}
                className="px-6 py-3 bg-primary text-white font-bold rounded-full hover:bg-[#4F46E5] transition-colors"
              >
                {t('projects.clearFilters')}
              </button>
            </div>
          )}
        </motion.div>
      ) : (
        /* Mobile Apps Section */
        <div className="max-w-5xl lg:max-w-7xl mx-auto">
          {/* Mobile Apps Search */}
            <div className="relative max-w-md mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
            <input
              type="text"
              placeholder={t('projects.searchMobileApps')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-10 py-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-full text-gray-900 dark:text-[#F8FAFC] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              aria-label={t('projects.searchMobileAppsAria')}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                aria-label={t('projects.clearSearch')}
              >
                <X size={16} />
              </button>
            )}
          </div>

          <p className="text-center text-sm text-gray-500 dark:text-[#94A3B8] mb-6">
            {t('projects.showingApps', { count: filteredMobileApps.length, total: mobileAppsData.length })}
          </p>

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
                  whileHover={shouldReduceMotion ? {} : { y: -4 }}
                  className="group bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/20 flex flex-col cursor-pointer"
                  role="button"
                  tabIndex={0}
                  aria-label={t('projects.openAppAria', { title: app.title })}
                  onClick={() => window.open(app.appUrl, '_blank', 'noopener noreferrer')}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.open(app.appUrl, '_blank', 'noopener noreferrer') } }}
                >
                  <div className="p-5 sm:p-6 flex flex-col flex-1">
                    <div className="flex items-start gap-4 mb-4">
                      <motion.div
                        whileHover={shouldReduceMotion ? {} : { rotate: 3, scale: 1.05 }}
                        className="w-14 h-14 flex-shrink-0 rounded-[18px] flex items-center justify-center shadow-lg"
                        style={{ backgroundColor: app.color }}
                      >
                        {renderMobileIcon(app.icon, app.color)}
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-[#F8FAFC] truncate font-display">
                          {app.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-[#94A3B8] line-clamp-2 mt-1">
                          {app.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 mb-3">
                      {[1,2,3,4,5].map(star => (
                        <Star
                          key={star}
                          size={14}
                          className={star <= Math.floor(app.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-600'}
                        />
                      ))}
                      <span className="text-xs font-bold text-gray-500 dark:text-[#94A3B8] ml-1">{app.rating}</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4" role="list" aria-label={t('projects.appFeatures')}>
                      {app.features.map((feature, i) => (
                        <span
                          key={i}
                          role="listitem"
                          className="px-2.5 py-1 text-[10px] font-medium rounded-md bg-gray-100 dark:bg-neutral-900 text-gray-500 dark:text-slate-400"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100 dark:border-neutral-800">
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
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-[#4F46E5] transition-colors"
                        aria-label={t('projects.openAppAria', { title: app.title })}
                        onClick={e => e.stopPropagation()}
                      >
                        <Download size={14} />
                        {t('projects.openApp')}
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 dark:bg-neutral-900 rounded-full flex items-center justify-center">
                  <Smartphone className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-[#F8FAFC] mb-2">{t('projects.noAppsFound')}</p>
                <p className="text-gray-500 dark:text-[#94A3B8] mb-6">{t('projects.noAppsHint')}</p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="px-6 py-3 bg-primary text-white font-bold rounded-full hover:bg-[#4F46E5] transition-colors"
                >
                  {t('projects.clearSearchBtn')}
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
