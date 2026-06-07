import { motion, useReducedMotion } from 'framer-motion'
import {
  Layout, Server, Shield, Sparkles, Smartphone, Wrench, Award,
  Globe, Wifi, Code, Palette, Video, Terminal, Trophy, BookOpen,
  Ribbon, Code2, Dot
} from 'lucide-react'
import {
  SiReact, SiPython, SiHtml5, SiTailwindcss, SiJavascript,
  SiNodedotjs, SiExpress, SiMongodb, SiMysql, SiCisco,
  SiOpenjdk, SiCplusplus, SiPhp, SiFlutter, SiFirebase,
  SiGit, SiGithub
} from 'react-icons/si'

const themeColors = {
  indigo: { primary: '#6366f1', light: '#eef2ff', label: 'Frontend, Network and security' },
  emerald: { primary: '#10b981', light: '#ecfdf5', label: 'BACKEND' },
  amber: { primary: '#f59e0b', light: '#fffbeb', label: 'Additional SKILLS' },
  blue: { primary: '#3b82f6', light: '#eff6ff', label: 'MOBILE APP DEVELOPMENT' },
  red: { primary: '#ef4444', light: '#fef2f2', label: 'TOOLS' },
  teal: { primary: '#14b8a6', light: '#f0fdfa', label: 'CERTIFICATES' },
  purple: { primary: '#8b5cf6', light: '#f5f3ff', label: 'Network and security' },
}

const skillIconMap = {
  'HTML': SiHtml5,
  'Tailwind CSS': SiTailwindcss,
  'JAVASCRIPT': SiJavascript,
  'REACT': SiReact,
  'NODEJS': SiNodedotjs,
  'EXPRESS': SiExpress,
  'MONGODB': SiMongodb,
  'MYSQL': SiMysql,
  'NETWORK DESIGN': Globe,
  'CISCO': SiCisco,
  'CYBER SECURITY': Shield,
  'INTERNET OF THINGS': Wifi,
  'PYTHON': SiPython,
  'JAVA': SiOpenjdk,
  'C++': SiCplusplus,
  'PHP': SiPhp,
  'ALGORISM': Code,
  'GRAPHICS': Palette,
  'VIDEO EDITING': Video,
  'FLUTTER': SiFlutter,
  'FIREBASE': SiFirebase,
  'GIT': SiGit,
  'GITHUB': SiGithub,
  'VISUAL STUDIO': Code2,
  'OPENCODE': Terminal,
  'HACKATON': Trophy,
  'NETWORKING INTRODUCTION': BookOpen,
  'NETWORKING BASICS': BookOpen,
  'INTERNET OF THINGS ETHIO CODERS AND e-SHE': Ribbon,
}

const cardsData = [
  {
    category: 'Frontend',
    headerIcon: Layout,
    theme: themeColors.indigo,
    skills: ['HTML', 'Tailwind CSS', 'JAVASCRIPT', 'REACT'],
  },
  {
    category: 'BACKEND',
    headerIcon: Server,
    theme: themeColors.emerald,
    skills: ['NODEJS', 'EXPRESS', 'MONGODB', 'MYSQL'],
  },
  {
    category: 'Network and security',
    headerIcon: Shield,
    theme: themeColors.purple,
    skills: ['NETWORK DESIGN', 'CISCO', 'CYBER SECURITY', 'INTERNET OF THINGS'],
  },
  {
    category: 'Additional SKILLS',
    headerIcon: Sparkles,
    theme: themeColors.amber,
    skills: ['PYTHON', 'JAVA', 'C++', 'PHP', 'ALGORISM', 'GRAPHICS', 'VIDEO EDITING'],
  },
  {
    category: 'MOBILE APP DEVELOPMENT',
    headerIcon: Smartphone,
    theme: themeColors.blue,
    skills: ['FLUTTER', 'FIREBASE'],
  },
  {
    category: 'TOOLS',
    headerIcon: Wrench,
    theme: themeColors.red,
    skills: ['GIT', 'GITHUB', 'VISUAL STUDIO', 'OPENCODE'],
  },
  {
    category: 'CERTIFICATES',
    headerIcon: Award,
    theme: themeColors.teal,
    skills: ['HACKATON', 'NETWORKING INTRODUCTION', 'NETWORKING BASICS', 'INTERNET OF THINGS ETHIO CODERS AND e-SHE'],
  },
]

function SkillIcon({ skill, className, style }) {
  const Icon = skillIconMap[skill]
  if (!Icon) return null
  return <Icon className={className} style={style} />
}

