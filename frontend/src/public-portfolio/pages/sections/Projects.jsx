import { motion, useReducedMotion } from 'framer-motion'
import { ExternalLink, Monitor, Wifi, Layers, Globe, Rocket, Code, Search, X, Smartphone, Heart, BookOpen, ShoppingBag, MessageCircle, Wallet, Star, Download, Apple, Play, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import projectsData from '../../../shared/data/projects.json'
import mobileAppsData from '../../../shared/data/mobileApps.json'
import { getProjects } from '../../../shared/services/projectService'
import { getMediaUrl } from '../../../shared/services/api'
import { ProjectsScene } from '../../../components/projects3d'
import HolographicTabs from '../../../components/projects3d/HolographicTabs'
import HolographicSearch from '../../../components/projects3d/HolographicSearch'
import AppShowcaseCard from '../../../components/projects3d/AppShowcaseCard'
import ProjectMonitorCard from '../../../components/projects3d/ProjectMonitorCard'

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
  const [activeTab, setActiveTab] = useState('web')
  const [searchTerm, setSearchTerm] = useState('')
  const [dbProjects, setDbProjects] = useState([])
  const [projectsLoading, setProjectsLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const data = await getProjects({ public: true, limit: 50 })
        setDbProjects(data.projects || [])
      } catch {
        setDbProjects([])
      } finally {
        setProjectsLoading(false)
      }
    })()
  }, [])

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
    <ProjectsScene>
    <section id="projects" className="py-16 sm:py-20 md:py-24 min-h-screen" aria-label={t('projects.ariaLabel')}>
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
            className="inline-block px-4 sm:px-5 py-2 mb-4 sm:mb-6 text-xs sm:text-sm font-bold tracking-[0.2em] text-[var(--accent-projects)] uppercase bg-[var(--accent-projects)]/10 rounded-full border border-[var(--accent-projects)]/20"
          >
            {t('projects.badge')}
          </motion.span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[var(--text-primary)] mb-4 sm:mb-6 tracking-tight">
            {t('projects.title')}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed px-4">
            {t('projects.description')}
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <HolographicTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          webCount={filteredProjects.length}
          mobileCount={filteredMobileApps.length}
        />

        {activeTab === 'web' ? (
        <>
        <HolographicSearch
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClear={() => setSearchTerm('')}
          placeholder="Search projects, technologies, stacks..."
          ariaLabel="Search web projects"
        />
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 max-w-6xl mx-auto"
          role="tabpanel"
        >
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => (
              <ProjectMonitorCard
                key={project._id || index}
                project={project}
                index={index}
                shouldReduceMotion={shouldReduceMotion}
                getMediaUrl={getMediaUrl}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 bg-[var(--surface)] rounded-full flex items-center justify-center border border-[var(--border-default)]">
                <Search className="w-10 h-10 text-[var(--text-secondary)]" />
              </div>
              <p className="text-xl font-bold text-[var(--text-primary)] mb-2">{t('projects.noProjectsFound')}</p>
              <p className="text-[var(--text-secondary)] mb-6">{t('projects.noProjectsHint')}</p>
              <button
                onClick={() => { setSearchTerm('') }}
                className="px-6 py-3 bg-cyan-500 text-white font-bold rounded-full hover:bg-cyan-400 transition-colors"
              >
                {t('projects.clearFilters')}
              </button>
            </div>
          )}
        </motion.div>
        </>
      ) : (
        /* Mobile Apps Section */
        <div className="max-w-5xl lg:max-w-7xl mx-auto">
          {/* Mobile Apps Search */}
          <HolographicSearch
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm('')}
            placeholder="Search mobile apps, features, platforms..."
            ariaLabel="Search mobile apps"
          />

          <p className="text-center text-sm text-[var(--text-secondary)] mb-6">
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
                <AppShowcaseCard
                  key={index}
                  app={app}
                  index={index}
                  shouldReduceMotion={shouldReduceMotion}
                  onOpen={() => window.open(app.appUrl, '_blank', 'noopener noreferrer')}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 bg-[var(--surface)] rounded-full flex items-center justify-center border border-[var(--border-default)]">
                  <Smartphone className="w-10 h-10 text-[var(--text-secondary)]" />
                </div>
                <p className="text-xl font-bold text-[var(--text-primary)] mb-2">{t('projects.noAppsFound')}</p>
                <p className="text-[var(--text-secondary)] mb-6">{t('projects.noAppsHint')}</p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="px-6 py-3 bg-cyan-500 text-white font-bold rounded-full hover:bg-cyan-400 transition-colors"
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
    </ProjectsScene>
  )
}
