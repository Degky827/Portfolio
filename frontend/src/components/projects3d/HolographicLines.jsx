import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function HoloGrid() {
  const meshRef = useRef()

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.material.uniforms.uTime.value = state.clock.getElapsedTime()
  })

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColorA: { value: new THREE.Color('#8b5cf6') },
    uColorB: { value: new THREE.Color('#6366f1') },
  }), [])

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]}>
      <planeGeometry args={[60, 60, 1, 1]} />
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
            vec2 uv = vUv * 50.0;
            float gridX = smoothstep(0.96, 1.0, fract(uv.x));
            float gridY = smoothstep(0.96, 1.0, fract(uv.y));
            float grid = max(gridX, gridY);

            float scanline = smoothstep(0.98, 1.0, fract(uv.y + uTime * 0.3));
            grid = max(grid, scanline * 0.5);

            float dist = length(vUv - 0.5) * 2.0;
            float fade = 1.0 - smoothstep(0.2, 1.0, dist);

            float pulse = 0.5 + 0.5 * sin(uTime * 0.4 + dist * 4.0);
            float alpha = grid * fade * 0.14 * pulse;

            float depthFade = 1.0 - smoothstep(3.0, 25.0, vDist);
            alpha *= depthFade;

            vec3 color = mix(uColorA, uColorB, dist * 0.6 + sin(uTime * 0.2) * 0.2);

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

function DataStreams() {
  const groupRef = useRef()
  const streamCount = 6

  const streams = useMemo(() =>
    Array.from({ length: streamCount }, (_, i) => ({
      x: (Math.random() - 0.5) * 20,
      z: -3 - Math.random() * 12,
      speed: 0.5 + Math.random() * 1.2,
      length: 2 + Math.random() * 3,
      phase: Math.random() * Math.PI * 2,
      color: i % 2 === 0 ? '#8b5cf6' : '#6366f1',
    })),
    []
  )

  useFrame((state) => {
    if (!groupRef.current) return
    const time = state.clock.getElapsedTime()
    groupRef.current.children.forEach((child, i) => {
      const s = streams[i]
      if (!s || !child.material) return
      const y = ((time * s.speed + s.phase) % 14) - 4
      child.position.y = y
      child.material.opacity = 0.05 + Math.sin(time * 2 + s.phase) * 0.02
    })
  })

  return (
    <group ref={groupRef}>
      {streams.map((s, i) => (
        <mesh key={i} position={[s.x, 0, s.z]}>
          <planeGeometry args={[0.015, s.length]} />
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

export default function HolographicLines() {
  return (
    <group>
      <HoloGrid />
      <DataStreams />
    </group>
  )
}
