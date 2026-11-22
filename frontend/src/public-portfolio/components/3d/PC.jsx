import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useWorkspace } from './WorkspaceContext'
import * as THREE from 'three'

/**
 * PC
 *
 * Professional Developer PC Tower in matte charcoal black matching the reference workstation:
 * - Dark charcoal black chassis (Width 0.38, Height 0.82, Depth 0.58)
 * - 4 Rubber feet resting flat on desk
 * - Dual large circular glowing purple (#6C2BFF) intake fans on the front panel with rotating blades
 * - Front emblem badge glowing purple
 * - Top dual antennas standing upright at the rear
 * - Tempered glass side panel with internal glowing hardware (GPU, RAM, AIO pump)
 */
export default function PC({ position = [0, 0, 0] }) {
  const workspace = useWorkspace()
  const topFanRef = useRef()
  const bottomFanRef = useRef()

  const purplePrimary = useMemo(() => new THREE.Color('#6C2BFF'), [])
  const purpleSecondary = useMemo(() => new THREE.Color('#8B5CF6'), [])
  const purpleVibrant = useMemo(() => new THREE.Color('#A855F7'), [])
  const caseColor = useMemo(() => new THREE.Color('#0d0e12'), [])
  const internalColor = useMemo(() => new THREE.Color('#07080b'), [])
  const glassTint = useMemo(() => new THREE.Color('#141022'), [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (topFanRef.current) {
      topFanRef.current.rotation.z = t * 2.8
    }
    if (bottomFanRef.current) {
      bottomFanRef.current.rotation.z = t * 2.8
    }
  })

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

      {/* ── Main Chassis Body in Matte Charcoal Black ── */}
      <mesh position={[0, 0.416, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.38, 0.80, 0.58]} />
        <meshStandardMaterial
          color={caseColor}
          roughness={0.4}
          metalness={0.65}
        />
      </mesh>

      {/* ── Front Face Panel in Deep Charcoal Black ── */}
      <mesh position={[0, 0.416, 0.291]} castShadow>
        <boxGeometry args={[0.378, 0.798, 0.018]} />
        <meshStandardMaterial
          color="#08090c"
          roughness={0.45}
          metalness={0.55}
        />
      </mesh>

      {/* ── Top Circular Glowing Purple Fan (Center at y = 0.57) ── */}
      <group position={[0, 0.57, 0.302]}>
        {/* Outer illuminated LED halo ring */}
        <mesh>
          <ringGeometry args={[0.082, 0.118, 40]} />
          <meshStandardMaterial
            color={purpleVibrant}
            emissive={purplePrimary}
            emissiveIntensity={3.5}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Fan hub center in Charcoal Black */}
        <mesh position={[0, 0, 0.004]}>
          <circleGeometry args={[0.032, 24]} />
          <meshStandardMaterial color="#101116" roughness={0.3} />
        </mesh>
        {/* Rotating fan blades */}
        <group ref={topFanRef}>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <mesh key={i} rotation={[0, 0, (angle * Math.PI) / 180]}>
              <boxGeometry args={[0.10, 0.016, 0.004]} />
              <meshStandardMaterial
                color={purpleSecondary}
                emissive={purpleSecondary}
                emissiveIntensity={0.8}
                transparent
                opacity={0.85}
              />
            </mesh>
          ))}
        </group>
      </group>

      {/* ── Bottom Circular Glowing Purple Fan (Center at y = 0.28) ── */}
      <group position={[0, 0.28, 0.302]}>
        {/* Outer illuminated LED halo ring */}
        <mesh>
          <ringGeometry args={[0.082, 0.118, 40]} />
          <meshStandardMaterial
            color={purpleVibrant}
            emissive={purplePrimary}
            emissiveIntensity={3.5}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Fan hub center in Charcoal Black */}
        <mesh position={[0, 0, 0.004]}>
          <circleGeometry args={[0.032, 24]} />
          <meshStandardMaterial color="#101116" roughness={0.3} />
        </mesh>
        {/* Rotating fan blades */}
        <group ref={bottomFanRef}>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <mesh key={i} rotation={[0, 0, (angle * Math.PI) / 180]}>
              <boxGeometry args={[0.10, 0.016, 0.004]} />
              <meshStandardMaterial
                color={purpleSecondary}
                emissive={purpleSecondary}
                emissiveIntensity={0.8}
                transparent
                opacity={0.85}
              />
            </mesh>
          ))}
        </group>
      </group>

      {/* ── Front Bottom Brand Logo Emblem ── */}
      <mesh position={[0, 0.095, 0.302]}>
        <planeGeometry args={[0.052, 0.032]} />
        <meshStandardMaterial
          color={purpleVibrant}
          emissive={purplePrimary}
          emissiveIntensity={2.5}
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* ── Left Tempered Glass Side Panel ── */}
      <mesh position={[-0.191, 0.416, 0]}>
        <planeGeometry args={[0.55, 0.78]} />
        <meshStandardMaterial
          color={glassTint}
          transparent
          opacity={0.38}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* ── Internal Hardware Components (Visible through Glass) ── */}
      <group position={[-0.04, 0.416, 0]}>
        {/* Motherboard Backplane */}
        <mesh position={[0.11, 0, -0.04]}>
          <boxGeometry args={[0.02, 0.65, 0.44]} />
          <meshStandardMaterial color={internalColor} roughness={0.6} metalness={0.3} />
        </mesh>

        {/* GPU graphics card with illuminated edge */}
        <mesh position={[0, -0.08, 0]}>
          <boxGeometry args={[0.18, 0.052, 0.34]} />
          <meshStandardMaterial color="#121319" roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh position={[-0.091, -0.08, 0]}>
          <boxGeometry args={[0.004, 0.018, 0.30]} />
          <meshStandardMaterial
            color={purpleVibrant}
            emissive={purplePrimary}
            emissiveIntensity={2.6}
          />
        </mesh>

        {/* Dual RAM Sticks with Purple LED bars */}
        <mesh position={[0.06, 0.17, 0.04]}>
          <boxGeometry args={[0.012, 0.065, 0.02]} />
          <meshStandardMaterial
            color={purpleSecondary}
            emissive={purpleSecondary}
            emissiveIntensity={2.8}
          />
        </mesh>
        <mesh position={[0.06, 0.17, 0.08]}>
          <boxGeometry args={[0.012, 0.065, 0.02]} />
          <meshStandardMaterial
            color={purpleSecondary}
            emissive={purpleSecondary}
            emissiveIntensity={2.8}
          />
        </mesh>

        {/* CPU AIO Cooler Block with glowing ring */}
        <mesh position={[0.07, 0.12, -0.04]}>
          <cylinderGeometry args={[0.042, 0.042, 0.03, 24]} />
          <meshStandardMaterial
            color={purpleVibrant}
            emissive={purplePrimary}
            emissiveIntensity={2.2}
          />
        </mesh>
      </group>

      {/* ── Internal Point Light for Consistent Purple Ambient Glow ── */}
      <pointLight
        position={[-0.06, 0.416, 0.05]}
        intensity={0.8}
        color={purplePrimary}
        distance={1.8}
        decay={2}
      />

      {/* ── Top Panel Details & Power LED ── */}
      <mesh position={[0, 0.817, 0.22]}>
        <cylinderGeometry args={[0.008, 0.008, 0.004, 16]} />
        <meshStandardMaterial
          color={purplePrimary}
          emissive={purplePrimary}
          emissiveIntensity={3}
        />
      </mesh>

      {/* ── Dual Top Wi-Fi / Bluetooth Antenna Sticks (Rear) ── */}
      <group position={[0, 0.816, -0.20]}>
        <mesh position={[-0.04, 0.075, 0]} rotation={[0.05, 0, -0.06]} castShadow>
          <cylinderGeometry args={[0.004, 0.006, 0.15, 12]} />
          <meshStandardMaterial color="#06070a" roughness={0.4} metalness={0.7} />
        </mesh>
        <mesh position={[0.04, 0.075, 0]} rotation={[0.05, 0, 0.06]} castShadow>
          <cylinderGeometry args={[0.004, 0.006, 0.15, 12]} />
          <meshStandardMaterial color="#06070a" roughness={0.4} metalness={0.7} />
        </mesh>
      </group>

      {/* ── Clickable Workspace Hitbox ── */}
      <mesh
        position={[0, 0.416, 0]}
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
        <boxGeometry args={[0.42, 0.84, 0.62]} />
        <meshStandardMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  )
}
