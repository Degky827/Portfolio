import { motion } from 'framer-motion'
import { ExternalLink, Monitor, Wifi, Layers, Globe, Rocket, Code } from 'lucide-react'

const GithubIcon = ({ size = 24, className = '' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
  </svg>
)

const projectsData = [
  {
    title: 'Portfolio Website',
    description: 'A modern, responsive portfolio website showcasing web development skills and projects. Built with React and Tailwind CSS with smooth animations.',
    tags: ['React', 'Tailwind', 'Framer Motion'],
    icon: <Globe size={32} />,
    color: '#6366f1',
    liveUrl: 'https://desalegnkasayemuluyekasaye-tech.github.io/portkiro/',
    repoUrl: 'https://github.com/desalegnkasayemuluyekasaye-tech/portkiro'
  },
  {
    title: 'Media Platform',
    description: 'A media streaming and content platform built with modern web technologies. Features responsive design and seamless user experience.',
    tags: ['React', 'Next.js', 'Vercel'],
    icon: <Rocket size={32} />,
    color: '#8b5cf6',
    liveUrl: 'https://media-plat-git-ecfd38-desalegnkasayemuluyekasaye-techs-projects.vercel.app/',
    repoUrl: 'https://github.com/desalegnkasayemuluyekasaye-tech/media-platform'
  },
  {
    title: 'Network Design',
    description: 'Enterprise network architecture with secure and scalable infrastructure solutions. Implementing robust systems for modern business requirements.',
    tags: ['Cisco', 'Security', 'Infrastructure'],
    icon: <Wifi size={32} />,
    color: '#10b981',
    liveUrl: 'public/cisco.pkt',
    repoUrl: '#'
  },
  {
    title: 'System Integration',
    description: 'Seamlessly integrating software systems with network infrastructure. Automating workflows and optimizing business processes.',
    tags: ['Integration', 'Automation', 'DevOps'],
    icon: <Layers size={32} />,
    color: '#f59e0b',
    liveUrl: 'https://github.com/desalegnkasayemuluyekasaye-tech',
    repoUrl: 'https://github.com/desalegnkasayemuluyekasaye-tech'
  }
]

export default function Projects() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  }

  return (
    <section id="projects" className="py-16 sm:py-20 md:py-24 bg-white dark:bg-slate-900 transition-colors duration-500 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16 md:mb-20"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
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

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-5xl lg:max-w-7xl mx-auto"
        >
          {projectsData.map((project, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="group relative glass-panel noise-bg rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] lg:rounded-[3rem] p-6 sm:p-8 md:p-10 border border-transparent hover:border-primary/20 transition-all duration-500 overflow-hidden"
            >
              {/* Background Glow */}
              <div 
                className="absolute -bottom-20 -right-20 w-36 sm:w-48 h-36 sm:h-48 blur-[80px] sm:blur-[100px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"
                style={{ backgroundColor: project.color }}
              />

              {/* Top Section: Icon & Actions */}
              <div className="flex justify-between items-start mb-6 sm:mb-8 md:mb-10">
                <motion.div 
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-xl sm:rounded-2xl glass-card group-hover:bg-primary group-hover:text-white transition-all duration-300"
                  style={{ color: project.color }}
                >
                  {project.icon}
                </motion.div>
                <div className="flex gap-2 sm:gap-3">
                  <a 
                    href={project.repoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 sm:p-3 glass-card rounded-lg sm:rounded-xl hover:bg-primary hover:text-white transition-all duration-300 text-gray-400"
                    title="View Source Code"
                  >
                    <GithubIcon size={18} className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                  <a 
                    href={project.liveUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 sm:p-3 glass-card rounded-lg sm:rounded-xl hover:bg-primary hover:text-white transition-all duration-300 text-gray-400"
                    title="View Live Site"
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
                
                <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8 md:mb-10">
                  {project.tags.map((tag, i) => (
                    <span 
                      key={i} 
                      className="px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-full glass-card text-gray-400 dark:text-gray-500 group-hover:border-primary/20 transition-all"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <motion.a 
                  whileHover={{ x: 5 }}
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-bold sm:font-black text-base sm:text-lg group/btn transition-colors font-display"
                  style={{ color: project.color }}
                >
                  View Project
                  <ExternalLink size={18} className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="group-hover/btn:translate-x-2 transition-transform duration-300">→</span>
                </motion.a>
              </div>

              {/* Bottom Accent Line */}
              <motion.div 
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                className="absolute bottom-0 left-0 w-full h-1 origin-left"
                style={{ backgroundColor: project.color }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
