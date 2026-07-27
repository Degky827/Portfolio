import { useRef, useEffect, useMemo, memo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function EnergyRing({ progress, radius, color, speed = 1, thickness = 0.015 }) {
  const ringRef = useRef()
  const segmentCount = 80

  const positions = useMemo(() => {
    const arr = new Float32Array(segmentCount * 3)
    for (let i = 0; i < segmentCount; i++) {
      const angle = (i / segmentCount) * Math.PI * 2
      arr[i * 3] = Math.cos(angle) * radius
      arr[i * 3 + 1] = Math.sin(angle) * radius
      arr[i * 3 + 2] = 0
    }
    return arr
  }, [radius])

  useFrame((state) => {
    if (!ringRef.current) return
    const t = state.clock.getElapsedTime()
    ringRef.current.rotation.z = t * speed
    ringRef.current.rotation.x = Math.sin(t * 0.2) * 0.15
  })

  const drawRange = Math.floor(segmentCount * Math.min(progress * 1.8, 1))

  return (
    <line ref={ringRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={segmentCount} itemSize={3} />
      </bufferGeometry>
      <lineBasicMaterial
        color={color}
        transparent
        opacity={Math.min(progress * 2.5, 0.7)}
        blending={THREE.AdditiveBlending}
      />
    </line>
  )
}

function MonitorScreen({ progress }) {
  const meshRef = useRef()
  const glowRef = useRef()
  const screenOpacity = Math.min(Math.max((progress - 0.4) / 0.25, 0), 1)
  const glowIntensity = Math.min(Math.max((progress - 0.85) / 0.15, 0), 1)

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.getElapsedTime()
    meshRef.current.material.emissiveIntensity = screenOpacity * (0.3 + Math.sin(t * 1.5) * 0.15)
    if (glowRef.current) {
      glowRef.current.material.opacity = glowIntensity * 0.4
      glowRef.current.scale.setScalar(1 + glowIntensity * 0.8)
    }
  })

  return (
    <group position={[0, 0.6, -1.5]}>
      <mesh>
        <boxGeometry args={[2.2, 1.4, 0.06]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.1} />
      </mesh>

      <mesh ref={meshRef} position={[0, 0, 0.035]}>
        <planeGeometry args={[2, 1.2]} />
        <meshStandardMaterial
          color="#050510"
          emissive="#06b6d4"
          emissiveIntensity={0}
          transparent
          opacity={screenOpacity}
        />
      </mesh>

      <mesh ref={glowRef} position={[0, 0, 0.15]}>
        <planeGeometry args={[3, 2]} />
        <meshBasicMaterial
          color="#06b6d4"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

function SceneWelcome({ progress, onComplete }) {
  const groupRef = useRef()

  useEffect(() => {
    if (progress >= 1) onComplete?.()
  }, [progress, onComplete])

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.getElapsedTime()
    groupRef.current.rotation.y = Math.sin(t * 0.08) * 0.04
  })

  return (
    <group ref={groupRef}>
      <EnergyRing progress={progress} radius={1.8} color="#06b6d4" speed={0.4} />
      <EnergyRing progress={Math.max(progress - 0.08, 0)} radius={1.4} color="#8b5cf6" speed={-0.25} />
      <EnergyRing progress={Math.max(progress - 0.16, 0)} radius={1.0} color="#4ade80" speed={0.6} />

      <MonitorScreen progress={progress} />

      <pointLight color="#06b6d4" intensity={progress * 3} distance={6} decay={2} />
      <pointLight color="#8b5cf6" intensity={progress * 1} distance={5} decay={2} position={[3, 2, -2]} />
    </group>
  )
}

export default memo(SceneWelcome)
