import { useMemo, useState, useEffect } from 'react'
import * as THREE from 'three'
import CodeScreenCanvas from './CodeScreenCanvas'

/**
 * MonitorScreen
 *
 * Renders the code editor as a CanvasTexture on a plane.
 * No Html component — pure Three.js mesh with canvas texture.
 */
export default function MonitorScreen({ position = [0, 0, 0] }) {
  const screenW = 2.48
  const screenH = 1.38

  const screenColor = useMemo(() => new THREE.Color('#0c1929'), [])
  const emissiveColor = useMemo(() => new THREE.Color('#1e3a5f'), [])
  const glowColor = useMemo(() => new THREE.Color('#3b82f6'), [])

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
      {/* Screen backing plane */}
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

      {/* Screen glow light */}
      <pointLight
        position={[0, 0, 0.4]}
        intensity={0.25}
        color={glowColor}
        distance={2.5}
        decay={2}
      />

      {/* Code editor canvas texture */}
      <CodeScreenCanvas screenW={screenW} screenH={screenH} />

      {/* Glass reflection overlay */}
      <mesh position={[0, 0, 0.035]}>
        <planeGeometry args={[screenW, screenH]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.025}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}
