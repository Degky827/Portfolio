import { motion } from 'framer-motion'
import { GraduationCap, Briefcase, Rocket, Target, Code, Award, Users, TrendingUp } from 'lucide-react'

const aboutSections = [
  {
    title: 'Education & Background',
    icon: <GraduationCap size={24} />,
    content: "I hold a Bachelor's degree in Computer Science and a Master's degree in Cyber Security, providing a deep foundation in both software systems and digital protection."
  },
  {
    title: 'Professional Focus',
    icon: <Briefcase size={24} />,
    content: "I specialize in full-stack development and secure network architecture, bridging the gap between elegant user experiences and robust back-end security."
  },
  {
    title: 'Expertise Areas',
    icon: <Rocket size={24} />,
    content: "From designing scalable cloud infrastructures to crafting interactive front-end applications, I focus on delivering performance-driven technology solutions."
  },
  {
    title: 'Mission & Approach',
    icon: <Target size={24} />,
    content: "My approach combines clean code practices with a security-first mindset, ensuring that every digital product I build is as safe as it is functional."
  }
]

export default function About() {
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
    <section id="about" className="py-16 sm:py-20 md:py-24 bg-white dark:bg-slate-900 transition-colors duration-500 overflow-hidden">
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
            About Me
          </motion.span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-4 sm:mb-6 tracking-tight">
            Get to Know Me
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed px-4">
            A passionate developer and network designer dedicated to building secure and scalable digital experiences.
          </p>
        </motion.div>

        <div className="glass-panel noise-bg p-6 sm:p-8 md:p-12 lg:p-16 rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] lg:rounded-[3.5rem] max-w-5xl lg:max-w-6xl mx-auto relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-primary/10 rounded-full blur-[80px] sm:blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-48 sm:w-64 h-48 sm:h-64 bg-accent/10 rounded-full blur-[80px] sm:blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2" />

          <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 items-start relative z-10">
            {/* Left: Info Cards */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="space-y-4 sm:space-y-6"
            >
              {aboutSections.map((section, index) => (
                <motion.div 
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, x: 10 }}
                  className="group p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-[2rem] glass-card hover:bg-white dark:hover:bg-slate-800 transition-all duration-300"
                >
                  <div className="flex items-start gap-4 sm:gap-6">
                    <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 flex-shrink-0">
                      {section.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-black mb-2 sm:mb-3 text-gray-900 dark:text-white group-hover:text-primary transition-colors font-display">
                        {section.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                        {section.content}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Right: Visual Code Block */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="sticky top-24"
            >
              <div className="bg-slate-900 rounded-2xl sm:rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl border border-slate-700/50 group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                <div className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 bg-slate-800/50 border-b border-slate-700/50">
                  <div className="flex gap-1.5 sm:gap-2">
                    <div className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-[#ff5f56]"></div>
                    <div className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-[#ffbd2e]"></div>
                    <div className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-[#27c93f]"></div>
                  </div>
                  <span className="ml-2 sm:ml-4 text-[10px] sm:text-xs text-slate-400 font-mono tracking-[0.2em] sm:tracking-[0.3em] uppercase flex items-center gap-1 sm:gap-2">
                    <Code size={12} className="w-3 h-3 sm:w-4 sm:h-4" /> about_me.js
                  </span>
                </div>
                <div className="p-4 sm:p-6 md:p-8 lg:p-10 font-mono text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed overflow-x-auto custom-scrollbar">
                  <pre className="text-slate-300">
                    <code>
                      <span className="text-purple-400">const</span> <span className="text-blue-400">developer</span> = {'{'}<br/>
                      &nbsp;&nbsp;<span className="text-slate-400">name:</span> <span className="text-green-400">"Desalegn"</span>,<br/>
                      &nbsp;&nbsp;<span className="text-slate-400">role:</span> <span className="text-green-400">"Full-Stack Dev"</span>,<br/>
                      &nbsp;&nbsp;<span className="text-slate-400">location:</span> <span className="text-green-400">"Bahirdar"</span>,<br/>
                      &nbsp;&nbsp;<span className="text-slate-400">skills:</span> [<span className="text-green-400">"React"</span>, <span className="text-green-400">"Node"</span>],<br/>
                      &nbsp;&nbsp;<span className="text-slate-400">available:</span> <span className="text-orange-400">true</span><br/>
                      {'}'};
                    </code>
                  </pre>
                </div>

                {/* Quick Stats Below Code */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 p-4 sm:p-6 border-t border-slate-700/50 bg-slate-800/30">
                  <div className="text-center p-2 sm:p-3 rounded-xl bg-slate-800/50">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 text-yellow-400" />
                    <span className="text-[10px] sm:text-xs font-bold text-slate-400">MSc Cyber</span>
                  </div>
                  <div className="text-center p-2 sm:p-3 rounded-xl bg-slate-800/50">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 text-blue-400" />
                    <span className="text-[10px] sm:text-xs font-bold text-slate-400">50+ Clients</span>
                  </div>
                  <div className="text-center p-2 sm:p-3 rounded-xl bg-slate-800/50">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 text-green-400" />
                    <span className="text-[10px] sm:text-xs font-bold text-slate-400">5+ Years</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
