import { useState, useEffect, useMemo } from 'react'
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import {
  Code2, Award, ExternalLink, Calendar, Building2, X,
} from 'lucide-react'
import {
  SiReact, SiPython, SiHtml5, SiTailwindcss, SiJavascript,
  SiNodedotjs, SiExpress, SiMongodb, SiMysql, SiCisco,
  SiOpenjdk, SiCplusplus, SiPhp, SiFlutter, SiFirebase,
  SiGit, SiGithub,
} from 'react-icons/si'
import { getSkills } from '../../services/skillService'

const skillIconMap = {
  'SiHtml5': SiHtml5, 'HTML': SiHtml5,
  'SiTailwindcss': SiTailwindcss, 'Tailwind CSS': SiTailwindcss,
  'SiJavascript': SiJavascript, 'JAVASCRIPT': SiJavascript,
  'SiReact': SiReact, 'REACT': SiReact,
  'SiNodedotjs': SiNodedotjs, 'NODEJS': SiNodedotjs,
  'SiExpress': SiExpress, 'EXPRESS': SiExpress,
  'SiMongodb': SiMongodb, 'MONGODB': SiMongodb,
  'SiMysql': SiMysql, 'MYSQL': SiMysql,
  'SiCisco': SiCisco, 'CISCO': SiCisco, 'NETWORK DESIGN': SiCisco, 'CYBER SECURITY': SiCisco, 'INTERNET OF THINGS': SiCisco,
  'SiPython': SiPython, 'PYTHON': SiPython,
  'SiOpenjdk': SiOpenjdk, 'JAVA': SiOpenjdk,
  'SiCplusplus': SiCplusplus, 'C++': SiCplusplus,
  'SiPhp': SiPhp, 'PHP': SiPhp,
  'SiFlutter': SiFlutter, 'FLUTTER': SiFlutter,
  'SiFirebase': SiFirebase, 'FIREBASE': SiFirebase,
  'SiGit': SiGit, 'GIT': SiGit,
  'SiGithub': SiGithub, 'GITHUB': SiGithub,
  'VISUAL STUDIO': SiCisco,
  'OPENCODE': SiCisco,
}

function SkillIcon({ skill, className, style }) {
  const IconComponent = useMemo(() => {
    const key = skill.icon || skill.name
    if (!key) return null
    const Icon = skillIconMap[key] || skillIconMap[key.toUpperCase()]
    return Icon || null
  }, [skill.icon, skill.name])
  if (!IconComponent) return null
  return <IconComponent className={className} style={style} />
}

