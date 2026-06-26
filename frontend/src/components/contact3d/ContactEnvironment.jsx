import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function HoloGrid() {
  const meshRef = useRef()

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.material.uniforms.uTime.value = state.clock.getElapsedTime()
  })

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color('#6366f1') },
      uColorB: { value: new THREE.Color('#06b6d4') },
    }),
    []
  )

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
      <planeGeometry args={[70, 70, 1, 1]} />
      <shaderMaterial
        vertexShader={`
          varying vec2 vUv;
          varying float vDist;
          void main() {
            vUv = uv;
            vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
            vDist = -mvPos.z;
            gl_Position = projectionMatrix * mvPos;
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform vec3 uColorA;
          uniform vec3 uColorB;
          varying vec2 vUv;
          varying float vDist;
          void main() {
            vec2 uv = vUv * 60.0;
            float gridX = smoothstep(0.96, 1.0, fract(uv.x));
            float gridY = smoothstep(0.96, 1.0, fract(uv.y));
            float grid = max(gridX, gridY);

            float scanline = smoothstep(0.98, 1.0, fract(uv.y + uTime * 0.3));
            grid = max(grid, scanline * 0.5);

            float dist = length(vUv - 0.5) * 2.0;
            float fade = 1.0 - smoothstep(0.2, 1.0, dist);

            float pulse = 0.5 + 0.5 * sin(uTime * 0.4 + dist * 4.0);
            float alpha = grid * fade * 0.15 * pulse;

            float depthFade = 1.0 - smoothstep(3.0, 30.0, vDist);
            alpha *= depthFade;

            vec3 color = mix(uColorA, uColorB, dist * 0.5 + sin(uTime * 0.2) * 0.2);

            gl_FragColor = vec4(color, alpha);
          }
        `}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

function NeonStreaks() {
  const groupRef = useRef()

  const streaks = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        x: (Math.random() - 0.5) * 24,
        z: -4 - Math.random() * 14,
        speed: 0.3 + Math.random() * 1.2,
        length: 3 + Math.random() * 5,
        phase: Math.random() * Math.PI * 2,
        color: i % 3 === 0 ? '#6366f1' : i % 3 === 1 ? '#06b6d4' : '#8b5cf6',
        width: 0.01 + Math.random() * 0.015,
      })),
    []
  )

  useFrame((state) => {
    if (!groupRef.current) return
    const time = state.clock.getElapsedTime()
    groupRef.current.children.forEach((child, i) => {
      const s = streaks[i]
      if (!s || !child.material) return
      const y = ((time * s.speed + s.phase) % 16) - 5
      child.position.y = y
      child.material.opacity = 0.04 + Math.sin(time * 2 + s.phase) * 0.025
    })
  })

  return (
    <group ref={groupRef}>
      {streaks.map((s, i) => (
        <mesh key={i} position={[s.x, 0, s.z]}>
          <planeGeometry args={[s.width, s.length]} />
          <meshBasicMaterial
            color={s.color}
            transparent
            opacity={0.05}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  )
}

function AmbientGlow() {
  const meshRef = useRef()

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.getElapsedTime()
    meshRef.current.material.opacity = 0.03 + Math.sin(t * 0.3) * 0.01
    meshRef.current.scale.x = 1 + Math.sin(t * 0.2) * 0.1
    meshRef.current.scale.y = 1 + Math.cos(t * 0.25) * 0.08
  })

  return (
    <mesh ref={meshRef} position={[0, 2, -8]}>
      <sphereGeometry args={[8, 32, 32]} />
      <meshBasicMaterial
        color="#6366f1"
        transparent
        opacity={0.03}
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

function VolumetricWalls() {
  return (
    <group>
      {[-14, 14].map((x) => (
        <mesh key={`v-${x}`} position={[x, 3, -10]}>
          <planeGeometry args={[0.02, 16]} />
          <meshBasicMaterial
            color="#06b6d4"
            transparent
            opacity={0.025}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
      {[-18, -8, 8, 18].map((z) => (
        <mesh key={`h-${z}`} position={[0, 0, z]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.02, 16]} />
          <meshBasicMaterial
            color="#8b5cf6"
            transparent
            opacity={0.02}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  )
}

export default function ContactEnvironment() {
  return (
    <group>
      <HoloGrid />
      <NeonStreaks />
      <AmbientGlow />
      <VolumetricWalls />
    </group>
  )
}
