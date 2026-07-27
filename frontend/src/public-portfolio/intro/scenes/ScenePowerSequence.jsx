import { useRef, useEffect, useState, memo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const RGB_ITEMS = [
  { name: 'Keyboard', pos: [0, -0.9, 1.2], color: '#8b5cf6', delay: 0, size: [0.5, 0.02, 0.15] },
  { name: 'PC', pos: [-2, -0.3, 0.3], color: '#06b6d4', delay: 0.12, size: [0.15, 0.4, 0.3] },
  { name: 'Monitor', pos: [0, 0.6, -1.2], color: '#4ade80', delay: 0.24, size: [1.2, 0.02, 0.7] },
  { name: 'Desk', pos: [0, -1.3, 0], color: '#f59e0b', delay: 0.36, size: [1.5, 0.02, 0.6] },
  { name: 'Ambient', pos: [0, 2.5, 0], color: '#ec4899', delay: 0.48, size: [0.5, 0.5, 0.5] },
]

function RGBElement({ item, progress }) {
  const meshRef = useRef()
  const lightRef = useRef()
  const glowRef = useRef()
  const appear = Math.min(Math.max((progress - item.delay) / 0.15, 0), 1)
  const isActive = progress > item.delay

  useFrame((state) => {
    if (!meshRef.current || !lightRef.current) return
    const t = state.clock.getElapsedTime()
    const pulse = isActive ? 0.6 + Math.sin(t * 4 + item.pos[0] * 3) * 0.4 : 0
    meshRef.current.material.emissiveIntensity = appear * pulse * 3
    lightRef.current.intensity = appear * pulse * 2

    if (glowRef.current) {
      glowRef.current.material.opacity = appear * pulse * 0.15
      glowRef.current.scale.setScalar(1 + pulse * 0.3)
    }
  })

  return (
    <group position={item.pos}>
      <mesh ref={meshRef}>
        <boxGeometry args={item.size} />
        <meshStandardMaterial
          color={item.color}
          emissive={item.color}
          emissiveIntensity={0}
          transparent
          opacity={appear * 0.9}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>
      <mesh ref={glowRef} scale={1.3}>
        <boxGeometry args={item.size.map(s => s * 1.5)} />
        <meshBasicMaterial
          color={item.color}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <pointLight
        ref={lightRef}
        color={item.color}
        intensity={0}
        distance={4}
        decay={2}
      />
    </group>
  )
}

function ScenePowerSequence({ progress, onComplete }) {
  const groupRef = useRef()
  const blackoutRef = useRef()

  useEffect(() => {
    if (progress >= 1) onComplete?.()
  }, [progress, onComplete])

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.getElapsedTime()
    groupRef.current.rotation.y = Math.sin(t * 0.08) * 0.08

    if (blackoutRef.current) {
      const blackout = progress < 0.15 ? 0.95 : Math.max(0.95 - (progress - 0.15) * 3, 0)
      blackoutRef.current.material.opacity = blackout
    }
  })

  return (
    <group ref={groupRef}>
      {RGB_ITEMS.map((item) => (
        <RGBElement key={item.name} item={item} progress={progress} />
      ))}

      {/* Blackout overlay - monitor stays black */}
      <mesh ref={blackoutRef} position={[0, 0.6, -1.19]}>
        <planeGeometry args={[1.3, 0.8]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.95} />
      </mesh>

      <ambientLight intensity={0.01} color="#06b6d4" />
    </group>
  )
}

export default memo(ScenePowerSequence)
