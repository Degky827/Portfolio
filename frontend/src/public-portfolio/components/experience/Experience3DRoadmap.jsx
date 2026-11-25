import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Code, Database, Users, Terminal, ExternalLink, Calendar, MapPin, CheckCircle2, X, Sparkles } from 'lucide-react'
import { useDarkMode } from '../../../shared/hooks/useDarkMode'
import GuillocheWaves from '../ui/GuillocheWaves'

/* ─── Technology & Language Brand Icons ──────────────────────────── */
const ReactIcon = () => (
  <svg viewBox="-11.5 -10.23 23 20.46" width="13" height="13" fill="none">
    <circle cx="0" cy="0" r="2.05" fill="#61dafb" />
    <g stroke="#61dafb" strokeWidth="1">
      <ellipse rx="11" ry="4.2" />
      <ellipse rx="11" ry="4.2" transform="rotate(60)" />
      <ellipse rx="11" ry="4.2" transform="rotate(120)" />
    </g>
  </svg>
)

const NodeIcon = () => (
  <svg viewBox="0 0 32 32" width="13" height="13" fill="#68a063">
    <path d="M16 2.5l11.7 6.8v13.4L16 29.5 4.3 22.7V9.3L16 2.5zm0 2.3L6.3 10.4v11.2L16 27.2l9.7-5.6V10.4L16 4.8z" />
  </svg>
)

const TSIcon = () => (
  <svg viewBox="0 0 32 32" width="13" height="13" fill="none">
    <rect width="32" height="32" rx="4" fill="#3178c6" />
    <path d="M7 11h10v3h-3.4v11h-3.2v-11H7V11zm11.3 7.8c.8-.8 1.9-1.3 3.3-1.3 2.1 0 3.6 1.1 3.6 3.1 0 2.2-1.8 3-3.6 3.4l-.8.2c-.9.2-1.3.5-1.3.9 0 .5.4.8 1.2.8.9 0 1.7-.4 2.2-.8l1.4 2.1c-.8.8-2.1 1.3-3.7 1.3-2.6 0-4.2-1.4-4.2-3.4 0-2.1 1.6-3.1 3.4-3.5l.9-.2c.8-.2 1.1-.4 1.1-.8 0-.4-.4-.7-1-.7-.8 0-1.5.3-2 .7l-1.5-1.9z" fill="#fff" />
  </svg>
)

const MongoIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="#13aa52">
    <path d="M12 2C12 2 7 7.5 7 13.5C7 17.5 9.5 20.5 12 22C14.5 20.5 17 17.5 17 13.5C17 7.5 12 2 12 2ZM12 20.5C10.5 19.3 8.5 16.8 8.5 13.5C8.5 9 11.5 5 12 4.2V20.5Z" />
  </svg>
)

const VueIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13">
    <path d="M2 3h3.5L12 14.2 18.5 3H22L12 20.5 2 3z" fill="#41b883" />
    <path d="M6.5 3h3.5L12 6.5 14 3h3.5L12 11.5 6.5 3z" fill="#35495e" />
  </svg>
)

const LaravelIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="#ff2d20">
    <path d="M2.5 7.5l8-4.5 8 4.5v9l-8 4.5-8-4.5v-9zm8-2.3l-5.8 3.3 5.8 3.3 5.8-3.3-5.8-3.3zm-6 5.5v5.6l5 2.8v-5.6l-5-2.8zm12 5.6v-5.6l-5 2.8v5.6l5-2.8z" />
  </svg>
)

const DockerIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="#2496ed">
    <path d="M13.98 10.02h2.04V8h-2.04v2.02zm-2.4 0h2.04V8h-2.04v2.02zm-2.4 0h2.04V8H9.18v2.02zm-2.4 0h2.04V8H6.78v2.02zm-2.4 0h2.04V8H4.38v2.02zm4.8-2.38h2.04V5.62H9.18v2.02zm2.4 0h2.04V5.62h-2.04v2.02zm2.4 0h2.04V5.62h-2.04v2.02zm-7.2 0h2.04V5.62H6.78v2.02zm16.5 4.38c-.37-.24-.97-.37-1.63-.37-.25 0-.5.02-.74.07-.4-1.28-1.42-2.13-2.61-2.13H1.96C1.22 12.02.6 12.6.53 13.34c-.58 5.76 3.65 8.68 9.5 8.68 5.17 0 9.5-2.73 10.74-7.85.83.08 1.63-.22 2.1-.84.22-.29.35-.65.35-1.03 0-.08-.01-.17-.03-.26z" />
  </svg>
)

const PythonIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13">
    <path d="M11.9 2c-3.1 0-5 .7-5 2.8v2.1h5.1v.7H4.9c-2.1 0-3.9 1.4-3.9 4.2 0 2.8 1.7 4.2 3.9 4.2h1.4v-2c0-2.4 2-4.2 4.5-4.2h5.1V7.7c0-2.1-2-2.8-5.1-2.8h-1.1V2h2.2zm-2.4 1.4a.7.7 0 1 1 0 1.4.7.7 0 0 1 0-1.4z" fill="#387eb8" />
    <path d="M12.1 22c3.1 0 5-.7 5-2.8v-2.1H12v-.7h7.1c2.1 0 3.9-1.4 3.9-4.2 0-2.8-1.7-4.2-3.9-4.2h-1.4v2c0 2.4-2 4.2-4.5 4.2H8.9v2.1c0 2.1 2 2.8 5.1 2.8h1.1V22h-2.2zm2.4-1.4a.7.7 0 1 1 0-1.4.7.7 0 0 1 0 1.4z" fill="#ffe052" />
  </svg>
)

const CppIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="#00599c">
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-2 14.5a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 3.5 1.7l-1.5 1.5a2.5 2.5 0 1 0 0 2.6l1.5 1.5a4.5 4.5 0 0 1-3.5 1.7zm6-4h-1v-1h-1v1h-1v1h1v1h1v-1h1v-1zm3 0h-1v-1h-1v1h-1v1h1v1h1v-1h1v-1z" />
  </svg>
)

const JavaIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="#e76f00">
    <path d="M8.5 18.2s-1.2.1-.6.6c.7.6 2.3.8 3.7.8 2.2 0 4.8-.6 4.8-.6s-.7.3-1.6.5c-2.3.6-5.5.5-6.8-.3-.9-.6.5-1 .5-1zm-.7-2.3s-1.4.2-.8.8c.8.8 2.8.9 4.6.8 2.8-.1 5.7-.8 5.7-.8s-.9.4-2.1.6c-2.8.5-6.8.5-8.2-.4-1.2-.8.8-1 .8-1zm6.9-5.3c.7 1.4-.4 2.8-.4 2.8s1.6-.8 1-2.4c-.6-1.5-2.2-2.3-2.2-2.3s.9.5 1.6 1.9zm-3.6-6.1s2.2 2.2-1.3 5.4c-2.8 2.5-.6 3.9-.6 3.9s-1.8-.9-1.2-2.6c.7-2 3.1-3.3 3.1-6.7zM4 21c3.5 1 10.3 1 14.2 0 0 0-1.2.6-3.8.9-3.8.4-8.8.2-10.4-.9z" />
  </svg>
)

const FlutterIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13">
    <path d="M14.3 2.5L3.8 13l3.2 3.2L20.7 2.5h-6.4zm0 8.5L8.6 16.7l5.7 5.7h6.4l-5.7-5.7 5.7-5.7h-6.4z" fill="#02569B" />
    <path d="M14.3 11l-2.9 2.9 2.9 2.9 2.9-2.9-2.9-2.9z" fill="#0175C2" />
    <path d="M14.3 16.8l-2.9 2.9 2.9 2.9h6.4l-6.4-5.8z" fill="#29B6F6" />
  </svg>
)

// Isometric Translucent Floating 3D Cube Component
const Floating3DCube = ({ className, size = 38, delay = 0 }) => (
  <motion.div
    initial={{ y: 0, rotate: 0 }}
    animate={{ y: [-6, 6, -6], rotate: [0, 4, -4, 0] }}
    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay }}
    className={`absolute pointer-events-none select-none z-10 ${className}`}
  >
    <svg width={size} height={size * 1.15} viewBox="0 0 100 115" fill="none">
      <defs>
        <linearGradient id={`cubeTop-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#CBD5E1" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#94A3B8" stopOpacity="0.65" />
        </linearGradient>
        <linearGradient id={`cubeLeft-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#475569" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#1E252B" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id={`cubeRight-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#64748B" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#334155" stopOpacity="0.75" />
        </linearGradient>
      </defs>
      <polygon points="50,5 95,30 50,55 5,30" fill={`url(#cubeTop-${size})`} stroke="#4A5568" strokeWidth="1.5" />
      <polygon points="5,30 50,55 50,110 5,85" fill={`url(#cubeLeft-${size})`} stroke="#36454F" strokeWidth="1.5" />
      <polygon points="50,55 95,30 95,85 50,110" fill={`url(#cubeRight-${size})`} stroke="#1E252B" strokeWidth="1.5" />
    </svg>
  </motion.div>
)

