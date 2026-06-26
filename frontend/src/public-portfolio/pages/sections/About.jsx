import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Award, GraduationCap, Briefcase, Cpu, Target } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import AboutGlassCard from '../../components/about/AboutGlassCard'
import DeveloperWorkstation from '../../components/about/DeveloperWorkstation'
import StatisticsDashboard from '../../components/about/StatisticsDashboard'
import CertificateGallery from '../../components/about/CertificateGallery'
import CinematicLighting from '../../components/about/CinematicLighting'
import GlobalAtmosphere from '../../components/about/GlobalAtmosphere'

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

// Icons for each card section (matching the 4 story pillars)
const sectionIcons = [GraduationCap, Briefcase, Cpu, Target]
const sectionAccents = ['#8b5cf6', '#22d3ee', '#6366f1', '#a78bfa']

/* ─── Floating Particles Background ─── */
function CyberParticles() {
  const particles = useMemo(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 3,
      duration: 15 + Math.random() * 25,
      delay: Math.random() * 10,
      opacity: 0.1 + Math.random() * 0.25,
    })), [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-purple-400/20"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animation: `cyberFloat ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

/* ─── Neon Grid Lines ─── */
function NeonGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Horizontal lines */}
      {[20, 40, 60, 80].map((top) => (
        <div
          key={`h-${top}`}
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/10 to-transparent"
          style={{ top: `${top}%` }}
        />
      ))}
      {/* Vertical lines */}
      {[25, 50, 75].map((left) => (
        <div
          key={`v-${left}`}
          className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-blue-500/10 to-transparent"
          style={{ left: `${left}%` }}
        />
      ))}
    </div>
  )
}

/* ─── Main About Component ─── */
export default function About({ content, hero, aboutContent }) {
  const { t, i18n } = useTranslation()
  const isAm = i18n.language === 'am'

  const title = isAm
    ? (aboutContent?.titleAm || aboutContent?.title || content?.title || t('about.title'))
    : (aboutContent?.title || content?.title || t('about.title'))
  const subtitle = isAm
    ? (aboutContent?.subtitleAm || aboutContent?.subtitle || content?.subtitle || t('about.subtitle'))
    : (aboutContent?.subtitle || content?.subtitle || t('about.subtitle'))
  const fullName = isAm
    ? (hero?.fullNameAm || hero?.fullName || t('about.fullName'))
    : (hero?.fullName || t('about.fullName'))
  const roleTitle = isAm
    ? (hero?.professionalBadgeAm || hero?.professionalBadge || t('about.role'))
    : (hero?.professionalBadge || t('about.role'))

  const storyPillars = aboutContent?.storyPillars?.length
    ? aboutContent.storyPillars.filter((p) => {
        const enContent = p.content && p.content !== '<p><br></p>'
        const amContent = p.contentAm && p.contentAm !== '<p><br></p>'
        return isAm ? (amContent || enContent) : enContent
      })
    : []

  const aboutSections = storyPillars.length > 0
    ? storyPillars.map((p) => ({
        title: isAm ? (p.titleAm || p.title) : p.title,
        content: isAm ? (p.contentAm || p.content) : p.content,
      }))
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

  return (
    <section
      id="about"
      className="relative min-h-screen py-16 sm:py-20 md:py-24 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #050210 0%, #0a0620 30%, #0d0828 60%, #080418 100%)',
      }}
    >
      {/* ── Global Background Effects ── */}
      <CinematicLighting />
      <GlobalAtmosphere />
      <NeonGrid />
      <CyberParticles />

      {/* Ambient glow orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/8 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-600/6 rounded-full blur-[100px] pointer-events-none" aria-hidden="true" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[140px] pointer-events-none" aria-hidden="true" />

      {/* Metallic floor reflection */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(139,92,246,0.04), transparent)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6">
        {/* ── Hero Section ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16 md:mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 mb-6 sm:mb-8 text-xs sm:text-sm font-bold tracking-[0.2em] text-purple-300 uppercase rounded-full border border-purple-500/30 backdrop-blur-sm"
            style={{
              background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(99,102,241,0.08))',
              boxShadow: '0 0 20px rgba(139,92,246,0.15), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
          >
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            {t('about.badge')}
          </motion.div>

          <h2
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 sm:mb-8 tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #c7d2fe 40%, #a78bfa 70%, #818cf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {title}
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed px-4">
            {subtitle}
          </p>

          {/* Decorative line */}
          <div className="mt-8 sm:mt-10 flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-purple-500/50" />
            <div className="w-2 h-2 rotate-45 border border-purple-500/50" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-purple-500/50" />
          </div>
        </motion.div>

        {/* ── Main Content Grid ── */}
        <div className="max-w-6xl lg:max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-14 items-start">

            {/* ── Left: Story Pillar Cards ── */}
            <div className="space-y-5 sm:space-y-6">
              {aboutSections.map((section, index) => {
                const Icon = sectionIcons[index] || Award
                return (
                  <AboutGlassCard
                    key={index}
                    icon={<Icon size={22} />}
                    title={section.title}
                    description={section.content}
                    accentColor={sectionAccents[index]}
                    animationDelay={index * 0.12}
                    index={index}
                  />
                )
              })}
            </div>

            {/* ── Right: Developer Workstation ── */}
            <div className="sticky top-24">
              <DeveloperWorkstation
                fullName={fullName}
                roleTitle={roleTitle}
                locationText={locationText}
                skills={skills}
                available={available}
              />
            </div>
          </div>

          {/* ── Statistics Dashboard ── */}
          <div className="mt-12 sm:mt-16">
            <StatisticsDashboard
              metrics={highlightMetrics}
              t={t}
              isAm={isAm}
            />
          </div>

          {/* ── Certificate Gallery (3D Wall) ── */}
          <div className="mt-12 sm:mt-16">
            <CertificateGallery
              certificates={achievementsList}
              t={t}
            />
          </div>
        </div>
      </div>

      {/* CSS animation for particles */}
      <style>{`
        @keyframes cyberFloat {
          0%, 100% { transform: translateY(0) translateX(0); opacity: var(--tw-opacity, 0.2); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-40px) translateX(-5px); opacity: calc(var(--tw-opacity, 0.2) * 1.5); }
          75% { transform: translateY(-20px) translateX(-10px); }
        }
      `}</style>
    </section>
  )
}
