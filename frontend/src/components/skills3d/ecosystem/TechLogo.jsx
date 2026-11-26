import { memo } from 'react'
import {
  SiPostgresql,
  SiMongodb,
  SiMysql,
  SiSupabase,
  SiNodedotjs,
  SiExpress,
  SiFastapi,
  SiPython,
  SiJavascript,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiGithub,
  SiDocker,
  SiVercel,
  SiRender,
} from 'react-icons/si'

function VsCodeIcon({ size = 28, className = '', style = {} }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      style={style}
    >
      <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .32 8.68l3.96 3.32-3.96 3.32a1 1 0 0 0 .007 1.42l1.322 1.202a1 1 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.94-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zM18 17.5l-6.5-5.5L18 6.5v11z" />
    </svg>
  )
}

const LOGO_MAP = {
  postgresql: {
    icon: SiPostgresql,
    color: '#336791',
    bg: '#3367911A',
    border: '#3367914D',
    lightBg: '#EEF6FB',
  },
  mongodb: {
    icon: SiMongodb,
    color: '#47A248',
    bg: '#47A2481A',
    border: '#47A2484D',
    lightBg: '#F0F9F1',
  },
  mysql: {
    icon: SiMysql,
    color: '#00758F',
    bg: '#00758F1A',
    border: '#00758F4D',
    lightBg: '#EBF7FA',
  },
  supabase: {
    icon: SiSupabase,
    color: '#3ECF8E',
    bg: '#3ECF8E1A',
    border: '#3ECF8E4D',
    lightBg: '#ECFDF5',
  },
  nodejs: {
    icon: SiNodedotjs,
    color: '#5FA04E',
    bg: '#5FA04E1A',
    border: '#5FA04E4D',
    lightBg: '#F2FAF0',
  },
  express: {
    icon: SiExpress,
    color: '#E2E8F0',
    darkColor: '#0F172A',
    bg: '#64748B1A',
    border: '#64748B4D',
    lightBg: '#F1F5F9',
  },
  fastapi: {
    icon: SiFastapi,
    color: '#009688',
    bg: '#0096881A',
    border: '#0096884D',
    lightBg: '#E6F7F5',
  },
  python: {
    icon: SiPython,
    color: '#3776AB',
    bg: '#3776AB1A',
    border: '#3776AB4D',
    lightBg: '#EDF5FA',
  },
  javascript: {
    icon: SiJavascript,
    color: '#F7DF1E',
    bg: '#F7DF1E1A',
    border: '#F7DF1E4D',
    lightBg: '#FEFCE8',
  },
  react: {
    icon: SiReact,
    color: '#61DAFB',
    bg: '#61DAFB1A',
    border: '#61DAFB4D',
    lightBg: '#ECFEFF',
  },
  nextjs: {
    icon: SiNextdotjs,
    color: '#F8FAFC',
    darkColor: '#020617',
    bg: '#3341551A',
    border: '#3341554D',
    lightBg: '#F8FAFC',
  },
  tailwind: {
    icon: SiTailwindcss,
    color: '#38BDF8',
    bg: '#38BDF81A',
    border: '#38BDF84D',
    lightBg: '#F0F9FF',
  },
  vscode: {
    icon: VsCodeIcon,
    color: '#007ACC',
    bg: '#007ACC1A',
    border: '#007ACC4D',
    lightBg: '#EFF8FF',
  },
  github: {
    icon: SiGithub,
    color: '#F1F5F9',
    darkColor: '#181717',
    bg: '#4755691A',
    border: '#4755694D',
    lightBg: '#F1F5F9',
  },
  docker: {
    icon: SiDocker,
    color: '#2496ED',
    bg: '#2496ED1A',
    border: '#2496ED4D',
    lightBg: '#EFF6FF',
  },
  vercel: {
    icon: SiVercel,
    color: '#F8FAFC',
    darkColor: '#000000',
    bg: '#3341551A',
    border: '#3341554D',
    lightBg: '#F8FAFC',
  },
  render: {
    icon: SiRender,
    color: '#46E3B7',
    bg: '#46E3B71A',
    border: '#46E3B74D',
    lightBg: '#ECFDF5',
  },
}

export const TechLogo = memo(function TechLogo({
  techId,
  size = 28,
  className = '',
  darkMode = true,
}) {
  const match = LOGO_MAP[techId?.toLowerCase()]
  if (!match) return null

  const IconComp = match.icon
  const color = !darkMode && match.darkColor ? match.darkColor : match.color

  return (
    <IconComp
      className={className}
      size={size}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        color,
        flexShrink: 0,
      }}
    />
  )
})

export default TechLogo
