import { motion, useReducedMotion } from 'framer-motion'
import { 
  Database, Layout, Server, GraduationCap, Cpu, Smartphone, Cloud, Terminal, Palette, 
  Sparkles, Zap, Code, Globe, Shield, Settings, Lock, GitBranch, 
  Database as DatabaseIcon, Braces, Package, Cpu as CpuIcon,
  Monitor, Smartphone as Phone, Cloud as CloudIcon, Shield as SecurityIcon
} from 'lucide-react'

const skillIcons = {
  'React': Code,
  'JavaScript': Braces,
  'HTML': Code,
  'CSS': Palette,
  'Tailwind': Layout,
  'Git': GitBranch,
  'GitHub': GitBranch,
  'Node.js': Server,
  'Express': Server,
  'MongoDB': DatabaseIcon,
  'PostgreSQL': DatabaseIcon,
  'REST APIs': Globe,
  'Network Design': CloudIcon,
  'Cisco': Shield,
  'Cyber Security': SecurityIcon,
  'Infrastructure': Settings,
  'Python': Terminal,
  'Java': Braces,
  'C++': Terminal,
  'PHP': Code,
  'UI/UX': Palette,
  'Mobile Dev': Phone
}

const skillsData = [
  {
    category: 'Frontend',
    icon: Layout,
    color: '#6366f1',
    skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Tailwind', 'Git', 'GitHub']
  },
  {
    category: 'Backend',
    icon: Server,
    color: '#10b981',
    skills: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'REST APIs']
  },
  {
    category: 'Network & Security',
    icon: Cloud,
    color: '#8b5cf6',
    skills: ['Network Design', 'Cisco', 'Cyber Security', 'Infrastructure']
  },
  {
    category: 'Other Skills',
    icon: Terminal,
    color: '#f59e0b',
    skills: ['Python', 'Java', 'C++', 'PHP', 'UI/UX', 'Mobile Dev']
  }
]

