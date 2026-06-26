import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function FlareDisc({ position, color, size, speed, phase }) {
  const meshRef = useRef()

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.getElapsedTime()
    const s = size * (1 + Math.sin(t * speed + phase) * 0.2)
    meshRef.current.scale.set(s, s, 1)
    meshRef.current.material.opacity = 0.08 + Math.sin(t * speed * 0.7 + phase) * 0.04
  })

  return (
    <mesh ref={meshRef} position={position}>
      <circleGeometry args={[1, 32]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.1}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

function HexFlare({ position, color, size }) {
  const meshRef = useRef()

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.getElapsedTime()
    meshRef.current.rotation.z = t * 0.2
    const s = size * (1 + Math.sin(t * 1.5) * 0.15)
    meshRef.current.scale.set(s, s, 1)
    meshRef.current.material.opacity = 0.06 + Math.sin(t * 0.8) * 0.03
  })

  return (
    <mesh ref={meshRef} position={position}>
      <circleGeometry args={[1, 6]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.06}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  )
}

function AnamorphicStreak() {
  const meshRef = useRef()

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.getElapsedTime()
    meshRef.current.material.opacity = 0.04 + Math.sin(t * 0.5) * 0.02
    meshRef.current.scale.x = 1 + Math.sin(t * 0.3) * 0.1
  })

  return (
    <mesh ref={meshRef} position={[0, 4, -8]} rotation={[0, 0, 0]}>
      <planeGeometry args={[20, 0.08]} />
      <meshBasicMaterial
        color="#8b5cf6"
        transparent
        opacity={0.04}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  )
}

function StarBurst() {
  const groupRef = useRef()

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.getElapsedTime()
    groupRef.current.children.forEach((child, i) => {
      child.material.opacity = 0.05 + Math.sin(t * 1.2 + i * 0.8) * 0.03
      const s = 0.8 + Math.sin(t * 0.6 + i) * 0.2
      child.scale.set(s, s, 1)
    })
  })

  const rays = useMemo(() =>
    Array.from({ length: 6 }, (_, i) => ({
      rotation: (i * Math.PI) / 6,
      length: 2 + Math.random() * 3,
    })),
    []
  )

  return (
    <group ref={groupRef} position={[3, 5, -7]}>
      {rays.map((ray, i) => (
        <mesh key={i} rotation={[0, 0, ray.rotation]}>
          <planeGeometry args={[0.02, ray.length]} />
          <meshBasicMaterial
            color="#a5b4fc"
            transparent
            opacity={0.05}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}

export default function CinematicLensFlare({ isMobile }) {
  return (
    <group>
      <FlareDisc position={[3, 5, -8]} color="#8b5cf6" size={1.2} speed={0.8} phase={0} />
      <FlareDisc position={[-2, 4, -6]} color="#06b6d4" size={0.8} speed={1.0} phase={1.5} />
      <FlareDisc position={[1, 6, -10]} color="#6366f1" size={1.5} speed={0.6} phase={3.0} />

      {!isMobile && (
        <>
          <HexFlare position={[4, 3, -5]} color="#22d3ee" size={0.6} />
          <HexFlare position={[-3, 5, -7]} color="#a78bfa" size={0.5} />
          <AnamorphicStreak />
          <StarBurst />
        </>
      )}
    </group>
  )
}
