import { useMemo } from 'react'
import * as THREE from 'three'

/**
 * Creates procedural high-resolution warm oak/amber teak wood tabletop textures
 * matching Image 1:
 * - Rich warm golden oak / amber wood tones (#a8642a, #be7839, #d08c48)
 * - Beautiful natural horizontal wood grain fibers with soft diffuse satin sheen
 * - Subtle bevel edge highlight
 */
function createOakWoodTableTextures() {
  if (typeof document === 'undefined') return { colorMap: null, bumpMap: null }

  const width = 1024
  const height = 512

  // 1. Color Map - Warm Oak / Teak Wood with natural grain
  const colorCanvas = document.createElement('canvas')
  colorCanvas.width = width
  colorCanvas.height = height
  const ctx = colorCanvas.getContext('2d')
  if (!ctx) return { colorMap: null, bumpMap: null }

  // Base warm amber oak gradient
  const grad = ctx.createLinearGradient(0, 0, width, height)
  grad.addColorStop(0, '#b16a2e')
  grad.addColorStop(0.5, '#c57b3b')
  grad.addColorStop(1, '#a35e26')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, width, height)

  // Natural horizontal wood grain lines
  for (let i = 0; i < 450; i++) {
    const y = Math.random() * height
    const h = 0.8 + Math.random() * 2.5
    const rand = Math.random()

    if (rand < 0.4) {
      ctx.fillStyle = `rgba(130, 72, 25, ${0.25 + Math.random() * 0.35})`
    } else if (rand < 0.75) {
      ctx.fillStyle = `rgba(225, 150, 85, ${0.20 + Math.random() * 0.30})`
    } else {
      ctx.fillStyle = `rgba(90, 48, 16, ${0.15 + Math.random() * 0.25})`
    }
    ctx.fillRect(0, y, width, h)
  }

  // Soft wood plank subtle waves
  ctx.fillStyle = 'rgba(255, 185, 115, 0.08)'
  for (let x = 0; x < width; x += 180) {
    ctx.fillRect(x, 0, 90, height)
  }

  // 2. Bump Map for fine wood pore micro-relief
  const bumpCanvas = document.createElement('canvas')
  bumpCanvas.width = width
  bumpCanvas.height = height
  const bCtx = bumpCanvas.getContext('2d')
  bCtx.fillStyle = '#808080'
  bCtx.fillRect(0, 0, width, height)

  for (let i = 0; i < 350; i++) {
    const y = Math.random() * height
    const h = 0.5 + Math.random() * 1.5
    const val = Math.floor(115 + Math.random() * 25)
    bCtx.fillStyle = `rgb(${val},${val},${val})`
    bCtx.fillRect(0, y, width, h)
  }

  const colorMap = new THREE.CanvasTexture(colorCanvas)
  colorMap.wrapS = THREE.RepeatWrapping
  colorMap.wrapT = THREE.RepeatWrapping
  colorMap.repeat.set(2, 1)

  const bumpMap = new THREE.CanvasTexture(bumpCanvas)
  bumpMap.wrapS = THREE.RepeatWrapping
  bumpMap.wrapT = THREE.RepeatWrapping
  bumpMap.repeat.set(2, 1)

  return { colorMap, bumpMap }
}

/**
 * Desk
 *
 * Warm Oak Wood Developer Workstation Console matching Image 1:
 * - Tabletop: Warm amber oak wood slab (Width 3.40, Depth 1.25, Thickness 0.085)
 * - Finish: Warm golden oak wood (#b87333 / #be7839) with satin sheen (roughness: 0.34)
 * - Tabletop top surface at y = 0.72, bottom at y = 0.635
 * - Frame & Legs: Sleek matte black industrial steel rectangular frame (Width 0.055, Height 0.635)
 * - Grounded firmly on the floor at y = 0
 */
