import { useRef, useState, useEffect, useMemo } from 'react'
import { motion, useInView, useSpring, useTransform, animate } from 'framer-motion'
import { Code2, Award, Layers, Zap, Shield, Cpu } from 'lucide-react'

function useAnimatedCounter(target, duration = 2, inView = false) {
  const [value, setValue] = useState(0)
  const controls = useRef(null)

  useEffect(() => {
    if (!inView) return
    const num = parseInt(target, 10)
    if (isNaN(num)) return

    controls.current = animate(0, num, {
      duration,
      ease: [0.25, 0.46, 0.45, 0.94],
      onUpdate: (v) => setValue(Math.round(v)),
    })

    return () => controls.current?.stop()
  }, [target, duration, inView])

  return value
}

function RotatingRing({ size, color, speed = 4, delay = 0, strokeWidth = 2 }) {
  return (
    <motion.div
      className="absolute inset-0"
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        style={{ transform: 'rotate(-90deg)' }}
      >
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={`${color}20`}
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray="283"
          strokeDashoffset="70"
          strokeLinecap="round"
          animate={{
            strokeDashoffset: [70, 283, 70],
            rotate: [0, 360],
          }}
          transition={{
            strokeDashoffset: {
              duration: speed,
              repeat: Infinity,
              ease: 'easeInOut',
              delay,
            },
            rotate: {
              duration: speed * 2,
              repeat: Infinity,
              ease: 'linear',
            },
          }}
          style={{ transformOrigin: 'center' }}
        />
      </svg>
    </motion.div>
  )
}

function ProgressCircle({ progress, color, size = 120, strokeWidth = 4 }) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`${color}15`}
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeLinecap="round"
          style={{
            transform: 'rotate(-90deg)',
            transformOrigin: 'center',
          }}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </svg>
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{
          textShadow: [
            `0 0 10px ${color}60`,
            `0 0 20px ${color}90`,
            `0 0 10px ${color}60`,
          ],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{
            background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
          }}
        >
          <span
            className="text-2xl font-black"
            style={{ color }}
          >
            {progress}%
          </span>
        </div>
      </motion.div>
    </div>
  )
}

