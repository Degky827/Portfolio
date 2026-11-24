import { useState, useMemo, useRef, memo } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { GraduationCap, Briefcase, Gem, Target } from 'lucide-react'
import GuillocheWaves from '../../components/ui/GuillocheWaves'
import AboutCenterpiece from '../../components/about/AboutCenterpiece'
import AboutPillarCard from '../../components/about/AboutPillarCard'
import AboutPillarModal from '../../components/about/AboutPillarModal'
import CertificateGallery from '../../components/about/CertificateGallery'
import CinematicLighting from '../../components/about/CinematicLighting'
import GlobalAtmosphere from '../../components/about/GlobalAtmosphere'

// The 4 Core Pillars from the reference design
const DEFAULT_PILLARS = [
  {
    id: 'education',
    number: '01.',
    title: 'Education & Background',
    icon: GraduationCap,
    description: "I hold a Bachelor's degree in Computer Science, providing a deep foundation in both software systems and digital protection.",
    details: [
      "Bachelor of Science in Computer Science from Bahir Dar University (BDU)",
      "Strong theoretical foundation in algorithms, data structures & operating systems",
      "Specialized training in software architecture & enterprise cyber-defense"
    ],
    targetUrl: '/skills',
    targetLabel: 'View Academic & Tech Stack',
    position: 'top-left',
  },
  {
    id: 'focus',
    number: '02.',
    title: 'Professional Focus',
    icon: Briefcase,
    description: "I specialize in full-stack development and secure network architecture, bridging the gap between elegant user experiences and robust back-end security.",
    details: [
      "End-to-End Web Applications: React, Vite, Node.js, Express, MongoDB & Tailwind",
      "Network Infrastructure: Secure routing, VLAN configurations, VPNs & firewall policies",
      "Clean Code Architecture: RESTful & WebSocket real-time systems, modular codebases"
    ],
    targetUrl: '/experience',
    targetLabel: 'Explore Experience Timeline',
    position: 'bottom-left',
  },
  {
    id: 'expertise',
    number: '03.',
    title: 'Expertise Areas',
    icon: Gem,
    description: "From designing scalable cloud infrastructures to crafting interactive front-end applications, I focus on delivering performance-driven technology solutions.",
    details: [
      "Interactive 3D & Modern UI: Three.js, React Three Fiber, Framer Motion animations",
      "Scalable Backend Services: Distributed APIs, JWT auth, MongoDB indexing & Docker",
      "Performance & SEO: Sub-second initial render, responsive mobile-first layouts"
    ],
    targetUrl: '/projects',
    targetLabel: 'View Featured Projects',
    position: 'top-right',
  },
  {
    id: 'mission',
    number: '04.',
    title: 'Mission & Approach',
    icon: Target,
    description: "My approach combines clean code practices with a security-first mindset, ensuring that every digital product I build is safe, reliable, and user-focused.",
    details: [
      "Security-First Engineering: Proactive threat prevention, data sanitization & zero-trust",
      "Human-Centered Design: Intuitive navigation, aesthetic precision & accessible UI",
      "Continuous Innovation: Constantly exploring bleeding-edge web & networking tech"
    ],
    targetUrl: '/contact',
    targetLabel: 'Get In Touch',
    position: 'bottom-right',
  },
]

const hardcodedAchievements = [
  { title: 'Ethio Coders' },
  { title: 'e-SHE Online Learning' },
  { title: 'Networking Designing' },
  { title: 'Hackathon Computation in 24h' },
]

