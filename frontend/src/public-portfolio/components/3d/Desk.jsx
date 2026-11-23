import { useMemo } from 'react'
import * as THREE from 'three'

/**
 * Creates procedural high-resolution warm golden honey oak tabletop textures
 * matching Target Reference Image:
 * - Rich warm golden honey oak / amber tones (#c87a32, #dc9144, #e8a452)
 * - Fine horizontal grain lines, growth rings, organic pore stippling
 * - Specular micro-relief bump map and satin lacquer finish
 */
function createOakWoodTableTextures() {
  if (typeof document === 'undefined') return { colorMap: null, bumpMap: null, roughnessMap: null }

  const width = 2048
  const height = 512

  // 1. Color Map - Warm Golden Honey Oak Wood with horizontal grain
  const colorCanvas = document.createElement('canvas')
  colorCanvas.width = width
  colorCanvas.height = height
  const ctx = colorCanvas.getContext('2d')
  if (!ctx) return { colorMap: null, bumpMap: null, roughnessMap: null }

  // Base warm golden-amber honey oak gradient
  const grad = ctx.createLinearGradient(0, 0, width, height)
  grad.addColorStop(0.00, '#cf7e2e')
  grad.addColorStop(0.20, '#de933f')
  grad.addColorStop(0.45, '#e49f4c')
  grad.addColorStop(0.70, '#d98b36')
  grad.addColorStop(0.88, '#e8a553')
  grad.addColorStop(1.00, '#c77524')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, width, height)

  // Gentle broad growth ring waves across length
  for (let y = 0; y < height; y += 4) {
    const wave = Math.sin(y * 0.04) * 0.5 + 0.5
    ctx.fillStyle = `rgba(255, 205, 135, ${0.04 + wave * 0.08})`
    ctx.fillRect(0, y, width, 4)
  }

  // 650 Fine horizontal wood fiber lines with subtle natural variations
  for (let i = 0; i < 650; i++) {
    const y = Math.random() * height
    const h = 0.6 + Math.random() * 2.2
    const rand = Math.random()

    if (rand < 0.35) {
      // Golden highlight fibers
      ctx.fillStyle = `rgba(255, 215, 145, ${0.18 + Math.random() * 0.22})`
    } else if (rand < 0.70) {
      // Warm amber grain fibers
      ctx.fillStyle = `rgba(165, 92, 28, ${0.16 + Math.random() * 0.24})`
    } else {
      // Deep golden honey pore streaks
      ctx.fillStyle = `rgba(120, 60, 15, ${0.12 + Math.random() * 0.18})`
    }
    ctx.fillRect(0, y, width, h)
  }

  // Medullary rays (subtle organic flecks across honey oak)
  ctx.fillStyle = 'rgba(255, 225, 160, 0.12)'
  for (let j = 0; j < 300; j++) {
    const rx = Math.random() * width
    const ry = Math.random() * height
    const rw = 25 + Math.random() * 60
    const rh = 1.0 + Math.random() * 1.5
    ctx.fillRect(rx, ry, rw, rh)
  }

  // 2. Bump Map for wood pore micro-relief
  const bumpCanvas = document.createElement('canvas')
  bumpCanvas.width = width
  bumpCanvas.height = height
  const bCtx = bumpCanvas.getContext('2d')
  bCtx.fillStyle = '#808080'
  bCtx.fillRect(0, 0, width, height)

  for (let i = 0; i < 450; i++) {
    const y = Math.random() * height
    const h = 0.5 + Math.random() * 1.8
    const val = Math.floor(115 + Math.random() * 26)
    bCtx.fillStyle = `rgb(${val},${val},${val})`
    bCtx.fillRect(0, y, width, h)
  }

  // 3. Roughness Map for satin lacquer sheen variation
  const roughCanvas = document.createElement('canvas')
  roughCanvas.width = width
  roughCanvas.height = height
  const rCtx = roughCanvas.getContext('2d')
  rCtx.fillStyle = 'rgb(65, 65, 65)' // Smooth base satin sheen
  rCtx.fillRect(0, 0, width, height)

  for (let i = 0; i < 200; i++) {
    const y = Math.random() * height
    const h = 1.0 + Math.random() * 2.5
    const val = Math.floor(75 + Math.random() * 20)
    rCtx.fillStyle = `rgb(${val},${val},${val})`
    rCtx.fillRect(0, y, width, h)
  }

  const colorMap = new THREE.CanvasTexture(colorCanvas)
  colorMap.wrapS = THREE.RepeatWrapping
  colorMap.wrapT = THREE.RepeatWrapping
  colorMap.repeat.set(2, 1)

  const bumpMap = new THREE.CanvasTexture(bumpCanvas)
  bumpMap.wrapS = THREE.RepeatWrapping
  bumpMap.wrapT = THREE.RepeatWrapping
  bumpMap.repeat.set(2, 1)

  const roughnessMap = new THREE.CanvasTexture(roughCanvas)
  roughnessMap.wrapS = THREE.RepeatWrapping
  roughnessMap.wrapT = THREE.RepeatWrapping
  roughnessMap.repeat.set(2, 1)

  return { colorMap, bumpMap, roughnessMap }
}

/**
 * Desk
 *
 * Warm Golden Honey Oak Wood Workstation Console matching Target Reference:
 * - Tabletop: Warm golden honey oak slab (Width 3.40, Depth 1.25, Thickness 0.085)
 * - Finish: Vibrant golden-amber honey oak with horizontal grain sheen and specular edge highlight
 * - Tabletop top surface at y = 0.72, bottom at y = 0.635
 * - Legs: Sleek matte black industrial steel rectangular frame (Width 0.06, Height 0.635)
 * - Grounded firmly on the floor at y = 0
 */