export default function Skills() {
  const shouldReduceMotion = useReducedMotion()
  const [categories, setCategories] = useState([])
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCert, setSelectedCert] = useState(null)

  useEffect(() => {
    getSkills({ status: 'active', limit: 100 })
      .then((data) => {
        setSkills(data.skills || [])
        setCategories(data.categories || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const skillCards = useMemo(() => {
    return categories
      .filter((cat) => cat.type === 'skills')
      .map((cat) => {
        const catSkills = skills.filter(
          (s) => s.category?.toLowerCase() === cat.title?.toLowerCase() && s.status === 'active',
        )
        return {
          _id: cat._id,
          category: cat.title,
          headerIcon: cat.icon,
          color: cat.color || '#6366f1',
          skills: catSkills,
          type: 'skills',
        }
      })
      .filter((card) => card.skills.length > 0)
  }, [categories, skills])

  const certificatesCard = useMemo(() => {
    const certCat = categories.find((cat) => cat.type === 'certificates')
    if (!certCat) return null
    const certSkills = skills.filter(
      (s) => s.category?.toLowerCase() === certCat.title?.toLowerCase() && s.status === 'active',
    )
    if (certSkills.length === 0) return null
    return {
      _id: certCat._id,
      category: certCat.title,
      headerIcon: certCat.icon,
      color: certCat.color || '#14b8a6',
      skills: certSkills,
      type: 'certificates',
    }
  }, [categories, skills])

  const allCards = useMemo(() => {
    const cards = [...skillCards]
    if (certificatesCard) cards.push(certificatesCard)
    return cards
  }, [skillCards, certificatesCard])

  const topRow = allCards.slice(0, 4)
  const bottomRow = allCards.slice(4)

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

  if (loading) {
    return (
      <section id="skills" className="py-16 sm:py-20 md:py-24 bg-gray-50 dark:bg-black/50 transition-colors duration-500">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        </div>
      </section>
    )
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

        {allCards.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 dark:text-gray-500">No skills added yet.</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="glass-panel noise-bg p-6 sm:p-8 md:p-10 lg:p-16 rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] lg:rounded-[3.5rem] max-w-5xl lg:max-w-6xl mx-auto relative overflow-hidden"
          >
            {topRow.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-6 lg:mb-8 relative z-10">
                {topRow.map((card) => (
                  <SkillCard
                    key={card._id}
                    card={card}
                    itemVariants={itemVariants}
                    onCertClick={(cert) => setSelectedCert(cert)}
                  />
                ))}
              </div>
            )}

            {bottomRow.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 max-w-4xl mx-auto relative z-10">
                {bottomRow.map((card) => (
                  <SkillCard
                    key={card._id}
                    card={card}
                    itemVariants={itemVariants}
                    onCertClick={(cert) => setSelectedCert(cert)}
                  />
                ))}
              </div>
            )}

            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: shouldReduceMotion ? 0.1 : 0.8 }}
              className="mt-10 sm:mt-14 md:mt-18 pt-8 sm:pt-10 md:pt-14 border-t border-white/20 dark:border-slate-700/50 grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-16 relative z-10"
            >
              {[
                { label: 'Technologies', value: `${skills.filter((s) => s.category?.toLowerCase() !== 'certificates').length}+`, color: 'primary' },
                { label: 'Certificates', value: `${certificatesCard?.skills.length || 0}+`, color: 'secondary' },
                { label: 'Categories', value: `${skillCards.length}+`, color: 'accent' },
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
                    <Award size={20} className="w-5 h-5 sm:w-6 sm:h-6" />
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
        )}
      </div>

      {/* Certificate Detail Modal */}
      <AnimatePresence>
        {selectedCert && (
          <CertModal cert={selectedCert} onClose={() => setSelectedCert(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}

function SkillCard({ card, itemVariants, onCertClick }) {
  const color = card.color

  if (card.type === 'certificates') {
    return (
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-black text-black dark:text-white rounded-2xl shadow-sm overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 border border-transparent hover:border-gray-200 dark:border-transparent dark:hover:border-slate-700 transition-all duration-300 group"
      >
        <div className="p-5 sm:p-6 flex flex-col flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
              style={{ color, backgroundColor: `${color}14` }}
            >
              <Award size={20} />
            </div>
            <h3 className="text-sm sm:text-base font-bold tracking-wide opacity-30 group-hover:opacity-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-300">
              {card.category}
            </h3>
          </div>

          {/* Certificate list inside the card */}
          <div className="space-y-1.5 flex-1">
            {card.skills.map((cert) => (
              <button
                key={cert._id}
                onClick={() => onCertClick(cert)}
                className="w-full text-left flex items-center gap-2.5 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group/cert"
              >
                {cert.icon ? (
                  <img
                    src={cert.icon.startsWith('http') ? cert.icon : `http://localhost:5000${cert.icon}`}
                    alt=""
                    className="w-7 h-7 rounded-lg object-cover flex-shrink-0"
                  />
                ) : (
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${color}20` }}
                  >
                    <Award size={14} style={{ color }} />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <span className="text-sm font-medium leading-tight block truncate transition-colors duration-200 group-hover/cert:text-gray-900 dark:group-hover/cert:text-gray-200">
                    {cert.name}
                  </span>
                  {cert.issuer && (
                    <span className="text-[11px] text-gray-400 block truncate">
                      {cert.issuer}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
              {card.skills.length} certificate{card.skills.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white dark:bg-black text-black dark:text-white rounded-2xl shadow-sm overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 border border-transparent hover:border-gray-200 dark:border-transparent dark:hover:border-slate-700 transition-all duration-300 group"
    >
      <div className="p-5 sm:p-6 flex flex-col flex-1">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
            style={{ color, backgroundColor: `${color}14` }}
          >
            <Code2 size={20} style={{ color }} />
          </div>
          <h3 className="text-sm sm:text-base font-bold tracking-wide opacity-30 group-hover:opacity-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-300">
            {card.category}
          </h3>
        </div>

        <div className="space-y-2.5 flex-1">
          {card.skills.map((skill) => (
            <div
              key={skill._id}
              className="flex items-center gap-2.5 group/skill"
            >
              <SkillIcon
                skill={skill}
                className="w-[18px] h-[18px] flex-shrink-0 transition-transform duration-200 group-hover/skill:scale-110 dark:opacity-100"
                style={{ color }}
              />
              <span className="text-sm font-medium leading-tight transition-colors duration-200 group-hover/skill:text-gray-900 dark:group-hover/skill:text-gray-200">
                {skill.name}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: color }}
          />
          <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
            {card.skills.length} skill{card.skills.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

function CertModal({ cert, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200 dark:border-slate-800"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors z-10"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {cert.icon && (
          <div className="h-36 bg-gray-100 dark:bg-slate-800 overflow-hidden">
            <img
              src={cert.icon.startsWith('http') ? cert.icon : `http://localhost:5000${cert.icon}`}
              alt={cert.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <Award size={18} className="text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Certificate</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {cert.name}
          </h3>

          <div className="space-y-3 text-sm">
            {cert.issuer && (
              <div className="flex items-center gap-2.5 text-gray-500 dark:text-gray-400">
                <Building2 size={16} className="shrink-0" />
                <span>{cert.issuer}</span>
              </div>
            )}
            {cert.issueDate && (
              <div className="flex items-center gap-2.5 text-gray-500 dark:text-gray-400">
                <Calendar size={16} className="shrink-0" />
                <span>{cert.issueDate}</span>
              </div>
            )}
          </div>

          {cert.description && (
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {cert.description}
            </p>
          )}

          {cert.certificateUrl && (
            <a
              href={cert.certificateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              <ExternalLink size={14} />
              View Certificate
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
