import { useMemo } from 'react'
import * as THREE from 'three'

/**
 * Potted Green Plant matching Image 1:
 * - Clean white cylindrical ceramic pot
 * - Rich dark soil
 * - Lush green tropical foliage with radiating stems & broad leaves
 */
export default function Plant({ position = [-1.30, 0.72, 0.10] }) {
  const potColor = useMemo(() => new THREE.Color('#f8fafc'), [])
  const soilColor = useMemo(() => new THREE.Color('#2d1a0e'), [])
  const leafDark = useMemo(() => new THREE.Color('#1b5e20'), [])
  const leafMid = useMemo(() => new THREE.Color('#2e7d32'), [])
  const leafLight = useMemo(() => new THREE.Color('#4caf50'), [])

  // Procedural leaves radiating around the center
  const leaves = useMemo(() => [
    { rot: [0.35, 0.2, 0.45], scale: [1, 1.2, 1], pos: [0.02, 0.24, 0.02], color: leafMid },
    { rot: [0.45, 1.2, 0.35], scale: [1.1, 1.3, 1], pos: [0.04, 0.26, -0.02], color: leafDark },
    { rot: [0.30, 2.2, 0.40], scale: [0.95, 1.15, 1], pos: [-0.03, 0.25, -0.03], color: leafLight },
    { rot: [0.40, 3.14, 0.38], scale: [1.15, 1.35, 1], pos: [-0.04, 0.27, 0.01], color: leafMid },
    { rot: [0.32, 4.2, 0.42], scale: [1.05, 1.25, 1], pos: [-0.02, 0.25, 0.04], color: leafDark },
    { rot: [0.50, 5.2, 0.30], scale: [1.0, 1.2, 1], pos: [0.03, 0.28, 0.03], color: leafLight },
    // Center upright shoot
    { rot: [0.15, 0.8, 0.15], scale: [0.85, 1.1, 0.85], pos: [0, 0.30, 0], color: leafLight },
    { rot: [-0.15, 2.4, -0.15], scale: [0.9, 1.15, 0.9], pos: [0.01, 0.31, -0.01], color: leafMid },
  ], [leafDark, leafMid, leafLight])

  return (
    <group position={position}>
      {/* ── Ceramic White Planter Pot ── */}
      <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.09, 0.075, 0.16, 24]} />
        <meshStandardMaterial
          color={potColor}
          roughness={0.25}
          metalness={0.05}
        />
      </mesh>

      {/* ── Soil Top Disc ── */}
      <mesh position={[0, 0.155, 0]}>
        <cylinderGeometry args={[0.085, 0.085, 0.01, 24]} />
        <meshStandardMaterial color={soilColor} roughness={0.9} />
      </mesh>

      {/* ── Foliage Leaves ── */}
      {leaves.map((leaf, i) => (
        <group key={i} position={leaf.pos} rotation={leaf.rot} scale={leaf.scale}>
          {/* Stem */}
          <mesh position={[0, 0.06, 0]} castShadow>
            <cylinderGeometry args={[0.005, 0.007, 0.12, 8]} />
            <meshStandardMaterial color={leafDark} roughness={0.4} />
          </mesh>
          {/* Leaf blade (flattened sphere or curved disc) */}
          <mesh position={[0, 0.13, 0.01]} rotation={[0.4, 0, 0]} castShadow>
            <sphereGeometry args={[0.048, 12, 12]} />
            <meshStandardMaterial
              color={leaf.color}
              roughness={0.35}
              metalness={0.1}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}
