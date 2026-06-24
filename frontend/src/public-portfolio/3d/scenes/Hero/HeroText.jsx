import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

/**
 * HeroText
 *
 * Text overlay on the 3D photo frame.
 * Introduction wraps into 2-3 lines using maxWidth.
 */
export default function HeroText({
  greeting = "Hello, I'm",
  fullName = 'Developer',
  badge = 'Full Stack Engineer',
  introduction = '',
  stats = [],
  socialLinks = {},
  textScale = 1,
  sectionProgress = 0,
  mouseRef,
}) {
  const groupRef = useRef()

  const white = useMemo(() => new THREE.Color('#f8fafc'), [])
  const indigo = useMemo(() => new THREE.Color('#818cf8'), [])
  const cyan = useMemo(() => new THREE.Color('#22d3ee'), [])
  const gray = useMemo(() => new THREE.Color('#94a3b8'), [])
  const green = useMemo(() => new THREE.Color('#10b981'), [])
  const amber = useMemo(() => new THREE.Color('#f59e0b'), [])
  const statColors = useMemo(() => [indigo, green, amber], [indigo, green, amber])

  useFrame(() => {
    if (!groupRef.current) return
    const mx = mouseRef?.current?.x || 0

    const exitOffset = sectionProgress * 5
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      0 - exitOffset,
      0.06
    )

    const opacity = Math.max(0, 1 - sectionProgress * 2.5)
    groupRef.current.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.opacity = THREE.MathUtils.lerp(
          child.material.opacity ?? 1,
          opacity,
          0.08
        )
      }
    })

    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      mx * 0.12,
      0.05
    )
  })

  // Clean HTML tags from introduction
  const cleanIntro = introduction
    .replace(/<[^>]*>/g, '')
    .trim()

  const shortIntro = cleanIntro.length > 150
    ? cleanIntro.substring(0, 150) + '...'
    : cleanIntro

  const activeSocials = Object.entries(socialLinks).filter(([, url]) => url)

  return (
    <group ref={groupRef} position={[0, 0, 0.15]} scale={textScale}>
      {/* Greeting - top of photo */}
      <Text
        position={[0, 2.2, 0]}
        fontSize={0.16}
        color={gray}
        anchorX="center"
        anchorY="middle"
        material-transparent
        material-opacity={1}
      >
        {greeting}
      </Text>

      {/* Name - upper area of photo */}
      <Text
        position={[0, 1.65, 0]}
        fontSize={0.42}
        color={white}
        anchorX="center"
        anchorY="middle"
        maxWidth={2.4}
        textAlign="center"
        material-transparent
        material-opacity={1}
        material-toneMapped={false}
      >
        {fullName}
      </Text>

      {/* Badge - below name */}
      <Text
        position={[0, 1.1, 0]}
        fontSize={0.15}
        color={indigo}
        anchorX="center"
        anchorY="middle"
        maxWidth={2.4}
        textAlign="center"
        material-transparent
        material-opacity={1}
      >
        {`// ${badge}`}
      </Text>

      {/* Decorative line */}
      <mesh position={[0, 0.85, 0]}>
        <boxGeometry args={[1.6, 0.005, 0.005]} />
        <meshBasicMaterial color={cyan} transparent opacity={0.6} />
      </mesh>

      {/* Introduction - wraps into 2-3 lines over photo */}
      {shortIntro && (
        <Text
          position={[0, 0.1, 0]}
          fontSize={0.1}
          color={white}
          anchorX="center"
          anchorY="middle"
          maxWidth={2.2}
          textAlign="center"
          lineHeight={1.8}
          material-transparent
          material-opacity={0.85}
        >
          {shortIntro}
        </Text>
      )}

      {/* Stats row - below photo */}
      {stats.length > 0 && (
        <group position={[0, -2.3, 0]}>
          {stats.slice(0, 3).map((stat, i) => {
            const x = (i - (Math.min(stats.length, 3) - 1) / 2) * 1.5
            const color = statColors[i % statColors.length]
            return (
              <group key={i} position={[x, 0, 0]}>
                <Text
                  position={[0, 0.15, 0]}
                  fontSize={0.22}
                  color={color}
                  anchorX="center"
                  anchorY="middle"
                  material-transparent
                  material-opacity={1}
                  material-toneMapped={false}
                >
                  {stat.value}
                </Text>
                <Text
                  position={[0, -0.1, 0]}
                  fontSize={0.065}
                  color={gray}
                  anchorX="center"
                  anchorY="middle"
                  maxWidth={1.5}
                  textAlign="center"
                  material-transparent
                  material-opacity={1}
                >
                  {stat.label?.toUpperCase() || ''}
                </Text>
              </group>
            )
          })}
        </group>
      )}

      {/* Social links */}
      {activeSocials.length > 0 && (
        <group position={[0, -2.9, 0]}>
          {activeSocials.slice(0, 6).map(([platform], i) => {
            const x = (i - (Math.min(activeSocials.length, 6) - 1) / 2) * 0.7
            return (
              <Text
                key={platform}
                position={[x, 0, 0]}
                fontSize={0.075}
                color={cyan}
                anchorX="center"
                anchorY="middle"
                material-transparent
                material-opacity={0.7}
              >
                {platform.toUpperCase()}
              </Text>
            )
          })}
        </group>
      )}
    </group>
  )
}
