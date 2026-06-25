import { useMemo } from 'react'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import PortfolioScreen from './PortfolioScreen'

/**
 * MonitorScreen
 *
 * A flat plane slightly recessed inside the bezel that displays
 * the portfolio UI using drei Html transform.
 * The Html is positioned exactly on the screen plane.
 */
export default function MonitorScreen({ position = [0, 0, 0] }) {
  const screenW = 2.48
  const screenH = 1.38

  const screenColor = useMemo(() => new THREE.Color('#05040a'), [])
  const emissiveColor = useMemo(() => new THREE.Color('#1d1035'), [])

  return (
    <group position={position}>
      {/* Screen backing plane - dark material */}
      <mesh position={[0, 0, -0.005]}>
        <planeGeometry args={[screenW, screenH]} />
        <meshStandardMaterial
          color={screenColor}
          emissive={emissiveColor}
          emissiveIntensity={0.3}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Portfolio UI - Html transform placed on the screen plane */}
      <Html
        transform
        occlude
        distanceFactor={1.55}
        position={[0, 0, 0.02]}
        rotation={[0, 0, 0]}
        style={{
          width: '1280px',
          height: '720px',
          pointerEvents: 'none',
        }}
      >
        <PortfolioScreen />
      </Html>
    </group>
  )
}
