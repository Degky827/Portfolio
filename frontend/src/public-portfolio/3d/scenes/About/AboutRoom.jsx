import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * AboutRoom
 *
 * A dark futuristic developer laboratory room.
 * Metallic floor, dark walls with neon accent strips, ambient glow.
 */
export default function AboutRoom() {
  const leftStripRef = useRef()
  const rightStripRef = useRef()
  const backStripRef = useRef()
  const ceilingStripRef = useRef()

  const colors = useMemo(() => ({
    floor: new THREE.Color('#080418'),
    floorReflect: new THREE.Color('#0c0824'),
    wall: new THREE.Color('#0a0620'),
    wallDark: new THREE.Color('#060314'),
    ceiling: new THREE.Color('#050210'),
    purple: new THREE.Color('#8b5cf6'),
    blue: new THREE.Color('#6366f1'),
    cyan: new THREE.Color('#22d3ee'),
    indigo: new THREE.Color('#4f46e5'),
    stripDim: new THREE.Color('#1e1548'),
  }), [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    const pulse = 1.5 + Math.sin(t * 1.2) * 0.5
    const pulseSlow = 1.2 + Math.sin(t * 0.8) * 0.3

    if (leftStripRef.current) {
      leftStripRef.current.material.emissiveIntensity = pulse
    }
    if (rightStripRef.current) {
      rightStripRef.current.material.emissiveIntensity = pulseSlow
    }
    if (backStripRef.current) {
      backStripRef.current.material.emissiveIntensity = pulse * 0.8
    }
    if (ceilingStripRef.current) {
      ceilingStripRef.current.material.emissiveIntensity = pulseSlow * 0.7
    }
  })

  const roomWidth = 14
  const roomDepth = 10
  const roomHeight = 6

  return (
    <group>
      {/* === FLOOR === */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[roomWidth, roomDepth]} />
        <meshStandardMaterial
          color={colors.floor}
          roughness={0.15}
          metalness={0.9}
          envMapIntensity={0.5}
        />
      </mesh>

      {/* Floor reflection overlay - slightly brighter for subtle reflection effect */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, 0]}>
        <planeGeometry args={[roomWidth, roomDepth]} />
        <meshStandardMaterial
          color={colors.floorReflect}
          roughness={0.1}
          metalness={0.95}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Floor grid lines */}
      {Array.from({ length: 15 }).map((_, i) => {
        const x = (i - 7) * 1
        return (
          <mesh key={`fx-${i}`} position={[x, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.005, roomDepth]} />
            <meshBasicMaterial color={colors.stripDim} transparent opacity={0.3} />
          </mesh>
        )
      })}
      {Array.from({ length: 11 }).map((_, i) => {
        const z = (i - 5) * 1
        return (
          <mesh key={`fz-${i}`} position={[0, 0.001, z]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
            <planeGeometry args={[0.005, roomWidth]} />
            <meshBasicMaterial color={colors.stripDim} transparent opacity={0.3} />
          </mesh>
        )
      })}

      {/* === BACK WALL === */}
      <mesh position={[0, roomHeight / 2, -roomDepth / 2]} receiveShadow>
        <planeGeometry args={[roomWidth, roomHeight]} />
        <meshStandardMaterial
          color={colors.wall}
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>

      {/* Back wall neon strip - horizontal */}
      <mesh ref={backStripRef} position={[0, 4.2, -roomDepth / 2 + 0.01]}>
        <boxGeometry args={[roomWidth - 1, 0.03, 0.02]} />
        <meshStandardMaterial
          color={colors.purple}
          emissive={colors.purple}
          emissiveIntensity={1.5}
          transparent
          opacity={0.9}
          toneMapped={false}
        />
      </mesh>

      {/* Back wall neon strip - lower */}
      <mesh position={[0, 1.5, -roomDepth / 2 + 0.01]}>
        <boxGeometry args={[roomWidth - 2, 0.02, 0.02]} />
        <meshStandardMaterial
          color={colors.blue}
          emissive={colors.blue}
          emissiveIntensity={1}
          transparent
          opacity={0.7}
          toneMapped={false}
        />
      </mesh>

      {/* Back wall vertical accent strips */}
      {[-4, -2, 2, 4].map((x, i) => (
        <mesh key={`bvs-${i}`} position={[x, roomHeight / 2, -roomDepth / 2 + 0.01]}>
          <boxGeometry args={[0.02, roomHeight - 0.5, 0.02]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? colors.indigo : colors.cyan}
            emissive={i % 2 === 0 ? colors.indigo : colors.cyan}
            emissiveIntensity={0.6}
            transparent
            opacity={0.4}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* === LEFT WALL === */}
      <mesh
        position={[-roomWidth / 2, roomHeight / 2, 0]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow
      >
        <planeGeometry args={[roomDepth, roomHeight]} />
        <meshStandardMaterial
          color={colors.wallDark}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Left wall neon strip - horizontal */}
      <mesh ref={leftStripRef} position={[-roomWidth / 2 + 0.01, 3.5, 0]}>
        <boxGeometry args={[0.02, 0.03, roomDepth - 1]} />
        <meshStandardMaterial
          color={colors.purple}
          emissive={colors.purple}
          emissiveIntensity={1.5}
          transparent
          opacity={0.9}
          toneMapped={false}
        />
      </mesh>

      {/* Left wall vertical accent */}
      <mesh position={[-roomWidth / 2 + 0.01, roomHeight / 2, -2]}>
        <boxGeometry args={[0.02, roomHeight - 1, 0.02]} />
        <meshStandardMaterial
          color={colors.cyan}
          emissive={colors.cyan}
          emissiveIntensity={0.8}
          transparent
          opacity={0.5}
          toneMapped={false}
        />
      </mesh>

      {/* === RIGHT WALL === */}
      <mesh
        position={[roomWidth / 2, roomHeight / 2, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow
      >
        <planeGeometry args={[roomDepth, roomHeight]} />
        <meshStandardMaterial
          color={colors.wallDark}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Right wall neon strip - horizontal */}
      <mesh ref={rightStripRef} position={[roomWidth / 2 - 0.01, 3.5, 0]}>
        <boxGeometry args={[0.02, 0.03, roomDepth - 1]} />
        <meshStandardMaterial
          color={colors.blue}
          emissive={colors.blue}
          emissiveIntensity={1.2}
          transparent
          opacity={0.9}
          toneMapped={false}
        />
      </mesh>

      {/* Right wall vertical accent */}
      <mesh position={[roomWidth / 2 - 0.01, roomHeight / 2, 2]}>
        <boxGeometry args={[0.02, roomHeight - 1, 0.02]} />
        <meshStandardMaterial
          color={colors.purple}
          emissive={colors.purple}
          emissiveIntensity={0.8}
          transparent
          opacity={0.5}
          toneMapped={false}
        />
      </mesh>

      {/* === CEILING === */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, roomHeight, 0]}>
        <planeGeometry args={[roomWidth, roomDepth]} />
        <meshStandardMaterial
          color={colors.ceiling}
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* Ceiling neon strip - center */}
      <mesh ref={ceilingStripRef} position={[0, roomHeight - 0.01, 0]}>
        <boxGeometry args={[0.04, 0.02, roomDepth - 2]} />
        <meshStandardMaterial
          color={colors.indigo}
          emissive={colors.indigo}
          emissiveIntensity={1}
          transparent
          opacity={0.8}
          toneMapped={false}
        />
      </mesh>

      {/* Ceiling strip - left */}
      <mesh position={[-3, roomHeight - 0.01, 0]}>
        <boxGeometry args={[0.03, 0.02, roomDepth - 3]} />
        <meshStandardMaterial
          color={colors.cyan}
          emissive={colors.cyan}
          emissiveIntensity={0.6}
          transparent
          opacity={0.5}
          toneMapped={false}
        />
      </mesh>

      {/* Ceiling strip - right */}
      <mesh position={[3, roomHeight - 0.01, 0]}>
        <boxGeometry args={[0.03, 0.02, roomDepth - 3]} />
        <meshStandardMaterial
          color={colors.purple}
          emissive={colors.purple}
          emissiveIntensity={0.6}
          transparent
          opacity={0.5}
          toneMapped={false}
        />
      </mesh>

      {/* === CORNER GLOW PILLARS === */}
      {[
        [-roomWidth / 2, 0, -roomDepth / 2],
        [roomWidth / 2, 0, -roomDepth / 2],
        [-roomWidth / 2, 0, roomDepth / 2],
        [roomWidth / 2, 0, roomDepth / 2],
      ].map((pos, i) => (
        <group key={`pillar-${i}`} position={pos}>
          <mesh position={[0, roomHeight / 2, 0]}>
            <boxGeometry args={[0.06, roomHeight, 0.06]} />
            <meshStandardMaterial
              color={i < 2 ? colors.purple : colors.cyan}
              emissive={i < 2 ? colors.purple : colors.cyan}
              emissiveIntensity={0.4}
              transparent
              opacity={0.3}
              toneMapped={false}
            />
          </mesh>
          {/* Pillar base glow */}
          <mesh position={[0, 0.05, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.08, 16]} />
            <meshStandardMaterial
              color={i < 2 ? colors.purple : colors.cyan}
              emissive={i < 2 ? colors.purple : colors.cyan}
              emissiveIntensity={2}
              transparent
              opacity={0.6}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}

      {/* === UNDER-FLOOR GLOW === */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <planeGeometry args={[roomWidth - 2, roomDepth - 2]} />
        <meshStandardMaterial
          color={colors.purple}
          emissive={colors.purple}
          emissiveIntensity={0.15}
          transparent
          opacity={0.08}
        />
      </mesh>
    </group>
  )
}
