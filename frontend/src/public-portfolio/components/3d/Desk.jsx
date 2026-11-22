import { useMemo } from 'react'
import * as THREE from 'three'

/**
 * Creates procedural high-resolution satin white tabletop textures
 * (color map & bump map) matching the reference image:
 * - Crisp, clean modern satin white (#ffffff / #fffdf7)
 * - Ultra-fine micro-smooth surface texture with diffuse satin sheen
 * - Soft platinum/silver edge highlight (#bbbbbb / #d1d5db)
 */
function createWhiteTableTextures() {
  if (typeof document === 'undefined') return { colorMap: null, bumpMap: null }

  const width = 1024
  const height = 512

  // 1. Color Map - Pure satin white with warm pearl / ivory undertone
  const colorCanvas = document.createElement('canvas')
  colorCanvas.width = width
  colorCanvas.height = height
  const ctx = colorCanvas.getContext('2d')
  if (!ctx) return { colorMap: null, bumpMap: null }

  // Crisp pure white base
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, width, height)

  // Subtle satin grain variations matching reference image (#fffdf7 / #f8f9fc)
  for (let i = 0; i < 300; i++) {
    const y = Math.random() * height
    const h = 1.0 + Math.random() * 3.0
    const rand = Math.random()

    if (rand < 0.5) {
      ctx.fillStyle = `rgba(255, 253, 247, ${0.40 + Math.random() * 0.35})`
    } else {
      ctx.fillStyle = `rgba(246, 248, 252, ${0.30 + Math.random() * 0.30})`
    }
    ctx.fillRect(0, y, width, h)
  }

  // 2. Bump Map for ultra-fine satin micro-relief
  const bumpCanvas = document.createElement('canvas')
  bumpCanvas.width = width
  bumpCanvas.height = height
  const bCtx = bumpCanvas.getContext('2d')
  bCtx.fillStyle = '#808080'
  bCtx.fillRect(0, 0, width, height)

  for (let i = 0; i < 200; i++) {
    const y = Math.random() * height
    const h = 0.5 + Math.random() * 1.5
    const val = Math.floor(126 + Math.random() * 8)
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
 * Modern satin white flat rectangular console slab with tall, straight, parallel 90° rectangular loop sled legs:
 * - Tabletop: Modern console slab (Width 3.55, Depth 1.28, Thickness 0.08)
 * - Finish: Modern satin white (#ffffff) matching reference image with subtle diffuse sheen (roughness: 0.28)
 * - Tabletop top surface at y = 0.72, bottom at y = 0.64
 * - Legs: Tall, architectural straight, parallel 90° rectangular loop sled legs on left and right (x = ±1.45)
 * - Height increased to 0.64m, firmly grounded on floor at y = 0
 */
export default function Desk({ position = [0, 0, 0] }) {
  const { colorMap, bumpMap } = useMemo(() => createWhiteTableTextures(), [])
  const whiteTableColor = useMemo(() => new THREE.Color('#ffffff'), [])
  const frontEdgeHighlight = useMemo(() => new THREE.Color('#e2e8f0'), [])
  const chamferColor = useMemo(() => new THREE.Color('#f1f5f9'), [])
  const legsSteelColor = useMemo(() => new THREE.Color('#101116'), [])
  const purpleGlow = useMemo(() => new THREE.Color('#6C2BFF'), [])

  // Tall legs dimensions (height from floor y = 0 up to tabletop bottom y = 0.64)
  const legHeight = 0.64
  const legCenterY = legHeight / 2 // 0.32

  return (
    <group position={position}>
      {/* ── Main Desktop Slab (Top at y = 0.72, bottom at y = 0.64) ── */}
      <mesh position={[0, 0.68, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.55, 0.08, 1.28]} />
        <meshStandardMaterial
          color={whiteTableColor}
          map={colorMap || undefined}
          bumpMap={bumpMap || undefined}
          bumpScale={0.0015}
          roughness={0.28}
          metalness={0.04}
        />
      </mesh>

      {/* ── Front Top Edge Sheen Highlight Strip (#e2e8f0 / platinum matching reference) ── */}
      <mesh position={[0, 0.719, 0.638]} receiveShadow>
        <boxGeometry args={[3.54, 0.004, 0.006]} />
        <meshStandardMaterial
          color={frontEdgeHighlight}
          roughness={0.22}
          metalness={0.15}
        />
      </mesh>

      {/* ── Front Vertical Slab Chamfer Accent ── */}
      <mesh position={[0, 0.68, 0.642]}>
        <boxGeometry args={[3.54, 0.072, 0.003]} />
        <meshStandardMaterial
          color={chamferColor}
          roughness={0.32}
          metalness={0.05}
        />
      </mesh>

      {/* ── Subtle Purple Underglow Trim beneath desk bottom ── */}
      <mesh position={[0, 0.638, 0]}>
        <boxGeometry args={[3.40, 0.004, 1.16]} />
        <meshStandardMaterial
          color={purpleGlow}
          emissive={purpleGlow}
          emissiveIntensity={0.25}
          transparent
          opacity={0.30}
        />
      </mesh>

      {/* ── Left Leg: Tall, Straight, Parallel 90° Rectangular Loop Sled Leg (x = -1.45) ── */}
      <group position={[-1.45, 0, 0]}>
        {/* Front vertical post: tall, straight 90° post (y: 0 to 0.64) */}
        <mesh position={[0, legCenterY, 0.48]} castShadow receiveShadow>
          <boxGeometry args={[0.05, legHeight, 0.05]} />
          <meshStandardMaterial color={legsSteelColor} roughness={0.45} metalness={0.75} />
        </mesh>
        {/* Rear vertical post: tall, straight 90° post (y: 0 to 0.64) */}
        <mesh position={[0, legCenterY, -0.48]} castShadow receiveShadow>
          <boxGeometry args={[0.05, legHeight, 0.05]} />
          <meshStandardMaterial color={legsSteelColor} roughness={0.45} metalness={0.75} />
        </mesh>
        {/* Bottom floor runner: horizontal bar connecting front & rear posts on the floor */}
        <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.05, 0.04, 1.01]} />
          <meshStandardMaterial color={legsSteelColor} roughness={0.45} metalness={0.75} />
        </mesh>
        {/* Top mounting runner: attaches tight against tabletop bottom at y = 0.63 */}
        <mesh position={[0, 0.63, 0]} castShadow>
          <boxGeometry args={[0.05, 0.02, 1.01]} />
          <meshStandardMaterial color={legsSteelColor} roughness={0.45} metalness={0.75} />
        </mesh>
        {/* Protective rubber floor glides */}
        <mesh position={[0, 0.003, 0.46]}>
          <boxGeometry args={[0.052, 0.006, 0.07]} />
          <meshStandardMaterial color="#050505" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.003, -0.46]}>
          <boxGeometry args={[0.052, 0.006, 0.07]} />
          <meshStandardMaterial color="#050505" roughness={0.9} />
        </mesh>
      </group>

      {/* ── Right Leg: Tall, Straight, Parallel 90° Rectangular Loop Sled Leg (x = +1.45) ── */}
      <group position={[1.45, 0, 0]}>
        {/* Front vertical post: tall, straight 90° post (y: 0 to 0.64) */}
        <mesh position={[0, legCenterY, 0.48]} castShadow receiveShadow>
          <boxGeometry args={[0.05, legHeight, 0.05]} />
          <meshStandardMaterial color={legsSteelColor} roughness={0.45} metalness={0.75} />
        </mesh>
        {/* Rear vertical post: tall, straight 90° post (y: 0 to 0.64) */}
        <mesh position={[0, legCenterY, -0.48]} castShadow receiveShadow>
          <boxGeometry args={[0.05, legHeight, 0.05]} />
          <meshStandardMaterial color={legsSteelColor} roughness={0.45} metalness={0.75} />
        </mesh>
        {/* Bottom floor runner: horizontal bar connecting front & rear posts on the floor */}
        <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.05, 0.04, 1.01]} />
          <meshStandardMaterial color={legsSteelColor} roughness={0.45} metalness={0.75} />
        </mesh>
        {/* Top mounting runner: attaches tight against tabletop bottom at y = 0.63 */}
        <mesh position={[0, 0.63, 0]} castShadow>
          <boxGeometry args={[0.05, 0.02, 1.01]} />
          <meshStandardMaterial color={legsSteelColor} roughness={0.45} metalness={0.75} />
        </mesh>
        {/* Protective rubber floor glides */}
        <mesh position={[0, 0.003, 0.46]}>
          <boxGeometry args={[0.052, 0.006, 0.07]} />
          <meshStandardMaterial color="#050505" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.003, -0.46]}>
          <boxGeometry args={[0.052, 0.006, 0.07]} />
          <meshStandardMaterial color="#050505" roughness={0.9} />
        </mesh>
      </group>

      {/* ── Rear Cross Stabilizer Bar (connects left leg to right leg at rear) ── */}
      <mesh position={[0, legCenterY, -0.48]} castShadow>
        <boxGeometry args={[2.85, 0.03, 0.03]} />
        <meshStandardMaterial color={legsSteelColor} roughness={0.5} metalness={0.7} />
      </mesh>
    </group>
  )
}