export default function Skills() {
  const shouldReduceMotion = useReducedMotion()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.08 },
    },
  }

  const itemVariants = {
    hidden: { y: shouldReduceMotion ? 0 : 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: shouldReduceMotion ? 'tween' : 'spring',
        stiffness: 80,
        damping: 12,
      },
    },
  }

  return (
    <section
      id="skills"
      className="py-16 sm:py-20 md:py-24 bg-gray-50 dark:bg-black/50 transition-colors duration-500"
      aria-label="Skills section"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: shouldReduceMotion ? 0.1 : 0.8 }}
          className="text-center mb-12 sm:mb-16 md:mb-20"
        >
          <motion.span
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 mb-4 sm:mb-6 text-xs sm:text-sm font-bold tracking-[0.2em] text-primary uppercase bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full border border-primary/20 hover-lift"
          >
            <Code2 className="w-3 h-3 sm:w-4 sm:h-4" />
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
          viewport={{ once: true, margin: '-50px' }}
          className="glass-panel noise-bg p-6 sm:p-8 md:p-10 lg:p-16 rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] lg:rounded-[3.5rem] max-w-5xl lg:max-w-6xl mx-auto relative overflow-hidden"
        >
          {/* Top Row - 4 Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-6 lg:mb-8 relative z-10">
            {cardsData.slice(0, 4).map((card, index) => {
              const IconComponent = card.headerIcon
              const color = card.theme.primary
              return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="bg-white dark:bg-black text-black dark:text-white rounded-2xl shadow-sm overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 border border-transparent hover:border-gray-200 dark:border-transparent dark:hover:border-slate-700 transition-all duration-300 group"
                  >
                    {/* Card Content */}
                    <div className="p-5 sm:p-6 flex flex-col flex-1">
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                          style={{ color, backgroundColor: `${color}14` }}
                        >
                          <IconComponent size={20} />
                        </div>
                        <h3
                          className="text-sm sm:text-base font-bold tracking-wide opacity-30 group-hover:opacity-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-300"
                        >
                          {card.category}
                        </h3>
                      </div>

                      {/* Skills */}
                      <div className="space-y-2.5 flex-1">
                        {card.skills.map((skill, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2.5 group/skill"
                          >
                            <SkillIcon
                              skill={skill}
                              className="w-[18px] h-[18px] flex-shrink-0 transition-transform duration-200 group-hover/skill:scale-110 dark:opacity-100"
                              style={{ color }}
                            />
                            <span
                              className="text-sm font-medium leading-tight transition-colors duration-200 group-hover/skill:text-gray-900 dark:group-hover/skill:text-gray-200"
                            >
                              {skill}
                            </span>
                          </div>
                        ))}
                      </div>

                    {/* Status Dot */}
                    <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                        {card.skills.length} skills
                      </span>
                    </div>
                  </div>

                </motion.div>
              )
            })}
          </div>

          {/* Bottom Row - 3 Cards Centered */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 max-w-4xl mx-auto relative z-10">
            {cardsData.slice(4, 7).map((card, index) => {
              const IconComponent = card.headerIcon
              const color = card.theme.primary
              return (
                  <motion.div
                    key={index + 4}
                    variants={itemVariants}
                    className="bg-white dark:bg-black text-black dark:text-white rounded-2xl shadow-sm overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 border border-transparent hover:border-gray-200 dark:border-transparent dark:hover:border-slate-700 transition-all duration-300 group"
                  >
                    {/* Card Content */}
                    <div className="p-5 sm:p-6 flex flex-col flex-1">
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                          style={{ color, backgroundColor: `${color}14` }}
                        >
                          <IconComponent size={20} />
                        </div>
                        <h3
                          className="text-sm sm:text-base font-bold tracking-wide opacity-30 group-hover:opacity-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-300"
                        >
                          {card.category}
                        </h3>
                      </div>

                      {/* Skills */}
                      <div className="space-y-2.5 flex-1">
                        {card.skills.map((skill, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2.5 group/skill"
                          >
                            <SkillIcon
                              skill={skill}
                              className="w-[18px] h-[18px] flex-shrink-0 transition-transform duration-200 group-hover/skill:scale-110 dark:opacity-100"
                              style={{ color }}
                            />
                            <span
                              className="text-sm font-medium leading-tight transition-colors duration-200 group-hover/skill:text-gray-900 dark:group-hover/skill:text-gray-200"
                            >
                              {skill}
                            </span>
                          </div>
                        ))}
                      </div>

                    {/* Status Dot */}
                    <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                        {card.skills.length} skills
                      </span>
                    </div>
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
            className="mt-10 sm:mt-14 md:mt-18 pt-8 sm:pt-10 md:pt-14 border-t border-white/20 dark:border-slate-700/50 grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-16 relative z-10"
          >
            {[
              { label: 'Technologies', value: '30+', icon: <Dot size={20} className="w-5 h-5 sm:w-6 sm:h-6" />, color: 'primary' },
              { label: 'Experience', value: '5+', icon: <Dot size={20} className="w-5 h-5 sm:w-6 sm:h-6" />, color: 'secondary' },
              { label: 'Satisfaction', value: '100%', icon: <Dot size={20} className="w-5 h-5 sm:w-6 sm:h-6" />, color: 'accent' },
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