export default function Experience3DRoadmap({ customExperiences = [] }) {
  const { darkMode } = useDarkMode()
  const [selectedMilestone, setSelectedMilestone] = useState(null)
  const stageRef = useRef(null)
  const isInView = useInView(stageRef, { once: true, amount: 0.15 })

  // Sequential Entrance Offsets for Cards (Different angles and positions)
  const cardEntranceOffsets = [
    { x: -50, y: -45 }, // Card 0: from top-left
    { x: 0, y: -65 },   // Card 1: from top
    { x: 65, y: -15 },  // Card 2: from right
    { x: -45, y: 55 },  // Card 3: from bottom-left
  ]

  // Real Experience Data with 75px Branch Length (Half of prior length) and 3 Languages With Icons
  const defaultMilestones = [
    {
      id: 'askuala',
      period: '2023 – Present',
      dateSub: 'Jan 2023 – Present',
      role: 'Software Development Intern',
      company: 'Askuala',
      description: 'Joined Askuala building scalable web apps and modern frontend practices with React, Node.js, and MongoDB.',
      icon: Code,
      iconType: 'code',
      // Coordinates in 1150 x 740 coordinate space
      nodeX: 110,
      nodeY: 260,
      stemX: 110,
      stemStartY: 185, // 260 - 185 = 75px branch length
      cardLeft: '20px',
      cardTop: '50px',
      cardWidth: '350px',
      cardHeight: '135px',
      languages: [
        { name: 'React', icon: ReactIcon },
        { name: 'Node.js', icon: NodeIcon },
        { name: 'MongoDB', icon: MongoIcon },
      ],
      tags: ['React', 'Node.js', 'TypeScript', 'MongoDB'],
      contributions: [
        'Developed RESTful APIs for internal tools and client services',
        'Implemented real-time features using Socket.IO',
        'Optimized database queries reducing response time by 40%',
      ],
    },
    {
      id: 'freelance',
      period: '2022',
      dateSub: 'Jun 2022 – Dec 2022',
      role: 'Full Stack Developer',
      company: 'Freelance Projects',
      description: 'Delivered custom production applications and automated CI/CD deployment pipelines for international clients.',
      icon: DockerIcon,
      iconType: 'docker',
      // Coordinates in 1150 x 740 coordinate space
      nodeX: 560,
      nodeY: 275,
      stemX: 560,
      stemStartY: 200, // 275 - 200 = 75px branch length
      cardLeft: '480px',
      cardTop: '65px',
      cardWidth: '350px',
      cardHeight: '135px',
      languages: [
        { name: 'Vue.js', icon: VueIcon },
        { name: 'Laravel', icon: LaravelIcon },
        { name: 'Docker', icon: DockerIcon },
      ],
      tags: ['Vue.js', 'Laravel', 'PostgreSQL', 'TailwindCSS'],
      contributions: [
        'Built 5+ production applications for international clients',
        'Implemented secure authentication and role-based access control',
        'Set up automated deployment pipelines with CI/CD',
      ],
    },
    {
      id: 'bdu',
      period: '2019 – 2023',
      dateSub: 'Sep 2019 – Jun 2023',
      role: 'Computer Science Student',
      company: 'Bahir Dar University',
      description: 'Promoted research on computer vision, algorithms, data structures, and software engineering architecture.',
      icon: Database,
      iconType: 'database',
      // Coordinates in 1150 x 740 coordinate space (sits in wide middle space between top & bottom tracks)
      nodeX: 860,
      nodeY: 590,
      stemX: 860,
      stemStartY: 515, // 590 - 515 = 75px branch length
      cardLeft: '640px',
      cardTop: '380px',
      cardWidth: '350px',
      cardHeight: '135px',
      languages: [
        { name: 'Python', icon: PythonIcon },
        { name: 'C++', icon: CppIcon },
        { name: 'Java', icon: JavaIcon },
      ],
      tags: ['Python', 'C++', 'Java', 'Algorithms'],
      contributions: [
        'Graduated with distinction (GPA: 3.8 / 4.0)',
        'Published research on computer vision applications',
        'Led university programming club and mentored students',
      ],
    },
    {
      id: 'askuals-link',
      period: '2024 – Present',
      dateSub: '2024 – Present',
      role: 'Distributed Systems & Mobile Developer',
      company: 'Askuals Link',
      description: 'Contributed to transport microservices, mobile driver workflows, and containerized Docker deployments.',
      icon: Users,
      iconType: 'team',
      // Coordinates in 1150 x 740 coordinate space (sits in wide middle space between top & bottom tracks)
      nodeX: 410,
      nodeY: 655,
      stemX: 410,
      stemStartY: 580, // 655 - 580 = 75px branch length
      cardLeft: '175px',
      cardTop: '445px',
      cardWidth: '350px',
      cardHeight: '135px',
      languages: [
        { name: 'Flutter', icon: FlutterIcon },
        { name: 'Node.js', icon: NodeIcon },
        { name: 'TypeScript', icon: TSIcon },
      ],
      tags: ['Flutter', 'Node.js', 'RabbitMQ', 'Docker'],
      contributions: [
        'Worked on Menged Transport Driver App and verification workflows',
        'Integrated microservice architecture with asynchronous RabbitMQ queues',
        'Contributed to containerized development and deployment with Docker',
      ],
    },
  ]

  // Map with custom fetched experiences if available
  const milestones = customExperiences && customExperiences.length >= 3
    ? defaultMilestones.map((d, i) => {
        const item = customExperiences[i]
        if (!item) return d
        return {
          ...d,
          period: item.period || d.period,
          role: item.role || d.role,
          company: item.company || d.company,
          description: item.summary || d.description,
          tags: item.primaryTags || d.tags,
          contributions: item.contributions || d.contributions,
        }
      })
    : defaultMilestones

  return (
    <div className="relative w-full max-w-6xl mx-auto select-none">
      {/* ── Background: About-Page Style Guilloche Waves + Glow Orbs + 3D Isometric Purple Cubes ── */}
      <div className="absolute -inset-x-8 -inset-y-12 pointer-events-none overflow-hidden -z-10">
        <GuillocheWaves className="absolute inset-0 z-0 opacity-45 dark:opacity-35 pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-slate-700/15 dark:bg-slate-800/25 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 left-10 w-[350px] h-[350px] bg-slate-800/10 dark:bg-slate-900/30 rounded-full blur-[100px]" />
        <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-[#2C3539]/10 dark:bg-black/30 rounded-full blur-[100px]" />

        <Floating3DCube size={48} className="top-10 right-8 sm:right-14" delay={0} />
        <Floating3DCube size={36} className="top-[45%] left-4 sm:left-10" delay={1.5} />
        <Floating3DCube size={44} className="bottom-12 right-6 sm:right-16" delay={3} />
      </div>

      {/* ═════════════════════════════════════════════════════════════════
          DESKTOP WIDESCREEN 3D CURVED ROADMAP (lg & xl screens)
          ═════════════════════════════════════════════════════════════════ */}
      <div ref={stageRef} className="hidden lg:block relative w-full h-[740px] my-4">
        {/* ── The 3D Curved Track Vector Layer ── */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
          viewBox="0 0 1150 740"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="trackHighlight2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#64748b" stopOpacity="0.85" />
              <stop offset="40%" stopColor="#94a3b8" stopOpacity="0.9" />
              <stop offset="70%" stopColor="#cbd5e1" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#475569" stopOpacity="0.8" />
            </linearGradient>

            <filter id="charcoalGlow2" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#36454f" floodOpacity="0.7" />
            </filter>

            <filter id="whiteGlow2" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#ffffff" floodOpacity="0.85" />
            </filter>
          </defs>

          {/* 1. Track Deep Shadow on Floor (Draws dynamically first) */}
          <motion.path
            d="M 15,255 C 180,262 400,268 560,275 C 760,285 1070,320 1095,430 C 1110,520 990,570 860,590 C 720,612 530,642 410,655 C 290,670 190,685 100,695"
            stroke="rgba(30, 41, 59, 0.22)"
            strokeWidth="18"
            strokeLinecap="round"
            transform="translate(4, 14)"
            filter="blur(10px)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ duration: 1.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          />

          {/* 2. Track Soft Ambient Drop Shadow */}
          <motion.path
            d="M 15,255 C 180,262 400,268 560,275 C 760,285 1070,320 1095,430 C 1110,520 990,570 860,590 C 720,612 530,642 410,655 C 290,670 190,685 100,695"
            stroke="rgba(15, 23, 42, 0.16)"
            strokeWidth="12"
            strokeLinecap="round"
            transform="translate(2, 7)"
            filter="blur(5px)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ duration: 1.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          />

          {/* 3. Main Dark 3D Tube Track (Charcoal Black) */}
          <motion.path
            d="M 15,255 C 180,262 400,268 560,275 C 760,285 1070,320 1095,430 C 1110,520 990,570 860,590 C 720,612 530,642 410,655 C 290,670 190,685 100,695"
            stroke="#1e252b"
            strokeWidth="8.5"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ duration: 1.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          />

          {/* 4. Upper Specular Tube Highlight */}
          <motion.path
            d="M 15,255 C 180,262 400,268 560,275 C 760,285 1070,320 1095,430 C 1110,520 990,570 860,590 C 720,612 530,642 410,655 C 290,670 190,685 100,695"
            stroke="url(#trackHighlight2)"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ duration: 1.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          />

          {/* ── Vertical Branches (75px half-length stems connecting sequentially) ── */}
          {milestones.map((m, index) => {
            const isHovered = selectedMilestone === m.id
            const branchColor = darkMode ? '#ffffff' : '#1e252b'
            const stemDelay = 1.3 + index * 0.5
            return (
              <g key={m.id} className="transition-all duration-300">
                {/* 75px Branch Stem Line (Draws as card arrives) */}
                <motion.line
                  x1={m.stemX}
                  y1={m.stemStartY}
                  x2={m.nodeX}
                  y2={m.nodeY}
                  stroke={branchColor}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  className="stroke-[#1e252b] dark:stroke-white transition-colors duration-300"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
                  transition={{ duration: 0.45, delay: stemDelay, ease: 'easeOut' }}
                />

                {/* Branch Stem Top Joint Pin at bottom of card */}
                <motion.circle
                  cx={m.stemX}
                  cy={m.stemStartY}
                  r="4.5"
                  fill={branchColor}
                  className="fill-[#1e252b] dark:fill-white transition-colors duration-300"
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ duration: 0.3, delay: stemDelay + 0.15 }}
                />

                {/* Node Outer Glowing Halo on Track */}
                <motion.circle
                  cx={m.nodeX}
                  cy={m.nodeY}
                  r="16"
                  fill={darkMode ? '#0f172a' : '#f8fafc'}
                  stroke={darkMode ? '#ffffff' : '#36454f'}
                  strokeWidth="2.2"
                  filter={darkMode ? 'url(#whiteGlow2)' : 'url(#charcoalGlow2)'}
                  opacity={isHovered ? 1 : 0.85}
                  className="stroke-[#36454f] dark:stroke-white transition-colors duration-300"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={isInView ? { scale: 1, opacity: isHovered ? 1 : 0.85 } : {}}
                  transition={{ duration: 0.4, delay: stemDelay - 0.1, type: 'spring', stiffness: 220 }}
                />

                {/* Node Middle Rim */}
                <motion.circle
                  cx={m.nodeX}
                  cy={m.nodeY}
                  r="10.5"
                  fill={darkMode ? '#1e293b' : '#ffffff'}
                  stroke={branchColor}
                  strokeWidth="3.2"
                  className="stroke-[#1e252b] dark:stroke-white transition-colors duration-300"
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ duration: 0.3, delay: stemDelay - 0.1 }}
                />

                {/* Node Center Core */}
                <motion.circle
                  cx={m.nodeX}
                  cy={m.nodeY}
                  r="4.8"
                  fill={branchColor}
                  className="fill-[#1e252b] dark:fill-white transition-colors duration-300"
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ duration: 0.3, delay: stemDelay - 0.1 }}
                />
              </g>
            )
          })}
        </svg>

        {/* ── 4 Floating Frosted Glass Cards (Sequentially animated from distinct positions) ── */}
        {milestones.map((m, index) => {
          const Icon = m.icon
          const isSelected = selectedMilestone === m.id
          const entrance = cardEntranceOffsets[index] || { x: 0, y: 30 }
          const cardDelay = 1.4 + index * 0.5

          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, x: entrance.x, y: entrance.y, scale: 0.92 }}
              animate={isInView ? { opacity: 1, x: 0, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.65, delay: cardDelay, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4, scale: 1.02 }}
              onClick={() => setSelectedMilestone(m.id)}
              style={{
                position: 'absolute',
                left: m.cardLeft,
                top: m.cardTop,
                width: m.cardWidth,
                height: m.cardHeight,
              }}
              className={`rounded-[24px] px-4.5 py-3 backdrop-blur-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-white/98 dark:bg-slate-900/95 border-2 border-indigo-500 shadow-[0_20px_45px_rgba(168,85,247,0.32)] ring-2 ring-indigo-400/30'
                  : 'bg-white/92 dark:bg-slate-900/85 border border-white/90 dark:border-slate-800 shadow-[0_14px_35px_rgba(168,85,247,0.14),0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_45px_rgba(168,85,247,0.25)] hover:border-purple-400/80'
              }`}
              title="Click to view detailed experience"
            >
              {/* Top Row: Icon + Period + Company */}
              <div className="flex items-start gap-3 w-full">
                <div className="w-11 h-11 shrink-0 rounded-2xl bg-gradient-to-br from-[#1e1b4b] to-[#0f172a] flex items-center justify-center text-white shadow-md shadow-indigo-950/25 ring-1 ring-white/20 mt-0.5">
                  <Icon />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="text-sm font-black text-[#1e1b4b] dark:text-white tracking-tight">
                      {m.period}
                    </h3>
                    <span className="text-[9.5px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/40 text-indigo-700 dark:text-purple-300 border border-purple-100 dark:border-purple-900/50 shrink-0">
                      {m.company}
                    </span>
                  </div>

                  <p className="text-[10.5px] font-bold text-indigo-600 dark:text-indigo-400 truncate">
                    {m.role}
                  </p>

                  <p className="text-[11px] font-medium leading-tight text-slate-700 dark:text-slate-300 line-clamp-1 mt-0.5">
                    {m.description}
                  </p>
                </div>
              </div>

              {/* 3 Languages With Brand Icons Under the Card */}
              <div className="flex items-center justify-between pt-1.5 border-t border-purple-100/70 dark:border-purple-900/30">
                <div className="flex items-center gap-1.5">
                  {m.languages.map((lang) => {
                    const LangIcon = lang.icon
                    return (
                      <span
                        key={lang.name}
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9.5px] font-bold bg-slate-100/85 dark:bg-slate-800/85 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700"
                      >
                        <LangIcon />
                        <span>{lang.name}</span>
                      </span>
                    )
                  })}
                </div>

                <span className="text-[9px] font-bold text-indigo-500 dark:text-indigo-400 flex items-center gap-0.5 opacity-80 hover:opacity-100">
                  <span>Details</span>
                  <ExternalLink size={9} />
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* ═════════════════════════════════════════════════════════════════
          MOBILE & TABLET RESPONSIVE 3D TIMELINE TRACK (< lg screens)
          ═════════════════════════════════════════════════════════════════ */}
      <div className="block lg:hidden relative w-full py-4 space-y-6">
        <div className="absolute left-[34px] top-6 bottom-6 w-[7px] bg-[#1e252b] rounded-full shadow-[0_0_12px_rgba(54,69,79,0.4)] pointer-events-none" />

        {milestones.map((m, index) => {
          const Icon = m.icon
          const isSelected = selectedMilestone === m.id

          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              onClick={() => setSelectedMilestone(m.id)}
              className="relative flex items-start gap-4 pl-2 cursor-pointer"
            >
              <div className="relative z-10 shrink-0 mt-6 flex items-center">
                <div className="w-9 h-9 rounded-full border-2 border-[#36454F] dark:border-white bg-white dark:bg-slate-900 shadow-[0_0_15px_rgba(54,69,79,0.5)] dark:shadow-[0_0_15px_rgba(255,255,255,0.6)] flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-[#1e252b] dark:bg-white transition-colors duration-300" />
                </div>
                {/* Connector line pointing to card: White in Dark Mode */}
                <div className="w-3 h-[3px] bg-[#1e252b] dark:bg-white transition-colors duration-300" />
              </div>

              <div
                className={`flex-1 rounded-[24px] p-5 backdrop-blur-2xl transition-all duration-300 ${
                  isSelected
                    ? 'bg-white/98 border-2 border-indigo-500 shadow-xl'
                    : 'bg-white/92 border border-white/90 shadow-[0_12px_30px_rgba(168,85,247,0.12)]'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-br from-[#1e1b4b] to-[#0f172a] flex items-center justify-center text-white shadow-md">
                    <Icon />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-black text-[#1e1b4b] tracking-tight">
                        {m.period}
                      </h3>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-purple-50 text-indigo-700 border border-purple-100">
                        {m.company}
                      </span>
                    </div>
                    <p className="text-[11px] font-bold text-indigo-600 mt-0.5">
                      {m.role}
                    </p>
                    <p className="mt-1 text-xs font-medium text-slate-700 leading-relaxed">
                      {m.description}
                    </p>

                    {/* 3 Languages With Icons in Mobile */}
                    <div className="flex flex-wrap gap-1.5 mt-2.5 pt-2 border-t border-purple-50">
                      {m.languages.map((lang) => {
                        const LangIcon = lang.icon
                        return (
                          <span
                            key={lang.name}
                            className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 border border-slate-200/60"
                          >
                            <LangIcon />
                            <span>{lang.name}</span>
                          </span>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* ── Interactive Popover Modal for Clicked Milestone Card ── */}
      <AnimatePresence>
        {selectedMilestone && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md"
            onClick={() => setSelectedMilestone(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg max-h-[85vh] flex flex-col p-6 sm:p-8 rounded-[32px] bg-white/95 dark:bg-slate-900/95 border-2 border-purple-300/80 dark:border-purple-800/80 shadow-[0_25px_60px_rgba(79,70,229,0.3)] backdrop-blur-2xl overflow-hidden"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedMilestone(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer z-10"
                title="Close modal"
              >
                <X size={18} />
              </button>

              {(() => {
                const active = milestones.find((m) => m.id === selectedMilestone) || milestones[0]
                const ActiveIcon = active.icon
                return (
                  <div className="flex flex-col flex-1 min-h-0">
                    {/* Header */}
                    <div className="flex items-start gap-4 shrink-0 pb-2">
                      <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-[#1e1b4b] to-[#0f172a] flex items-center justify-center text-white shadow-lg shadow-indigo-950/30 ring-1 ring-white/20">
                        <ActiveIcon />
                      </div>
                      <div className="min-w-0 flex-1 pr-6">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black px-3 py-1 rounded-full bg-[#4f46e5] text-white tracking-wide shadow-sm">
                            {active.period}
                          </span>
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                            {active.company}
                          </span>
                        </div>
                        <h3 className="mt-2 text-xl font-black text-[#1e1b4b] dark:text-white">
                          {active.role}
                        </h3>
                      </div>
                    </div>

                    {/* Scrollable Reading Content Body */}
                    <div className="overflow-y-auto pr-2 custom-scrollbar flex-1 mt-3 space-y-4">
                      {/* Description */}
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                        {active.description}
                      </p>

                      {/* Languages with Brand Icons */}
                      <div>
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                          Core Technologies & Languages
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {active.languages.map((lang) => {
                            const LangIcon = lang.icon
                            return (
                              <span
                                key={lang.name}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-50/90 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 border border-purple-200/80 dark:border-purple-800/80 shadow-sm"
                              >
                                <LangIcon />
                                <span>{lang.name}</span>
                              </span>
                            )
                          })}
                        </div>
                      </div>

                      {/* Key Contributions */}
                      {active.contributions && active.contributions.length > 0 && (
                        <div className="pt-3 border-t border-purple-100 dark:border-purple-900/40">
                          <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                            Key Achievements & Responsibilities
                          </h4>
                          <ul className="space-y-2 mt-2">
                            {active.contributions.map((c, i) => (
                              <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
                                <CheckCircle2 size={15} className="text-[#4f46e5] shrink-0 mt-0.5" />
                                <span className="leading-snug">{c}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
