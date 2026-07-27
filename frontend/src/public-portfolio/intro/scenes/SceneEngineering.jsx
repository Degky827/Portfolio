import { useRef, useMemo, useEffect, memo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const OBJECTS = [
  { name: 'CPU', pos: [0, 0.2, 0], scale: 0.25, color: '#06b6d4', shape: 'box' },
  { name: 'GPU', pos: [-1.8, 0.1, 0.3], scale: 0.3, color: '#8b5cf6', shape: 'box' },
  { name: 'RAM', pos: [1.8, 0.1, 0.3], scale: 0.2, color: '#4ade80', shape: 'box' },
  { name: 'Motherboard', pos: [0, -0.5, 0], scale: 0.4, color: '#6366f1', shape: 'box' },
  { name: 'Keyboard', pos: [0, -0.9, 1.2], scale: 0.35, color: '#f59e0b', shape: 'box' },
  { name: 'Monitor', pos: [0, 0.6, -1.2], scale: 0.45, color: '#06b6d4', shape: 'box' },
  { name: 'Desk', pos: [0, -1.3, 0], scale: 0.5, color: '#6366f1', shape: 'box' },
  { name: 'Chair', pos: [0, -0.8, 2], scale: 0.3, color: '#ec4899', shape: 'box' },
]

function BlueprintObject({ object, progress }) {
  const groupRef = useRef()
  const wireRef = useRef()
  const solidRef = useRef()
  const glassRef = useRef()
  const glowRef = useRef()

  const phase = Math.min(progress * 2.5, 1)
  const wirePhase = Math.min(Math.max(progress * 2.5 - 0.2, 0), 1)
  const metalPhase = Math.min(Math.max(progress * 2.5 - 0.4, 0), 1)
  const glassPhase = Math.min(Math.max(progress * 2.5 - 0.6, 0), 1)
  const realPhase = Math.min(Math.max(progress * 2.5 - 0.8, 0), 1)

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.getElapsedTime()
    groupRef.current.rotation.y = t * 0.15
    groupRef.current.position.y = object.pos[1] + Math.sin(t * 0.4 + object.pos[0] * 2) * 0.03
  })

  const size = [1, 0.6, 0.8]

  return (
    <group ref={groupRef} position={object.pos}>
      {/* Blueprint outline */}
      <mesh ref={wireRef} scale={object.scale * wirePhase}>
        <boxGeometry args={size} />
        <meshBasicMaterial
          color={object.color}
          wireframe
          transparent
          opacity={wirePhase * 0.5}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Metal layer */}
      <mesh ref={solidRef} scale={object.scale * metalPhase}>
        <boxGeometry args={size} />
        <meshStandardMaterial
          color={object.color}
          transparent
          opacity={metalPhase * 0.7}
          emissive={object.color}
          emissiveIntensity={0.2}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Glass layer */}
      <mesh ref={glassRef} scale={object.scale * glassPhase * 1.02}>
        <boxGeometry args={size} />
        <meshPhysicalMaterial
          color={object.color}
          transparent
          opacity={glassPhase * 0.15}
          metalness={0.1}
          roughness={0.05}
          transmission={0.6}
          thickness={0.2}
        />
      </mesh>

      {/* Glow */}
      <mesh ref={glowRef} scale={object.scale * phase * 1.15}>
        <boxGeometry args={size} />
        <meshBasicMaterial
          color={object.color}
          transparent
          opacity={phase * 0.08}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

function SceneEngineering({ progress, onComplete }) {
  const groupRef = useRef()

  useEffect(() => {
    if (progress >= 1) onComplete?.()
  }, [progress, onComplete])

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.getElapsedTime()
    groupRef.current.rotation.y = Math.sin(t * 0.08) * 0.15
  })

  return (
    <group ref={groupRef}>
      {OBJECTS.map((obj, i) => (
        <BlueprintObject
          key={obj.name}
          object={obj}
          progress={Math.min(Math.max(progress * OBJECTS.length - i * 0.8, 0), 1)}
        />
      ))}

      <ambientLight intensity={0.08} color="#06b6d4" />
      <pointLight color="#06b6d4" intensity={1.8} distance={10} decay={2} position={[4, 4, 4]} />
      <pointLight color="#8b5cf6" intensity={1} distance={8} decay={2} position={[-4, 3, -3]} />
      <pointLight color="#4ade80" intensity={0.5} distance={6} decay={2} position={[0, -3, 3]} />
    </group>
  )
}

export default memo(SceneEngineering)
