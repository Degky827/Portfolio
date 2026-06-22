import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Code, Award, Users, TrendingUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const hardcodedSections = (t) => [
  { title: t('about.sectionEducation'), content: t('about.sectionEducationContent') },
  { title: t('about.sectionProfessionalFocus'), content: t('about.sectionProfessionalFocusContent') },
  { title: t('about.sectionExpertiseAreas'), content: t('about.sectionExpertiseAreasContent') },
  { title: t('about.sectionMissionApproach'), content: t('about.sectionMissionApproachContent') },
]

const hardcodedAchievements = [
  { title: 'Ethio Coders' },
  { title: 'e-SHE Online Learning' },
  { title: 'Networking Designing' },
  { title: 'Hackathon Computation in 24h' },
]

const iconMap = { Award, Users, TrendingUp }

export default function About({ content, hero, aboutContent }) {
  const { t } = useTranslation()
  const title = aboutContent?.title || content?.title || t('about.title')
  const subtitle = aboutContent?.subtitle || content?.subtitle || t('about.subtitle')
  const fullName = hero?.fullName || t('about.fullName')
  const roleTitle = hero?.professionalBadge || t('about.role')

  const storyPillars = aboutContent?.storyPillars?.length
    ? aboutContent.storyPillars.filter((p) => p.content && p.content !== '<p><br></p>')
    : []

  const aboutSections = storyPillars.length > 0
    ? storyPillars.map((p) => ({ title: p.title, content: p.content }))
    : hardcodedSections(t)

  const ide = aboutContent?.idePresentation || {}
  const skills = ide.skills?.length ? ide.skills : ['React', 'Node']
  const available = ide.available !== undefined ? ide.available : true
  const locationText = ide.location || content?.location || hero?.location || t('about.location')

  const highlightMetrics = aboutContent?.highlightMetrics?.length
    ? aboutContent.highlightMetrics
    : [
        { icon: 'Award', title: t('about.metricNetworkDesigner'), value: '' },
        { icon: 'Users', title: t('about.metricHappyClients'), value: '50+' },
        { icon: 'TrendingUp', title: t('about.metricYearsExperience'), value: '5+' },
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

  function TypingCodeBlock({ fullName, roleTitle, locationText, skills, available }) {
    const lines = useRef([
      [
        { text: 'const ', className: 'text-purple-400' },
        { text: 'developer', className: 'text-blue-400' },
        { text: ' = {', className: '' },
      ],
      [
        { text: '  name: ', className: 'text-slate-400' },
        { text: `"${fullName}"`, className: 'text-green-400' },
        { text: ',', className: '' },
      ],
      [
        { text: '  role: ', className: 'text-slate-400' },
        { text: `"${roleTitle}"`, className: 'text-green-400' },
        { text: ',', className: '' },
      ],
      [
        { text: '  location: ', className: 'text-slate-400' },
        { text: `"${locationText}"`, className: 'text-green-400' },
        { text: ',', className: '' },
      ],
      [
        { text: '  skills: [', className: 'text-slate-400' },
        { text: `"${skills.join('", "')}"`, className: 'text-green-400' },
        { text: '],', className: '' },
      ],
      [
        { text: '  available: ', className: 'text-slate-400' },
        { text: available ? 'true' : 'false', className: 'text-orange-400' },
        { text: ',', className: '' },
      ],
      [
        { text: '}', className: '' },
        { text: ';', className: '' },
      ],
    ])

    const flatLines = useRef(
      lines.current.map((tokens) => tokens.map((t) => t.text).join(''))
    )

    const [lineIdx, setLineIdx] = useState(0)
    const [charIdx, setCharIdx] = useState(0)
    const [paused, setPaused] = useState(false)
    const timerRef = useRef(null)
    const pauseTimerRef = useRef(null)

    const totalLines = lines.current.length

    const tick = useCallback(() => {
      setCharIdx((prev) => {
        const currentLineLen = flatLines.current[lineIdx].length
        if (prev < currentLineLen) {
          return prev + 1
        }
        if (lineIdx + 1 < totalLines) {
          setLineIdx((l) => l + 1)
          return 0
        }
        setPaused(true)
        return prev
      })
    }, [lineIdx, totalLines])

    useEffect(() => {
      if (paused) {
        pauseTimerRef.current = setTimeout(() => {
          setLineIdx(0)
          setCharIdx(0)
          setPaused(false)
        }, 3000)
        return () => clearTimeout(pauseTimerRef.current)
      }
      timerRef.current = setTimeout(tick, 35)
      return () => clearTimeout(timerRef.current)
    }, [lineIdx, charIdx, paused, tick])

    return (
      <div className="p-4 sm:p-6 md:p-8 lg:p-10 font-mono text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed overflow-x-auto">
        <pre className="text-slate-300">
          <code>
            {lines.current.map((tokens, i) => {
              const isCurrent = i === lineIdx
              const isPast = i < lineIdx
              const isFuture = i > lineIdx
              const lineText = flatLines.current[i]

              let display
              if (isFuture) {
                display = <span className="opacity-0">{lineText}</span>
              } else if (isCurrent) {
                const shown = lineText.slice(0, charIdx)
                const segments = []
                let pos = 0
                tokens.forEach((tok) => {
                  if (pos >= shown.length) return
                  const end = pos + tok.text.length
                  const slice = shown.slice(Math.max(pos, 0), end)
                  if (slice) {
                    segments.push(
                      <span key={pos} className={tok.className}>{slice}</span>
                    )
                  }
                  pos = end
                })
                display = (
                  <>
                    {segments}
                    <span className="inline-block w-[2px] h-[1em] bg-slate-300 align-text-bottom ml-0.5 cursor-blink" />
                  </>
                )
              } else {
                display = tokens.map((tok, ti) => (
                  <span key={ti} className={tok.className}>{tok.text}</span>
                ))
              }

              return (
                <span key={i} className="block">
                  {display}
                </span>
              )
            })}
            <span id="typing-scroll-anchor" />
          </code>
        </pre>
      </div>
    )
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
            {t('about.badge')}
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
                    <Code size={12} className="w-3 h-3 sm:w-4 sm:h-4" /> {t('about.codeFilename')}
                  </span>
                </div>
                <TypingCodeBlock
                  fullName={fullName}
                  roleTitle={roleTitle}
                  locationText={locationText}
                  skills={skills}
                  available={available}
                />

                {/* Highlight Metrics Below Code */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 p-4 sm:p-6 border-t border-slate-700/50 bg-slate-800/30">
                  {highlightMetrics.map((metric, idx) => {
                    const val = metric.value || (idx === 0 ? '' : idx === 1 ? '50+' : '5+')
                    const lbl = metric.title || (idx === 0 ? t('about.metricNetworkDesigner') : idx === 1 ? t('about.metricHappyClients') : t('about.metricYearsExperience'))
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
                {t('about.certificationsPrefix')}{' '}
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
