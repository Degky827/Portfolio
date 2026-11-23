import { useMemo } from 'react'
import * as THREE from 'three'

/**
 * MonitorStand
 *
 * Professional widescreen developer monitor stand matching Target Reference Image:
 * - Solid, wide flat rectangular platform base sitting firmly on the wood tabletop
 * - Subtle beveled chamfer and anti-slip rubber pads
 * - Sturdy upright cylindrical matte-black metallic neck column
 * - Heavy-duty VESA hinge mount securely lifting the monitor high above the desk
 */
export default function MonitorStand({ position = [0, 0, 0], frameCenterY = 0.68 }) {
  const metallicDark = useMemo(() => new THREE.Color('#141720'), [])
  const metallicChamfer = useMemo(() => new THREE.Color('#222734'), [])
  const metallicNeck = useMemo(() => new THREE.Color('#1c202a'), [])
  const footPadColor = useMemo(() => new THREE.Color('#08090c'), [])

  // Calculate neck span based on elevated frameCenterY
  const baseTopY = 0.015
  const hingeCenterY = frameCenterY - 0.04
  const neckHeight = hingeCenterY - baseTopY
  const neckCenterY = baseTopY + neckHeight / 2

  return (
    <group position={position}>
      {/* ── Solid Flat Rectangular Stand Base Platform (resting flat on table) ── */}
      <group position={[0, 0, 0.02]}>
        {/* Main flat base slab */}
        <mesh position={[0, 0.007, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.44, 0.014, 0.22]} />
          <meshStandardMaterial
            color={metallicDark}
            roughness={0.35}
            metalness={0.80}
          />
        </mesh>

        {/* Top chamfer / recessed highlight tier */}
        <mesh position={[0, 0.0145, 0]}>
          <boxGeometry args={[0.418, 0.002, 0.198]} />
          <meshStandardMaterial
            color={metallicChamfer}
            roughness={0.25}
            metalness={0.88}
          />
        </mesh>

        {/* Rubber contact feet pads under base corners */}
        <mesh position={[-0.19, -0.001, -0.08]}>
          <boxGeometry args={[0.035, 0.004, 0.035]} />
          <meshStandardMaterial color={footPadColor} roughness={0.9} />
        </mesh>
        <mesh position={[0.19, -0.001, -0.08]}>
          <boxGeometry args={[0.035, 0.004, 0.035]} />
          <meshStandardMaterial color={footPadColor} roughness={0.9} />
        </mesh>
        <mesh position={[-0.19, -0.001, 0.08]}>
          <boxGeometry args={[0.035, 0.004, 0.035]} />
          <meshStandardMaterial color={footPadColor} roughness={0.9} />
        </mesh>
        <mesh position={[0.19, -0.001, 0.08]}>
          <boxGeometry args={[0.035, 0.004, 0.035]} />
          <meshStandardMaterial color={footPadColor} roughness={0.9} />
        </mesh>
      </group>

      {/* ── Sturdy Cylindrical Neck Column (elevating monitor cleanly above desk) ── */}
      <group position={[0, 0, -0.035]}>
        {/* Base collar transitioning from flat plate to cylinder */}
        <mesh position={[0, 0.022, 0]} castShadow>
          <cylinderGeometry args={[0.054, 0.065, 0.020, 36]} />
          <meshStandardMaterial
            color={metallicChamfer}
            roughness={0.30}
            metalness={0.85}
          />
        </mesh>

        {/* Main sturdy metallic vertical neck cylinder */}
        <mesh position={[0, neckCenterY, 0]} castShadow>
          <cylinderGeometry args={[0.044, 0.048, neckHeight, 36]} />
          <meshStandardMaterial
            color={metallicNeck}
            roughness={0.28}
            metalness={0.85}
          />
        </mesh>

        {/* Top neck collar */}
        <mesh position={[0, hingeCenterY - 0.02, 0]} castShadow>
          <cylinderGeometry args={[0.050, 0.046, 0.024, 36]} />
          <meshStandardMaterial
            color={metallicChamfer}
            roughness={0.30}
            metalness={0.85}
          />
        </mesh>

        {/* Heavy-duty VESA hinge mount hub */}
        <mesh position={[0, hingeCenterY, 0.015]} castShadow>
          <boxGeometry args={[0.11, 0.09, 0.06]} />
          <meshStandardMaterial
            color={metallicDark}
            roughness={0.35}
            metalness={0.80}
          />
        </mesh>

        {/* VESA Mounting Bracket plate behind monitor */}
        <mesh position={[0, hingeCenterY, 0.042]} castShadow>
          <boxGeometry args={[0.18, 0.18, 0.016]} />
          <meshStandardMaterial
            color="#0a0b10"
            roughness={0.4}
            metalness={0.7}
          />
        </mesh>
      </group>
    </group>
  )
}
