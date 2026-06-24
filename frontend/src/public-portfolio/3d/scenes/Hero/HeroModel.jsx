import { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

/**
 * HeroModel
 *
 * 3D photo frame with profile image, floating with animation.
 * Text overlays on top of the photo.
 */
export default function HeroModel({ sectionProgress = 0, mouseRef, modelScale = 1, profilePhotoUrl }) {
  const groupRef = useRef()
  const frameRef = useRef()
  const ringRef = useRef()
  const orbRef = useRef()
  const [texture, setTexture] = useState(null)

  const indigoColor = useMemo(() => new THREE.Color('#6366f1'), [])
  const cyanColor = useMemo(() => new THREE.Color('#22d3ee'), [])
  const violetColor = useMemo(() => new THREE.Color('#8b5cf6'), [])

  // Load profile photo texture
  useEffect(() => {
    if (!profilePhotoUrl) return
    let cancelled = false
    const loader = new THREE.TextureLoader()
    loader.load(
      profilePhotoUrl,
      (tex) => {
        if (!cancelled) {
          tex.colorSpace = THREE.SRGBColorSpace
          tex.minFilter = THREE.LinearFilter
          tex.magFilter = THREE.LinearFilter
          setTexture(tex)
        }
      },
      undefined,
      () => {}
    )
    return () => { cancelled = true }
  }, [profilePhotoUrl])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    const mx = mouseRef?.current?.x || 0
    const my = mouseRef?.current?.y || 0

    // Frame follows mouse
    if (frameRef.current) {
      frameRef.current.rotation.y = THREE.MathUtils.lerp(
        frameRef.current.rotation.y,
        mx * 0.1,
        0.04
      )
      frameRef.current.rotation.x = THREE.MathUtils.lerp(
        frameRef.current.rotation.x,
        my * 0.06,
        0.04
      )
    }

    if (ringRef.current) {
      ringRef.current.rotation.x = t * 0.12
      ringRef.current.rotation.z = t * 0.08
    }

    if (orbRef.current) {
      orbRef.current.position.x = Math.sin(t * 0.5) * 2.2
      orbRef.current.position.y = Math.cos(t * 0.3) * 1.2
      orbRef.current.position.z = Math.sin(t * 0.4) * 1.0
    }

    // Scroll exit
    if (groupRef.current) {
      const exitOffset = sectionProgress * 4
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        -exitOffset,
        0.08
      )
      groupRef.current.rotation.y = sectionProgress * 0.4
    }
  })

  return (
    <group ref={groupRef} scale={modelScale}>
      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.5}>
        <group ref={frameRef} position={[0, 0, 0]}>
          {/* Outer frame border - glowing edges */}
          <mesh position={[0, 0, -0.02]}>
            <planeGeometry args={[2.8, 3.6]} />
            <meshBasicMaterial color="#0f0a2a" />
          </mesh>

          {/* Frame border - top */}
          <mesh position={[0, 1.82, 0]}>
            <boxGeometry args={[2.85, 0.06, 0.06]} />
            <meshStandardMaterial color={cyanColor} emissive={cyanColor} emissiveIntensity={2.5} />
          </mesh>
          {/* Frame border - bottom */}
          <mesh position={[0, -1.82, 0]}>
            <boxGeometry args={[2.85, 0.06, 0.06]} />
            <meshStandardMaterial color={indigoColor} emissive={indigoColor} emissiveIntensity={2.5} />
          </mesh>
          {/* Frame border - left */}
          <mesh position={[-1.42, 0, 0]}>
            <boxGeometry args={[0.06, 3.7, 0.06]} />
            <meshStandardMaterial color={violetColor} emissive={violetColor} emissiveIntensity={2} />
          </mesh>
          {/* Frame border - right */}
          <mesh position={[1.42, 0, 0]}>
            <boxGeometry args={[0.06, 3.7, 0.06]} />
            <meshStandardMaterial color={violetColor} emissive={violetColor} emissiveIntensity={2} />
          </mesh>

          {/* Profile photo */}
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[2.6, 3.4]} />
            {texture ? (
              <meshBasicMaterial map={texture} transparent opacity={1} />
            ) : (
              <meshBasicMaterial color="#1e1b4b" transparent opacity={0.6} />
            )}
          </mesh>

          {/* Subtle glass overlay */}
          <mesh position={[0, 0, 0.02]}>
            <planeGeometry args={[2.6, 3.4]} />
            <meshBasicMaterial color="#6366f1" transparent opacity={0.08} />
          </mesh>
        </group>
      </Float>

      {/* Orbiting ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[3.0, 0.012, 16, 100]} />
        <meshStandardMaterial color={cyanColor} emissive={cyanColor} emissiveIntensity={1.5} transparent opacity={0.5} />
      </mesh>

      {/* Second ring */}
      <mesh rotation={[Math.PI / 3, 0, Math.PI / 6]}>
        <torusGeometry args={[3.4, 0.008, 16, 100]} />
        <meshStandardMaterial color={indigoColor} emissive={indigoColor} emissiveIntensity={1} transparent opacity={0.3} />
      </mesh>

      {/* Orbital sphere */}
      <mesh ref={orbRef}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color={cyanColor} emissive={cyanColor} emissiveIntensity={3} />
      </mesh>

      {/* Corner accents */}
      {[
        [-1.6, 2.0, 0.3],
        [1.6, -2.0, 0.3],
        [-1.4, -1.8, -0.3],
        [1.4, 1.8, -0.3],
      ].map((pos, i) => (
        <Float key={i} speed={2 + i * 0.3} rotationIntensity={0} floatIntensity={0.3}>
          <mesh position={pos}>
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? indigoColor : cyanColor}
              emissive={i % 2 === 0 ? indigoColor : cyanColor}
              emissiveIntensity={2}
            />
          </mesh>
        </Float>
      ))}
    </group>
  )
}