export default function About({ content, hero, aboutContent }) {
  const shouldReduceMotion = useReducedMotion()
  const [selectedPillar, setSelectedPillar] = useState(null)

  const stageRef = useRef(null)
  const isInView = useInView(stageRef, { once: true, amount: 0.15 })

  const title = aboutContent?.title || content?.title || 'Who Am I'
  const subtitle =
    aboutContent?.subtitle ||
    content?.subtitle ||
    'A passionate developer and network designer dedicated to building secure and scalable digital experiences.'

  // Map database pillars if available, or fall back to the exact reference pillars
  const pillars = useMemo(() => {
    if (aboutContent?.storyPillars?.length >= 4) {
      const icons = [GraduationCap, Briefcase, Gem, Target]
      return aboutContent.storyPillars.slice(0, 4).map((p, idx) => ({
        ...DEFAULT_PILLARS[idx],
        title: p.title || DEFAULT_PILLARS[idx].title,
        description: p.content?.replace(/<[^>]+>/g, '') || DEFAULT_PILLARS[idx].description,
        icon: icons[idx],
      }))
    }
    return DEFAULT_PILLARS
  }, [aboutContent?.storyPillars])

  const certifications = aboutContent?.certifications?.length
    ? [...aboutContent.certifications].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
    : []

  const achievementsList = certifications.length > 0 ? certifications : hardcodedAchievements

  return (
    <section
      id="about"
      ref={stageRef}
      className="relative min-h-screen py-14 sm:py-20 md:py-24 overflow-hidden bg-white dark:bg-[#1a1a2e] text-slate-900 dark:text-white transition-colors duration-300"
    >
      {/* ── Monochromatic Purple Guilloche Ribbon Wave Background (Preserved as requested) ── */}
      <GuillocheWaves className="absolute inset-0 z-0 opacity-45 dark:opacity-35 pointer-events-none" />

      {/* ── Ambient Background Lighting ── */}
      <div className="dark:block hidden pointer-events-none">
        <CinematicLighting />
        <GlobalAtmosphere />
      </div>

      {/* Subtle background glow orbs (Cyan & Blue tones) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-cyan-500/10 dark:bg-cyan-950/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-[350px] h-[350px] bg-blue-500/10 dark:bg-blue-950/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-teal-500/10 dark:bg-teal-950/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 max-w-7xl">
        {/* ── Section Header (3D Title & Subtitle) ── */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10 sm:mb-14 md:mb-16"
        >
          {/* 3D Extruded Title: WHO AM I ? */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 tracking-wider uppercase font-sans text-slate-900 dark:text-white text-3d-extruded select-none transition-transform duration-300 hover:scale-[1.02]">
            WHO AM I ?
          </h2>

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed px-4 font-normal">
            {subtitle}
          </p>

          {/* Decorative Diamond Accent Line: <> ◇ <> */}
          <div className="flex items-center justify-center gap-3 mt-5">
            <div className="h-[1.5px] w-14 sm:w-20 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
            <div className="w-2.5 h-2.5 rotate-45 border-2 border-cyan-500 shadow-[0_0_12px_#06B6D4]" />
            <div className="h-[1.5px] w-14 sm:w-20 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
          </div>
        </motion.div>

        {/* ── DESKTOP PANORAMIC STAGE (Screen width >= 1024px) ── */}
        <div className="hidden lg:block relative w-full mb-16">
          {/* Glowing Energy Tracer Arcs (SVG) in Electric Cyan / Blue */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            viewBox="0 0 1200 520"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="neonTracerL" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#0284C7" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#2563EB" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="neonTracerR" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#2563EB" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#0284C7" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.9" />
              </linearGradient>
              <filter id="tracerGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Arc: Card 01 -> Center (Draws dynamically when Card 01 arrives) */}
            <motion.path
              d="M 360 140 C 440 140, 480 210, 520 240"
              fill="none"
              stroke="url(#neonTracerL)"
              strokeWidth="2.5"
              strokeDasharray="6 6"
              filter="url(#tracerGlow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isInView ? { pathLength: 1, opacity: 0.9 } : {}}
              transition={{ duration: 0.8, delay: 1.3, ease: 'easeOut' }}
            />

            {/* Arc: Card 02 -> Pedestal (Draws dynamically when Card 02 arrives) */}
            <motion.path
              d="M 360 380 C 440 380, 480 430, 520 430"
              fill="none"
              stroke="url(#neonTracerL)"
              strokeWidth="2.5"
              strokeDasharray="6 6"
              filter="url(#tracerGlow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isInView ? { pathLength: 1, opacity: 0.9 } : {}}
              transition={{ duration: 0.8, delay: 1.9, ease: 'easeOut' }}
            />

            {/* Arc: Card 03 -> Center (Draws dynamically when Card 03 arrives) */}
            <motion.path
              d="M 840 140 C 760 140, 720 210, 680 240"
              fill="none"
              stroke="url(#neonTracerR)"
              strokeWidth="2.5"
              strokeDasharray="6 6"
              filter="url(#tracerGlow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isInView ? { pathLength: 1, opacity: 0.9 } : {}}
              transition={{ duration: 0.8, delay: 2.5, ease: 'easeOut' }}
            />

            {/* Arc: Card 04 -> Pedestal (Draws dynamically when Card 04 arrives) */}
            <motion.path
              d="M 840 380 C 760 380, 720 430, 680 430"
              fill="none"
              stroke="url(#neonTracerR)"
              strokeWidth="2.5"
              strokeDasharray="6 6"
              filter="url(#tracerGlow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isInView ? { pathLength: 1, opacity: 0.9 } : {}}
              transition={{ duration: 0.8, delay: 3.1, ease: 'easeOut' }}
            />
          </svg>

          {/* 3-Column Slashed Paper Layout */}
          <div className="grid grid-cols-12 gap-6 xl:gap-8 items-center relative z-10">
            {/* Left Column: Card 01 (Arrives at 1.0s from left) & Card 02 (Arrives at 1.6s from left) */}
            <div className="col-span-4 space-y-6 xl:space-y-8">
              <AboutPillarCard
                {...pillars[0]}
                position="top-left"
                rhombusSide="left"
                delay={1.0}
                isInView={isInView}
                onOpenDetails={() => setSelectedPillar(pillars[0])}
              />
              <AboutPillarCard
                {...pillars[1]}
                position="bottom-left"
                rhombusSide="left"
                delay={1.6}
                isInView={isInView}
                onOpenDetails={() => setSelectedPillar(pillars[1])}
              />
            </div>

            {/* Center Column: Desalegn Kasaye Hero Portrait (First on scene at 0.1s + wave ripple!) */}
            <div className="col-span-4 flex items-center justify-center">
              <AboutCenterpiece isInView={isInView} />
            </div>

            {/* Right Column: Card 03 (Arrives at 2.2s from right) & Card 04 (Arrives at 2.8s from right) */}
            <div className="col-span-4 space-y-6 xl:space-y-8">
              <AboutPillarCard
                {...pillars[2]}
                position="top-right"
                rhombusSide="right"
                delay={2.2}
                isInView={isInView}
                onOpenDetails={() => setSelectedPillar(pillars[2])}
              />
              <AboutPillarCard
                {...pillars[3]}
                position="bottom-right"
                rhombusSide="right"
                delay={2.8}
                isInView={isInView}
                onOpenDetails={() => setSelectedPillar(pillars[3])}
              />
            </div>
          </div>
        </div>

        {/* ── TABLET & MOBILE RESPONSIVE LAYOUT (Screen width < 1024px) ── */}
        <div className="lg:hidden space-y-8 mb-16">
          {/* Centerpiece Hero (Appears first with shockwave) */}
          <div className="p-3 rounded-2xl bg-slate-900/10 dark:bg-cyan-950/20 border border-slate-200 dark:border-cyan-500/30 backdrop-blur-sm shadow-xl">
            <AboutCenterpiece isInView={isInView} />
          </div>

          {/* 4 Responsive Slashed Paper Cards (Sequenced 1 by 1) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {pillars.map((pillar, idx) => (
              <AboutPillarCard
                key={pillar.id}
                {...pillar}
                position={pillar.position || (idx === 0 ? 'top-left' : idx === 1 ? 'bottom-left' : idx === 2 ? 'top-right' : 'bottom-right')}
                rhombusSide={idx < 2 ? 'left' : 'right'}
                delay={0.8 + idx * 0.5}
                isInView={isInView}
                onOpenDetails={() => setSelectedPillar(pillar)}
              />
            ))}
          </div>
        </div>

        {/* ── Interactive Deep-Dive Modal ── */}
        <AboutPillarModal
          pillar={selectedPillar}
          isOpen={!!selectedPillar}
          onClose={() => setSelectedPillar(null)}
        />

        {/* ── Certifications & Achievements Showcase ── */}
        <div className="mt-16 sm:mt-20">
          <div className="text-center mb-8">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400 mb-1">
              // Verified Credentials
            </h3>
            <h4 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Certifications & Recognitions
            </h4>
          </div>
          <CertificateGallery certificates={achievementsList} />
        </div>
      </div>
    </section>
  )
}
