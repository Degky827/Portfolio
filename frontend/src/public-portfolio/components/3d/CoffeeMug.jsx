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
  ctx.moveTo(140, 40)
  ctx.lineTo(210, 110)
  ctx.lineTo(165, 155)
  ctx.lineTo(95, 85)
  ctx.closePath()
  ctx.fill()

  // Lower wing - light blue
  ctx.fillStyle = '#0175C2'
  ctx.beginPath()
  ctx.moveTo(140, 140)
  ctx.lineTo(195, 195)
  ctx.lineTo(150, 240)
  ctx.lineTo(95, 185)
  ctx.closePath()
  ctx.fill()

  // Small bottom triangle - cyan
  ctx.fillStyle = '#54C5F8'
  ctx.beginPath()
  ctx.moveTo(140, 140)
  ctx.lineTo(165, 165)
  ctx.lineTo(140, 190)
  ctx.lineTo(115, 165)
  ctx.closePath()
  ctx.fill()

  return new THREE.CanvasTexture(canvas)
}

export default function CoffeeMug({ position = [-1.08, 0.72, 0.28] }) {
  const flutterTexture = useMemo(() => createFlutterMugTexture(), [])
  const mugColor = useMemo(() => new THREE.Color('#f8fafc'), [])
  const coffeeColor = useMemo(() => new THREE.Color('#38220f'), [])

  return (
    <group position={position}>
      {/* ── Ceramic Cup Body ── */}
      <mesh position={[0, 0.045, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.040, 0.038, 0.09, 24]} />
        <meshStandardMaterial
          color={mugColor}
          roughness={0.25}
          metalness={0.08}
        />
      </mesh>

      {/* ── Coffee Surface Inside ── */}
      <mesh position={[0, 0.082, 0]}>
        <circleGeometry args={[0.036, 24]} />
        <meshStandardMaterial
          color={coffeeColor}
          roughness={0.15}
          metalness={0.2}
        />
      </mesh>

      {/* ── Flutter Logo Decal on Mug Front ── */}
      {flutterTexture && (
        <mesh position={[0, 0.045, 0.039]}>
          <planeGeometry args={[0.035, 0.035]} />
          <meshBasicMaterial map={flutterTexture} transparent />
        </mesh>
      )}

      {/* ── Mug Handle (Torus) ── */}
      <mesh position={[-0.046, 0.045, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <torusGeometry args={[0.024, 0.006, 12, 24, Math.PI]} />
        <meshStandardMaterial color={mugColor} roughness={0.25} metalness={0.08} />
      </mesh>
    </group>
  )
}
