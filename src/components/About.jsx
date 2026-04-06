import { motion } from 'framer-motion'
import { GraduationCap, Briefcase, Rocket, Target, Code } from 'lucide-react'

const aboutSections = [
  {
    title: 'Education & Background',
    icon: <GraduationCap size={28} />,
    content: 'I hold a Bachelor\'s degree in Computer Science and a Master\'s degree in Cyber Security, providing a deep foundation in both software systems and digital protection.'
  },
  {
    title: 'Professional Focus',
    icon: <Briefcase size={28} />,
    content: 'I specialize in full-stack development and secure network architecture, bridging the gap between elegant user experiences and robust back-end security.'
  },
  {
    title: 'Expertise Areas',
    icon: <Rocket size={28} />,
    content: 'From designing scalable cloud infrastructures to crafting interactive front-end applications, I focus on delivering performance-driven technology solutions.'
  },
  {
    title: 'Mission & Approach',
    icon: <Target size={28} />,
    content: 'My approach combines clean code practices with a security-first mindset, ensuring that every digital product I build is as safe as it is functional.'
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
    <section id="about" className="py-24 bg-white dark:bg-slate-900 transition-colors duration-500 overflow-hidden">
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
            About Me
          </motion.span>
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
            Get to Know Me
          </h2>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            A passionate developer and network designer dedicated to building secure and scalable digital experiences.
          </p>
        </motion.div>

        <div className="glass-panel noise-bg p-10 md:p-16 rounded-[3.5rem] max-w-6xl mx-auto relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2" />

          <div className="grid lg:grid-cols-2 gap-16 items-start relative z-10">
            {/* Left: Info Cards */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="space-y-6"
            >
              {aboutSections.map((section, index) => (
                <motion.div 
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, x: 10 }}
                  className="group p-8 rounded-[2.5rem] glass-card hover:bg-white dark:hover:bg-slate-800 transition-all duration-300"
                >
                  <div className="flex items-start gap-6">
                    <div className="p-4 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      {section.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-black mb-3 text-gray-900 dark:text-white group-hover:text-primary transition-colors font-display">
                        {section.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg font-medium">
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
              <div className="bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl border border-slate-700/50 group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                <div className="flex items-center gap-3 px-8 py-6 bg-slate-800/50 border-b border-slate-700/50">
                  <div className="flex gap-2">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f56]"></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e]"></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f]"></div>
                  </div>
                  <span className="ml-4 text-xs text-slate-400 font-mono tracking-[0.3em] uppercase flex items-center gap-2">
                    <Code size={14} /> about_me.js
                  </span>
                </div>
                <div className="p-8 md:p-10 font-mono text-base md:text-lg leading-relaxed overflow-x-auto custom-scrollbar">
                  <pre className="text-slate-300">
                    <code>
                      <span className="text-purple-400">const</span> <span className="text-blue-400">developer</span> = {'{'}<br/>
                      &nbsp;&nbsp;<span className="text-slate-400">name:</span> <span className="text-green-400">"Desalegn"</span>,<br/>
                      &nbsp;&nbsp;<span className="text-slate-400">role:</span> <span className="text-green-400">"Full-Stack Developer"</span>,<br/>
                      &nbsp;&nbsp;<span className="text-slate-400">skills:</span> [<span className="text-green-400">"React"</span>, <span className="text-green-400">"Node.js"</span>, <span className="text-green-400">"Network Design"</span>],<br/>
                      &nbsp;&nbsp;<span className="text-slate-400">passion:</span> <span className="text-green-400">"Building great software"</span>,<br/>
                      &nbsp;&nbsp;<span className="text-slate-400">available:</span> <span className="text-orange-400">true</span><br/>
                      {'}'};<br/><br/>
                      <span className="text-slate-500">// Let's build something amazing!</span><br/>
                      <span className="text-blue-400">developer</span>.<span className="text-yellow-400">startProject</span>();
                    </code>
                  </pre>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}