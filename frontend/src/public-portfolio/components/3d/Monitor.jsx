import { Suspense } from 'react'
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
  const monitorHeight = 1.5
  const standHeight = 0.44
  const baseOffset = 0.03

  const frameCenterY = baseOffset + standHeight + monitorHeight / 2

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
      </group>
    </group>
  )
}
