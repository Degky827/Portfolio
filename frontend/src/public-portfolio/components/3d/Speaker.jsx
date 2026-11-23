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

  const cyanNeon = useMemo(() => new THREE.Color('#00A3FF'), [])
  const cyanCore = useMemo(() => new THREE.Color('#70D6FF'), [])
  const blueGlow = useMemo(() => new THREE.Color('#0077EE'), [])
  const bodyColor = useMemo(() => new THREE.Color('#0a0c10'), [])
  const baffleColor = useMemo(() => new THREE.Color('#06070a'), [])
  const coneColor = useMemo(() => new THREE.Color('#101217'), [])

  // Inward rotation slightly towards user (matching acoustic studio monitors)
  const inwardRotation = side === 'left' ? 0.15 : -0.15

  useFrame((state) => {
    if (!wooferRingRef.current) return
    const t = state.clock.getElapsedTime()
    wooferRingRef.current.material.emissiveIntensity = 1.8 + Math.sin(t * 2.0) * 0.25
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

      {/* ── Woofer (Bottom driver with Electric Cyan-Blue Halo Ring matching Image 2) ── */}
      <group position={[0, 0.15, 0.122]}>
        {/* Outer illuminated halo ring */}
        <mesh ref={wooferRingRef}>
          <ringGeometry args={[0.060, 0.090, 40]} />
          <meshStandardMaterial
            color={cyanCore}
            emissive={cyanNeon}
            emissiveIntensity={1.8}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Dark inner acoustic cone */}
        <mesh position={[0, 0, -0.008]}>
          <cylinderGeometry args={[0.058, 0.026, 0.020, 28]} />
          <meshStandardMaterial color={coneColor} roughness={0.55} />
        </mesh>
        {/* Center dust cap */}
        <mesh position={[0, 0, 0.002]}>
          <sphereGeometry args={[0.022, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#06070a" roughness={0.25} />
        </mesh>
      </group>

      {/* ── Bottom LED Status Indicator Dot in Electric Cyan ── */}
      <mesh position={[0, 0.024, 0.123]}>
        <circleGeometry args={[0.0035, 14]} />
        <meshBasicMaterial color={cyanNeon} />
      </mesh>
    </group>
  )
}
