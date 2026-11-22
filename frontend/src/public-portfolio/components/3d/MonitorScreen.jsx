import { useMemo, useState, useEffect } from 'react'
import * as THREE from 'three'
import CodeScreenCanvas from './CodeScreenCanvas'
import PortfolioDashboardScreen from './PortfolioDashboardScreen'
import PortfolioPreviewScreen from './PortfolioPreviewScreen'

/**
 * MonitorScreen
 *
 * Renders content on the monitor screen as a CanvasTexture.
 * Proportioned to fit precisely within the MonitorFrame (1.72 x 0.95).
 */
export default function MonitorScreen({ position = [0, 0, 0], mode = 'code', profileData }) {
  const screenW = 1.72
  const screenH = 0.95

  const screenColor = useMemo(() => new THREE.Color('#0b0f17'), [])
  const emissiveColor = useMemo(() => new THREE.Color('#131822'), [])
  const glowColor = useMemo(() => new THREE.Color('#6C2BFF'), [])

  const [glowIntensity, setGlowIntensity] = useState(0.25)

  useEffect(() => {
    const id = setInterval(() => {
      if (Math.random() > 0.88) {
        setGlowIntensity(0.20 + Math.random() * 0.12)
        setTimeout(() => setGlowIntensity(0.25), 80)
      }
    }, 300)
    return () => clearInterval(id)
  }, [])

  return (
    <group position={position}>
      {/* Screen backing plane */}
      <mesh position={[0, 0, -0.004]}>
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
        position={[0, 0, 0.35]}
        intensity={0.35}
        color={glowColor}
        distance={2.0}
        decay={2}
      />

      {/* Screen Content */}
      {mode === 'code' ? (
        <CodeScreenCanvas screenW={screenW} screenH={screenH} />
      ) : mode === 'preview' ? (
        <PortfolioPreviewScreen />
      ) : (
        <PortfolioDashboardScreen profileData={profileData} />
      )}
    </group>
  )
}
