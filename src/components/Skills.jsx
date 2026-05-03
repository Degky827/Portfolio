import { motion } from 'framer-motion'
import { Database, Layout, Server, GraduationCap, Cpu, Smartphone, Cloud, Terminal, Palette } from 'lucide-react'

const skillsData = [
  {
    category: 'Frontend',
    icon: <Layout size={28} />,
    color: '#6366f1',
    skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Tailwind', 'Git', 'GitHub']
  },
  {
    category: 'Backend',
    icon: <Server size={28} />,
    color: '#10b981',
    skills: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'REST APIs']
  },
  {
    category: 'Network & Security',
    icon: <Cloud size={28} />,
    color: '#8b5cf6',
    skills: ['Network Design', 'Cisco', 'Cyber Security', 'Infrastructure']
  },
  {
    category: 'Other Skills',
    icon: <Terminal size={28} />,
    color: '#f59e0b',
    skills: ['Python', 'Java', 'C++', 'PHP', 'UI/UX', 'Mobile Dev']
  }
]

export default function Skills() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
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
    <section id="skills" className="py-16 sm:py-20 md:py-24 bg-gray-50 dark:bg-slate-900/50 transition-colors duration-500">
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
            My Expertise
          </motion.span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-4 sm:mb-6 tracking-tight">
            Technical Features
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
            {skillsData.map((category, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.03, y: -5 }}
                className="group relative p-5 sm:p-6 md:p-8 lg:p-10 rounded-2xl sm:rounded-[1.5rem] md:rounded-[2rem] lg:rounded-[2.5rem] glass-card hover:bg-white dark:hover:bg-slate-800 transition-all duration-500 overflow-hidden border border-transparent hover:border-primary/20"
              >
                {/* Accent Glow */}
                <div 
                  className="absolute -top-10 -right-10 w-24 sm:w-32 h-24 sm:h-32 blur-[50px] sm:blur-[60px] opacity-10 group-hover:opacity-30 transition-opacity duration-500"
                  style={{ backgroundColor: category.color }}
                />

                <div className="relative z-10">
                  <div 
                    className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 md:mb-8 transition-all duration-300 group-hover:scale-110 group-hover:bg-white dark:group-hover:bg-slate-800 group-hover:shadow-lg"
                    style={{ color: category.color, backgroundColor: `${category.color}15` }}
                  >
                    {category.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-black text-gray-900 dark:text-white mb-4 sm:mb-6 md:mb-8 group-hover:text-primary transition-colors font-display">
                    {category.category}
                  </h3>
                  
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {category.skills.map((skill, i) => (
                      <span 
                        key={i} 
                        className="px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs md:text-sm font-bold rounded-lg sm:rounded-xl transition-all duration-300 bg-white/50 dark:bg-slate-900/50 border border-white/50 dark:border-slate-700/50 group-hover:border-primary/20 shadow-sm"
                        style={{ color: category.color }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Animated Progress Bar */}
                <div className="absolute bottom-0 left-0 w-full h-1.5 sm:h-2 bg-gray-100 dark:bg-slate-700">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: '100%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: index * 0.2 }}
                    className="h-full"
                    style={{ backgroundColor: category.color }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats Footer */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-12 sm:mt-16 md:mt-20 pt-10 sm:pt-12 md:pt-16 border-t border-white/20 dark:border-slate-700/50 grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-16 relative z-10"
          >
            {[
              { label: 'Technologies', value: '30+', icon: <Cpu size={20} className="w-5 h-5 sm:w-6 sm:h-6" /> },
              { label: 'Experience', value: '5+', icon: <Smartphone size={20} className="w-5 h-5 sm:w-6 sm:h-6" /> },
              { label: 'Satisfaction', value: '100%', icon: <Palette size={20} className="w-5 h-5 sm:w-6 sm:h-6" /> }
            ].map((stat, i) => (
              <div key={i} className="text-center group flex flex-col items-center">
                <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-primary/10 text-primary mb-2 sm:mb-3 md:mb-4 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  {stat.icon}
                </div>
                <span className="block text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-1 group-hover:text-primary transition-colors font-display">
                  {stat.value}
                </span>
                <span className="text-[10px] sm:text-xs md:text-sm font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] text-gray-400 dark:text-gray-500">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
