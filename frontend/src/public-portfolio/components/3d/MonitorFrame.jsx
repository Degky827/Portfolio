import { useMemo } from 'react'
import * as THREE from 'three'

/**
 * MonitorFrame
 *
 * Outer bezel of the monitor - black metallic frame with rounded corners
 * and slight thickness. Provides the housing for the screen.
 */
export default function MonitorFrame({ screenPosition = [0, 0, 0] }) {
  const frameColor = useMemo(() => new THREE.Color('#0a0520'), [])
  const accentColor = useMemo(() => new THREE.Color('#8b5cf6'), [])
  const cyanColor = useMemo(() => new THREE.Color('#22d3ee'), [])

  const bodyW = 2.6
  const bodyH = 1.5
  const bodyD = 0.06
  const bezelThickness = 0.06

  const screenW = bodyW - bezelThickness * 2
  const screenH = bodyH - bezelThickness * 2

  return (
    <group position={screenPosition}>
      {/* Monitor body - back panel */}
      <mesh position={[0, 0, -bodyD / 2 - 0.02]} castShadow>
        <boxGeometry args={[bodyW, bodyH, bodyD]} />
        <meshStandardMaterial
          color={frameColor}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* Top bezel */}
      <mesh position={[0, bodyH / 2 - bezelThickness / 2, -0.01]} castShadow>
        <boxGeometry args={[bodyW, bezelThickness, 0.04]} />
        <meshStandardMaterial
          color={frameColor}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Bottom bezel */}
      <mesh position={[0, -bodyH / 2 + bezelThickness / 2, -0.01]} castShadow>
        <boxGeometry args={[bodyW, bezelThickness, 0.04]} />
        <meshStandardMaterial
          color={frameColor}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Left bezel */}
      <mesh position={[-bodyW / 2 + bezelThickness / 2, 0, -0.01]} castShadow>
        <boxGeometry args={[bezelThickness, bodyH, 0.04]} />
        <meshStandardMaterial
          color={frameColor}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Right bezel */}
      <mesh position={[bodyW / 2 - bezelThickness / 2, 0, -0.01]} castShadow>
        <boxGeometry args={[bezelThickness, bodyH, 0.04]} />
        <meshStandardMaterial
          color={frameColor}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Inner screen border - thin dark rim */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[screenW + 0.02, screenH + 0.02]} />
        <meshBasicMaterial color="#020108" />
      </mesh>

      {/* Bezel glow - top */}
      <mesh position={[0, bodyH / 2, 0.01]}>
        <boxGeometry args={[bodyW + 0.02, 0.015, 0.015]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={2}
        />
      </mesh>

      {/* Bezel glow - bottom */}
      <mesh position={[0, -bodyH / 2, 0.01]}>
        <boxGeometry args={[bodyW + 0.02, 0.015, 0.015]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* Bezel glow - left */}
      <mesh position={[-bodyW / 2, 0, 0.01]}>
        <boxGeometry args={[0.015, bodyH + 0.02, 0.015]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* Bezel glow - right */}
      <mesh position={[bodyW / 2, 0, 0.01]}>
        <boxGeometry args={[0.015, bodyH + 0.02, 0.015]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* Power indicator LED */}
      <mesh position={[0, -bodyH / 2 + bezelThickness / 2 - 0.04, 0.025]}>
        <sphereGeometry args={[0.012, 8, 8]} />
        <meshStandardMaterial
          color={cyanColor}
          emissive={cyanColor}
          emissiveIntensity={3}
        />
      </mesh>

      {/* Screen soft glow - emitted light effect */}
      <pointLight
        position={[0, 0, 0.8]}
        intensity={0.15}
        color={accentColor}
        distance={3}
      />
    </group>
  )
}
