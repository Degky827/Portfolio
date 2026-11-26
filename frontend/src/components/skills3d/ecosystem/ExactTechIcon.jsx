import { useMemo } from 'react'
import * as THREE from 'three'
import {
  SiNodedotjs,
  SiExpress,
  SiFastapi,
  SiPython,
  SiJavascript,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiPostgresql,
  SiMongodb,
  SiMysql,
  SiSupabase,
  SiGit,
  SiGithub,
  SiDocker,
  SiVercel,
  SiRender,
  SiApple,
} from 'react-icons/si'

function getPath(Comp) {
  if (!Comp) return null
  try {
    const el = Comp({})
    const ch = el?.props?.children
    return Array.isArray(ch) ? ch[0]?.props?.d : ch?.props?.d
  } catch {
    return null
  }
}

const VS_CODE_PATH =
  'M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .32 8.68l3.96 3.32-3.96 3.32a1 1 0 0 0 .007 1.42l1.322 1.202a1 1 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.94-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zM18 17.5l-6.5-5.5L18 6.5v11z'

const PYTHON_RAW = getPath(SiPython) || ''
const pythonParts = PYTHON_RAW ? PYTHON_RAW.split('zm') : []
const pythonSnake1 = pythonParts.length >= 2 ? pythonParts[0] + 'zm' + pythonParts[1] + 'z' : ''
const pythonSnake2 = pythonParts.length >= 4 ? 'M' + pythonParts[2] + 'zm' + pythonParts[3] + 'z' : ''

const JS_RAW = getPath(SiJavascript) || ''
const jsLetters = JS_RAW.length > 16 ? 'M' + JS_RAW.slice(16) : JS_RAW

export const ICON_DEFS = {
  nodejs: { path: getPath(SiNodedotjs), defaultColor: '#5FA04E', scale: 0.94 },
  express: { path: getPath(SiExpress), defaultColor: '#FFFFFF', scale: 0.94 },
  fastapi: { path: getPath(SiFastapi), defaultColor: '#009688', scale: 0.92 },
  python: { isPython: true, snake1: pythonSnake1, snake2: pythonSnake2, scale: 0.94 },
  javascript: { isJs: true, lettersPath: jsLetters, scale: 0.94 },
  react: { path: getPath(SiReact), defaultColor: '#61DAFB', scale: 0.95 },
  nextjs: { path: getPath(SiNextdotjs), defaultColor: '#FFFFFF', bg: '#000000', shape: 'circle', scale: 0.95 },
  tailwind: { path: getPath(SiTailwindcss), defaultColor: '#38BDF8', scale: 0.92 },
  postgresql: { path: getPath(SiPostgresql), defaultColor: '#60A5FA', scale: 0.94 },
  mongodb: { path: getPath(SiMongodb), defaultColor: '#47A248', scale: 0.94 },
  mysql: { path: getPath(SiMysql), defaultColor: '#00758F', scale: 0.94 },
  supabase: { path: getPath(SiSupabase), defaultColor: '#3ECF8E', scale: 0.94 },
  vscode: { path: VS_CODE_PATH, defaultColor: '#007ACC', scale: 0.94 },
  git: { path: getPath(SiGit), defaultColor: '#F05032', scale: 0.94 },
  github: { path: getPath(SiGithub), defaultColor: '#FFFFFF', scale: 0.94 },
  docker: { path: getPath(SiDocker), defaultColor: '#2496ED', scale: 0.94 },
  vercel: { path: getPath(SiVercel), defaultColor: '#FFFFFF', scale: 0.92 },
  render: { path: getPath(SiRender), defaultColor: '#7B2CBF', scale: 0.94 },
  apple: { path: getPath(SiApple), defaultColor: '#FFFFFF', scale: 0.94 },
}

const TEXTURE_CACHE = new Map()

export function getTechIconTexture(techId, overrideColor = null, overrideBg = null) {
  if (typeof document === 'undefined') return null
  const key = `${techId?.toLowerCase()}_${overrideColor || ''}_${overrideBg || ''}`
  if (TEXTURE_CACHE.has(key)) return TEXTURE_CACHE.get(key)

  const def = ICON_DEFS[techId?.toLowerCase()]
  if (!def) return null

  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  ctx.clearRect(0, 0, size, size)

  // 1. Handle special JavaScript icon (Yellow rounded badge with black official JS letters)
  if (def.isJs) {
    // Yellow rounded square
    const r = 56
    ctx.fillStyle = '#F7DF1E'
    ctx.beginPath()
    if (ctx.roundRect) {
      ctx.roundRect(16, 16, size - 32, size - 32, r)
    } else {
      ctx.rect(16, 16, size - 32, size - 32)
    }
    ctx.fill()

    // Black official JS letters
    ctx.save()
    const s = (size / 24) * 0.96
    const offset = (size - 24 * s) / 2
    ctx.translate(offset, offset)
    ctx.scale(s, s)
    ctx.fillStyle = '#000000'
    ctx.fill(new Path2D(def.lettersPath))
    ctx.restore()
  }
  // 2. Handle special Python icon (Official two-toned snakes: Blue top, Yellow bottom)
  else if (def.isPython) {
    ctx.save()
    const s = (size / 24) * (def.scale || 0.88)
    const offset = (size - 24 * s) / 2
    ctx.translate(offset, offset)
    ctx.scale(s, s)
    if (def.snake1 && def.snake2) {
      ctx.fillStyle = '#387EB8' // Official Python Blue
      ctx.fill(new Path2D(def.snake1))
      ctx.fillStyle = '#FFC331' // Official Python Yellow
      ctx.fill(new Path2D(def.snake2))
    }
    ctx.restore()
  }
  // 3. Handle standard vector icons
  else {
    const bg = overrideBg || def.bg
    if (bg) {
      ctx.fillStyle = bg
      if (def.shape === 'circle') {
        ctx.beginPath()
        ctx.arc(size / 2, size / 2, size / 2 - 4, 0, Math.PI * 2)
        ctx.fill()
      } else {
        const r = 40
        ctx.beginPath()
        if (ctx.roundRect) {
          ctx.roundRect(16, 16, size - 32, size - 32, r)
        } else {
          ctx.rect(16, 16, size - 32, size - 32)
        }
        ctx.fill()
      }
    }

    if (def.path) {
      ctx.save()
      const s = (size / 24) * (def.scale || 0.88)
      const offset = (size - 24 * s) / 2
      ctx.translate(offset, offset)
      ctx.scale(s, s)
      ctx.fillStyle = overrideColor || def.defaultColor || '#FFFFFF'
      ctx.fill(new Path2D(def.path))
      ctx.restore()
    }
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.generateMipmaps = true
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.needsUpdate = true

  TEXTURE_CACHE.set(key, texture)
  return texture
}

export function ExactTechIcon3D({
  techId,
  size = 0.6,
  color,
  bgColor,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  emissiveIntensity = 0.7,
}) {
  const texture = useMemo(() => {
    return getTechIconTexture(techId, color, bgColor)
  }, [techId, color, bgColor])

  if (!texture) return null

  const def = ICON_DEFS[techId?.toLowerCase()]
  const emColor = color || (def ? def.defaultColor : '#FFFFFF')

  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[size, size]} />
      <meshStandardMaterial
        map={texture}
        transparent
        alphaTest={0.02}
        roughness={0.2}
        metalness={0.1}
        emissive={def?.isPython ? '#FFE873' : emColor}
        emissiveMap={texture}
        emissiveIntensity={emissiveIntensity}
      />
    </mesh>
  )
}

export default ExactTechIcon3D
