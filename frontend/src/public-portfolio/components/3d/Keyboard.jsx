import { useMemo } from 'react'
import { useWorkspace } from './WorkspaceContext'
import * as THREE from 'three'

/**
 * Keyboard
 *
 * Mechanical keyboard with per-key RGB glow effect.
 */
export default function Keyboard({ position = [0, 0, 0] }) {
  const { openByObject } = useWorkspace()
  const keyColor = useMemo(() => new THREE.Color('#1a1035'), [])
  const purpleColor = useMemo(() => new THREE.Color('#8b5cf6'), [])
  const cyanColor = useMemo(() => new THREE.Color('#22d3ee'), [])
  const bodyColor = useMemo(() => new THREE.Color('#0f0a2a'), [])

  const keyRows = [
    { z: -0.18, keys: 14, width: 0.14 },
    { z: -0.09, keys: 14, width: 0.14 },
    { z: 0, keys: 13, width: 0.14 },
    { z: 0.09, keys: 12, width: 0.14 },
    { z: 0.18, keys: 8, width: 0.14 },
  ]

  return (
    <group position={position}>
      {/* Keyboard body */}
      <mesh position={[0, 0.02, 0]} castShadow>
        <boxGeometry args={[1.4, 0.04, 0.5]} />
        <meshStandardMaterial
          color={bodyColor}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Keyboard body edge glow */}
      <mesh position={[0, 0.02, 0.26]}>
        <boxGeometry args={[1.42, 0.02, 0.01]} />
        <meshStandardMaterial
          color={purpleColor}
          emissive={purpleColor}
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* Key rows */}
      {keyRows.map((row, rowIdx) => (
        <group key={rowIdx} position={[0, 0.045, row.z]}>
          {Array.from({ length: row.keys }).map((_, keyIdx) => {
            const totalWidth = row.keys * row.width + (row.keys - 1) * 0.01
            const startX = -totalWidth / 2 + row.width / 2
            const x = startX + keyIdx * (row.width + 0.01)
            const isAccent = (rowIdx + keyIdx) % 5 === 0

            return (
              <group key={keyIdx} position={[x, 0, 0]}>
                {/* Key cap */}
                <mesh castShadow>
                  <boxGeometry args={[row.width - 0.01, 0.025, 0.12]} />
                  <meshStandardMaterial
                    color={keyColor}
                    roughness={0.4}
                    metalness={0.3}
                  />
                </mesh>

                {/* Key glow */}
                <mesh position={[0, -0.013, 0]}>
                  <boxGeometry args={[row.width - 0.02, 0.005, 0.1]} />
                  <meshStandardMaterial
                    color={isAccent ? cyanColor : purpleColor}
                    emissive={isAccent ? cyanColor : purpleColor}
                    emissiveIntensity={isAccent ? 1.5 : 0.8}
                    transparent
                    opacity={isAccent ? 0.8 : 0.5}
                  />
                </mesh>
              </group>
            )
          })}
        </group>
      ))}

      {/* Spacebar glow */}
      <mesh position={[0, 0.02, 0.18]}>
        <boxGeometry args={[0.6, 0.005, 0.08]} />
        <meshStandardMaterial
          color={cyanColor}
          emissive={cyanColor}
          emissiveIntensity={1}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Clickable hitbox */}
      <mesh
        position={[0, 0.05, 0]}
        onClick={(e) => {
          e.stopPropagation()
          openByObject('keyboard')
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto'
        }}
      >
        <boxGeometry args={[1.5, 0.1, 0.6]} />
        <meshStandardMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  )
}