export default function Desk({ position = [0, 0, 0] }) {
  const { colorMap, bumpMap } = useMemo(() => createOakWoodTableTextures(), [])
  const woodColor = useMemo(() => new THREE.Color('#be7839'), [])
  const edgeColor = useMemo(() => new THREE.Color('#d49150'), [])
  const blackSteelColor = useMemo(() => new THREE.Color('#16181d'), [])

  // Legs dimensions
  const legHeight = 0.635
  const legCenterY = legHeight / 2 // 0.3175

  return (
    <group position={position}>
      {/* ── Main Warm Oak Tabletop Slab (Top at y = 0.72, bottom at y = 0.635) ── */}
      <mesh position={[0, 0.6775, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.40, 0.085, 1.25]} />
        <meshStandardMaterial
          color={woodColor}
          map={colorMap || undefined}
          bumpMap={bumpMap || undefined}
          bumpScale={0.002}
          roughness={0.34}
          metalness={0.06}
        />
      </mesh>

      {/* ── Front Top Edge Bevel Sheen Highlight ── */}
      <mesh position={[0, 0.718, 0.623]} receiveShadow>
        <boxGeometry args={[3.39, 0.004, 0.006]} />
        <meshStandardMaterial
          color={edgeColor}
          roughness={0.25}
          metalness={0.12}
        />
      </mesh>

      {/* ── Left Matte Black Steel Leg Frame (x = -1.40) ── */}
      <group position={[-1.40, 0, 0]}>
        {/* Front post */}
        <mesh position={[0, legCenterY, 0.48]} castShadow receiveShadow>
          <boxGeometry args={[0.06, legHeight, 0.06]} />
          <meshStandardMaterial color={blackSteelColor} roughness={0.4} metalness={0.7} />
        </mesh>
        {/* Rear post */}
        <mesh position={[0, legCenterY, -0.48]} castShadow receiveShadow>
          <boxGeometry args={[0.06, legHeight, 0.06]} />
          <meshStandardMaterial color={blackSteelColor} roughness={0.4} metalness={0.7} />
        </mesh>
        {/* Floor runner bar */}
        <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.06, 0.04, 1.02]} />
          <meshStandardMaterial color={blackSteelColor} roughness={0.4} metalness={0.7} />
        </mesh>
        {/* Top mounting runner */}
        <mesh position={[0, 0.625, 0]} castShadow>
          <boxGeometry args={[0.06, 0.02, 1.02]} />
          <meshStandardMaterial color={blackSteelColor} roughness={0.4} metalness={0.7} />
        </mesh>
        {/* Protective rubber floor feet */}
        <mesh position={[0, 0.003, 0.46]}>
          <boxGeometry args={[0.062, 0.006, 0.07]} />
          <meshStandardMaterial color="#050505" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.003, -0.46]}>
          <boxGeometry args={[0.062, 0.006, 0.07]} />
          <meshStandardMaterial color="#050505" roughness={0.9} />
        </mesh>
      </group>

      {/* ── Right Matte Black Steel Leg Frame (x = +1.40) ── */}
      <group position={[1.40, 0, 0]}>
        {/* Front post */}
        <mesh position={[0, legCenterY, 0.48]} castShadow receiveShadow>
          <boxGeometry args={[0.06, legHeight, 0.06]} />
          <meshStandardMaterial color={blackSteelColor} roughness={0.4} metalness={0.7} />
        </mesh>
        {/* Rear post */}
        <mesh position={[0, legCenterY, -0.48]} castShadow receiveShadow>
          <boxGeometry args={[0.06, legHeight, 0.06]} />
          <meshStandardMaterial color={blackSteelColor} roughness={0.4} metalness={0.7} />
        </mesh>
        {/* Floor runner bar */}
        <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.06, 0.04, 1.02]} />
          <meshStandardMaterial color={blackSteelColor} roughness={0.4} metalness={0.7} />
        </mesh>
        {/* Top mounting runner */}
        <mesh position={[0, 0.625, 0]} castShadow>
          <boxGeometry args={[0.06, 0.02, 1.02]} />
          <meshStandardMaterial color={blackSteelColor} roughness={0.4} metalness={0.7} />
        </mesh>
        {/* Protective rubber floor feet */}
        <mesh position={[0, 0.003, 0.46]}>
          <boxGeometry args={[0.062, 0.006, 0.07]} />
          <meshStandardMaterial color="#050505" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.003, -0.46]}>
          <boxGeometry args={[0.062, 0.006, 0.07]} />
          <meshStandardMaterial color="#050505" roughness={0.9} />
        </mesh>
      </group>

      {/* ── Rear Cross Stabilizer Bar ── */}
      <mesh position={[0, legCenterY, -0.48]} castShadow>
        <boxGeometry args={[2.74, 0.035, 0.035]} />
        <meshStandardMaterial color={blackSteelColor} roughness={0.45} metalness={0.65} />
      </mesh>
    </group>
  )
}
