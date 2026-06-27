import { useMemo, useState, useEffect } from 'react'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import PortfolioScreen from './PortfolioScreen'
import CodeEditorScreen from './CodeEditorScreen'

/**
 * MonitorScreen
 *
 * A flat plane slightly recessed inside the bezel that displays
 * either the PortfolioScreen or CodeEditorScreen using drei Html transform.
 *
 * Props:
 *   mode: "portfolio" | "code" — which screen to render (default: "code")
 */
export default function MonitorScreen({ position = [0, 0, 0], mode = 'code' }) {
  const screenW = 2.48
  const screenH = 1.38

  const screenColor = useMemo(() => new THREE.Color('#0c1929'), [])
  const emissiveColor = useMemo(() => new THREE.Color('#1e3a5f'), [])
  const glowColor = useMemo(() => new THREE.Color('#3b82f6'), [])

  /* Subtle flicker for screen glow */
  const [glowIntensity, setGlowIntensity] = useState(0.35)

  useEffect(() => {
    const id = setInterval(() => {
      if (Math.random() > 0.88) {
        setGlowIntensity(0.28 + Math.random() * 0.14)
        setTimeout(() => setGlowIntensity(0.35), 80)
      }
    }, 300)
    return () => clearInterval(id)
  }, [])

  return (
    <group position={position}>
      {/* Screen backing plane - dark material */}
      <mesh position={[0, 0, -0.005]}>
        <planeGeometry args={[screenW, screenH]} />
        <meshStandardMaterial
          color={screenColor}
          emissive={emissiveColor}
          emissiveIntensity={glowIntensity}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Screen glow - soft light emitted from the screen */}
      <pointLight
        position={[0, 0, 0.4]}
        intensity={0.2}
        color={glowColor}
        distance={2.5}
        decay={2}
      />

      {/* Screen reflection - semi-transparent glossy overlay */}
      <mesh position={[0, 0, 0.008]}>
        <planeGeometry args={[screenW, screenH]} />
        <meshPhysicalMaterial
          transparent
          opacity={0.03}
          roughness={0.05}
          metalness={0.9}
          color="#ffffff"
          envMapIntensity={0.5}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Screen edge highlight - top */}
      <mesh position={[0, screenH / 2 - 0.005, 0.007]}>
        <boxGeometry args={[screenW, 0.004, 0.001]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.06} />
      </mesh>

      {/* Screen edge highlight - bottom */}
      <mesh position={[0, -screenH / 2 + 0.005, 0.007]}>
        <boxGeometry args={[screenW, 0.004, 0.001]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.04} />
      </mesh>

      {/* Portfolio UI or Code Editor - Html transform placed on the screen plane */}
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
        {mode === 'code' ? <CodeEditorScreen /> : <PortfolioScreen />}
      </Html>
    </group>
  )
}
