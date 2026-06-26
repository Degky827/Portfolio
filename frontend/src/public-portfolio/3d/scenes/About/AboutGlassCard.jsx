import { useRef, useMemo, useState, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

/**
 * AboutGlassCard
 *
 * A reusable futuristic floating glass panel for 3D scenes.
 *
 * Features:
 * - Glassmorphism (transparency, refraction-like layering)
 * - Rounded edges (RoundedBox)
 * - Thickness (extruded body)
 * - Metal border (wireframe overlay)
 * - Purple glow (emissive edge strips)
 * - Reflection (specular metallic surface)
 * - Depth (back panel + front panel gap)
 * - Soft shadow (castShadow)
 * - Continuous float animation
 * - Hover effects (lift, glow, rotate, reflection boost)
 */
export default function AboutGlassCard({
  title = '',
  content = '',
  index = 0,
  position = [0, 0, 0],
  width = 3.2,
  height = 1.6,
  accentColor,
}) {
  const groupRef = useRef()
  const glowRef = useRef()
  const borderRef = useRef()
  const [hovered, setHovered] = useState(false)

  const colors = useMemo(() => ({
    purple: new THREE.Color('#8b5cf6'),
    cyan: new THREE.Color('#22d3ee'),
    indigo: new THREE.Color('#6366f1'),
    white: new THREE.Color('#f8fafc'),
    gray: new THREE.Color('#94a3b8'),
    glass: new THREE.Color('#1a1040'),
    glassEdge: new THREE.Color('#2d1b69'),
    dark: new THREE.Color('#0a0620'),
  }), [])

  const accent = useMemo(() => {
    if (accentColor) return new THREE.Color(accentColor)
    const palette = [colors.purple, colors.cyan, colors.indigo, colors.purple]
    return palette[index % palette.length]
  }, [accentColor, index, colors])

  // Animation state
  const animState = useRef({
    floatOffset: Math.random() * Math.PI * 2,
    baseY: position[1],
    hoverLerp: 0,
    glowLerp: 0,
    rotXLerp: 0,
    rotZLerp: 0,
  })

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.getElapsedTime()
    const s = animState.current

    // Continuous float
    const floatY = Math.sin(t * 0.8 + s.floatOffset) * 0.08
    const floatRotZ = Math.sin(t * 0.5 + s.floatOffset + 1) * 0.015
    const floatRotX = Math.cos(t * 0.6 + s.floatOffset + 2) * 0.01

    // Hover interpolation
    const hoverTarget = hovered ? 1 : 0
    s.hoverLerp = THREE.MathUtils.lerp(s.hoverLerp, hoverTarget, 0.08)
    s.glowLerp = THREE.MathUtils.lerp(s.glowLerp, hoverTarget, 0.06)

    // Hover rotation
    const hoverRotX = s.hoverLerp * 0.04
    const hoverRotZ = s.hoverLerp * -0.02
    s.rotXLerp = THREE.MathUtils.lerp(s.rotXLerp, hoverRotX, 0.06)
    s.rotZLerp = THREE.MathUtils.lerp(s.rotZLerp, hoverRotZ, 0.06)

    // Apply position
    const liftY = s.hoverLerp * 0.15
    groupRef.current.position.y = s.baseY + floatY + liftY
    groupRef.current.position.x = position[0]
    groupRef.current.position.z = position[2]

    // Apply rotation
    groupRef.current.rotation.x = floatRotX + s.rotXLerp
    groupRef.current.rotation.z = floatRotZ + s.rotZLerp

    // Glow intensity
    if (glowRef.current) {
      glowRef.current.material.emissiveIntensity =
        1.2 + s.glowLerp * 2.5 + Math.sin(t * 1.5 + s.floatOffset) * 0.3
    }

    // Border glow
    if (borderRef.current) {
      borderRef.current.material.emissiveIntensity =
        0.8 + s.glowLerp * 1.5
      borderRef.current.material.opacity = 0.4 + s.glowLerp * 0.3
    }
  })

  const handlePointerOver = useCallback((e) => {
    e.stopPropagation()
    setHovered(true)
    document.body.style.cursor = 'pointer'
  }, [])

  const handlePointerOut = useCallback(() => {
    setHovered(false)
    document.body.style.cursor = 'auto'
  }, [])

  // Clean HTML from content
  const clean = (s) => s?.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() || ''
  const displayContent = clean(content).substring(0, 160)
  const displayTitle = clean(title)

  const panelW = width
  const panelH = height
  const depth = 0.06
  const edgeGlow = 0.025

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* === BACK PANEL (depth layer) === */}
      <RoundedBox
        args={[panelW, panelH, depth]}
        radius={0.06}
        smoothness={4}
        position={[0, 0, -0.03]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={colors.dark}
          roughness={0.3}
          metalness={0.8}
          transparent
          opacity={0.6}
        />
      </RoundedBox>

      {/* === FRONT GLASS PANEL === */}
      <RoundedBox
        args={[panelW, panelH, depth * 0.5]}
        radius={0.06}
        smoothness={4}
        position={[0, 0, 0.02]}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          color={colors.glass}
          roughness={0.1}
          metalness={0.4}
          transmission={0.15}
          thickness={0.5}
          transparent
          opacity={0.55}
          envMapIntensity={0.8}
          clearcoat={0.3}
          clearcoatRoughness={0.2}
        />
      </RoundedBox>

      {/* === EDGE GLOW STRIPS === */}
      {/* Top edge */}
      <mesh ref={glowRef} position={[0, panelH / 2, 0.01]}>
        <boxGeometry args={[panelW - 0.1, edgeGlow, edgeGlow]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={1.2}
          transparent
          opacity={0.9}
          toneMapped={false}
        />
      </mesh>

      {/* Bottom edge */}
      <mesh position={[0, -panelH / 2, 0.01]}>
        <boxGeometry args={[panelW - 0.1, edgeGlow, edgeGlow]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={0.6}
          transparent
          opacity={0.5}
          toneMapped={false}
        />
      </mesh>

      {/* Left edge */}
      <mesh position={[-panelW / 2, 0, 0.01]}>
        <boxGeometry args={[edgeGlow, panelH - 0.1, edgeGlow]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={0.8}
          transparent
          opacity={0.6}
          toneMapped={false}
        />
      </mesh>

      {/* Right edge */}
      <mesh position={[panelW / 2, 0, 0.01]}>
        <boxGeometry args={[edgeGlow, panelH - 0.1, edgeGlow]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={0.8}
          transparent
          opacity={0.6}
          toneMapped={false}
        />
      </mesh>

      {/* === METAL BORDER (wireframe) === */}
      <mesh ref={borderRef} position={[0, 0, 0.04]}>
        <planeGeometry args={[panelW + 0.02, panelH + 0.02]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={0.8}
          wireframe
          transparent
          opacity={0.4}
          toneMapped={false}
        />
      </mesh>

      {/* === CONTENT: TITLE === */}
      <Text
        position={[-panelW / 2 + 0.25, panelH / 2 - 0.3, 0.06]}
        fontSize={0.14}
        color={accent}
        anchorX="left"
        anchorY="middle"
        maxWidth={panelW - 0.5}
        material-transparent
        material-opacity={1}
        material-toneMapped={false}
      >
        {displayTitle}
      </Text>

      {/* === CONTENT: BODY === */}
      <Text
        position={[-panelW / 2 + 0.25, panelH / 2 - 0.6, 0.06]}
        fontSize={0.085}
        color={colors.gray}
        anchorX="left"
        anchorY="top"
        maxWidth={panelW - 0.5}
        lineHeight={1.5}
        material-transparent
        material-opacity={0.9}
      >
        {displayContent}
      </Text>

      {/* === ACCENT DOT (top-left) === */}
      <mesh position={[-panelW / 2 + 0.12, panelH / 2 - 0.12, 0.05]}>
        <circleGeometry args={[0.04, 16]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={3}
          transparent
          opacity={1}
          toneMapped={false}
        />
      </mesh>

      {/* === INDEX NUMBER (bottom-right) === */}
      <Text
        position={[panelW / 2 - 0.25, -panelH / 2 + 0.15, 0.06]}
        fontSize={0.1}
        color={accent}
        anchorX="right"
        anchorY="middle"
        material-transparent
        material-opacity={0.3}
        material-toneMapped={false}
      >
        {`0${index + 1}`}
      </Text>

      {/* === REFLECTION SURFACE (bottom half, subtle) === */}
      <mesh position={[0, -panelH / 4, 0.025]} rotation={[0, 0, 0]}>
        <planeGeometry args={[panelW - 0.2, panelH * 0.35]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.02}
          metalness={1}
          roughness={0}
        />
      </mesh>

      {/* === SHADOW CATCHER (below card) === */}
      <mesh
        position={[0, -panelH / 2 - 0.15, -0.1]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[panelW * 0.8, 0.3]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={0.15}
          transparent
          opacity={0.08}
        />
      </mesh>
    </group>
  )
}
