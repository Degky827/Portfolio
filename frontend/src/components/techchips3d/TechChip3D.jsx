import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

const TECH_CONFIGS = {
  React: {
    color: '#61DAFB',
    glowColor: '#61DAFB',
    iconType: 'atom',
  },
  Node: {
    color: '#68A063',
    glowColor: '#3C873A',
    iconType: 'node',
  },
  MongoDB: {
    color: '#47A248',
    glowColor: '#00ED64',
    iconType: 'crystal',
  },
  'Next.js': {
    color: '#FFFFFF',
    glowColor: '#A0A0A0',
    iconType: 'chrome',
  },
  Java: {
    color: '#ED8B00',
    glowColor: '#F89820',
    iconType: 'default',
  },
  HTML: {
    color: '#E34F26',
    glowColor: '#FF6B35',
    iconType: 'default',
  },
  CSS: {
    color: '#1572B6',
    glowColor: '#33A1DE',
    iconType: 'default',
  },
}

const DEFAULT_CONFIG = {
  color: '#8b5cf6',
  glowColor: '#a78bfa',
  iconType: 'default',
}

function ReactAtom({ color, time, intensity }) {
  const groupRef = useRef()
  const orbits = useMemo(() => [0, 1, 2], [])

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.5
    }
  })

  return (
    <group ref={groupRef} scale={0.12}>
      <mesh>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={intensity * 0.8}
          toneMapped={false}
        />
      </mesh>
      {orbits.map((i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, (i * Math.PI) / 3 + time * 0.3]}>
          <torusGeometry args={[0.7, 0.03, 8, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={intensity * 0.5}
            transparent
            opacity={0.7}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  )
}

function NodeGlow({ color, time, intensity }) {
  return (
    <group scale={0.12}>
      <mesh>
        <octahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={intensity * 0.6 + Math.sin(time * 2) * 0.15}
          transparent
          opacity={0.85}
          toneMapped={false}
        />
      </mesh>
      <mesh scale={1.6}>
        <octahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={intensity * 0.2}
          transparent
          opacity={0.15}
          wireframe
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

function MongoCrystal({ color, time, intensity }) {
  const ref = useRef()

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y = time * 0.4
      ref.current.rotation.z = Math.sin(time * 0.6) * 0.15
    }
  })

  return (
    <group ref={ref} scale={0.12}>
      <mesh>
        <dodecahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={intensity * 0.7}
          transparent
          opacity={0.8}
          toneMapped={false}
        />
      </mesh>
      <mesh scale={1.4}>
        <dodecahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={intensity * 0.3}
          transparent
          opacity={0.12}
          wireframe
          toneMapped={false}
        />
      </mesh>
      <pointLight
        color={color}
        intensity={intensity * 1.5}
        distance={3}
        decay={2}
      />
    </group>
  )
}

function ChromeEffect({ color, time, intensity }) {
  const ref = useRef()

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y = time * 0.3
    }
  })

  return (
    <group ref={ref} scale={0.12}>
      <mesh>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial
          color="#E0E0E0"
          metalness={0.95}
          roughness={0.05}
          envMapIntensity={intensity * 2}
          toneMapped={false}
        />
      </mesh>
      <mesh scale={1.3}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial
          color="#FFFFFF"
          metalness={1}
          roughness={0.02}
          transparent
          opacity={0.15}
          wireframe
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

const ICON_COMPONENTS = {
  atom: ReactAtom,
  node: NodeGlow,
  crystal: MongoCrystal,
  chrome: ChromeEffect,
}

export default function TechChip3D({
  name,
  position = [0, 0, 0],
  index = 0,
}) {
  const groupRef = useRef()
  const meshRef = useRef()
  const glowRef = useRef()
  const iconRef = useRef()
  const [hovered, setHovered] = useState(false)
  const targetY = useRef(0)
  const targetScale = useRef(1)
  const currentY = useRef(0)
  const currentScale = useRef(1)

  const config = TECH_CONFIGS[name] || DEFAULT_CONFIG
  const baseColor = useMemo(() => new THREE.Color(config.color), [config.color])
  const glowColor = useMemo(() => new THREE.Color(config.glowColor), [config.glowColor])

  const floatOffset = useMemo(() => index * 1.2, [index])
  const rotOffset = useMemo(() => index * 0.5, [index])

  useFrame((state) => {
    if (!groupRef.current) return
    const time = state.clock.getElapsedTime()

    const floatY = Math.sin(time * 0.8 + floatOffset) * 0.15
    const floatRotX = Math.sin(time * 0.5 + rotOffset) * 0.08
    const floatRotZ = Math.cos(time * 0.6 + rotOffset) * 0.05

    targetY.current = hovered ? floatY + 0.4 : floatY
    targetScale.current = hovered ? 1.18 : 1

    currentY.current += (targetY.current - currentY.current) * 0.08
    currentScale.current += (targetScale.current - currentScale.current) * 0.08

    groupRef.current.position.y = position[1] + currentY.current
    groupRef.current.rotation.x = floatRotX
    groupRef.current.rotation.z = floatRotZ
    groupRef.current.scale.setScalar(currentScale.current)

    if (meshRef.current) {
      const glowIntensity = hovered ? 0.6 : 0.2
      meshRef.current.emissiveIntensity +=
        (glowIntensity - meshRef.current.emissiveIntensity) * 0.08
    }

    if (glowRef.current) {
      const glowScale = hovered ? 1.35 : 1.15
      glowRef.current.scale.lerp(
        new THREE.Vector3(glowScale, glowScale, glowScale),
        0.06,
      )
      glowRef.current.material.opacity +=
        ((hovered ? 0.25 : 0.08) - glowRef.current.material.opacity) * 0.06
    }
  })

  const IconComponent = ICON_COMPONENTS[config.iconType]

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerEnter={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerLeave={(e) => {
        e.stopPropagation()
        setHovered(false)
        document.body.style.cursor = 'auto'
      }}
    >
      {/* Outer glow shell */}
      <mesh ref={glowRef} scale={1.15}>
        <RoundedBox args={[2.4, 1, 0.3]} radius={0.15} smoothness={4}>
          <meshBasicMaterial
            color={glowColor}
            transparent
            opacity={0.08}
            toneMapped={false}
          />
        </RoundedBox>
      </mesh>

      {/* Glass body */}
      <RoundedBox
        ref={meshRef}
        args={[2.2, 0.9, 0.25]}
        radius={0.12}
        smoothness={4}
      >
        <meshPhysicalMaterial
          color={baseColor}
          emissive={baseColor}
          emissiveIntensity={0.2}
          metalness={0.1}
          roughness={0.15}
          transmission={0.6}
          thickness={0.5}
          ior={1.5}
          envMapIntensity={1.2}
          clearcoat={1}
          clearcoatRoughness={0.05}
          transparent
          opacity={0.88}
          toneMapped={false}
        />
      </RoundedBox>

      {/* Top glass highlight */}
      <RoundedBox args={[2, 0.15, 0.02]} radius={0.06} smoothness={2} position={[0, 0.22, 0.14]}>
        <meshBasicMaterial
          color="#FFFFFF"
          transparent
          opacity={hovered ? 0.25 : 0.12}
        />
      </RoundedBox>

      {/* Tech icon */}
      {IconComponent && (
        <group position={[-0.7, 0, 0.18]}>
          <IconComponent
            color={config.color}
            time={0}
            intensity={hovered ? 1.2 : 0.6}
          />
        </group>
      )}

      {/* Label */}
      <Text
        position={[0.15, 0, 0.16]}
        fontSize={0.28}
        color={config.iconType === 'chrome' ? '#333333' : '#FFFFFF'}
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/spacegrotesk/v16/V8mDoQDjQSkFtoMM3T6r8E7mPbF4C_k3HqU.woff2"
        fontWeight={700}
      >
        {name}
      </Text>

      {/* Bottom edge accent */}
      <mesh position={[0, -0.42, 0]}>
        <planeGeometry args={[1.8, 0.015]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={hovered ? 0.8 : 0.3}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}
