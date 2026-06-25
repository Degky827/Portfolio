import { useMemo } from 'react'
import * as THREE from 'three'

/**
 * MonitorStand
 *
 * Monitor stand with base and neck. Metallic dark finish with
 * purple accent glow on the neck.
 */
export default function MonitorStand({ position = [0, 0, 0] }) {
  const frameColor = useMemo(() => new THREE.Color('#0a0520'), [])
  const accentColor = useMemo(() => new THREE.Color('#8b5cf6'), [])

  return (
    <group position={position}>
      {/* Stand base */}
      <mesh position={[0, 0, 0.1]} castShadow>
        <cylinderGeometry args={[0.25, 0.3, 0.03, 32]} />
        <meshStandardMaterial
          color={frameColor}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* Stand neck */}
      <mesh position={[0, 0.22, 0.1]} castShadow>
        <boxGeometry args={[0.06, 0.44, 0.06]} />
        <meshStandardMaterial
          color={frameColor}
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>

      {/* Stand neck glow accent */}
      <mesh position={[0, 0.22, 0.13]}>
        <boxGeometry args={[0.02, 0.4, 0.01]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={1.5}
        />
      </mesh>
    </group>
  )
}
