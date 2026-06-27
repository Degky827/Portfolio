import { Suspense, useMemo } from 'react'
import { useWorkspace } from './WorkspaceContext'
import * as THREE from 'three'
import MonitorFrame from './MonitorFrame'
import MonitorScreen from './MonitorScreen'
import MonitorStand from './MonitorStand'

/**
 * Monitor
 *
 * Ultra-wide monitor composed of three parts:
 * - MonitorFrame: outer bezel/frame
 * - MonitorScreen: display area with Html portfolio
 * - MonitorStand: stand base and neck
 *
 * Everything (profile, text, skills, icons) renders INSIDE the monitor screen.
 */
export default function Monitor({ position = [0, 0, 0] }) {
  const workspace = useWorkspace()
  const monitorHeight = 1.5
  const standHeight = 0.44
  const baseOffset = 0.03

  const frameCenterY = baseOffset + standHeight + monitorHeight / 2

  const hoverColor = useMemo(() => new THREE.Color('#8b5cf6'), [])

  return (
    <group position={position}>
      {/* Stand */}
      <MonitorStand position={[0, 0, 0]} />

      {/* Monitor head - frame + screen */}
      <group position={[0, frameCenterY, 0.1]}>
        {/* Frame */}
        <MonitorFrame />

        {/* Screen with Html content */}
        <Suspense fallback={null}>
          <MonitorScreen position={[0, 0, 0.01]} />
        </Suspense>

        {/* Clickable hitbox */}
        <mesh
          position={[0, 0, 0.05]}
          onClick={(e) => {
            e.stopPropagation()
            workspace?.openByObject?.('monitor')
          }}
          onPointerOver={(e) => {
            e.stopPropagation()
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={() => {
            document.body.style.cursor = 'auto'
          }}
        >
          <boxGeometry args={[2.6, 1.5, 0.1]} />
          <meshStandardMaterial
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
      </group>
    </group>
  )
}
