import { motion } from 'framer-motion'
import { Code, Award, Users, TrendingUp } from 'lucide-react'

const hardcodedSections = [
  { title: 'Education & Background', content: "I hold a Bachelor's degree in Computer Science, providing a deep foundation in both software systems and digital protection." },
  { title: 'Professional Focus', content: "I specialize in full-stack development and secure network architecture, bridging the gap between elegant user experiences and robust back-end security." },
  { title: 'Expertise Areas', content: "From designing scalable cloud infrastructures to crafting interactive front-end applications, I focus on delivering performance-driven technology solutions." },
  { title: 'Mission & Approach', content: "My approach combines clean code practices with a security-first mindset, ensuring that every digital product I build is as safe as it is functional." },
]

const hardcodedAchievements = [
  { title: 'Ethio Coders' },
  { title: 'e-SHE Online Learning' },
  { title: 'Networking Designing' },
  { title: 'Hackathon Computation in 24h' },
]

const iconMap = { Award, Users, TrendingUp }

export default function About({ content, hero, aboutContent }) {
  const title = content?.title || 'Get to Know Me'
  const subtitle = content?.subtitle || 'A passionate developer and network designer dedicated to building secure and scalable digital experiences.'
  const fullName = hero?.fullName || 'Desalegn'
  const roleTitle = hero?.professionalBadge || 'Full-Stack Dev'

  const storyPillars = aboutContent?.storyPillars?.length
    ? aboutContent.storyPillars.filter((p) => p.content && p.content !== '<p><br></p>')
    : []

  const aboutSections = storyPillars.length > 0
    ? storyPillars.map((p) => ({ title: p.title, content: p.content }))
    : hardcodedSections

  const ide = aboutContent?.idePresentation || {}
  const skills = ide.skills?.length ? ide.skills : ['React', 'Node']
  const available = ide.available !== undefined ? ide.available : true
  const locationText = ide.location || content?.location || hero?.location || 'Bahirdar'

  const highlightMetrics = aboutContent?.highlightMetrics?.length
    ? aboutContent.highlightMetrics
    : [
        { icon: 'Award', title: 'Network Designer', value: '' },
        { icon: 'Users', title: 'Happy Clients', value: '50+' },
        { icon: 'TrendingUp', title: 'Years Experience', value: '5+' },
      ]

  const certifications = aboutContent?.certifications?.length
    ? [...aboutContent.certifications].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
    : []

  const achievementsList = certifications.length > 0 ? certifications : hardcodedAchievements

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
  }

  function MetricIcon({ name, ...props }) {
    const Icon = iconMap[name] || Award
    return <Icon {...props} />
  }

  return (
    <section id="about" className="py-16 sm:py-20 md:py-24 bg-white dark:bg-black transition-colors duration-500 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
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
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-[#F8FAFC] mb-4 sm:mb-6 tracking-tight">
            {title}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-500 dark:text-[#94A3B8] max-w-2xl mx-auto leading-relaxed px-4">
            {subtitle}
          </p>
        </motion.div>

        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 p-6 sm:p-8 md:p-12 lg:p-16 rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] lg:rounded-[3.5rem] max-w-5xl lg:max-w-6xl mx-auto relative overflow-hidden shadow-sm">
          <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 items-start relative z-10">
            {/* Left: Story Pillar Cards */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="space-y-4 sm:space-y-6"
            >
              {aboutSections.map((section, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, x: 10 }}
                  className="group p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-[2rem] glass-card hover:bg-white dark:hover:bg-slate-800 transition-all duration-300"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl md:text-2xl mb-2 sm:mb-3 opacity-50 font-normal group-hover:opacity-100 group-hover:font-black group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-all duration-300 font-display">
                      {section.title}
                    </h3>
                    {section.content.startsWith('<') ? (
                      <div
                        className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed prose prose-sm dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: section.content }}
                      />
                    ) : (
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                        {section.content}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Right: Visual Code Block */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="sticky top-24"
            >
              <div className="bg-[#0B1120] rounded-2xl sm:rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl border border-[#334155] group relative">
                <div className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6 bg-[#111827] border-b border-[#334155]">
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
                      &nbsp;&nbsp;                      <span className="text-slate-400">name:</span> <span className="text-green-400">"{fullName}"</span>,<br/>
                      &nbsp;&nbsp;<span className="text-slate-400">role:</span> <span className="text-green-400">"{roleTitle}"</span>,<br/>
                      &nbsp;&nbsp;<span className="text-slate-400">location:</span> <span className="text-green-400">"{locationText}"</span>,<br/>
                      &nbsp;&nbsp;<span className="text-slate-400">skills:</span> [<span className="text-green-400">"{skills.join('", "')}"</span>],<br/>
                      &nbsp;&nbsp;<span className="text-slate-400">available:</span> <span className="text-orange-400">{available ? 'true' : 'false'}</span><br/>
                      {'}'};
                    </code>
                  </pre>
                </div>

                {/* Highlight Metrics Below Code */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 p-4 sm:p-6 border-t border-slate-700/50 bg-slate-800/30">
                  {highlightMetrics.map((metric, idx) => {
                    const val = metric.value || (idx === 0 ? '' : idx === 1 ? '50+' : '5+')
                    const lbl = metric.title || (idx === 0 ? 'Network Designer' : idx === 1 ? 'Happy Clients' : 'Years Experience')
                    return (
                      <div key={idx} className="text-center p-2 sm:p-3 rounded-xl bg-slate-800/50">
                        <MetricIcon name={metric.icon} className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1"
                          style={{ color: idx === 0 ? '#f59e0b' : idx === 1 ? '#60a5fa' : '#34d399' }}
                        />
                        <span className="text-[10px] sm:text-xs font-bold text-slate-400">{val}</span>
                        <span className="block text-[8px] sm:text-[10px] text-slate-500 mt-0.5">{lbl}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Certifications / Achievements Footer */}
          {(achievementsList.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200 dark:border-slate-700"
            >
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                I hold certificates in{' '}
                {achievementsList.map((a, i) => (
                  <span key={i}>
                    {i > 0 && <span>, </span>}
                    {a.verificationUrl ? (
                      <a
                        href={a.verificationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary transition-colors underline underline-offset-2"
                      >
                        {a.title}
                      </a>
                    ) : (
                      <span className="font-bold text-gray-900 dark:text-white">{a.title}</span>
                    )}
                  </span>
                ))}
                .
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
