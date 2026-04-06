import { useState } from 'react'
import { motion } from 'framer-motion'
import { Globe, Shield, Zap, ExternalLink, Github } from 'lucide-react'

const projectsData = [
  {
    title: 'Web Application Development',
    description: 'Full-stack web applications with responsive design and modern user interfaces. Focused on performance, scalability, and accessibility.',
    tags: ['Frontend', 'Backend', 'Database'],
    icon: <Globe size={32} />,
    color: '#6366f1'
  },
  {
    title: 'Network Infrastructure Design',
    description: 'Enterprise network architecture with secure and scalable infrastructure solutions. Designing robust systems for modern business needs.',
    tags: ['Network Design', 'Security', 'Infrastructure'],
    icon: <Shield size={32} />,
    color: '#8b5cf6'
  },
  {
    title: 'System Integration',
    description: 'Integration of software systems with network infrastructure for seamless operations. Automating workflows and optimizing resources.',
    tags: ['Integration', 'Automation', 'Optimization'],
    icon: <Zap size={32} />,
    color: '#10b981'
  }
]

export default function Projects() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
    <section id="projects" className="py-24 bg-white dark:bg-slate-900 transition-colors duration-500 overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-block px-5 py-2 mb-6 text-sm font-bold tracking-[0.2em] text-primary uppercase bg-primary/10 rounded-full"
          >
            Portfolio
          </motion.span>
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
            Featured Projects
          </h2>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            A showcase of my recent work across web development and enterprise network architecture.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto"
        >
          {projectsData.map((project, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              whileHover={{ y: -15 }}
              className="group relative glass-panel noise-bg rounded-[3rem] p-10 border border-transparent hover:border-primary/20 transition-all duration-500 overflow-hidden"
            >
              {/* Background Glow */}
              <div 
                className="absolute -bottom-20 -right-20 w-48 h-48 blur-[100px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"
                style={{ backgroundColor: project.color }}
              />

              {/* Top Section: Icon & Color Accent */}
              <div className="flex justify-between items-start mb-10">
                <motion.div 
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  className="w-20 h-20 flex items-center justify-center rounded-[1.5rem] glass-card group-hover:bg-primary group-hover:text-white transition-all duration-300"
                  style={{ color: project.color }}
                >
                  {project.icon}
                </motion.div>
                <div className="flex gap-3">
                  <a href="#" className="p-3 glass-card rounded-xl hover:bg-primary hover:text-white transition-all duration-300 text-gray-400">
                    <Github size={20} />
                  </a>
                  <a href="#" className="p-3 glass-card rounded-xl hover:bg-primary hover:text-white transition-all duration-300 text-gray-400">
                    <ExternalLink size={20} />
                  </a>
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-5 group-hover:text-primary transition-colors leading-tight font-display">
                  {project.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-10 leading-relaxed text-lg font-medium">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-3 mb-10">
                  {project.tags.map((tag, i) => (
                    <span 
                      key={i} 
                      className="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full glass-card text-gray-400 dark:text-gray-500 group-hover:border-primary/20 transition-all"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <motion.button 
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-3 font-black text-lg group/btn transition-colors font-display"
                  style={{ color: project.color }}
                >
                  Explore Details
                  <span className="group-hover/btn:translate-x-2 transition-transform duration-300">→</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}