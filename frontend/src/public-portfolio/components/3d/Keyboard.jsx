import { useMemo } from 'react'
import { useWorkspace } from './WorkspaceContext'
import * as THREE from 'three'

/**
 * Keyboard
 *
 * Centered backlit mechanical keyboard in refined matte charcoal black finish,
 * floating mechanical keycaps, and glowing purple (#6C2BFF) underglow bed.
 * Proportioned to match the reference workstation (width ~0.82, depth ~0.24).
 */
export default function Keyboard({ position = [0, 0, 0] }) {
  const workspace = useWorkspace()
  const keyColor = useMemo(() => new THREE.Color('#14151a'), [])
  const bluePrimary = useMemo(() => new THREE.Color('#0084FF'), [])
  const blueSoft = useMemo(() => new THREE.Color('#38BDF8'), [])
  const bodyColor = useMemo(() => new THREE.Color('#0b0c10'), [])

  const keyRows = [
    { z: -0.08, keys: 14, width: 0.052 },
    { z: -0.04, keys: 14, width: 0.052 },
    { z: 0.00, keys: 13, width: 0.052 },
    { z: 0.04, keys: 12, width: 0.052 },
    { z: 0.08, keys: 7, width: 0.052 },
  ]

  return (
    <group position={position}>
      {/* ── Keyboard Chassis Body in Matte Charcoal Black ── */}
      <mesh position={[0, 0.008, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.82, 0.016, 0.24]} />
        <meshStandardMaterial
          color={bodyColor}
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>

      {/* ── Front Wrist Edge Bevel ── */}
      <mesh position={[0, 0.006, 0.121]}>
        <boxGeometry args={[0.816, 0.012, 0.004]} />
        <meshStandardMaterial color="#101116" roughness={0.35} metalness={0.65} />
      </mesh>

      {/* ── Flat Horizontal Key Underglow Bed (Lying flat, NO vertical artifact) ── */}
      <mesh position={[0, 0.016, 0]}>
        <boxGeometry args={[0.80, 0.002, 0.22]} />
        <meshStandardMaterial
          color={bluePrimary}
          emissive={bluePrimary}
          emissiveIntensity={2.5}
          transparent
          opacity={0.80}
        />
      </mesh>

      {/* ── Floating Mechanical Keycap Rows in Charcoal Black PBT ── */}
      {keyRows.map((row, rowIdx) => (
        <group key={rowIdx} position={[0, 0.021, row.z]}>
          {Array.from({ length: row.keys }).map((_, keyIdx) => {
            const totalWidth = row.keys * row.width + (row.keys - 1) * 0.005
            const startX = -totalWidth / 2 + row.width / 2
            const x = startX + keyIdx * (row.width + 0.005)

            return (
              <group key={keyIdx} position={[x, 0, 0]}>
                {/* Floating keycap */}
                <mesh castShadow>
                  <boxGeometry args={[row.width - 0.006, 0.010, 0.034]} />
                  <meshStandardMaterial
                    color={keyColor}
                    roughness={0.5}
                    metalness={0.2}
                  />
                </mesh>
                {/* Micro switch stem glow under keycap */}
                <mesh position={[0, -0.004, 0]}>
                  <boxGeometry args={[0.012, 0.004, 0.012]} />
                  <meshStandardMaterial
                    color={blueSoft}
                    emissive={blueSoft}
                    emissiveIntensity={2.8}
                  />
                </mesh>
              </group>
            )
          })}
        </group>
      ))}

      {/* ── Spacebar Key & Blue LED Accent Bar ── */}
      <mesh position={[0, 0.022, 0.08]} castShadow>
        <boxGeometry args={[0.26, 0.010, 0.034]} />
        <meshStandardMaterial
          color={keyColor}
          roughness={0.5}
          metalness={0.2}
        />
      </mesh>
      <mesh position={[0, 0.028, 0.08]}>
        <boxGeometry args={[0.22, 0.002, 0.006]} />
        <meshStandardMaterial
          color={blueSoft}
          emissive={blueSoft}
          emissiveIntensity={3.0}
        />
      </mesh>

      {/* ── Keyboard Interactive Hitbox ── */}
      <mesh
        position={[0, 0.02, 0]}
        onClick={(e) => {
          e.stopPropagation()
          workspace?.openByObject?.('keyboard')
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto'
        }}
      >
        <boxGeometry args={[0.84, 0.04, 0.26]} />
        <meshStandardMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  )
}
