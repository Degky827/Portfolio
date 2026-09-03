import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Award, GraduationCap, Briefcase, Cpu, Target } from 'lucide-react'
import AboutGlassCard from '../../components/about/AboutGlassCard'
import DeveloperWorkstation from '../../components/about/DeveloperWorkstation'
import CertificateGallery from '../../components/about/CertificateGallery'
import CinematicLighting from '../../components/about/CinematicLighting'
import GlobalAtmosphere from '../../components/about/GlobalAtmosphere'
import { createContainerVariants, sectionHeaderVariants, defaultViewport } from '../../shared/animations'

const hardcodedSections = [
  { title: 'Education & Background', content: "I hold a Bachelor's degree in Computer Science, providing a deep foundation in both software systems and digital protection." },
  { title: 'Professional Focus', content: 'I specialize in full-stack development and secure network architecture, bridging the gap between elegant user experiences and robust back-end security.' },
  { title: 'Expertise Areas', content: 'From designing scalable cloud infrastructures to crafting interactive front-end applications, I focus on delivering performance-driven technology solutions.' },
  { title: 'Mission & Approach', content: 'My approach combines clean code practices with a security-first mindset, ensuring that every digital product I build is as safe as it is functional.' },
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
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 3,
      duration: 15 + Math.random() * 25,
      delay: Math.random() * 10,
      opacity: 0.1 + Math.random() * 0.25,
    })), [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none dark:block hidden" aria-hidden="true">
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
    <div className="absolute inset-0 overflow-hidden pointer-events-none dark:block hidden" aria-hidden="true">
      {[20, 40, 60, 80].map((top) => (
        <div
          key={`h-${top}`}
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/10 to-transparent"
          style={{ top: `${top}%` }}
        />
      ))}
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

const MemoizedNeonGrid = memo(NeonGrid)
const MemoizedCyberParticles = memo(CyberParticles)

/* ─── Main About Component ─── */
export default function About({ content, hero, aboutContent }) {
  const shouldReduceMotion = useReducedMotion()

  const title = aboutContent?.title || content?.title || 'Who Am I'
  const subtitle = aboutContent?.subtitle || content?.subtitle || 'A passionate developer and network designer dedicated to building secure and scalable digital experiences.'
  const fullName = hero?.fullName || 'Desalegn'
  const roleTitle = hero?.professionalBadge || 'Full-Stack Dev'

  const storyPillars = aboutContent?.storyPillars?.length
    ? aboutContent.storyPillars.filter((p) => {
        const enContent = p.content && p.content !== '<p><br></p>'
        return enContent
      })
    : []

  const aboutSections = storyPillars.length > 0
    ? storyPillars.map((p) => ({
        title: p.title,
        content: p.content,
      }))
    : hardcodedSections

  const ide = aboutContent?.idePresentation || {}
  const skills = ide.skills?.length ? ide.skills : ['React', 'Node']
  const available = ide.available !== undefined ? ide.available : true
  const locationText = ide.location || content?.location || hero?.location || 'Bahirdar'

  const certifications = aboutContent?.certifications?.length
    ? [...aboutContent.certifications].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
    : []

  const achievementsList = certifications.length > 0 ? certifications : hardcodedAchievements

  return (
    <section
      id="about"
      className="relative min-h-screen py-16 sm:py-20 md:py-24 overflow-hidden bg-[var(--bg-primary)] transition-colors duration-500"
    >
      {/* ── Global Background Effects - dark mode only ── */}
      <div className="dark:block hidden">
        <CinematicLighting />
        <GlobalAtmosphere />
      </div>

      {/* Clean subtle background orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-900/5 rounded-full blur-[120px] pointer-events-none dark:block hidden" aria-hidden="true" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-900/3 rounded-full blur-[100px] pointer-events-none dark:block hidden" aria-hidden="true" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/3 rounded-full blur-[140px] pointer-events-none dark:block hidden" aria-hidden="true" />

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
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 mb-4 sm:mb-6 text-[10px] sm:text-xs font-bold tracking-[0.18em] text-[var(--accent-about)] uppercase rounded-full border border-[var(--accent-about)]/30 bg-[var(--accent-about)]/10"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-about)] animate-pulse" />
            About Me
          </motion.div>

          <h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-4 sm:mb-6 tracking-tight text-[var(--text-primary)]"
          >
            {title}
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed px-4">
            {subtitle}
          </p>

          {/* Clean decorative line */}
          <div className="mt-6 sm:mt-8 flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-[var(--accent-about)]/30" />
            <div className="w-1.5 h-1.5 rotate-45 border border-[var(--accent-about)]/30" />
            <div className="h-px w-12 bg-[var(--accent-about)]/30" />
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
                    animationDelay={shouldReduceMotion ? 0 : index * 0.15}
                    index={index}
                    shouldReduceMotion={shouldReduceMotion}
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

          {/* ── Certificate Gallery (3D Wall) ── */}
          <div className="mt-12 sm:mt-16">
            <CertificateGallery
              certificates={achievementsList}
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
