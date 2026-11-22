import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useWorkspace } from './WorkspaceContext'
import * as THREE from 'three'

/**
 * PC
 *
 * Professional Developer PC Tower matching Image 1:
 * - Matte black chassis with tempered glass side panel
 * - FRONT PANEL WITH 3 CIRCULAR GLOWING ELECTRIC CYAN-BLUE INTAKE FANS (stacked vertically)
 * - Rotating fan blades with cyan-blue LED rings (#0084FF / #00B4D8)
 * - Glowing interior hardware components visible through tempered glass
 */
export default function PC({ position = [0, 0, 0] }) {
  const workspace = useWorkspace()
  const topFanRef = useRef()
  const midFanRef = useRef()
  const bottomFanRef = useRef()

  const blueGlow = useMemo(() => new THREE.Color('#0088FF'), [])
  const cyanRing = useMemo(() => new THREE.Color('#00C8FF'), [])
  const bladeColor = useMemo(() => new THREE.Color('#0070D0'), [])
  const caseColor = useMemo(() => new THREE.Color('#0d0e12'), [])
  const internalColor = useMemo(() => new THREE.Color('#07080b'), [])
  const glassTint = useMemo(() => new THREE.Color('#101824'), [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (topFanRef.current) topFanRef.current.rotation.z = t * 2.8
    if (midFanRef.current) midFanRef.current.rotation.z = t * 2.8
    if (bottomFanRef.current) bottomFanRef.current.rotation.z = t * 2.8
  })

  // Fan component helper matching the 3 prominent circular fans in Image 1
  const renderFan = (ref, yPos) => (
    <group position={[0, yPos, 0.301]}>
      {/* Dark recessed fan intake backplate */}
      <mesh position={[0, 0, 0.001]}>
        <circleGeometry args={[0.088, 36]} />
        <meshStandardMaterial color="#08090c" roughness={0.7} />
      </mesh>

      {/* Outer prominent illuminated LED halo ring in Electric Cyan-Blue */}
      <mesh position={[0, 0, 0.002]}>
        <ringGeometry args={[0.066, 0.086, 40]} />
        <meshBasicMaterial
          color={cyanRing}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Fan hub center */}
      <mesh position={[0, 0, 0.004]}>
        <circleGeometry args={[0.024, 24]} />
        <meshStandardMaterial color="#121318" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Center glowing LED pip on fan hub */}
      <mesh position={[0, 0, 0.005]}>
        <circleGeometry args={[0.006, 16]} />
        <meshBasicMaterial color={cyanRing} />
      </mesh>

      {/* Rotating fan blades */}
      <group ref={ref} position={[0, 0, 0.003]}>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <mesh key={i} rotation={[0, 0, (angle * Math.PI) / 180]}>
            <boxGeometry args={[0.076, 0.016, 0.003]} />
            <meshStandardMaterial
              color={bladeColor}
              emissive={blueGlow}
              emissiveIntensity={1.2}
              transparent
              opacity={0.88}
            />
          </mesh>
        ))}
      </group>
    </group>
  )

  return (
    <group position={position}>
      {/* ── 4 Case Rubber Feet (resting on desk at y = 0) ── */}
      {[
        [-0.15, 0.008, 0.24],
        [0.15, 0.008, 0.24],
        [-0.15, 0.008, -0.24],
        [0.15, 0.008, -0.24],
      ].map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <cylinderGeometry args={[0.018, 0.018, 0.016, 16]} />
          <meshStandardMaterial color="#050505" roughness={0.9} />
        </mesh>
      ))}

      {/* ── Main Chassis Body in Matte Black ── */}
      <mesh position={[0, 0.416, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.38, 0.80, 0.58]} />
        <meshStandardMaterial
          color={caseColor}
          roughness={0.4}
          metalness={0.65}
        />
      </mesh>

      {/* ── Front Face Panel in Deep Black ── */}
      <mesh position={[0, 0.416, 0.291]} castShadow>
        <boxGeometry args={[0.378, 0.798, 0.018]} />
        <meshStandardMaterial
          color="#08090c"
          roughness={0.45}
          metalness={0.55}
        />
      </mesh>

      {/* ── Top Blue Logo Badge ── */}
      <mesh position={[0, 0.74, 0.301]}>
        <boxGeometry args={[0.032, 0.024, 0.002]} />
        <meshBasicMaterial color={cyanRing} />
      </mesh>

      {/* ── 3 Circular Glowing Electric Blue Fans stacked vertically (Matching Image 1) ── */}
      {renderFan(topFanRef, 0.58)}
      {renderFan(midFanRef, 0.39)}
      {renderFan(bottomFanRef, 0.20)}

      {/* ── Left Tempered Glass Side Panel ── */}
      <mesh position={[-0.191, 0.416, 0]}>
        <boxGeometry args={[0.008, 0.776, 0.556]} />
        <meshPhysicalMaterial
          color={glassTint}
          transparent
          opacity={0.35}
          roughness={0.1}
          metalness={0.1}
          transmission={0.65}
          thickness={0.02}
        />
      </mesh>

      {/* ── Internal Hardware Components (Visible through Glass) ── */}
      <group position={[-0.04, 0.416, 0]}>
        {/* Motherboard Tray */}
        <mesh position={[0.13, 0, 0]}>
          <boxGeometry args={[0.01, 0.68, 0.48]} />
          <meshStandardMaterial color={internalColor} roughness={0.7} />
        </mesh>

        {/* Graphics Card (GPU) with glowing blue edge */}
        <mesh position={[0.02, -0.06, 0.02]} castShadow>
          <boxGeometry args={[0.18, 0.075, 0.32]} />
          <meshStandardMaterial color="#121319" roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh position={[-0.072, -0.06, 0.02]}>
          <boxGeometry args={[0.004, 0.014, 0.28]} />
          <meshBasicMaterial color={cyanRing} />
        </mesh>

        {/* Liquid Cooler AIO CPU Block glowing blue */}
        <mesh position={[0.08, 0.14, -0.02]}>
          <cylinderGeometry args={[0.042, 0.042, 0.038, 24]} />
          <meshStandardMaterial
            color={cyanRing}
            emissive={blueGlow}
            emissiveIntensity={2.0}
          />
        </mesh>

        {/* RAM Sticks with glowing blue light bars */}
        {[-0.02, 0.01].map((zOffset, i) => (
          <mesh key={i} position={[0.08, 0.17, 0.06 + zOffset]}>
            <boxGeometry args={[0.01, 0.048, 0.016]} />
            <meshBasicMaterial color={cyanRing} />
          </mesh>
        ))}

        {/* Power Supply (PSU) Shroud */}
        <mesh position={[0, -0.32, 0]}>
          <boxGeometry args={[0.26, 0.14, 0.52]} />
          <meshStandardMaterial color="#0a0b0e" roughness={0.6} />
        </mesh>
      </group>

      {/* Internal Blue Ambient Light casting through glass onto desk */}
      <pointLight
        position={[-0.12, 0.40, 0]}
        intensity={0.8}
        color={blueGlow}
        distance={1.6}
        decay={2}
      />
    </group>
  )
}
