import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useWorkspace } from './WorkspaceContext'
import * as THREE from 'three'

/**
 * Speaker
 *
 * Studio monitor desktop speaker in sleek charcoal black finish with
 * illuminated circular purple driver ring.
 */
export default function Speaker({ position = [0, 0, 0], side = 'left' }) {
  const workspace = useWorkspace()
  const wooferRingRef = useRef()

  const purplePrimary = useMemo(() => new THREE.Color('#6C2BFF'), [])
  const purpleVibrant = useMemo(() => new THREE.Color('#A855F7'), [])
  const bodyColor = useMemo(() => new THREE.Color('#0d0e12'), [])
  const baffleColor = useMemo(() => new THREE.Color('#08090c'), [])
  const coneColor = useMemo(() => new THREE.Color('#14151b'), [])

  // Angle slightly inward towards user
  const inwardRotation = side === 'left' ? 0.12 : -0.12

  useFrame((state) => {
    if (!wooferRingRef.current) return
    const t = state.clock.getElapsedTime()
    wooferRingRef.current.material.emissiveIntensity = 3.0 + Math.sin(t * 1.5) * 0.4
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

      {/* ── Tweeter (Top Driver) ── */}
      <group position={[0, 0.33, 0.123]}>
        <mesh>
          <ringGeometry args={[0.024, 0.038, 28]} />
          <meshStandardMaterial color="#1a1c22" roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh position={[0, 0, 0.005]}>
          <sphereGeometry args={[0.018, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#08080a" roughness={0.2} metalness={0.8} />
        </mesh>
      </group>

      {/* ── Woofer (Charcoal Black Cone with Illuminated Purple Halo Ring) ── */}
      <group position={[0, 0.15, 0.123]}>
        {/* Outer illuminated purple driver halo ring */}
        <mesh ref={wooferRingRef}>
          <ringGeometry args={[0.066, 0.082, 40]} />
          <meshStandardMaterial
            color={purpleVibrant}
            emissive={purplePrimary}
            emissiveIntensity={3.2}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Charcoal Black Cone Diaphragm */}
        <mesh position={[0, 0, -0.003]}>
          <circleGeometry args={[0.066, 36]} />
          <meshStandardMaterial
            color={coneColor}
            roughness={0.45}
            metalness={0.25}
          />
        </mesh>

        {/* Center metallic charcoal dust cap */}
        <mesh position={[0, 0, 0.006]}>
          <sphereGeometry args={[0.022, 20, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial
            color="#0b0c10"
            roughness={0.25}
            metalness={0.75}
          />
        </mesh>
      </group>

      {/* ── Soft purple point light from driver ── */}
      <pointLight
        position={[0, 0.15, 0.20]}
        intensity={0.3}
        color={purplePrimary}
        distance={0.8}
        decay={2}
      />

      {/* ── Rubber Isolation Feet ── */}
      {[-0.09, 0.09].map((x, i) =>
        [-0.09, 0.09].map((z, j) => (
          <mesh key={`${i}-${j}`} position={[x, 0.005, z]} castShadow>
            <cylinderGeometry args={[0.014, 0.014, 0.01, 16]} />
            <meshStandardMaterial color="#050505" roughness={0.9} />
          </mesh>
        ))
      )}

      {/* ── Interactive Workspace Hitbox ── */}
      <mesh
        position={[0, 0.22, 0]}
        onClick={(e) => {
          e.stopPropagation()
          workspace?.openByObject?.('speaker')
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto'
        }}
      >
        <boxGeometry args={[0.26, 0.46, 0.26]} />
        <meshStandardMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  )
}
