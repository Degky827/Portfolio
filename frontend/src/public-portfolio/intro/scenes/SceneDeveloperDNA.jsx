import { useRef, useEffect, useMemo, memo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const SCAN_DURATION = 0.35

const DEVELOPER_INFO = {
  name: 'Desalegn Kasaye',
  role: 'Full Stack Developer',
  fields: ['Frontend Engineering', 'Backend Engineering', 'Mobile Development', '3D Web Experiences', 'Cloud Deployment', 'Artificial Intelligence', 'Cyber Security'],
  languages: ['JavaScript', 'TypeScript', 'Dart', 'Python', 'Java'],
  frameworks: ['React', 'Node.js', 'Express', 'Flutter', 'MongoDB', 'Three.js'],
}

function HoloPanel({ position, rotation, width, height, color, opacity, label, items }) {
  const groupRef = useRef()

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.getElapsedTime()
    groupRef.current.position.y = position[1] + Math.sin(t * 0.4 + position[0] * 2) * 0.015
    groupRef.current.rotation.y = rotation[1] + Math.sin(t * 0.2) * 0.02
  })

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Panel background */}
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={opacity * 0.1}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Panel border */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={new Float32Array([
              -width / 2, -height / 2, 0, width / 2, -height / 2, 0,
              width / 2, -height / 2, 0, width / 2, height / 2, 0,
              width / 2, height / 2, 0, -width / 2, height / 2, 0,
              -width / 2, height / 2, 0, -width / 2, -height / 2, 0,
            ])}
            count={8}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={color} transparent opacity={opacity * 0.5} />
      </lineSegments>

      {/* Inner grid lines */}
      {items && items.length > 0 && (
        <lineSegments position={[0, -0.02, 0.001]}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              array={new Float32Array(
                items.flatMap((_, i) => {
                  const y = -height / 2 + (height / (items.length + 1)) * (i + 1)
                  return [-width / 2 + 0.05, y, 0, width / 2 - 0.05, y, 0]
                })
              )}
              count={items.length * 2}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color={color} transparent opacity={opacity * 0.15} />
        </lineSegments>
      )}

      {/* Corner accents */}
      {[
        [-width / 2, -height / 2, 0],
        [width / 2, -height / 2, 0],
        [width / 2, height / 2, 0],
        [-width / 2, height / 2, 0],
      ].map((corner, i) => (
        <mesh key={i} position={corner}>
          <circleGeometry args={[0.015, 8]} />
          <meshBasicMaterial color={color} transparent opacity={opacity * 0.6} />
        </mesh>
      ))}
    </group>
  )
}

function SceneDeveloperDNA({ progress, onComplete }) {
  const groupRef = useRef()
  const scanLineRef = useRef()
  const scanProgress = Math.min(progress / SCAN_DURATION, 1)
  const infoOpacity = Math.min(Math.max((progress - 0.25) / 0.2, 0), 1)

  useEffect(() => {
    if (progress >= 1) onComplete?.()
  }, [progress, onComplete])

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.getElapsedTime()
    groupRef.current.rotation.y = Math.sin(t * 0.12) * 0.1

    if (scanLineRef.current) {
      const scanY = scanProgress * 3 - 1.5
      scanLineRef.current.position.y = scanY
      scanLineRef.current.material.opacity = scanProgress < 1 ? 0.4 + Math.sin(t * 15) * 0.1 : 0
    }
  })

  return (
    <group ref={groupRef}>
      {/* Scan line */}
      <mesh ref={scanLineRef} position={[0, 0, 0.2]}>
        <planeGeometry args={[5, 0.015]} />
        <meshBasicMaterial
          color="#06b6d4"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Name panel */}
      <HoloPanel
        position={[-1.5, 0.8, 0]}
        rotation={[0, 0.25, 0]}
        width={1.6}
        height={0.35}
        color="#06b6d4"
        opacity={infoOpacity}
        label="NAME"
        items={[DEVELOPER_INFO.name]}
      />

      {/* Role panel */}
      <HoloPanel
        position={[1.5, 0.8, 0]}
        rotation={[0, -0.25, 0]}
        width={1.4}
        height={0.3}
        color="#8b5cf6"
        opacity={infoOpacity}
        label="ROLE"
        items={[DEVELOPER_INFO.role]}
      />

      {/* Engineering Fields */}
      <HoloPanel
        position={[-1.8, 0, 0.5]}
        rotation={[0, 0.35, 0]}
        width={1.2}
        height={0.9}
        color="#4ade80"
        opacity={infoOpacity}
        label="FIELDS"
        items={DEVELOPER_INFO.fields}
      />

      {/* Languages */}
      <HoloPanel
        position={[1.8, 0, 0.5]}
        rotation={[0, -0.35, 0]}
        width={1.1}
        height={0.7}
        color="#f59e0b"
        opacity={infoOpacity}
        label="LANGUAGES"
        items={DEVELOPER_INFO.languages}
      />

      {/* Frameworks */}
      <HoloPanel
        position={[0, -0.8, 0.8]}
        rotation={[0.1, 0, 0]}
        width={2.0}
        height={0.6}
        color="#ec4899"
        opacity={infoOpacity}
        label="FRAMEWORKS"
        items={DEVELOPER_INFO.frameworks}
      />

      <ambientLight intensity={0.04} color="#06b6d4" />
      <pointLight color="#06b6d4" intensity={1.2} distance={8} decay={2} />
      <pointLight color="#8b5cf6" intensity={0.6} distance={6} decay={2} position={[4, 2, -2]} />
      <pointLight color="#4ade80" intensity={0.3} distance={5} decay={2} position={[-3, -1, 3]} />
    </group>
  )
}

export default memo(SceneDeveloperDNA)
