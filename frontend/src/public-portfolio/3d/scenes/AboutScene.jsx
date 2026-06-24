import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Text } from '@react-three/drei'
import * as THREE from 'three'
import useAboutData from '../hooks/useAboutData'
import useMousePosition from '../hooks/useMousePosition'

/**
 * AboutScene — 3D About section with story pillars, code block, metrics.
 * Data-driven from the same admin content as the 2D About page.
 */
export default function AboutScene({ sectionProgress = 0 }) {
  const groupRef = useRef()
  const mouseRef = useMousePosition()

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
    indigo: new THREE.Color('#6366f1'),
    cyan: new THREE.Color('#22d3ee'),
    violet: new THREE.Color('#8b5cf6'),
    white: new THREE.Color('#f8fafc'),
    gray: new THREE.Color('#94a3b8'),
    dark: new THREE.Color('#0f0a2a'),
    green: new THREE.Color('#10b981'),
    amber: new THREE.Color('#f59e0b'),
    blue: new THREE.Color('#3b82f6'),
    panel: new THREE.Color('#111827'),
    panelBorder: new THREE.Color('#334155'),
    dotRed: new THREE.Color('#ff5f56'),
    dotYellow: new THREE.Color('#ffbd2e'),
    dotGreen: new THREE.Color('#27c93f'),
    metricColors: [new THREE.Color('#f59e0b'), new THREE.Color('#60a5fa'), new THREE.Color('#34d399')],
  }), [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    const mx = mouseRef?.current?.x || 0

    if (groupRef.current) {
      const exitOffset = sectionProgress * 6
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
        mx * 0.08,
        0.04
      )
    }
  })

  // Clean HTML tags
  const clean = (s) => s?.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() || ''
  const shortSubtitle = clean(subtitle).length > 120
    ? clean(subtitle).substring(0, 120) + '...'
    : clean(subtitle)

  // Build code block lines from data
  const codeLines = useMemo(() => [
    { keyword: 'const ', varName: 'developer', equals: ' = {' },
    { indent: '  name: ', value: `"${fullName}"`, comma: ',' },
    { indent: '  role: ', value: `"${roleTitle}"`, comma: ',' },
    { indent: '  location: ', value: `"${locationText}"`, comma: ',' },
    { indent: '  skills: [', value: `"${skills.slice(0, 4).join('", "')}"`, comma: '],' },
    { indent: '  available: ', value: available ? 'true' : 'false', comma: ',' },
    { equals: '}' },
  ], [fullName, roleTitle, locationText, skills, available])

  return (
    <group ref={groupRef}>
      {/* === HEADER AREA === */}
      <group position={[0, 3.2, 0]}>
        {/* Badge */}
        <Text
          position={[0, 0.35, 0]}
          fontSize={0.12}
          color={colors.indigo}
          anchorX="center"
          anchorY="middle"
          material-transparent
          material-opacity={1}
        >
          {`// ${badge}`}
        </Text>

        {/* Title */}
        <Text
          position={[0, 0, 0]}
          fontSize={0.38}
          color={colors.white}
          anchorX="center"
          anchorY="middle"
          maxWidth={5}
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
            position={[0, -0.4, 0]}
            fontSize={0.11}
            color={colors.gray}
            anchorX="center"
            anchorY="middle"
            maxWidth={5}
            textAlign="center"
            lineHeight={1.6}
            material-transparent
            material-opacity={1}
          >
            {shortSubtitle}
          </Text>
        )}
      </group>

      {/* === LEFT: STORY PILLAR CARDS === */}
      <group position={[-2.8, 0.3, 0]}>
        {sections.slice(0, 4).map((section, i) => {
          const y = (1 - i) * 1.35
          return (
            <Float key={i} speed={1.5 + i * 0.2} rotationIntensity={0.05} floatIntensity={0.3}>
              <group position={[0, y, 0]}>
                {/* Card background */}
                <mesh position={[0, 0, -0.02]}>
                  <planeGeometry args={[3.8, 1.2]} />
                  <meshBasicMaterial color={colors.panel} transparent opacity={0.5} />
                </mesh>
                {/* Left accent */}
                <mesh position={[-1.9, 0, 0]}>
                  <boxGeometry args={[0.04, 1.2, 0.04]} />
                  <meshStandardMaterial
                    color={colors.indigo}
                    emissive={colors.indigo}
                    emissiveIntensity={1.5}
                    transparent
                    opacity={1}
                  />
                </mesh>
                {/* Section title */}
                <Text
                  position={[-1.7, 0.3, 0.01]}
                  fontSize={0.13}
                  color={colors.indigo}
                  anchorX="left"
                  anchorY="middle"
                  maxWidth={3.4}
                  material-transparent
                  material-opacity={1}
                >
                  {section.title || ''}
                </Text>
                {/* Section content */}
                <Text
                  position={[-1.7, -0.1, 0.01]}
                  fontSize={0.085}
                  color={colors.gray}
                  anchorX="left"
                  anchorY="top"
                  maxWidth={3.4}
                  lineHeight={1.5}
                  material-transparent
                  material-opacity={1}
                >
                  {clean(section.content).substring(0, 120) || ''}
                </Text>
              </group>
            </Float>
          )
        })}
      </group>

      {/* === RIGHT: CODE BLOCK === */}
      <group position={[3.2, 0.5, 0.5]}>
        <Float speed={1.2} rotationIntensity={0.05} floatIntensity={0.2}>
          {/* Panel background */}
          <mesh position={[0, 0, -0.03]}>
            <planeGeometry args={[4.2, 5.5]} />
            <meshBasicMaterial color={colors.panel} transparent opacity={0.7} />
          </mesh>

          {/* Top bar */}
          <mesh position={[0, 2.78, -0.01]}>
            <planeGeometry args={[4.2, 0.4]} />
            <meshBasicMaterial color={new THREE.Color('#1f2937')} transparent opacity={0.9} />
          </mesh>

          {/* Traffic light dots */}
          <mesh position={[-1.8, 2.78, 0]}>
            <circleGeometry args={[0.08, 16]} />
            <meshBasicMaterial color={colors.dotRed} />
          </mesh>
          <mesh position={[-1.6, 2.78, 0]}>
            <circleGeometry args={[0.08, 16]} />
            <meshBasicMaterial color={colors.dotYellow} />
          </mesh>
          <mesh position={[-1.4, 2.78, 0]}>
            <circleGeometry args={[0.08, 16]} />
            <meshBasicMaterial color={colors.dotGreen} />
          </mesh>

          {/* Filename label */}
          <Text
            position={[-0.8, 2.78, 0.01]}
            fontSize={0.07}
            color={colors.gray}
            anchorX="left"
            anchorY="middle"
            material-transparent
            material-opacity={1}
          >
            {'// developer.config.js'}
          </Text>

          {/* Code lines */}
          {codeLines.map((line, i) => {
            const y = 2.2 - i * 0.55
            return (
              <group key={i} position={[0, y, 0.01]}>
                {line.keyword && (
                  <Text
                    position={[-1.8, 0, 0]}
                    fontSize={0.1}
                    color={colors.violet}
                    anchorX="left"
                    anchorY="middle"
                    material-transparent
                    material-opacity={1}
                  >
                    {line.keyword}
                  </Text>
                )}
                {line.varName && (
                  <Text
                    position={[-1.2, 0, 0]}
                    fontSize={0.1}
                    color={colors.blue}
                    anchorX="left"
                    anchorY="middle"
                    material-transparent
                    material-opacity={1}
                  >
                    {line.varName}
                  </Text>
                )}
                {line.equals && (
                  <Text
                    position={[line.varName ? -0.7 : -1.8, 0, 0]}
                    fontSize={0.1}
                    color={colors.white}
                    anchorX="left"
                    anchorY="middle"
                    material-transparent
                    material-opacity={1}
                  >
                    {line.equals}
                  </Text>
                )}
                {line.indent && (
                  <Text
                    position={[-1.8, 0, 0]}
                    fontSize={0.1}
                    color={colors.gray}
                    anchorX="left"
                    anchorY="middle"
                    material-transparent
                    material-opacity={1}
                  >
                    {line.indent}
                  </Text>
                )}
                {line.value && (
                  <Text
                    position={[line.indent ? -0.8 : -1.2, 0, 0]}
                    fontSize={0.1}
                    color={colors.green}
                    anchorX="left"
                    anchorY="middle"
                    material-transparent
                    material-opacity={1}
                  >
                    {line.value}
                  </Text>
                )}
                {line.comma && (
                  <Text
                    position={[0.6, 0, 0]}
                    fontSize={0.1}
                    color={colors.white}
                    anchorX="left"
                    anchorY="middle"
                    material-transparent
                    material-opacity={1}
                  >
                    {line.comma}
                  </Text>
                )}
              </group>
            )
          })}

          {/* Skills pills below code */}
          <group position={[0, -1.8, 0.01]}>
            {skills.slice(0, 5).map((skill, i) => {
              const x = (i - Math.min(skills.length, 5) / 2 + 0.5) * 0.7
              return (
                <group key={i} position={[x, 0, 0]}>
                  <mesh>
                    <planeGeometry args={[0.6, 0.25]} />
                    <meshBasicMaterial color={colors.indigo} transparent opacity={0.2} />
                  </mesh>
                  <Text
                    position={[0, 0, 0.01]}
                    fontSize={0.07}
                    color={colors.cyan}
                    anchorX="center"
                    anchorY="middle"
                    material-transparent
                    material-opacity={1}
                  >
                    {skill}
                  </Text>
                </group>
              )
            })}
          </group>

          {/* Available badge */}
          <group position={[0, -2.3, 0.01]}>
            <mesh>
              <planeGeometry args={[1.2, 0.3]} />
              <meshBasicMaterial
                color={available ? colors.green : new THREE.Color('#ef4444')}
                transparent
                opacity={0.15}
              />
            </mesh>
            <Text
              position={[0, 0, 0.01]}
              fontSize={0.08}
              color={available ? colors.green : new THREE.Color('#ef4444')}
              anchorX="center"
              anchorY="middle"
              material-transparent
              material-opacity={1}
            >
              {available ? '● Available for work' : '○ Currently busy'}
            </Text>
          </group>
        </Float>
      </group>

      {/* === BOTTOM: HIGHLIGHT METRICS === */}
      {highlightMetrics.length > 0 && (
        <group position={[0, -2.8, 0]}>
          {highlightMetrics.slice(0, 3).map((metric, i) => {
            const x = (i - 1) * 2.2
            const val = metric.value || (i === 0 ? '' : i === 1 ? '50+' : '5+')
            return (
              <Float key={i} speed={1.8 + i * 0.3} rotationIntensity={0.05} floatIntensity={0.2}>
                <group position={[x, 0, 0]}>
                  <mesh>
                    <planeGeometry args={[1.8, 0.8]} />
                    <meshBasicMaterial color={colors.panel} transparent opacity={0.4} />
                  </mesh>
                  {/* Metric icon circle */}
                  <mesh position={[0, 0.15, 0.01]}>
                    <circleGeometry args={[0.12, 16]} />
                    <meshStandardMaterial
                      color={colors.metricColors[i]}
                      emissive={colors.metricColors[i]}
                      emissiveIntensity={1.5}
                      transparent
                      opacity={1}
                    />
                  </mesh>
                  {/* Value */}
                  <Text
                    position={[0, -0.05, 0.01]}
                    fontSize={0.12}
                    color={colors.metricColors[i]}
                    anchorX="center"
                    anchorY="middle"
                    material-transparent
                    material-opacity={1}
                    material-toneMapped={false}
                  >
                    {val}
                  </Text>
                  {/* Label */}
                  <Text
                    position={[0, -0.25, 0.01]}
                    fontSize={0.06}
                    color={colors.gray}
                    anchorX="center"
                    anchorY="middle"
                    maxWidth={1.6}
                    textAlign="center"
                    material-transparent
                    material-opacity={1}
                  >
                    {(metric.title || '').toUpperCase()}
                  </Text>
                </group>
              </Float>
            )
          })}
        </group>
      )}

      {/* === CERTIFICATIONS BAR === */}
      {certifications.length > 0 && (
        <group position={[0, -3.6, 0]}>
          <Text
            position={[0, 0.15, 0]}
            fontSize={0.07}
            color={colors.gray}
            anchorX="center"
            anchorY="middle"
            material-transparent
            material-opacity={1}
          >
            {'CERTIFICATIONS'}
          </Text>
          <Text
            position={[0, -0.05, 0]}
            fontSize={0.065}
            color={colors.white}
            anchorX="center"
            anchorY="middle"
            maxWidth={6}
            textAlign="center"
            material-transparent
            material-opacity={1}
          >
            {certifications.map((c) => c.title).join(' · ')}
          </Text>
        </group>
      )}

      {/* === DECORATIVE FLOATING SHAPES === */}
      {[
        { pos: [-4.5, 2.5, -1], color: colors.indigo, size: 0.06 },
        { pos: [5.0, 1.8, -1.5], color: colors.cyan, size: 0.05 },
        { pos: [-4.2, -1.5, -0.8], color: colors.violet, size: 0.04 },
        { pos: [4.8, -2.0, -1.2], color: colors.indigo, size: 0.07 },
        { pos: [-3.8, 0, -2], color: colors.cyan, size: 0.05 },
      ].map((dot, i) => (
        <Float key={i} speed={2 + i * 0.4} rotationIntensity={0} floatIntensity={0.5}>
          <mesh position={dot.pos}>
            <sphereGeometry args={[dot.size, 12, 12]} />
            <meshStandardMaterial
              color={dot.color}
              emissive={dot.color}
              emissiveIntensity={2}
              transparent
              opacity={1}
            />
          </mesh>
        </Float>
      ))}
    </group>
  )
}
