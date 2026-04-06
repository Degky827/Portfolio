import { motion } from 'framer-motion'
import { Database, Layout, Settings, GraduationCap, Server, Globe, Cpu, Smartphone } from 'lucide-react'

const skillsData = [
  {
    category: 'Database',
    icon: <Database size={32} />,
    color: '#00d4ff',
    skills: ['MongoDB', 'PostgreSQL', 'MySQL']
  },
  {
    category: 'Frontend',
    icon: <Layout size={32} />,
    color: '#8b5cf6',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Git', 'GitHub']
  },
  {
    category: 'Backend',
    icon: <Server size={32} />,
    color: '#10b981',
    skills: ['Node.js', 'Express', 'AI']
  },
  {
    category: 'Class Courses',
    icon: <GraduationCap size={32} />,
    color: '#f59e0b',
    skills: ['PHP', 'Java', 'C++', 'Video Editing', 'Cisco (Networking)', 'Algorithms', 'Mobile App Development', 'UI/UX Design', 'Computer Graphics']
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
    <section id="skills" className="py-24 bg-gray-50 dark:bg-slate-900/50 transition-colors duration-500">
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
            My Expertise
          </motion.span>
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
            Technical Arsenal
          </h2>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            A comprehensive overview of the technologies and tools I master to build modern digital solutions.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="glass-panel noise-bg p-10 md:p-16 rounded-[3.5rem] max-w-6xl mx-auto relative overflow-hidden"
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {skillsData.map((category, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group relative p-10 rounded-[2.5rem] glass-card hover:bg-white dark:hover:bg-slate-800 transition-all duration-500 overflow-hidden border border-transparent hover:border-primary/20"
              >
                {/* Accent Glow */}
                <div 
                  className="absolute -top-10 -right-10 w-32 h-32 blur-[60px] opacity-10 group-hover:opacity-30 transition-opacity duration-500"
                  style={{ backgroundColor: category.color }}
                />

                <div className="relative z-10">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-all duration-300 group-hover:scale-110 group-hover:bg-white dark:group-hover:bg-slate-800 group-hover:shadow-lg"
                    style={{ color: category.color, backgroundColor: `${category.color}15` }}
                  >
                    {category.icon}
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-8 group-hover:text-primary transition-colors font-display">
                    {category.category}
                  </h3>
                  
                  <div className="flex flex-wrap gap-3">
                    {category.skills.map((skill, i) => (
                      <span 
                        key={i} 
                        className="px-4 py-1.5 text-sm font-bold rounded-xl transition-all duration-300 bg-white/50 dark:bg-slate-900/50 border border-white/50 dark:border-slate-700/50 group-hover:border-primary/20 shadow-sm"
                        style={{ color: category.color }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Animated Progress Bar */}
                <div className="absolute bottom-0 left-0 w-full h-2 bg-gray-100 dark:bg-slate-700">
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
            className="mt-20 pt-16 border-t border-white/20 dark:border-slate-700/50 flex flex-wrap justify-center gap-16 md:gap-32 relative z-10"
          >
            {[
              { label: 'Technologies', value: '30+', icon: <Cpu size={24} /> },
              { label: 'Experience', value: '5+', icon: <Smartphone size={24} /> },
              { label: 'Satisfaction', value: '100%', icon: <Globe size={24} /> }
            ].map((stat, i) => (
              <div key={i} className="text-center group flex flex-col items-center">
                <div className="p-4 rounded-2xl bg-primary/10 text-primary mb-4 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  {stat.icon}
                </div>
                <span className="block text-4xl font-black text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors font-display">
                  {stat.value}
                </span>
                <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
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