export default function Skills() {
  const shouldReduceMotion = useReducedMotion()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: shouldReduceMotion ? 0 : 20, opacity: 0 },
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

  return (
    <section id="skills" className="py-16 sm:py-20 md:py-24 bg-gray-50 dark:bg-slate-900/50 transition-colors duration-500" aria-label="Skills section">
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
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 mb-4 sm:mb-6 text-xs sm:text-sm font-bold tracking-[0.2em] text-primary uppercase bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full border border-primary/20 hover-lift"
          >
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
            My Expertise
          </motion.span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black gradient-text mb-4 sm:mb-6 tracking-tight">
            Technical Skills
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed px-4">
            A comprehensive overview of the technologies and tools I master to build modern digital solutions.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="glass-panel noise-bg p-6 sm:p-8 md:p-10 lg:p-16 rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] lg:rounded-[3.5rem] max-w-5xl lg:max-w-6xl mx-auto relative overflow-hidden"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 relative z-10">
            {skillsData.map((category, index) => {
              const IconComponent = category.icon
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={shouldReduceMotion ? {} : { scale: 1.05, y: -8 }}
                  className="group relative p-5 sm:p-6 md:p-8 lg:p-10 rounded-2xl sm:rounded-[1.5rem] md:rounded-[2rem] lg:rounded-[2.5rem] glass-card hover:bg-white dark:hover:bg-slate-800 transition-all duration-500 overflow-hidden border border-transparent hover:border-primary/30 hover-lift"
                  role="article"
                  aria-label={`${category.category} skills`}
                >
                  {/* Accent Glow */}
                  <div
                    className="absolute -top-10 -right-10 w-24 sm:w-32 h-24 sm:h-32 blur-[50px] sm:blur-[60px] opacity-10 group-hover:opacity-40 transition-all duration-500 group-hover:scale-110"
                    style={{ backgroundColor: category.color }}
                  />
                  
                  {/* Floating Particles */}
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-4 right-4 w-2 h-2 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />

                  <div className="relative z-10">
                    <motion.div
                      whileHover={shouldReduceMotion ? {} : { scale: 1.15, rotate: 5 }}
                      className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 md:mb-8 transition-all duration-300 group-hover:bg-white dark:group-hover:bg-slate-800 group-hover:shadow-xl group-hover:scale-110 relative overflow-hidden"
                      style={{ 
                        color: category.color, 
                        backgroundColor: `${category.color}15`,
                        boxShadow: `0 4px 20px ${category.color}20`
                      }}
                    >
                      <IconComponent size={28} />
                      {/* Icon Glow */}
                      <div 
                        className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                        style={{ backgroundColor: category.color }}
                      />
                    </motion.div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-black gradient-text mb-4 sm:mb-6 md:mb-8 group-hover:scale-105 transition-all font-display">
                      {category.category}
                    </h3>

                    <div className="flex flex-wrap gap-2 sm:gap-3" role="list" aria-label="Skills list">
                      {category.skills.map((skill, i) => {
                        const SkillIcon = skillIcons[skill] || Code
                        return (
                          <motion.span
                            key={i}
                            role="listitem"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs md:text-sm font-bold rounded-lg sm:rounded-xl transition-all duration-300 bg-white/50 dark:bg-slate-900/50 border border-white/50 dark:border-slate-700/50 group-hover:border-primary/30 group-hover:bg-gradient-to-r group-hover:from-primary/10 group-hover:to-secondary/10 shadow-sm hover:shadow-md hover-lift"
                            style={{ color: category.color }}
                          >
                            <SkillIcon size={12} className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: category.color }} />
                            <span>{skill}</span>
                          </motion.span>
                        )
                      })}
                    </div>
                  </div>

                  {/* Animated Progress Bar */}
                  <div className="absolute bottom-0 left-0 w-full h-1.5 sm:h-2 bg-gray-100 dark:bg-slate-700 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '100%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: index * 0.2 }}
                      className="h-full relative overflow-hidden"
                      style={{ backgroundColor: category.color }}
                      aria-hidden="true"
                    >
                      <motion.div
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 bg-white/20"
                      />
                    </motion.div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Stats Footer */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: shouldReduceMotion ? 0.1 : 0.8 }}
            className="mt-12 sm:mt-16 md:mt-20 pt-10 sm:pt-12 md:pt-16 border-t border-white/20 dark:border-slate-700/50 grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-16 relative z-10"
          >
            {[
              { label: 'Technologies', value: '30+', icon: <Cpu size={20} className="w-5 h-5 sm:w-6 sm:h-6" />, color: 'primary' },
              { label: 'Experience', value: '5+', icon: <Zap size={20} className="w-5 h-5 sm:w-6 sm:h-6" />, color: 'secondary' },
              { label: 'Satisfaction', value: '100%', icon: <Sparkles size={20} className="w-5 h-5 sm:w-6 sm:h-6" />, color: 'accent' }
            ].map((stat, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center group flex flex-col items-center"
              >
                <motion.div 
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-${stat.color}/10 text-${stat.color} mb-2 sm:mb-3 md:mb-4 group-hover:bg-gradient-to-r group-hover:from-${stat.color} group-hover:to-${stat.color === 'primary' ? 'secondary' : stat.color === 'secondary' ? 'accent' : 'primary'} group-hover:text-white transition-all duration-300 shadow-lg group-hover:shadow-xl`} 
                  aria-hidden="true"
                >
                  {stat.icon}
                </motion.div>
                <motion.span 
                  whileHover={{ scale: 1.1 }}
                  className="block text-2xl sm:text-3xl md:text-4xl font-black gradient-text mb-1 group-hover:scale-110 transition-all font-display"
                >
                  {stat.value}
                </motion.span>
                <span className="text-[10px] sm:text-xs md:text-sm font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] text-gray-400 dark:text-gray-500 group-hover:text-primary transition-colors">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
