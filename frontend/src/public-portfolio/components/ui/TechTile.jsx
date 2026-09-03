import { MoreHorizontal } from 'lucide-react'
import {
  SiReact,
  SiNodedotjs,
  SiTypescript,
  SiMongodb,
  SiExpress,
  SiFlutter,
  SiDart,
  SiPostgresql,
  SiDocker,
  SiGit,
  SiPrisma,
  SiRabbitmq,
  SiThreedotjs,
  SiFramer,
  SiJavascript,
  SiTailwindcss,
  SiRedis,
  SiFirebase,
  SiPython,
  SiGithub,
} from 'react-icons/si'

const ICONS = {
  react: { Icon: SiReact, color: '#61DAFB' },
  'react three fiber': { Icon: SiReact, color: '#61DAFB' },
  'node.js': { Icon: SiNodedotjs, color: '#5FA04E' },
  nodejs: { Icon: SiNodedotjs, color: '#5FA04E' },
  typescript: { Icon: SiTypescript, color: '#3178C6' },
  javascript: { Icon: SiJavascript, color: '#F7DF1E' },
  mongodb: { Icon: SiMongodb, color: '#47A248' },
  express: { Icon: SiExpress },
  'express.js': { Icon: SiExpress },
  flutter: { Icon: SiFlutter, color: '#54C5F8' },
  dart: { Icon: SiDart, color: '#0175C2' },
  postgresql: { Icon: SiPostgresql, color: '#4169E1' },
  docker: { Icon: SiDocker, color: '#2496ED' },
  git: { Icon: SiGit, color: '#F05032' },
  github: { Icon: SiGithub },
  prisma: { Icon: SiPrisma },
  rabbitmq: { Icon: SiRabbitmq, color: '#FF6600' },
  'three.js': { Icon: SiThreedotjs },
  'framer motion': { Icon: SiFramer, color: '#0055FF' },
  'tailwind css': { Icon: SiTailwindcss, color: '#06B6D4' },
  redis: { Icon: SiRedis, color: '#FF4438' },
  firebase: { Icon: SiFirebase, color: '#FFCA28' },
  python: { Icon: SiPython, color: '#3776AB' },
}

function abbreviate(name) {
  const words = name.trim().split(/\s+/)
  if (words.length === 1) return words[0].slice(0, 4).toUpperCase()
  return words.map((w) => w[0]).join('').slice(0, 3).toUpperCase()
}

const SIZES = {
  md: { box: 'w-[60px] h-[60px] rounded-2xl', icon: 28, label: 'text-[11px] sm:text-xs' },
  sm: { box: 'w-12 h-12 rounded-xl', icon: 22, label: 'text-[10px]' },
}

export function TechTile({ name, icon, size = 'md', label = name, onClick, className = '' }) {
  const s = SIZES[size]
  const entry = ICONS[(icon || name).toLowerCase()]
  const isMore = icon === 'more'
  const Wrapper = onClick ? 'button' : 'div'

  return (
    <Wrapper
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      aria-label={onClick ? label : undefined}
      className={`group flex flex-col items-center gap-1.5 ${onClick ? 'cursor-pointer' : 'cursor-default'} ${className}`}
    >
      <div
        className={`${s.box} flex items-center justify-center bg-slate-100 dark:bg-[#151B2B] border border-slate-200 dark:border-white/[0.08] shadow-sm group-hover:border-indigo-500/50 group-hover:-translate-y-0.5 transition-all duration-200`}
      >
        {isMore ? (
          <MoreHorizontal size={s.icon} className="text-indigo-500 dark:text-[#818CF8]" aria-hidden="true" />
        ) : entry ? (
          <entry.Icon
            size={s.icon}
            style={entry.color ? { color: entry.color } : undefined}
            className={entry.color ? undefined : 'text-slate-800 dark:text-white'}
            aria-hidden="true"
          />
        ) : (
          <div className={`font-bold tracking-wide text-slate-700 dark:text-white ${size === 'sm' ? 'text-[11px]' : 'text-sm'}`}>
            {abbreviate(name)}
          </div>
        )}
      </div>
      <div className={`${s.label} font-medium text-slate-700 dark:text-[#E2E8F0] text-center leading-none whitespace-nowrap`}>
        {label}
      </div>
    </Wrapper>
  )
}

export default TechTile
