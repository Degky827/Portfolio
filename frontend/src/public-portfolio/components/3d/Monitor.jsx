import { Suspense, useMemo } from 'react'
import { useWorkspace } from './WorkspaceContext'
import * as THREE from 'three'
import MonitorFrame from './MonitorFrame'
import MonitorScreen from './MonitorScreen'
import MonitorStand from './MonitorStand'

/**
 * Monitor
 *
 * Professional 16:9 widescreen developer monitor:
 * - Elevated above the desk (frameCenterY = 0.80) to clearly expose the long stand neck and metallic V-wing feet
 * - MonitorStand: angled metallic V-wing feet resting flat on tabletop, long metallic upright neck
 * - MonitorFrame: slim black bezel enclosure with bottom chin branding badge
 * - MonitorScreen: high-fidelity VS Code workspace
 */
export default function Monitor({ position = [0, 0, 0], screenMode = 'code', profileData }) {
  const workspace = useWorkspace()
  const frameCenterY = 0.80

  return (
    <group position={position}>
      {/* Stand base resting on desk */}
      <MonitorStand position={[0, 0, 0]} />

      {/* Monitor head - frame + screen raised above desk */}
      <group position={[0, frameCenterY, 0.04]}>
        <MonitorFrame />

        <Suspense fallback={null}>
          <MonitorScreen
            position={[0, 0, 0.01]}
            mode={screenMode}
            profileData={profileData}
          />
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
          <boxGeometry args={[1.76, 1.00, 0.08]} />
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
