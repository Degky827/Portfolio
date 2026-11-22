import { useMemo } from 'react'
import * as THREE from 'three'

/**
 * Creates canvas texture for the Flutter logo on the mug
 */
function createFlutterMugTexture() {
  if (typeof document === 'undefined') return null
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, 256, 256)

  // Draw crisp Flutter logo
  // Upper wing
  ctx.fillStyle = '#02569B'
  ctx.beginPath()
  ctx.moveTo(140, 35)
  ctx.lineTo(215, 110)
  ctx.lineTo(168, 157)
  ctx.lineTo(93, 82)
  ctx.closePath()
  ctx.fill()

  // Lower wing - light blue
  ctx.fillStyle = '#0175C2'
  ctx.beginPath()
  ctx.moveTo(140, 140)
  ctx.lineTo(198, 198)
  ctx.lineTo(151, 245)
  ctx.lineTo(93, 187)
  ctx.closePath()
  ctx.fill()

  // Small bottom triangle - cyan
  ctx.fillStyle = '#54C5F8'
  ctx.beginPath()
  ctx.moveTo(140, 140)
  ctx.lineTo(168, 168)
  ctx.lineTo(140, 196)
  ctx.lineTo(112, 168)
  ctx.closePath()
  ctx.fill()

  return new THREE.CanvasTexture(canvas)
}

/**
 * Ceramic Coffee Mug with Flutter Logo matching Image 1:
 * - Pure white glazed ceramic finish
 * - Front-facing official Flutter logo
 * - Rich dark coffee surface inside
 * - Curved ceramic handle
 */
export default function CoffeeMug({ position = [-1.02, 0.72, 0.26] }) {
  const flutterTexture = useMemo(() => createFlutterMugTexture(), [])
  const mugColor = useMemo(() => new THREE.Color('#ffffff'), [])
  const coffeeColor = useMemo(() => new THREE.Color('#38220f'), [])

  return (
    <group position={position}>
      {/* ── Ceramic Cup Body ── */}
      <mesh position={[0, 0.055, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.050, 0.046, 0.11, 28]} />
        <meshStandardMaterial
          color={mugColor}
          roughness={0.20}
          metalness={0.06}
        />
      </mesh>

      {/* ── Cup Top Lip Rim ── */}
      <mesh position={[0, 0.11, 0]}>
        <torusGeometry args={[0.049, 0.004, 12, 28]} />
        <meshStandardMaterial color={mugColor} roughness={0.20} metalness={0.06} />
      </mesh>

      {/* ── Dark Coffee Surface Inside ── */}
      <mesh position={[0, 0.098, 0]}>
        <circleGeometry args={[0.045, 24]} />
        <meshStandardMaterial
          color={coffeeColor}
          roughness={0.15}
          metalness={0.2}
        />
      </mesh>

      {/* ── Flutter Logo Decal on Mug Front ── */}
      {flutterTexture && (
        <mesh position={[0, 0.055, 0.048]}>
          <planeGeometry args={[0.046, 0.046]} />
          <meshBasicMaterial map={flutterTexture} transparent />
        </mesh>
      )}

      {/* ── Mug Handle (Torus on left side) ── */}
      <mesh position={[-0.056, 0.055, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <torusGeometry args={[0.030, 0.007, 12, 24, Math.PI]} />
        <meshStandardMaterial color={mugColor} roughness={0.20} metalness={0.06} />
      </mesh>
    </group>
  )
}
