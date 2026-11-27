import { memo, useRef, useState, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import { GraduationCap, Trophy, Code2, Award, ExternalLink, ShieldCheck, CheckCircle2, X, Sparkles } from 'lucide-react'
import Certificate3DBrain from './Certificate3DBrain'

// ── Chrome Corner Screw Bolt ──
const ChromeBolt = ({ className = '' }) => (
  <div
    className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full absolute flex items-center justify-center select-none pointer-events-none z-20 ${className}`}
    style={{
      background: 'radial-gradient(circle at 35% 35%, #ffffff 0%, #cbd5e1 50%, #475569 100%)',
      boxShadow: '0 2px 4px rgba(0,0,0,0.35), inset 0 1px 1px #fff',
      border: '1px solid rgba(255,255,255,0.8)',
    }}
  >
    <div className="w-1.5 h-0.5 bg-slate-600/80 rounded-[0.5px]" />
  </div>
)

// ── Hanging Ribbon Medal Seal ──
const RibbonSeal = () => (
  <div className="relative flex flex-col items-center pointer-events-none select-none">
    {/* Medal Disc */}
    <div
      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center z-10"
      style={{
        background: 'radial-gradient(circle at 35% 35%, #ffffff 0%, #cbd5e1 45%, #64748b 100%)',
        boxShadow: '0 4px 10px rgba(0,0,0,0.25), inset 0 1px 1px #fff',
        border: '1.5px solid rgba(255,255,255,0.95)',
      }}
    >
      <div className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full border border-slate-400/80 flex items-center justify-center">
        <Award size={11} className="text-slate-700 dark:text-slate-800" />
      </div>
    </div>
    {/* Ribbon Tails */}
    <div className="flex gap-0.5 -mt-1.5 z-0">
      <div
        className="w-2.5 h-4 bg-gradient-to-b from-slate-400 to-slate-600 origin-top -rotate-12"
        style={{
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 75%, 0 100%)',
        }}
      />
      <div
        className="w-2.5 h-4 bg-gradient-to-b from-slate-400 to-slate-600 origin-top rotate-12"
        style={{
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 75%, 0 100%)',
        }}
      />
    </div>
  </div>
)

// ── 3D Sculpted Porcelain Brain Centerpiece ──
const Sculpted3DBrain = Certificate3DBrain

// ── The 4 Target Credentials Matching Reference Image ──
const CREDENTIALS = [
  {
    id: 'ethio-coders',
    title: 'Ethio Coders',
    type: 'Certificate of Completion',
    detail: 'Advanced Web Development',
    issuer: 'Ministry of Innovation and Technology & Udacity',
    issueDate: '2024',
    credentialId: 'ETH-WD-84920',
    skills: ['Frontend Architecture', 'Full-Stack JavaScript', 'Web Performance'],
    iconType: 'coders',
    category: 'code',
    verificationUrl: 'https://ethiocoders.et/',
    badgeColor: '#0284c7',
  },
  {
    id: 'e-she',
    title: 'e-SHE',
    type: 'e-SHE Online Learning',
    detail: 'Digital Skills for Professionals',
    issuer: 'Ministry of Education & Arizona State University',
    issueDate: '2023',
    credentialId: 'ESHE-DIG-59218',
    skills: ['Digital Transformation', 'Professional Computing', 'Cloud Systems'],
    iconType: 'eshe',
    category: 'education',
    verificationUrl: 'https://eshe.edu.et/',
    badgeColor: '#0d9488',
  },
  {
    id: 'networking',
    title: 'Networking Designing',
    type: 'Certificate of Achievement',
    detail: 'Network Infrastructure & Security',
    issuer: 'Cisco Networking Academy',
    issueDate: '2023',
    credentialId: 'CSCO-NET-10943',
    skills: ['Routing & Switching', 'VLAN & Subnetting', 'Firewall Policies', 'Network Security'],
    iconType: 'network',
    category: 'award',
    verificationUrl: 'https://www.netacad.com/',
    badgeColor: '#2563eb',
  },
  {
    id: 'hackathon',
    title: 'Hackathon Computation in 24h',
    type: 'Certificate of Participation',
    detail: 'Innovation & Problem Solving',
    issuer: 'Bahir Dar University Innovation Hub',
    issueDate: '2024',
    credentialId: 'BDU-HACK-24HR',
    skills: ['Rapid Prototyping', 'Team Collaboration', 'Real-time Systems', 'Creative Problem Solving'],
    iconType: 'trophy',
    category: 'trophy',
    verificationUrl: 'https://bdu.edu.et/',
    badgeColor: '#d97706',
  },
]

const CredentialIcon = ({ type }) => {
  if (type === 'coders') {
    return (
      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30 border border-white/40 shrink-0">
        <Code2 size={20} />
      </div>
    )
  }
  if (type === 'eshe') {
    return (
      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-teal-500/30 border border-white/40 shrink-0">
        <GraduationCap size={20} />
      </div>
    )
  }
  if (type === 'network') {
    return (
      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-indigo-500/30 border border-white/40 shrink-0">
        <ShieldCheck size={20} />
      </div>
    )
  }
  return (
    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-md shadow-amber-500/30 border border-white/40 shrink-0">
      <Trophy size={20} />
    </div>
  )
}

const CertificateGallery = memo(function CertificateGallery() {
  const [activeTab, setActiveTab] = useState('all') // 'all' | 'education' | 'trophy' | 'code' | 'award'
  const [selectedCert, setSelectedCert] = useState(null)
  const containerRef = useRef(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [4, -4]), {
    stiffness: 90,
    damping: 18,
  })
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [-3, 3]), {
    stiffness: 90,
    damping: 18,
  })

  const handleMouseMove = (e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  const certData = CREDENTIALS

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-6xl mx-auto py-12 px-4 select-none overflow-visible"
      style={{ perspective: 1200 }}
    >
      {/* ── Extruded 3D Headline matching reference ── */}
      <div className="text-center mb-10 sm:mb-14">
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight uppercase"
          style={{
            textShadow: `
              0 1px 0 #64748b,
              0 2px 0 #475569,
              0 3px 0 #334155,
              0 4px 0 #1e293b,
              0 5px 0 #1e252b,
              0 6px 1px rgba(0, 0, 0, 0.3),
              0 8px 18px rgba(30, 37, 43, 0.4)
            `,
          }}
        >
          Certifications & Recognitions
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mt-2 font-normal">
          A testament to my skills, dedication, and commitment to continuous learning.
        </p>

        {/* Center Metallic Bead & Diamond Divider: —— ⚪ —— */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <div className="h-[1.5px] w-14 sm:w-20 bg-gradient-to-r from-transparent via-[#36454F] dark:via-slate-400 to-transparent" />
          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-white via-slate-300 to-slate-500 border border-white shadow-[0_0_10px_rgba(255,255,255,0.6)]" />
          <div className="h-[1.5px] w-14 sm:w-20 bg-gradient-to-r from-transparent via-[#36454F] dark:via-slate-400 to-transparent" />
        </div>
      </div>

      {/* ── Studio Stage: Stepped Pedestal + 3D Brain + 4 Acrylic Plaques ── */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative min-h-[580px] sm:min-h-[640px] flex items-center justify-center overflow-visible"
      >
        {/* SVG Concentric Orbital Chrome Wire Loops */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
          viewBox="0 0 1000 700"
        >
          <ellipse
            cx="500"
            cy="350"
            rx="460"
            ry="210"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="3"
            transform="rotate(-15 500 350)"
            className="opacity-80 dark:opacity-40"
          />
          <ellipse
            cx="500"
            cy="350"
            rx="470"
            ry="180"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="2.5"
            transform="rotate(18 500 350)"
            className="opacity-70 dark:opacity-35"
          />
          <ellipse
            cx="500"
            cy="350"
            rx="480"
            ry="140"
            fill="none"
            stroke="#64748b"
            strokeWidth="1.8"
            transform="rotate(38 500 350)"
            className="opacity-55 dark:opacity-25"
          />
        </svg>

        {/* Floating Mirror Chrome Reflection Spheres */}
        <motion.div
          animate={{ y: [-5, 5, -5] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-16 left-1/4 w-8 h-8 rounded-full z-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 35% 30%, #ffffff 0%, #cbd5e1 50%, #64748b 100%)',
            boxShadow: '0 8px 18px rgba(0,0,0,0.25)',
          }}
        />
        <motion.div
          animate={{ y: [5, -5, 5] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
          className="absolute bottom-24 right-1/4 w-9 h-9 rounded-full z-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 35% 30%, #ffffff 0%, #cbd5e1 50%, #64748b 100%)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
          }}
        />
        <div
          className="absolute bottom-6 right-10 sm:right-16 w-12 h-12 rounded-full z-20 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 35% 30%, #ffffff 0%, #cbd5e1 50%, #64748b 100%)',
            boxShadow: '0 12px 28px rgba(0,0,0,0.3)',
          }}
        />
        <div
          className="absolute bottom-8 left-10 sm:left-16 w-10 h-10 rounded-full z-20 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 35% 30%, #ffffff 0%, #cbd5e1 50%, #64748b 100%)',
            boxShadow: '0 10px 24px rgba(0,0,0,0.28)',
          }}
        />

        {/* ══════════════════════════════════════════════════════
            CENTERPIECE: Stepped Chrome Pedestal & Glowing 3D Brain
           ══════════════════════════════════════════════════════ */}
        <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none">
          {/* Glowing 3D Brain */}
          <div className="relative z-20 -mb-2 pointer-events-auto">
            <Certificate3DBrain />
          </div>

          {/* Multi-Tiered Concentric Circular Stepped Chrome Pedestal */}
          <div className="relative flex flex-col items-center pointer-events-none z-10">
            {/* Top Tier Disc with Neon Blue Center Reflection */}
            <div
              className="w-48 sm:w-56 h-6 rounded-full border-t border-white"
              style={{
                background: 'linear-gradient(180deg, #ffffff 0%, #e2e8f0 45%, #94a3b8 100%)',
                boxShadow: '0 6px 20px rgba(56, 189, 248, 0.4), inset 0 2px 2px #fff',
              }}
            />
            {/* Middle Tier Groove */}
            <div
              className="w-56 sm:w-68 h-5 rounded-full -mt-3 border-t border-slate-300"
              style={{
                background: 'linear-gradient(180deg, #cbd5e1 0%, #64748b 100%)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
              }}
            />
            {/* Bottom Flared Base Disc */}
            <div
              className="w-68 sm:w-84 h-5 rounded-full -mt-2.5 border-t border-slate-200"
              style={{
                background: 'linear-gradient(180deg, #94a3b8 0%, #475569 100%)',
                boxShadow: '0 14px 34px rgba(0,0,0,0.4)',
              }}
            />
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            THE 4 FLOATING ACRYLIC GLASSMORHPIC CERTIFICATION PLAQUES
            (100% Clickable, Accessible, with Hover Highlights & Action Badges)
           ══════════════════════════════════════════════════════ */}
        <div className="absolute inset-0 z-30 pointer-events-auto overflow-visible flex items-center justify-center">
          {/* ── 1. Top-Left Plaque: Ethio Coders ── */}
          <motion.div
            role="button"
            tabIndex={0}
            aria-label={`View certificate for ${certData[0].title}`}
            onClick={(e) => {
              e.stopPropagation()
              setSelectedCert(certData[0])
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setSelectedCert(certData[0])
              }
            }}
            initial={{ opacity: 0, y: 35, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.05, y: -6 }}
            whileTap={{ scale: 0.98 }}
            animate={{
              rotateY: 10,
              rotateX: 4,
            }}
            className={`group absolute top-4 left-2 sm:left-6 md:left-12 z-30 w-[240px] sm:w-[280px] cursor-pointer rounded-2xl p-4 sm:p-5 transition-all duration-300 select-auto outline-none bg-white/95 dark:bg-[#161f30]/95 backdrop-blur-md border-2 border-white/90 dark:border-slate-700/80 shadow-[0_16px_36px_rgba(100,116,139,0.25)] dark:shadow-[0_16px_36px_rgba(0,0,0,0.6),0_0_24px_rgba(30,41,59,0.5)] ${
              activeTab === 'code' ? 'ring-4 ring-cyan-400 shadow-cyan-400/50 scale-105' : ''
            }`}
          >
            <ChromeBolt className="top-2 left-2" />
            <ChromeBolt className="top-2 right-2" />
            <ChromeBolt className="bottom-2 left-2" />
            <ChromeBolt className="bottom-2 right-2" />

            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-3">
                <CredentialIcon type={certData[0].iconType} />
                <div className="text-left">
                  <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight leading-tight group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                    {certData[0].title}
                  </h4>
                </div>
              </div>
              <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-slate-700 dark:text-slate-300 shadow-sm">
                <ExternalLink size={12} />
              </div>
            </div>
            <div className="text-center my-1.5">
              <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 leading-snug">
                {certData[0].type}
              </p>
              <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">
                {certData[0].detail}
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 mt-3">
              <RibbonSeal />
            </div>
            <div className="text-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[10px] font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-wider bg-blue-50 dark:bg-cyan-950/70 px-2 py-0.5 rounded-full border border-blue-200 dark:border-cyan-800/70">
                Click to View Details ↗
              </span>
            </div>
          </motion.div>

          {/* ── 2. Top-Right Plaque: e-SHE ── */}
          <motion.div
            role="button"
            tabIndex={0}
            aria-label={`View certificate for ${certData[1].title}`}
            onClick={(e) => {
              e.stopPropagation()
              setSelectedCert(certData[1])
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setSelectedCert(certData[1])
              }
            }}
            initial={{ opacity: 0, y: 35, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.05, y: -6 }}
            whileTap={{ scale: 0.98 }}
            animate={{
              rotateY: -10,
              rotateX: 4,
            }}
            className={`group absolute top-4 right-2 sm:right-6 md:right-12 z-30 w-[240px] sm:w-[280px] cursor-pointer rounded-2xl p-4 sm:p-5 transition-all duration-300 select-auto outline-none bg-white/95 dark:bg-[#161f30]/95 backdrop-blur-md border-2 border-white/90 dark:border-slate-700/80 shadow-[0_16px_36px_rgba(100,116,139,0.25)] dark:shadow-[0_16px_36px_rgba(0,0,0,0.6),0_0_24px_rgba(30,41,59,0.5)] ${
              activeTab === 'education' ? 'ring-4 ring-teal-400 shadow-teal-400/50 scale-105' : ''
            }`}
          >
            <ChromeBolt className="top-2 left-2" />
            <ChromeBolt className="top-2 right-2" />
            <ChromeBolt className="bottom-2 left-2" />
            <ChromeBolt className="bottom-2 right-2" />

            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-3">
                <CredentialIcon type={certData[1].iconType} />
                <div className="text-left">
                  <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight leading-tight group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {certData[1].title}
                  </h4>
                </div>
              </div>
              <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-slate-700 dark:text-slate-300 shadow-sm">
                <ExternalLink size={12} />
              </div>
            </div>
            <div className="text-center my-1.5">
              <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 leading-snug">
                {certData[1].type}
              </p>
              <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">
                {certData[1].detail}
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 mt-3">
              <RibbonSeal />
            </div>
            <div className="text-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider bg-teal-50 dark:bg-teal-950/70 px-2 py-0.5 rounded-full border border-teal-200 dark:border-teal-800/70">
                Click to View Details ↗
              </span>
            </div>
          </motion.div>

          {/* ── 3. Bottom-Left Plaque: Networking Designing ── */}
          <motion.div
            role="button"
            tabIndex={0}
            aria-label={`View certificate for ${certData[2].title}`}
            onClick={(e) => {
              e.stopPropagation()
              setSelectedCert(certData[2])
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setSelectedCert(certData[2])
              }
            }}
            initial={{ opacity: 0, y: 35, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.05, y: -6 }}
            whileTap={{ scale: 0.98 }}
            animate={{
              rotateY: 8,
              rotateX: -2,
            }}
            className={`group absolute bottom-6 left-2 sm:left-6 md:left-12 z-30 w-[240px] sm:w-[280px] cursor-pointer rounded-2xl p-4 sm:p-5 transition-all duration-300 select-auto outline-none bg-white/95 dark:bg-[#161f30]/95 backdrop-blur-md border-2 border-white/90 dark:border-slate-700/80 shadow-[0_16px_36px_rgba(100,116,139,0.25)] dark:shadow-[0_16px_36px_rgba(0,0,0,0.6),0_0_24px_rgba(30,41,59,0.5)] ${
              activeTab === 'award' ? 'ring-4 ring-indigo-400 shadow-indigo-400/50 scale-105' : ''
            }`}
          >
            <ChromeBolt className="top-2 left-2" />
            <ChromeBolt className="top-2 right-2" />
            <ChromeBolt className="bottom-2 left-2" />
            <ChromeBolt className="bottom-2 right-2" />

            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-3">
                <CredentialIcon type={certData[2].iconType} />
                <div className="text-left">
                  <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {certData[2].title}
                  </h4>
                </div>
              </div>
              <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-slate-700 dark:text-slate-300 shadow-sm">
                <ExternalLink size={12} />
              </div>
            </div>
            <div className="text-center my-1.5">
              <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 leading-snug">
                {certData[2].type}
              </p>
              <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">
                {certData[2].detail}
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 mt-3">
              <RibbonSeal />
            </div>
            <div className="text-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/70 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800/70">
                Click to View Details ↗
              </span>
            </div>
          </motion.div>

          {/* ── 4. Bottom-Right Plaque: Hackathon Computation in 24h ── */}
          <motion.div
            role="button"
            tabIndex={0}
            aria-label={`View certificate for ${certData[3].title}`}
            onClick={(e) => {
              e.stopPropagation()
              setSelectedCert(certData[3])
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setSelectedCert(certData[3])
              }
            }}
            initial={{ opacity: 0, y: 35, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.6, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.05, y: -6 }}
            whileTap={{ scale: 0.98 }}
            animate={{
              rotateY: -8,
              rotateX: -2,
            }}
            className={`group absolute bottom-6 right-2 sm:right-6 md:right-12 z-30 w-[240px] sm:w-[280px] cursor-pointer rounded-2xl p-4 sm:p-5 transition-all duration-300 select-auto outline-none bg-white/95 dark:bg-[#161f30]/95 backdrop-blur-md border-2 border-white/90 dark:border-slate-700/80 shadow-[0_16px_36px_rgba(100,116,139,0.25)] dark:shadow-[0_16px_36px_rgba(0,0,0,0.6),0_0_24px_rgba(30,41,59,0.5)] ${
              activeTab === 'trophy' ? 'ring-4 ring-amber-400 shadow-amber-400/50 scale-105' : ''
            }`}
          >
            <ChromeBolt className="top-2 left-2" />
            <ChromeBolt className="top-2 right-2" />
            <ChromeBolt className="bottom-2 left-2" />
            <ChromeBolt className="bottom-2 right-2" />

            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-3">
                <CredentialIcon type={certData[3].iconType} />
                <div className="text-left">
                  <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight leading-tight group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {certData[3].title}
                  </h4>
                </div>
              </div>
              <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-slate-700 dark:text-slate-300 shadow-sm">
                <ExternalLink size={12} />
              </div>
            </div>
            <div className="text-center my-1.5">
              <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 leading-snug">
                {certData[3].type}
              </p>
              <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">
                {certData[3].detail}
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 mt-3">
              <RibbonSeal />
            </div>
            <div className="text-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider bg-amber-50 dark:bg-amber-950/70 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800/70">
                Click to View Details ↗
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ── Bottom Controls: 4 Circular 3D Embossed Token Buttons matching reference ── */}
      <div className="relative mt-8 sm:mt-12 flex flex-col items-center">
        {/* Accent Divider Line */}
        <div className="w-full max-w-xl h-[1.5px] bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent mb-6" />

        <div className="flex items-center justify-center gap-4 sm:gap-6">
          {/* Button 1: Graduation Cap */}
          <button
            type="button"
            onClick={() => {
              setActiveTab(activeTab === 'education' ? 'all' : 'education')
              setSelectedCert(certData[1])
            }}
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-200 active:translate-y-1 cursor-pointer ${
              activeTab === 'education'
                ? 'bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-[0_6px_0_#0f766e,0_10px_20px_rgba(20,184,166,0.5)] scale-110'
                : 'bg-gradient-to-br from-[#2a303c] to-[#161a22] text-slate-200 shadow-[0_5px_0_#0c0f14,0_8px_16px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.25)] border border-white/10 hover:brightness-110'
            }`}
            title="Education & Completion (e-SHE)"
          >
            <GraduationCap size={22} />
          </button>

          {/* Button 2: Trophy */}
          <button
            type="button"
            onClick={() => {
              setActiveTab(activeTab === 'trophy' ? 'all' : 'trophy')
              setSelectedCert(certData[3])
            }}
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-200 active:translate-y-1 cursor-pointer ${
              activeTab === 'trophy'
                ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-[0_6px_0_#b45309,0_10px_20px_rgba(245,158,11,0.5)] scale-110'
                : 'bg-gradient-to-br from-[#2a303c] to-[#161a22] text-slate-200 shadow-[0_5px_0_#0c0f14,0_8px_16px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.25)] border border-white/10 hover:brightness-110'
            }`}
            title="Hackathons & Competitions"
          >
            <Trophy size={20} />
          </button>

          {/* Button 3: Code */}
          <button
            type="button"
            onClick={() => {
              setActiveTab(activeTab === 'code' ? 'all' : 'code')
              setSelectedCert(certData[0])
            }}
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-200 active:translate-y-1 cursor-pointer ${
              activeTab === 'code'
                ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-[0_6px_0_#0369a1,0_10px_20px_rgba(14,165,233,0.5)] scale-110'
                : 'bg-gradient-to-br from-[#2a303c] to-[#161a22] text-slate-200 shadow-[0_5px_0_#0c0f14,0_8px_16px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.25)] border border-white/10 hover:brightness-110'
            }`}
            title="Web & Software Engineering (Ethio Coders)"
          >
            <Code2 size={20} />
          </button>

          {/* Button 4: Ribbon Medal */}
          <button
            type="button"
            onClick={() => {
              setActiveTab(activeTab === 'award' ? 'all' : 'award')
              setSelectedCert(certData[2])
            }}
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-200 active:translate-y-1 cursor-pointer ${
              activeTab === 'award'
                ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-[0_6px_0_#1d4ed8,0_10px_20px_rgba(59,130,246,0.5)] scale-110'
                : 'bg-gradient-to-br from-[#2a303c] to-[#161a22] text-slate-200 shadow-[0_5px_0_#0c0f14,0_8px_16px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.25)] border border-white/10 hover:brightness-110'
            }`}
            title="Professional Certifications (Networking Designing)"
          >
            <Award size={21} />
          </button>
        </div>
      </div>

      {/* ── Interactive Credential Detail Modal ── */}
      <AnimatePresence>
        {selectedCert && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-md p-4"
            onClick={() => setSelectedCert(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 320, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-[2rem] p-6 sm:p-8 bg-white dark:bg-slate-900 border-2 border-white/90 dark:border-slate-700 shadow-2xl relative text-left overflow-hidden"
              style={{
                boxShadow: '0 25px 60px rgba(0,0,0,0.4), 0 0 40px rgba(56,189,248,0.2)',
              }}
            >
              {/* Decorative top ribbon */}
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400" />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedCert(null)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer shadow-sm"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>

              {/* Header */}
              <div className="flex items-center gap-4 mb-5">
                <CredentialIcon type={selectedCert.iconType} />
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                    {selectedCert.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400">
                    {selectedCert.type}
                  </p>
                </div>
              </div>

              {/* Verified Certificate Body */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/60 dark:from-slate-800/80 dark:to-slate-800/40 border border-slate-200 dark:border-slate-700 mb-5 relative overflow-hidden">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-wider mb-2">
                  <CheckCircle2 size={16} />
                  <span>Verified Credential & Accreditation</span>
                </div>
                <h4 className="text-base sm:text-lg font-extrabold text-slate-800 dark:text-slate-100 mb-1">
                  {selectedCert.detail}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                  Issued by: <strong className="text-slate-900 dark:text-slate-200">{selectedCert.issuer}</strong>
                </p>

                {/* Key Skills Tags */}
                {selectedCert.skills && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {selectedCert.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-xs"
                      >
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                )}

                {/* Credential ID */}
                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  <span>ID: {selectedCert.credentialId}</span>
                  <span>Issued: {selectedCert.issueDate}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedCert(null)}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Close
                </button>
                <a
                  href={selectedCert.verificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center gap-2 hover:brightness-110 active:translate-y-0.5 transition-all shadow-lg shadow-blue-500/30 cursor-pointer"
                >
                  <ExternalLink size={14} />
                  <span>Verify Credential</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
})

export default CertificateGallery