function GlowNumber({ value, suffix = '+', color, icon: Icon }) {
  return (
    <motion.div
      className="relative flex flex-col items-center"
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Holographic background */}
      <div
        className="absolute inset-0 rounded-2xl opacity-30"
        style={{
          background: `linear-gradient(135deg, ${color}15 0%, transparent 50%, ${color}10 100%)`,
          filter: 'blur(10px)',
        }}
      />

      {/* Rotating rings */}
      <div className="relative w-32 h-32 sm:w-40 sm:h-40 mb-4">
        <RotatingRing
          size="100%"
          color={color}
          speed={4}
          delay={0}
          strokeWidth={2}
        />
        <RotatingRing
          size="85%"
          color={color}
          speed={6}
          delay={0.5}
          strokeWidth={1.5}
        />
        <RotatingRing
          size="70%"
          color={color}
          speed={8}
          delay={1}
          strokeWidth={1}
        />

        {/* Center icon */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            rotateY: [0, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{ perspective: '500px' }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${color}30 0%, ${color}10 100%)`,
              boxShadow: `0 0 30px ${color}40, inset 0 0 20px ${color}20`,
            }}
          >
            <Icon size={24} style={{ color }} />
          </div>
        </motion.div>
      </div>

      {/* Glow number */}
      <motion.div
        className="relative"
        animate={{
          textShadow: [
            `0 0 10px ${color}40`,
            `0 0 20px ${color}70`,
            `0 0 10px ${color}40`,
          ],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span
          className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight"
          style={{ color }}
        >
          {value}{suffix}
        </span>
      </motion.div>

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            backgroundColor: color,
            top: '50%',
            left: '50%',
          }}
          animate={{
            x: [
              Math.cos((i * Math.PI * 2) / 6) * 60,
              Math.cos((i * Math.PI * 2) / 6 + Math.PI) * 60,
              Math.cos((i * Math.PI * 2) / 6) * 60,
            ],
            y: [
              Math.sin((i * Math.PI * 2) / 6) * 60,
              Math.sin((i * Math.PI * 2) / 6 + Math.PI) * 60,
              Math.sin((i * Math.PI * 2) / 6) * 60,
            ],
            opacity: [0.2, 0.8, 0.2],
            scale: [0.5, 1.5, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.3,
          }}
        />
      ))}
    </motion.div>
  )
}

function HolographicPanel({ children, className = '' }) {
  return (
    <motion.div
      className={`relative ${className}`}
      whileHover={{
        scale: 1.02,
        rotateX: 2,
        rotateY: -2,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{ perspective: '1000px' }}
    >
      {/* Glass background */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/8 via-white/4 to-transparent backdrop-blur-xl" />

      {/* Holographic border */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        animate={{
          background: [
            'conic-gradient(from 0deg, rgba(6,182,212,0.4), transparent 25%, rgba(139,92,246,0.3) 50%, transparent 75%, rgba(6,182,212,0.4))',
            'conic-gradient(from 360deg, rgba(6,182,212,0.4), transparent 25%, rgba(139,92,246,0.3) 50%, transparent 75%, rgba(6,182,212,0.4))',
          ],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        style={{
          padding: '1px',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
        }}
      />

      {/* Neon glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        animate={{
          boxShadow: [
            '0 0 20px rgba(6,182,212,0.1), inset 0 0 20px rgba(6,182,212,0.05)',
            '0 0 30px rgba(139,92,246,0.15), inset 0 0 30px rgba(139,92,246,0.08)',
            '0 0 20px rgba(6,182,212,0.1), inset 0 0 20px rgba(6,182,212,0.05)',
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}

function ScanningLine() {
  return (
    <motion.div
      className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl"
      style={{ zIndex: 20 }}
    >
      <motion.div
        className="absolute left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.5), transparent)',
          boxShadow: '0 0 10px rgba(6,182,212,0.5)',
        }}
        animate={{
          top: ['-5%', '105%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </motion.div>
  )
}

export default function StatsDashboard3D({
  technologies,
  certificates,
  categories,
  t,
}) {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })

  const techCount = useAnimatedCounter(technologies, 2, isInView)
  const certCount = useAnimatedCounter(certificates, 1.8, isInView)
  const catCount = useAnimatedCounter(categories, 1.5, isInView)

  const stats = useMemo(() => [
    {
      label: t('skills.statTechnologies'),
      value: technologies,
      animatedValue: techCount,
      color: '#06b6d4',
      icon: Code2,
      progress: Math.min((technologies / 50) * 100, 100),
    },
    {
      label: t('skills.statCertificates'),
      value: certificates,
      animatedValue: certCount,
      color: '#8b5cf6',
      icon: Award,
      progress: Math.min((certificates / 10) * 100, 100),
    },
    {
      label: t('skills.statCategories'),
      value: categories,
      animatedValue: catCount,
      color: '#22d3ee',
      icon: Layers,
      progress: Math.min((categories / 10) * 100, 100),
    },
  ], [technologies, certificates, categories, techCount, certCount, catCount, t])

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8 }}
      className="mt-12 sm:mt-16 md:mt-20 pt-8 sm:pt-10 md:pt-14 border-t border-slate-700/50 relative z-10"
    >
      {/* Section header */}
      <motion.div
        className="text-center mb-10 sm:mb-14"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full bg-cyan-500/10 border border-cyan-500/20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          >
            <Cpu size={14} className="text-cyan-400" />
          </motion.div>
          <span className="text-xs font-bold tracking-[0.2em] text-cyan-400 uppercase">
            Analytics
          </span>
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-white/80">
          Performance Metrics
        </h3>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
        {stats.map((stat, i) => (
          <HolographicPanel key={i} className="p-6 sm:p-8">
            <ScanningLine />
            <div className="flex flex-col items-center">
              <GlowNumber
                value={stat.animatedValue}
                suffix="+"
                color={stat.color}
                icon={stat.icon}
              />

              <motion.div
                className="mt-4 mb-3"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
              >
                <div
                  className="h-px w-16"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${stat.color}, transparent)`,
                  }}
                />
              </motion.div>

              <ProgressCircle
                progress={Math.round(stat.progress)}
                color={stat.color}
                size={80}
                strokeWidth={3}
              />

              <motion.span
                className="mt-4 text-xs sm:text-sm font-bold uppercase tracking-[0.15em] text-center"
                style={{ color: `${stat.color}cc` }}
                animate={{
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.2,
                }}
              >
                {stat.label}
              </motion.span>

              <span className="text-[10px] text-white/30 mt-1">
                {stat.value} total
              </span>
            </div>
          </HolographicPanel>
        ))}
      </div>

      {/* Bottom HUD decoration */}
      <motion.div
        className="mt-10 flex items-center justify-center gap-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8 }}
      >
        <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-cyan-500/30" />
        <div className="flex items-center gap-2">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-cyan-400"
            animate={{
              boxShadow: [
                '0 0 4px rgba(6,182,212,0.4)',
                '0 0 8px rgba(6,182,212,0.8)',
                '0 0 4px rgba(6,182,212,0.4)',
              ],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="text-[10px] font-bold tracking-[0.2em] text-cyan-400/60 uppercase">
            System Online
          </span>
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-green-400"
            animate={{
              boxShadow: [
                '0 0 4px rgba(34,197,94,0.4)',
                '0 0 8px rgba(34,197,94,0.8)',
                '0 0 4px rgba(34,197,94,0.4)',
              ],
            }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
          />
        </div>
        <div className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-purple-500/30" />
      </motion.div>
    </motion.div>
  )
}
