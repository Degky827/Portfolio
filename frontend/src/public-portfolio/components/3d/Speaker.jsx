import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useWorkspace } from './WorkspaceContext'
import * as THREE from 'three'

/**
 * Speaker
 *
 * Studio monitor desktop speaker matching Image 1:
 * - Sleek matte black cabinet
 * - Circular glowing electric cyan-blue (#00C8FF) driver ring
 */
export default function Speaker({ position = [0, 0, 0], side = 'left' }) {
  const workspace = useWorkspace()
  const wooferRingRef = useRef()

  const cyanRing = useMemo(() => new THREE.Color('#00C8FF'), [])
  const blueGlow = useMemo(() => new THREE.Color('#0088FF'), [])
  const bodyColor = useMemo(() => new THREE.Color('#0d0e12'), [])
  const baffleColor = useMemo(() => new THREE.Color('#08090c'), [])
  const coneColor = useMemo(() => new THREE.Color('#14151b'), [])

  // Inward rotation slightly towards user
  const inwardRotation = side === 'left' ? 0.12 : -0.12

  useFrame((state) => {
    if (!wooferRingRef.current) return
    const t = state.clock.getElapsedTime()
    wooferRingRef.current.material.emissiveIntensity = 1.4 + Math.sin(t * 1.5) * 0.2
  })

  return (
    <group position={position} rotation={[0, inwardRotation, 0]}>
      {/* ── Speaker Cabinet in Matte Charcoal Black ── */}
      <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.24, 0.44, 0.24]} />
        <meshStandardMaterial
          color={bodyColor}
          roughness={0.45}
          metalness={0.4}
        />
      </mesh>

      {/* ── Front Baffle in Deep Charcoal Black ── */}
      <mesh position={[0, 0.22, 0.121]} castShadow>
        <planeGeometry args={[0.22, 0.42]} />
        <meshStandardMaterial
          color={baffleColor}
          roughness={0.35}
          metalness={0.3}
        />
      </mesh>

      {/* ── Tweeter (Top small driver at y = 0.32) ── */}
      <group position={[0, 0.32, 0.122]}>
        <mesh>
          <ringGeometry args={[0.024, 0.038, 32]} />
          <meshStandardMaterial color="#1f212a" roughness={0.5} metalness={0.6} />
        </mesh>
        <mesh position={[0, 0, 0.004]}>
          <sphereGeometry args={[0.016, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#0a0a0d" roughness={0.2} metalness={0.8} />
        </mesh>
      </group>

      {/* ── Woofer (Bottom driver with Electric Cyan-Blue Halo Ring matching Image 1) ── */}
      <group position={[0, 0.15, 0.122]}>
        {/* Outer illuminated halo ring */}
        <mesh ref={wooferRingRef}>
          <ringGeometry args={[0.062, 0.088, 36]} />
          <meshStandardMaterial
            color={cyanRing}
            emissive={blueGlow}
            emissiveIntensity={1.4}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Dark inner acoustic cone */}
        <mesh position={[0, 0, -0.008]}>
          <cylinderGeometry args={[0.060, 0.028, 0.020, 24]} />
          <meshStandardMaterial color={coneColor} roughness={0.55} />
        </mesh>
        {/* Center dust cap */}
        <mesh position={[0, 0, 0.002]}>
          <sphereGeometry args={[0.022, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#08080a" roughness={0.25} />
        </mesh>
      </group>

      {/* ── Bottom LED Status Indicator Dot in Blue ── */}
      <mesh position={[0, 0.024, 0.123]}>
        <circleGeometry args={[0.0035, 12]} />
        <meshBasicMaterial color={cyanRing} />
      </mesh>
    </group>
  )
}
