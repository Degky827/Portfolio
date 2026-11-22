import { useMemo } from 'react'
import * as THREE from 'three'

/**
 * MonitorStand
 *
 * Professional widescreen gaming/developer monitor stand in matte charcoal black finish matching Image 1:
 * - Prominent, elongated metallic V-wing feet in charcoal black steel spreading across the tabletop
 * - Heavy-duty cast-aluminum central base hub
 * - Extended metallic upright neck column (height ~0.58, frameCenterY = 0.58)
 * - Cable management pass-through channel with glowing electric cyan-blue accent
 * - Heavy-duty VESA mounting bracket securely behind the monitor
 */
export default function MonitorStand({ position = [0, 0, 0] }) {
  const metallicTitanium = useMemo(() => new THREE.Color('#101117'), [])
  const metallicProng = useMemo(() => new THREE.Color('#151720'), [])
  const darkHub = useMemo(() => new THREE.Color('#0a0b10'), [])
  const accentColor = useMemo(() => new THREE.Color('#0088FF'), [])

  return (
    <group position={position}>
      {/* ── Angled Metallic V-Wing Base Feet (Prominent & Extended matching Image 1) ── */}

      {/* Central base hub resting on tabletop */}
      <mesh position={[0, 0.014, 0.04]} castShadow receiveShadow>
        <boxGeometry args={[0.16, 0.026, 0.12]} />
        <meshStandardMaterial color={darkHub} roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Left extended angled foot prong (spreads out 33° to the left across desk) */}
      <group position={[-0.06, 0.009, 0.04]} rotation={[0, 0.58, 0]}>
        <mesh position={[-0.26, 0, 0.11]} castShadow receiveShadow>
          <boxGeometry args={[0.54, 0.016, 0.044]} />
          <meshStandardMaterial color={metallicProng} roughness={0.25} metalness={0.85} />
        </mesh>
        {/* Foot top chamfer highlight strip */}
        <mesh position={[-0.26, 0.009, 0.11]}>
          <boxGeometry args={[0.53, 0.003, 0.016]} />
          <meshStandardMaterial color="#262a36" roughness={0.2} metalness={0.9} />
        </mesh>
        {/* Rubber contact pad under left foot tip */}
        <mesh position={[-0.49, -0.007, 0.11]}>
          <boxGeometry args={[0.05, 0.004, 0.040]} />
          <meshStandardMaterial color="#050505" roughness={0.9} />
        </mesh>
      </group>

      {/* Right extended angled foot prong (spreads out 33° to the right across desk) */}
      <group position={[0.06, 0.009, 0.04]} rotation={[0, -0.58, 0]}>
        <mesh position={[0.26, 0, 0.11]} castShadow receiveShadow>
          <boxGeometry args={[0.54, 0.016, 0.044]} />
          <meshStandardMaterial color={metallicProng} roughness={0.25} metalness={0.85} />
        </mesh>
        {/* Foot top chamfer highlight strip */}
        <mesh position={[0.26, 0.009, 0.11]}>
          <boxGeometry args={[0.53, 0.003, 0.016]} />
          <meshStandardMaterial color="#262a36" roughness={0.2} metalness={0.9} />
        </mesh>
        {/* Rubber contact pad under right foot tip */}
        <mesh position={[0.49, -0.007, 0.11]}>
          <boxGeometry args={[0.05, 0.004, 0.040]} />
          <meshStandardMaterial color="#050505" roughness={0.9} />
        </mesh>
      </group>

      {/* Rear stabilizing prong resting on desk behind neck */}
      <mesh position={[0, 0.009, -0.06]} castShadow receiveShadow>
        <boxGeometry args={[0.06, 0.016, 0.15]} />
        <meshStandardMaterial color={metallicTitanium} roughness={0.3} metalness={0.8} />
      </mesh>

      {/* ── Extended Metallic Stand Neck Column (height 0.58) ── */}
      <group position={[0, 0.29, -0.05]} rotation={[-0.03, 0, 0]}>
        {/* Main metallic neck column */}
        <mesh castShadow>
          <boxGeometry args={[0.088, 0.58, 0.056]} />
          <meshStandardMaterial color={metallicTitanium} roughness={0.3} metalness={0.8} />
        </mesh>

        {/* Cable management pass-through channel slot */}
        <mesh position={[0, -0.06, 0]}>
          <boxGeometry args={[0.026, 0.20, 0.060]} />
          <meshStandardMaterial color="#06070a" roughness={0.6} />
        </mesh>

        {/* Subtle electric blue illumination inside cable channel matching Image 1 */}
        <mesh position={[0, -0.06, 0]}>
          <boxGeometry args={[0.014, 0.18, 0.006]} />
          <meshStandardMaterial
            color={accentColor}
            emissive={accentColor}
            emissiveIntensity={2.2}
          />
        </mesh>
      </group>

      {/* VESA Mounting Bracket plate behind monitor */}
      <mesh position={[0, 0.58, -0.035]} castShadow>
        <boxGeometry args={[0.18, 0.18, 0.024]} />
        <meshStandardMaterial color="#0a0b10" roughness={0.35} metalness={0.7} />
      </mesh>
    </group>
  )
}
