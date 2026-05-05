import { motion, useReducedMotion } from 'framer-motion'
import { ExternalLink, Monitor, Wifi, Layers, Globe, Rocket, Code, Search, X, Filter, ChevronDown, Tag } from 'lucide-react'
import { useState, useMemo, useRef, useEffect } from 'react'
import projectsData from '../data/projects.json'

const iconMap = {
  Globe,
  Rocket,
  Wifi,
  Layers,
  Monitor,
  Code
}

const GithubIcon = ({ size = 24, className = '' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
  </svg>
)

export default function Projects() {
  const shouldReduceMotion = useReducedMotion()
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTag, setActiveTag] = useState('All')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchType, setSearchType] = useState('all') // 'all', 'title', 'description', 'tags'
  const searchRef = useRef(null)

  const allTags = useMemo(() => {
    const tags = new Set()
    projectsData.forEach(p => p.tags.forEach(t => tags.add(t)))
    return ['All', ...Array.from(tags).sort()]
  }, [])

  const filteredProjects = useMemo(() => {
    return projectsData.filter(project => {
      const matchesSearch = searchTerm === '' || 
        (searchType === 'all' && (
          project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        )) ||
        (searchType === 'title' && project.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (searchType === 'description' && project.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (searchType === 'tags' && project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      const matchesTag = activeTag === 'All' || project.tags.includes(activeTag)
      return matchesSearch && matchesTag
    })
  }, [searchTerm, activeTag, searchType])

  const searchSuggestions = useMemo(() => {
    if (!searchTerm || searchTerm.length < 2) return []
    
    const suggestions = new Set()
    projectsData.forEach(project => {
      if (searchType === 'all' || searchType === 'title') {
        if (project.title.toLowerCase().includes(searchTerm.toLowerCase())) {
          suggestions.add(project.title)
        }
      }
      if (searchType === 'all' || searchType === 'tags') {
        project.tags.forEach(tag => {
          if (tag.toLowerCase().includes(searchTerm.toLowerCase())) {
            suggestions.add(tag)
          }
        })
      }
    })
    return Array.from(suggestions).slice(0, 5)
  }, [searchTerm, searchType])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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

  return (
    <section id="projects" className="py-16 sm:py-20 md:py-24 bg-white dark:bg-slate-900 transition-colors duration-500 overflow-hidden" aria-label="Projects section">
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

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl lg:max-w-7xl mx-auto mb-8 sm:mb-10 space-y-4"
        >
          {/* Enhanced Search Bar with Dropdown */}
          <div className="relative max-w-2xl mx-auto" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search projects by title, description, or tags..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setIsDropdownOpen(true)
                }}
                onFocus={() => setIsDropdownOpen(true)}
                className="w-full pl-12 pr-24 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                aria-label="Search projects"
              />
              
              {/* Search Type Selector */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="px-2 py-1 text-xs bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-primary/50"
                >
                  <option value="all">All</option>
                  <option value="title">Title</option>
                  <option value="description">Description</option>
                  <option value="tags">Tags</option>
                </select>
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      setIsDropdownOpen(false)
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    aria-label="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Dropdown Suggestions */}
            {isDropdownOpen && (searchSuggestions.length > 0 || searchTerm.length > 0) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden"
              >
                {searchSuggestions.length > 0 ? (
                  <div className="max-h-60 overflow-y-auto">
                    {searchSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSearchTerm(suggestion)
                          setIsDropdownOpen(false)
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-3 border-b border-gray-100 dark:border-slate-700 last:border-b-0"
                      >
                        {allTags.includes(suggestion) ? (
                          <Tag size={16} className="text-primary flex-shrink-0" />
                        ) : (
                          <Search size={16} className="text-gray-400 flex-shrink-0" />
                        )}
                        <span className="text-gray-900 dark:text-white truncate">
                          {suggestion}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-3 text-gray-500 dark:text-gray-400 text-center">
                    No suggestions found
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Tag Filter Dropdown */}
          <div className="flex justify-center">
            <div className="relative">
              <select
                value={activeTag}
                onChange={(e) => setActiveTag(e.target.value)}
                className="appearance-none bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-6 py-3 pr-12 text-sm font-bold text-gray-900 dark:text-white cursor-pointer hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-lg"
                aria-label="Filter projects by tag"
              >
                {allTags.map(tag => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
              
              {/* Custom Dropdown Arrow */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronDown 
                  size={20} 
                  className="text-gray-400 dark:text-gray-500 transition-transform duration-300"
                />
              </div>
            </div>
          </div>

          {/* Results Count */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredProjects.length} of {projectsData.length} projects
          </p>
        </motion.div>

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
                whileHover={shouldReduceMotion ? {} : { y: -10 }}
                className="group relative glass-panel noise-bg rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] lg:rounded-[3rem] p-6 sm:p-8 md:p-10 border border-transparent hover:border-primary/20 transition-all duration-500 overflow-hidden"
                role="article"
                aria-label={project.title}
              >
                {/* Background Glow */}
                <div
                  className="absolute -bottom-20 -right-20 w-36 sm:w-48 h-36 sm:h-48 blur-[80px] sm:blur-[100px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"
                  style={{ backgroundColor: project.color }}
                />

                {/* Top Section: Icon & Actions */}
                <div className="flex justify-between items-start mb-6 sm:mb-8 md:mb-10">
                  <motion.div
                    whileHover={shouldReduceMotion ? {} : { rotate: 5, scale: 1.1 }}
                    className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-xl sm:rounded-2xl glass-card group-hover:bg-primary group-hover:text-white transition-all duration-300"
                    style={{ color: project.color }}
                  >
                    {renderIcon(project.icon, project.color)}
                  </motion.div>
                  <div className="flex gap-2 sm:gap-3">
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="p-2 sm:p-3 glass-card rounded-lg sm:rounded-xl hover:bg-primary hover:text-white transition-all duration-300 text-gray-400"
                      title={`View ${project.title} source code`}
                      aria-label={`View ${project.title} source code on GitHub`}
                    >
                      <GithubIcon size={18} className="w-4 h-4 sm:w-5 sm:h-5" />
                    </a>
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="p-2 sm:p-3 glass-card rounded-lg sm:rounded-xl hover:bg-primary hover:text-white transition-all duration-300 text-gray-400"
                      title={`View ${project.title} live site`}
                      aria-label={`View ${project.title} live demo`}
                    >
                      <ExternalLink size={18} className="w-4 h-4 sm:w-5 sm:h-5" />
                    </a>
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-3 sm:mb-5 group-hover:text-primary transition-colors leading-tight font-display">
                    {project.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-6 sm:mb-8 md:mb-10 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8 md:mb-10" role="list" aria-label="Project technologies">
                    {project.tags.map((tag, i) => (
                      <span
                        key={i}
                        role="listitem"
                        className="px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-full glass-card text-gray-400 dark:text-gray-500 group-hover:border-primary/20 transition-all"
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
                    className="inline-flex items-center gap-2 font-bold sm:font-black text-base sm:text-lg group/btn transition-colors font-display"
                    style={{ color: project.color }}
                    aria-label={`View ${project.title} project details`}
                  >
                    View Project
                    <ExternalLink size={18} className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="group-hover/btn:translate-x-2 transition-transform duration-300">→</span>
                  </motion.a>
                </div>

                {/* Bottom Accent Line */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileHover={shouldReduceMotion ? {} : { scaleX: 1 }}
                  className="absolute bottom-0 left-0 w-full h-1 origin-left"
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
      </div>
    </section>
  )
}
