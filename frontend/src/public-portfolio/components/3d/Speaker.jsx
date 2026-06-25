import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Speaker
 *
 * Desktop speaker with pulsing RGB ring light.
 */
export default function Speaker({ position = [0, 0, 0], side = 'left' }) {
  const ringRef = useRef()
  const purpleColor = useMemo(() => new THREE.Color('#8b5cf6'), [])
  const cyanColor = useMemo(() => new THREE.Color('#22d3ee'), [])
  const bodyColor = useMemo(() => new THREE.Color('#0f0a2a'), [])

  const mirrorX = side === 'right' ? -1 : 1

  useFrame((state) => {
    if (!ringRef.current) return
    const t = state.clock.getElapsedTime()
    ringRef.current.material.emissiveIntensity = 1.5 + Math.sin(t * 2) * 0.5
  })

  return (
    <group position={position} scale={[mirrorX, 1, 1]}>
      {/* Speaker body */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[0.2, 0.9, 0.2]} />
        <meshStandardMaterial
          color={bodyColor}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* Speaker grille - front */}
      <mesh position={[0, 0.45, 0.101]}>
        <planeGeometry args={[0.18, 0.85]} />
        <meshStandardMaterial
          color="#0a0520"
          roughness={0.5}
          metalness={0.3}
        />
      </mesh>

      {/* Grille pattern lines */}
      {[-0.3, -0.15, 0, 0.15, 0.3].map((y, i) => (
        <mesh key={i} position={[0, 0.45 + y, 0.102]}>
          <boxGeometry args={[0.16, 0.008, 0.001]} />
          <meshStandardMaterial
            color={bodyColor}
            roughness={0.4}
          />
        </mesh>
      ))}

      {/* RGB ring light - top */}
      <mesh ref={ringRef} position={[0, 0.82, 0.101]}>
        <ringGeometry args={[0.04, 0.06, 32]} />
        <meshStandardMaterial
          color={cyanColor}
          emissive={cyanColor}
          emissiveIntensity={2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Volume knob glow */}
      <mesh position={[0, 0.15, 0.101]}>
        <circleGeometry args={[0.03, 16]} />
        <meshStandardMaterial
          color={purpleColor}
          emissive={purpleColor}
          emissiveIntensity={2}
        />
      </mesh>

      {/* Side accent strip */}
      <mesh position={[0.101, 0.45, 0]}>
        <boxGeometry args={[0.01, 0.85, 0.01]} />
        <meshStandardMaterial
          color={purpleColor}
          emissive={purpleColor}
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* Speaker internal glow */}
      <pointLight
        position={[0, 0.45, 0.15]}
        intensity={0.2}
        color={purpleColor}
        distance={1}
      />

      {/* Base pad */}
      <mesh position={[0, 0.01, 0]}>
        <boxGeometry args={[0.22, 0.02, 0.22]} />
        <meshStandardMaterial
          color={bodyColor}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </group>
  )
}
