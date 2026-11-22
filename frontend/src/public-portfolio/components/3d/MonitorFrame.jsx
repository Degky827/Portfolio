import { useMemo } from 'react'
import * as THREE from 'three'

/**
 * MonitorFrame
 *
 * Slim-bezel 16:9 widescreen monitor enclosure in matte charcoal black finish,
 * with bottom chin branding badge matching the reference workstation monitor.
 */
function createBrandBadgeTexture() {
  if (typeof document === 'undefined') return null
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 32
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  ctx.clearRect(0, 0, 256, 32)
  ctx.fillStyle = '#b8c2dc'
  ctx.font = 'bold 15px "Segoe UI", Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('G I G A B Y T E', 128, 16)
  const texture = new THREE.CanvasTexture(canvas)
  return texture
}

export default function MonitorFrame({ screenPosition = [0, 0, 0] }) {
  const frameColor = useMemo(() => new THREE.Color('#0b0c10'), [])
  const accentColor = useMemo(() => new THREE.Color('#6C2BFF'), [])
  const badgeTexture = useMemo(() => createBrandBadgeTexture(), [])

  const bodyW = 1.76
  const bodyH = 1.00
  const bodyD = 0.04
  const topBezel = 0.016
  const sideBezel = 0.016
  const bottomBezel = 0.036

  return (
    <group position={screenPosition}>
      {/* ── Monitor Back Shell in Matte Charcoal Black ── */}
      <mesh position={[0, 0, -bodyD / 2 - 0.004]} castShadow>
        <boxGeometry args={[bodyW, bodyH, bodyD]} />
        <meshStandardMaterial
          color={frameColor}
          roughness={0.4}
          metalness={0.65}
        />
      </mesh>

      {/* ── Top Ultra-Thin Bezel in Charcoal Black ── */}
      <mesh position={[0, bodyH / 2 - topBezel / 2, 0.004]} castShadow>
        <boxGeometry args={[bodyW, topBezel, 0.014]} />
        <meshStandardMaterial color={frameColor} roughness={0.3} metalness={0.7} />
      </mesh>

      {/* ── Bottom Chin in Deep Charcoal Black ── */}
      <mesh position={[0, -bodyH / 2 + bottomBezel / 2, 0.006]} castShadow>
        <boxGeometry args={[bodyW, bottomBezel, 0.018]} />
        <meshStandardMaterial color="#07080b" roughness={0.3} metalness={0.75} />
      </mesh>

      {/* Chin Brand Badge (Gigabyte branding) */}
      <mesh position={[0, -bodyH / 2 + bottomBezel / 2, 0.016]}>
        <planeGeometry args={[0.13, 0.016]} />
        <meshBasicMaterial
          map={badgeTexture || undefined}
          color="#ffffff"
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* ── Left Ultra-Thin Bezel in Charcoal Black ── */}
      <mesh position={[-bodyW / 2 + sideBezel / 2, 0, 0.004]} castShadow>
        <boxGeometry args={[sideBezel, bodyH, 0.014]} />
        <meshStandardMaterial color={frameColor} roughness={0.3} metalness={0.7} />
      </mesh>

      {/* ── Right Ultra-Thin Bezel in Charcoal Black ── */}
      <mesh position={[bodyW / 2 - sideBezel / 2, 0, 0.004]} castShadow>
        <boxGeometry args={[sideBezel, bodyH, 0.014]} />
        <meshStandardMaterial color={frameColor} roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Subtle Purple LED Glow from under the bottom chin */}
      <mesh position={[0, -bodyH / 2 - 0.003, 0.002]}>
        <boxGeometry args={[bodyW * 0.70, 0.003, 0.008]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={1.8}
        />
      </mesh>
    </group>
  )
}
