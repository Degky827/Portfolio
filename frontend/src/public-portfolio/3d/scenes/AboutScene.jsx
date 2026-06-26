import { useRef, useMemo, Suspense } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Text, Float } from '@react-three/drei'
import * as THREE from 'three'
import useAboutData from '../hooks/useAboutData'
import useMousePosition from '../hooks/useMousePosition'
import AboutRoom from './About/AboutRoom'
import AboutLighting from './About/AboutLighting'
import AboutParticles from './About/AboutParticles'
import AboutCards from './About/AboutCards'

/**
 * AboutScene — Dark futuristic developer laboratory.
 *
 * A 3D room with metallic floor, neon wall strips, fog,
 * ambient particles, and dramatic lab-style lighting.
 * Data-driven from the same admin content as the 2D About page.
 *
 * Content cards (story pillars, code block, metrics) will be
 * added on top of this room foundation in a later step.
 */
export default function AboutScene({ sectionProgress = 0 }) {
  const groupRef = useRef()
  const cameraGroupRef = useRef()
  const mouseRef = useMousePosition()
  const { camera } = useThree()

  const {
    title,
    subtitle,
    fullName,
    roleTitle,
    sections,
    skills,
    available,
    locationText,
    highlightMetrics,
    certifications,
    badge,
  } = useAboutData()

  const colors = useMemo(() => ({
    purple: new THREE.Color('#8b5cf6'),
    cyan: new THREE.Color('#22d3ee'),
    indigo: new THREE.Color('#6366f1'),
    white: new THREE.Color('#f8fafc'),
    gray: new THREE.Color('#94a3b8'),
  }), [])

  const fogColor = useMemo(() => new THREE.Color('#0a0a1a'), [])

  // Camera intro animation + mouse parallax
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    const mx = mouseRef?.current?.x || 0
    const my = mouseRef?.current?.y || 0

    // Smooth camera position with mouse parallax
    if (cameraGroupRef.current) {
      const targetX = mx * 0.3
      const targetY = 2.2 + my * 0.15
      cameraGroupRef.current.position.x = THREE.MathUtils.lerp(
        cameraGroupRef.current.position.x,
        targetX,
        0.04
      )
      cameraGroupRef.current.position.y = THREE.MathUtils.lerp(
        cameraGroupRef.current.position.y,
        targetY,
        0.04
      )
    }

    // Scroll-driven exit animation
    if (groupRef.current) {
      const exitOffset = sectionProgress * 8
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        0 - exitOffset,
        0.06
      )

      const opacity = sectionProgress < 0.05
        ? 1
        : sectionProgress < 0.9
          ? Math.max(0, 1 - (sectionProgress - 0.1) * 1.5)
          : 0

      groupRef.current.traverse((child) => {
        if (child.isMesh && child.material && child.material.opacity !== undefined) {
          child.material.opacity = THREE.MathUtils.lerp(
            child.material.opacity,
            opacity,
            0.08
          )
        }
      })

      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        mx * 0.06,
        0.04
      )
    }
  })

  // Clean HTML tags from content
  const clean = (s) => s?.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() || ''
  const shortSubtitle = clean(subtitle).length > 100
    ? clean(subtitle).substring(0, 100) + '...'
    : clean(subtitle)

  return (
    <group ref={groupRef}>
      {/* Fog */}
      <fog attach="fog" args={[fogColor, 6, 18]} />

      {/* Camera rig with parallax */}
      <group ref={cameraGroupRef} position={[0, 2.2, 0]}>
        {/* Subtle camera sway */}
      </group>

      {/* Room geometry */}
      <AboutRoom />

      {/* Lighting rig */}
      <AboutLighting />

      {/* Ambient particles */}
      <AboutParticles />

      {/* Information cards - 4 glass panels in 3D space */}
      <AboutCards />

      {/* === FLOATING TITLE in the room (right side, above cards) === */}
      <group position={[3.5, 3.5, -3]}>
        {/* Badge */}
        <Text
          position={[0, 0.45, 0]}
          fontSize={0.14}
          color={colors.indigo}
          anchorX="center"
          anchorY="middle"
          material-transparent
          material-opacity={1}
          material-toneMapped={false}
        >
          {`// ${badge}`}
        </Text>

        {/* Title */}
        <Text
          position={[0, 0, 0]}
          fontSize={0.42}
          color={colors.white}
          anchorX="center"
          anchorY="middle"
          maxWidth={6}
          textAlign="center"
          material-transparent
          material-opacity={1}
          material-toneMapped={false}
        >
          {title}
        </Text>

        {/* Subtitle */}
        {shortSubtitle && (
          <Text
            position={[0, -0.5, 0]}
            fontSize={0.12}
            color={colors.gray}
            anchorX="center"
            anchorY="middle"
            maxWidth={5.5}
            textAlign="center"
            lineHeight={1.6}
            material-transparent
            material-opacity={1}
          >
            {shortSubtitle}
          </Text>
        )}
      </group>

      {/* === DECORATIVE FLOATING ORBS === */}
      {[
        { pos: [-5, 1.5, -3], color: colors.purple, size: 0.08 },
        { pos: [5.5, 2.5, -2], color: colors.cyan, size: 0.06 },
        { pos: [-4, 4, -1], color: colors.indigo, size: 0.05 },
        { pos: [4.5, 0.8, -4], color: colors.purple, size: 0.07 },
        { pos: [-3, 3, -4.5], color: colors.cyan, size: 0.04 },
        { pos: [3, 4.5, -3], color: colors.indigo, size: 0.05 },
        { pos: [0, 1, -2], color: colors.purple, size: 0.04 },
        { pos: [-2, 5, 0], color: colors.cyan, size: 0.03 },
      ].map((orb, i) => (
        <Float key={i} speed={1.5 + i * 0.3} rotationIntensity={0} floatIntensity={0.4}>
          <mesh position={orb.pos}>
            <sphereGeometry args={[orb.size, 12, 12]} />
            <meshStandardMaterial
              color={orb.color}
              emissive={orb.color}
              emissiveIntensity={3}
              transparent
              opacity={1}
              toneMapped={false}
            />
          </mesh>
        </Float>
      ))}

      {/* === GROUND GLOW PLANE === */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[8, 6]} />
        <meshStandardMaterial
          color={colors.purple}
          emissive={colors.purple}
          emissiveIntensity={0.08}
          transparent
          opacity={0.05}
        />
      </mesh>
    </group>
  )
}
