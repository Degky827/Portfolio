import { useMemo } from 'react'
import * as THREE from 'three'

/**
 * Creates procedural high-resolution warm golden honey oak tabletop textures
 * matching Image 1:
 * - Rich warm golden oak / amber teak tones (#c57b34, #db8e3f, #a86226)
 * - Beautiful horizontal wood grain lines with natural pores and satin sheen
 * - Front edge highlight
 */
function createOakWoodTableTextures() {
  if (typeof document === 'undefined') return { colorMap: null, bumpMap: null }

  const width = 1024
  const height = 512

  // 1. Color Map - Warm Golden Honey Oak Wood with natural grain
  const colorCanvas = document.createElement('canvas')
  colorCanvas.width = width
  colorCanvas.height = height
  const ctx = colorCanvas.getContext('2d')
  if (!ctx) return { colorMap: null, bumpMap: null }

  // Base warm golden honey oak gradient matching Image 1
  const grad = ctx.createLinearGradient(0, 0, width, height)
  grad.addColorStop(0, '#c87a32')
  grad.addColorStop(0.35, '#dc9144')
  grad.addColorStop(0.7, '#d4883b')
  grad.addColorStop(1, '#b86b25')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, width, height)

  // Natural horizontal wood grain lines
  for (let i = 0; i < 500; i++) {
    const y = Math.random() * height
    const h = 0.8 + Math.random() * 2.2
    const rand = Math.random()

    if (rand < 0.35) {
      ctx.fillStyle = `rgba(145, 80, 25, ${0.25 + Math.random() * 0.30})`
    } else if (rand < 0.70) {
      ctx.fillStyle = `rgba(245, 175, 100, ${0.20 + Math.random() * 0.25})`
    } else {
      ctx.fillStyle = `rgba(100, 50, 15, ${0.15 + Math.random() * 0.20})`
    }
    ctx.fillRect(0, y, width, h)
  }

  // Soft wood plank subtle waves
  ctx.fillStyle = 'rgba(255, 200, 130, 0.09)'
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

  for (let i = 0; i < 400; i++) {
    const y = Math.random() * height
    const h = 0.5 + Math.random() * 1.5
    const val = Math.floor(118 + Math.random() * 22)
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
 * Warm Golden Honey Oak Wood Workstation Console matching Image 1:
 * - Tabletop: Warm golden oak wood slab (Width 3.40, Depth 1.25, Thickness 0.085)
 * - Finish: Warm golden honey oak wood (#c57b34) with satin sheen (roughness: 0.30)
 * - Tabletop top surface at y = 0.72, bottom at y = 0.635
 * - Frame & Legs: Sleek matte black industrial steel rectangular frame (Width 0.055, Height 0.635)
 * - Grounded firmly on the floor at y = 0
 */
export default function Desk({ position = [0, 0, 0] }) {
  const { colorMap, bumpMap } = useMemo(() => createOakWoodTableTextures(), [])
  const woodColor = useMemo(() => new THREE.Color('#c57b34'), [])
  const edgeColor = useMemo(() => new THREE.Color('#e59e55'), [])
  const blackSteelColor = useMemo(() => new THREE.Color('#14161b'), [])

  // Legs dimensions
  const legHeight = 0.635
  const legCenterY = legHeight / 2 // 0.3175

  return (
    <group position={position}>
      {/* ── Main Warm Honey Oak Tabletop Slab (Top at y = 0.72, bottom at y = 0.635) ── */}
      <mesh position={[0, 0.6775, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.40, 0.085, 1.25]} />
        <meshStandardMaterial
          color={woodColor}
          map={colorMap || undefined}
          bumpMap={bumpMap || undefined}
          bumpScale={0.002}
          roughness={0.30}
          metalness={0.05}
        />
      </mesh>

      {/* ── Front Top Edge Bevel Sheen Highlight ── */}
      <mesh position={[0, 0.718, 0.623]} receiveShadow>
        <boxGeometry args={[3.39, 0.004, 0.006]} />
        <meshStandardMaterial
          color={edgeColor}
          roughness={0.22}
          metalness={0.10}
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