export default function Desk({ position = [0, 0, 0] }) {
  const { colorMap, bumpMap, roughnessMap } = useMemo(() => createOakWoodTableTextures(), [])
  const woodColor = useMemo(() => new THREE.Color('#ffffff'), []) // Pure white so texture colors shine at full vibrancy
  const edgeHighlightColor = useMemo(() => new THREE.Color('#f5be76'), [])
  const blackSteelColor = useMemo(() => new THREE.Color('#101216'), [])

  // Legs dimensions
  const legHeight = 0.635
  const legCenterY = legHeight / 2 // 0.3175

  return (
    <group position={position}>
      {/* ── Main Warm Honey Oak Tabletop Slab (Width 3.92, Depth 1.28, Top at y = 0.72) ── */}
      <mesh position={[0, 0.6775, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.92, 0.085, 1.28]} />
        <meshStandardMaterial
          color={woodColor}
          map={colorMap || undefined}
          bumpMap={bumpMap || undefined}
          bumpScale={0.0016}
          roughnessMap={roughnessMap || undefined}
          roughness={0.25}
          metalness={0.03}
          envMapIntensity={1.2}
        />
      </mesh>

      {/* ── Front Top Edge Chamfer / Specular Highlight (Amber-Gold Sheen Strip) ── */}
      <mesh position={[0, 0.719, 0.638]} receiveShadow>
        <boxGeometry args={[3.915, 0.005, 0.008]} />
        <meshStandardMaterial
          color={edgeHighlightColor}
          roughness={0.18}
          metalness={0.08}
        />
      </mesh>

      {/* ── Front Face Lower Chamfer ── */}
      <mesh position={[0, 0.636, 0.638]} receiveShadow>
        <boxGeometry args={[3.915, 0.004, 0.006]} />
        <meshStandardMaterial
          color="#aa5f1e"
          roughness={0.35}
          metalness={0.04}
        />
      </mesh>

      {/* ── Left Matte Black Steel Leg Frame (x = -1.64) ── */}
      <group position={[-1.64, 0, 0]}>
        {/* Front post */}
        <mesh position={[0, legCenterY, 0.49]} castShadow receiveShadow>
          <boxGeometry args={[0.06, legHeight, 0.06]} />
          <meshStandardMaterial color={blackSteelColor} roughness={0.35} metalness={0.8} />
        </mesh>
        {/* Rear post */}
        <mesh position={[0, legCenterY, -0.49]} castShadow receiveShadow>
          <boxGeometry args={[0.06, legHeight, 0.06]} />
          <meshStandardMaterial color={blackSteelColor} roughness={0.35} metalness={0.8} />
        </mesh>
        {/* Floor runner bar */}
        <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.06, 0.04, 1.04]} />
          <meshStandardMaterial color={blackSteelColor} roughness={0.35} metalness={0.8} />
        </mesh>
        {/* Top mounting runner */}
        <mesh position={[0, 0.625, 0]} castShadow>
          <boxGeometry args={[0.06, 0.02, 1.04]} />
          <meshStandardMaterial color={blackSteelColor} roughness={0.35} metalness={0.8} />
        </mesh>
        {/* Protective rubber floor feet */}
        <mesh position={[0, 0.003, 0.47]}>
          <boxGeometry args={[0.062, 0.006, 0.07]} />
          <meshStandardMaterial color="#050505" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.003, -0.47]}>
          <boxGeometry args={[0.062, 0.006, 0.07]} />
          <meshStandardMaterial color="#050505" roughness={0.9} />
        </mesh>
      </group>

      {/* ── Right Matte Black Steel Leg Frame (x = +1.64) ── */}
      <group position={[1.64, 0, 0]}>
        {/* Front post */}
        <mesh position={[0, legCenterY, 0.49]} castShadow receiveShadow>
          <boxGeometry args={[0.06, legHeight, 0.06]} />
          <meshStandardMaterial color={blackSteelColor} roughness={0.35} metalness={0.8} />
        </mesh>
        {/* Rear post */}
        <mesh position={[0, legCenterY, -0.49]} castShadow receiveShadow>
          <boxGeometry args={[0.06, legHeight, 0.06]} />
          <meshStandardMaterial color={blackSteelColor} roughness={0.35} metalness={0.8} />
        </mesh>
        {/* Floor runner bar */}
        <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.06, 0.04, 1.04]} />
          <meshStandardMaterial color={blackSteelColor} roughness={0.35} metalness={0.8} />
        </mesh>
        {/* Top mounting runner */}
        <mesh position={[0, 0.625, 0]} castShadow>
          <boxGeometry args={[0.06, 0.02, 1.04]} />
          <meshStandardMaterial color={blackSteelColor} roughness={0.35} metalness={0.8} />
        </mesh>
        {/* Protective rubber floor feet */}
        <mesh position={[0, 0.003, 0.47]}>
          <boxGeometry args={[0.062, 0.006, 0.07]} />
          <meshStandardMaterial color="#050505" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.003, -0.47]}>
          <boxGeometry args={[0.062, 0.006, 0.07]} />
          <meshStandardMaterial color="#050505" roughness={0.9} />
        </mesh>
      </group>

      {/* ── Rear Cross Stabilizer Bar ── */}
      <mesh position={[0, legCenterY, -0.49]} castShadow>
        <boxGeometry args={[3.22, 0.035, 0.035]} />
        <meshStandardMaterial color={blackSteelColor} roughness={0.35} metalness={0.8} />
      </mesh>
    </group>
  )
}
