import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useWorkspace } from './WorkspaceContext'
import * as THREE from 'three'

/**
 * PC
 *
 * PC tower case with RGB fans and glowing accents.
 */
export default function PC({ position = [0, 0, 0] }) {
  const workspace = useWorkspace()
  const fanRef1 = useRef()
  const fanRef2 = useRef()
  const purpleColor = useMemo(() => new THREE.Color('#8b5cf6'), [])
  const cyanColor = useMemo(() => new THREE.Color('#22d3ee'), [])
  const caseColor = useMemo(() => new THREE.Color('#0a0520'), [])
  const glowColor = useMemo(() => new THREE.Color('#6366f1'), [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (fanRef1.current) {
      fanRef1.current.rotation.z = t * 3
    }
    if (fanRef2.current) {
      fanRef2.current.rotation.z = -t * 2.5
    }
  })

  return (
    <group position={position}>
      {/* PC Case body */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <boxGeometry args={[0.5, 1.5, 0.5]} />
        <meshStandardMaterial
          color={caseColor}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Case side panel - glass effect */}
      <mesh position={[0.251, 0.75, 0]}>
        <planeGeometry args={[0.5, 1.5]} />
        <meshStandardMaterial
          color="#1a1040"
          transparent
          opacity={0.3}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Front panel glow strip */}
      <mesh position={[0, 0.75, 0.251]}>
        <planeGeometry args={[0.04, 1.4]} />
        <meshStandardMaterial
          color={purpleColor}
          emissive={purpleColor}
          emissiveIntensity={2}
        />
      </mesh>

      {/* Top fan glow */}
      <group ref={fanRef1} position={[0, 1.4, 0]}>
        <mesh>
          <ringGeometry args={[0.12, 0.18, 32]} />
          <meshStandardMaterial
            color={cyanColor}
            emissive={cyanColor}
            emissiveIntensity={2}
            transparent
            opacity={0.7}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Fan blades */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <mesh key={i} rotation={[Math.PI / 2, 0, (angle * Math.PI) / 180]}>
            <boxGeometry args={[0.14, 0.02, 0.03]} />
            <meshStandardMaterial
              color={caseColor}
              roughness={0.5}
            />
          </mesh>
        ))}
      </group>

      {/* Bottom fan glow */}
      <group ref={fanRef2} position={[0, 0.15, 0]}>
        <mesh>
          <ringGeometry args={[0.1, 0.15, 32]} />
          <meshStandardMaterial
            color={purpleColor}
            emissive={purpleColor}
            emissiveIntensity={1.5}
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Internal RGB glow */}
      <pointLight
        position={[0, 0.75, 0]}
        intensity={0.5}
        color={purpleColor}
        distance={2}
      />

      {/* Power button */}
      <mesh position={[0, 1.35, 0.252]}>
        <circleGeometry args={[0.02, 16]} />
        <meshStandardMaterial
          color={cyanColor}
          emissive={cyanColor}
          emissiveIntensity={3}
        />
      </mesh>

      {/* USB ports */}
      {[-0.3, -0.15, 0].map((y, i) => (
        <mesh key={i} position={[0, 0.75 + y, 0.252]}>
          <boxGeometry args={[0.06, 0.02, 0.01]} />
          <meshStandardMaterial color="#1a1035" />
        </mesh>
      ))}

      {/* Case edge glow - top */}
      <mesh position={[0, 1.51, 0]}>
        <boxGeometry args={[0.52, 0.01, 0.52]} />
        <meshStandardMaterial
          color={purpleColor}
          emissive={purpleColor}
          emissiveIntensity={1}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Clickable hitbox */}
      <mesh
        position={[0, 0.75, 0]}
          onClick={(e) => {
            e.stopPropagation()
            workspace?.openByObject?.('pc')
          }}
        onPointerOver={(e) => {
          e.stopPropagation()
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto'
        }}
      >
        <boxGeometry args={[0.55, 1.55, 0.55]} />
        <meshStandardMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  )
}
