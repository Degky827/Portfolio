import { useMemo } from 'react'
import * as THREE from 'three'

/**
 * Desk
 *
 * Futuristic desk with glowing edge accents.
 * Built with primitive geometries for zero external model dependencies.
 */
export default function Desk({ position = [0, 0, 0] }) {
  const purpleColor = useMemo(() => new THREE.Color('#8b5cf6'), [])
  const darkColor = useMemo(() => new THREE.Color('#0f0a2a'), [])
  const edgeColor = useMemo(() => new THREE.Color('#6366f1'), [])

  return (
    <group position={position}>
      {/* Desktop surface */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 0.06, 1.4]} />
        <meshStandardMaterial
          color={darkColor}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Desktop edge glow - front */}
      <mesh position={[0, 0.75, 0.71]}>
        <boxGeometry args={[3.22, 0.02, 0.02]} />
        <meshStandardMaterial
          color={purpleColor}
          emissive={purpleColor}
          emissiveIntensity={2}
        />
      </mesh>

      {/* Desktop edge glow - back */}
      <mesh position={[0, 0.75, -0.71]}>
        <boxGeometry args={[3.22, 0.02, 0.02]} />
        <meshStandardMaterial
          color={edgeColor}
          emissive={edgeColor}
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* Desktop edge glow - left */}
      <mesh position={[-1.61, 0.75, 0]}>
        <boxGeometry args={[0.02, 0.02, 1.42]} />
        <meshStandardMaterial
          color={purpleColor}
          emissive={purpleColor}
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* Desktop edge glow - right */}
      <mesh position={[1.61, 0.75, 0]}>
        <boxGeometry args={[0.02, 0.02, 1.42]} />
        <meshStandardMaterial
          color={purpleColor}
          emissive={purpleColor}
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* Left leg */}
      <mesh position={[-1.4, 0.375, 0]} castShadow>
        <boxGeometry args={[0.06, 0.75, 1.2]} />
        <meshStandardMaterial
          color={darkColor}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* Right leg */}
      <mesh position={[1.4, 0.375, 0]} castShadow>
        <boxGeometry args={[0.06, 0.75, 1.2]} />
        <meshStandardMaterial
          color={darkColor}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* Under-desk support bar */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[2.8, 0.04, 0.04]} />
        <meshStandardMaterial
          color={edgeColor}
          emissive={edgeColor}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Desk underside glow strip */}
      <mesh position={[0, 0.72, 0]}>
        <boxGeometry args={[3.0, 0.01, 1.2]} />
        <meshStandardMaterial
          color={purpleColor}
          emissive={purpleColor}
          emissiveIntensity={0.3}
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  )
}
