import { useMemo } from 'react'
import * as THREE from 'three'

/**
 * MonitorStand
 *
 * Professional widescreen monitor stand in matte charcoal black finish matching Image 1:
 * - Sleek angled metallic V-wing feet in charcoal black steel resting flat on the tabletop
 * - Heavy-duty cast-aluminum base hub
 * - Metallic upright column (height ~0.44, frameCenterY = 0.46)
 * - Cable management pass-through channel with subtle blue glow
 * - VESA mounting bracket securely behind the monitor
 */
export default function MonitorStand({ position = [0, 0, 0] }) {
  const metallicTitanium = useMemo(() => new THREE.Color('#101117'), [])
  const metallicProng = useMemo(() => new THREE.Color('#151720'), [])
  const darkHub = useMemo(() => new THREE.Color('#0a0b10'), [])
  const accentColor = useMemo(() => new THREE.Color('#0084FF'), [])

  return (
    <group position={position}>
      {/* ── Angled Metallic V-Wing Base Feet in Charcoal Black Steel ── */}

      {/* Central base hub resting on tabletop */}
      <mesh position={[0, 0.012, 0.04]} castShadow receiveShadow>
        <boxGeometry args={[0.13, 0.022, 0.10]} />
        <meshStandardMaterial color={darkHub} roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Left angled foot prong (spreads out 30° to the left, resting flat on desk) */}
      <group position={[-0.05, 0.008, 0.04]} rotation={[0, 0.52, 0]}>
        <mesh position={[-0.20, 0, 0.09]} castShadow receiveShadow>
          <boxGeometry args={[0.42, 0.014, 0.038]} />
          <meshStandardMaterial color={metallicProng} roughness={0.25} metalness={0.85} />
        </mesh>
        {/* Foot top chamfer highlight strip */}
        <mesh position={[-0.20, 0.008, 0.09]}>
          <boxGeometry args={[0.41, 0.002, 0.014]} />
          <meshStandardMaterial color="#222530" roughness={0.2} metalness={0.9} />
        </mesh>
        {/* Rubber contact pad under left foot tip */}
        <mesh position={[-0.38, -0.006, 0.09]}>
          <boxGeometry args={[0.04, 0.004, 0.034]} />
          <meshStandardMaterial color="#050505" roughness={0.9} />
        </mesh>
      </group>

      {/* Right angled foot prong (spreads out 30° to the right, resting flat on desk) */}
      <group position={[0.05, 0.008, 0.04]} rotation={[0, -0.52, 0]}>
        <mesh position={[0.20, 0, 0.09]} castShadow receiveShadow>
          <boxGeometry args={[0.42, 0.014, 0.038]} />
          <meshStandardMaterial color={metallicProng} roughness={0.25} metalness={0.85} />
        </mesh>
        {/* Foot top chamfer highlight strip */}
        <mesh position={[0.20, 0.008, 0.09]}>
          <boxGeometry args={[0.41, 0.002, 0.014]} />
          <meshStandardMaterial color="#222530" roughness={0.2} metalness={0.9} />
        </mesh>
        {/* Rubber contact pad under right foot tip */}
        <mesh position={[0.38, -0.006, 0.09]}>
          <boxGeometry args={[0.04, 0.004, 0.034]} />
          <meshStandardMaterial color="#050505" roughness={0.9} />
        </mesh>
      </group>

      {/* Rear stabilizing prong resting on desk behind neck */}
      <mesh position={[0, 0.008, -0.05]} castShadow receiveShadow>
        <boxGeometry args={[0.05, 0.014, 0.12]} />
        <meshStandardMaterial color={metallicTitanium} roughness={0.3} metalness={0.8} />
      </mesh>

      {/* ── Stand Neck in Charcoal Black (Proportioned to y = 0.46 frame height) ── */}
      <group position={[0, 0.23, -0.05]} rotation={[-0.03, 0, 0]}>
        {/* Main metallic neck column */}
        <mesh castShadow>
          <boxGeometry args={[0.082, 0.44, 0.054]} />
          <meshStandardMaterial color={metallicTitanium} roughness={0.3} metalness={0.8} />
        </mesh>

        {/* Cable management pass-through channel slot */}
        <mesh position={[0, -0.05, 0]}>
          <boxGeometry args={[0.024, 0.15, 0.058]} />
          <meshStandardMaterial color="#06070a" roughness={0.6} />
        </mesh>

        {/* Subtle electric blue illumination inside cable channel matching Image 1 */}
        <mesh position={[0, -0.05, 0]}>
          <boxGeometry args={[0.012, 0.13, 0.006]} />
          <meshStandardMaterial
            color={accentColor}
            emissive={accentColor}
            emissiveIntensity={2.0}
          />
        </mesh>
      </group>

      {/* VESA Mounting Bracket plate behind monitor */}
      <mesh position={[0, 0.46, -0.035]} castShadow>
        <boxGeometry args={[0.16, 0.16, 0.022]} />
        <meshStandardMaterial color="#0a0b10" roughness={0.35} metalness={0.7} />
      </mesh>
    </group>
  )
}
