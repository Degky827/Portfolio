import { useMemo } from 'react'
import * as THREE from 'three'

/**
 * Creates procedural high-resolution dark charcoal wood tabletop textures
 * matching the reference image 3:
 * - Rich dark charcoal/black wood tone (#14151a / #181920)
 * - Ultra-fine horizontal wood grain fibers with subtle satin sheen
 * - Soft chamfer edge highlight
 */
function createDarkWoodTableTextures() {
  if (typeof document === 'undefined') return { colorMap: null, bumpMap: null }

  const width = 1024
  const height = 512

  // 1. Color Map - Dark charcoal wood with subtle grain variations
  const colorCanvas = document.createElement('canvas')
  colorCanvas.width = width
  colorCanvas.height = height
  const ctx = colorCanvas.getContext('2d')
  if (!ctx) return { colorMap: null, bumpMap: null }

  // Base dark charcoal
  ctx.fillStyle = '#14151a'
  ctx.fillRect(0, 0, width, height)

  // Horizontal wood grain fibers matching Image 3
  for (let i = 0; i < 400; i++) {
    const y = Math.random() * height
    const h = 1.0 + Math.random() * 2.5
    const rand = Math.random()

    if (rand < 0.45) {
      ctx.fillStyle = `rgba(28, 30, 38, ${0.35 + Math.random() * 0.30})`
    } else if (rand < 0.8) {
      ctx.fillStyle = `rgba(10, 11, 14, ${0.40 + Math.random() * 0.30})`
    } else {
      ctx.fillStyle = `rgba(38, 40, 52, ${0.20 + Math.random() * 0.20})`
    }
    ctx.fillRect(0, y, width, h)
  }

  // 2. Bump Map for fine wood grain micro-relief
  const bumpCanvas = document.createElement('canvas')
  bumpCanvas.width = width
  bumpCanvas.height = height
  const bCtx = bumpCanvas.getContext('2d')
  bCtx.fillStyle = '#808080'
  bCtx.fillRect(0, 0, width, height)

  for (let i = 0; i < 300; i++) {
    const y = Math.random() * height
    const h = 0.5 + Math.random() * 1.5
    const val = Math.floor(120 + Math.random() * 16)
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
 * Professional Developer Workstation Console Desk matching Image 3:
 * - Tabletop: Modern dark charcoal wood console slab (Width 3.30, Depth 1.25, Thickness 0.08)
 * - Finish: Dark charcoal wood finish (#14151a) with subtle satin sheen (roughness: 0.36)
 * - Tabletop top surface at y = 0.72, bottom at y = 0.64
 * - Legs: Solid architectural straight rectangular loop sled legs on left and right (x = ±1.36)
 * - Height: 0.64m, firmly grounded on floor at y = 0
 */
export default function Desk({ position = [0, 0, 0] }) {
  const { colorMap, bumpMap } = useMemo(() => createDarkWoodTableTextures(), [])
  const tableColor = useMemo(() => new THREE.Color('#14151a'), [])
  const frontEdgeHighlight = useMemo(() => new THREE.Color('#2a2d38'), [])
  const chamferColor = useMemo(() => new THREE.Color('#1c1e26'), [])
  const legsSteelColor = useMemo(() => new THREE.Color('#0c0d11'), [])
  const purpleGlow = useMemo(() => new THREE.Color('#6C2BFF'), [])

  // Legs dimensions (height from floor y = 0 up to tabletop bottom y = 0.64)
  const legHeight = 0.64
  const legCenterY = legHeight / 2 // 0.32

  return (
    <group position={position}>
      {/* ── Main Dark Charcoal Wood Tabletop Slab (Top at y = 0.72, bottom at y = 0.64) ── */}
      <mesh position={[0, 0.68, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.30, 0.08, 1.25]} />
        <meshStandardMaterial
          color={tableColor}
          map={colorMap || undefined}
          bumpMap={bumpMap || undefined}
          bumpScale={0.002}
          roughness={0.36}
          metalness={0.15}
        />
      </mesh>

      {/* ── Front Top Edge Sheen Highlight Strip ── */}
      <mesh position={[0, 0.719, 0.623]} receiveShadow>
        <boxGeometry args={[3.29, 0.004, 0.006]} />
        <meshStandardMaterial
          color={frontEdgeHighlight}
          roughness={0.3}
          metalness={0.25}
        />
      </mesh>

      {/* ── Front Vertical Slab Chamfer Accent ── */}
      <mesh position={[0, 0.68, 0.627]}>
        <boxGeometry args={[3.29, 0.072, 0.003]} />
        <meshStandardMaterial
          color={chamferColor}
          roughness={0.4}
          metalness={0.15}
        />
      </mesh>

      {/* ── Subtle Purple Underglow beneath desk bottom matching Image 3 ── */}
      <mesh position={[0, 0.638, 0]}>
        <boxGeometry args={[3.15, 0.004, 1.12]} />
        <meshStandardMaterial
          color={purpleGlow}
          emissive={purpleGlow}
          emissiveIntensity={0.30}
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* ── Left Leg: Rectangular Loop Sled Leg (x = -1.36) ── */}
      <group position={[-1.36, 0, 0]}>
        {/* Front vertical post */}
        <mesh position={[0, legCenterY, 0.46]} castShadow receiveShadow>
          <boxGeometry args={[0.06, legHeight, 0.06]} />
          <meshStandardMaterial color={legsSteelColor} roughness={0.4} metalness={0.7} />
        </mesh>
        {/* Rear vertical post */}
        <mesh position={[0, legCenterY, -0.46]} castShadow receiveShadow>
          <boxGeometry args={[0.06, legHeight, 0.06]} />
          <meshStandardMaterial color={legsSteelColor} roughness={0.4} metalness={0.7} />
        </mesh>
        {/* Bottom floor runner bar */}
        <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.06, 0.04, 0.98]} />
          <meshStandardMaterial color={legsSteelColor} roughness={0.4} metalness={0.7} />
        </mesh>
        {/* Top mounting runner bar */}
        <mesh position={[0, 0.63, 0]} castShadow>
          <boxGeometry args={[0.06, 0.02, 0.98]} />
          <meshStandardMaterial color={legsSteelColor} roughness={0.4} metalness={0.7} />
        </mesh>
        {/* Protective floor glides */}
        <mesh position={[0, 0.003, 0.44]}>
          <boxGeometry args={[0.062, 0.006, 0.07]} />
          <meshStandardMaterial color="#050505" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.003, -0.44]}>
          <boxGeometry args={[0.062, 0.006, 0.07]} />
          <meshStandardMaterial color="#050505" roughness={0.9} />
        </mesh>
      </group>

      {/* ── Right Leg: Rectangular Loop Sled Leg (x = +1.36) ── */}
      <group position={[1.36, 0, 0]}>
        {/* Front vertical post */}
        <mesh position={[0, legCenterY, 0.46]} castShadow receiveShadow>
          <boxGeometry args={[0.06, legHeight, 0.06]} />
          <meshStandardMaterial color={legsSteelColor} roughness={0.4} metalness={0.7} />
        </mesh>
        {/* Rear vertical post */}
        <mesh position={[0, legCenterY, -0.46]} castShadow receiveShadow>
          <boxGeometry args={[0.06, legHeight, 0.06]} />
          <meshStandardMaterial color={legsSteelColor} roughness={0.4} metalness={0.7} />
        </mesh>
        {/* Bottom floor runner bar */}
        <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.06, 0.04, 0.98]} />
          <meshStandardMaterial color={legsSteelColor} roughness={0.4} metalness={0.7} />
        </mesh>
        {/* Top mounting runner bar */}
        <mesh position={[0, 0.63, 0]} castShadow>
          <boxGeometry args={[0.06, 0.02, 0.98]} />
          <meshStandardMaterial color={legsSteelColor} roughness={0.4} metalness={0.7} />
        </mesh>
        {/* Protective floor glides */}
        <mesh position={[0, 0.003, 0.44]}>
          <boxGeometry args={[0.062, 0.006, 0.07]} />
          <meshStandardMaterial color="#050505" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.003, -0.44]}>
          <boxGeometry args={[0.062, 0.006, 0.07]} />
          <meshStandardMaterial color="#050505" roughness={0.9} />
        </mesh>
      </group>

      {/* ── Rear Cross Stabilizer Bar ── */}
      <mesh position={[0, legCenterY, -0.46]} castShadow>
        <boxGeometry args={[2.66, 0.035, 0.035]} />
        <meshStandardMaterial color={legsSteelColor} roughness={0.45} metalness={0.65} />
      </mesh>
    </group>
  )
}
