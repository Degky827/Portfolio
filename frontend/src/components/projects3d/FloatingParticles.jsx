import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const particleVertexShader = `
  attribute float aSize;
  attribute float aOpacity;
  attribute float aPhase;
  attribute float aSpeed;
  attribute float aDepth;
  uniform float uTime;
  varying float vOpacity;
  varying float vPhase;
  varying float vDepth;

  void main() {
    vOpacity = aOpacity;
    vPhase = aPhase;
    vDepth = aDepth;

    vec3 pos = position;
    float t = uTime * aSpeed;

    pos.y += sin(t + aPhase * 6.28) * 0.4;
    pos.x += cos(t * 0.7 + aPhase * 3.14) * 0.2;
    pos.z += sin(t * 0.5 + aPhase * 4.71) * 0.15;

    pos.x += sin(t * 0.15 + aPhase * 5.0) * 0.08;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const particleFragmentShader = `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  uniform float uTime;
  varying float vOpacity;
  varying float vPhase;
  varying float vDepth;

  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;

    float core = 1.0 - smoothstep(0.0, 0.08, dist);
    float mid = 1.0 - smoothstep(0.0, 0.25, dist);
    float glow = 1.0 - smoothstep(0.0, 0.5, dist);
    glow = pow(glow, 1.5);

    float pulse = 0.5 + 0.5 * sin(uTime * 0.6 + vPhase * 6.28);
    float flicker = 0.85 + 0.15 * sin(uTime * 3.0 + vPhase * 20.0);
    float alpha = (core * 1.2 + mid * 0.3 + glow * 0.5) * vOpacity * pulse * flicker;

    vec3 color = mix(uColorA, uColorB, vPhase);
    color = mix(color, uColorC, sin(uTime * 0.3 + vPhase * 3.0) * 0.3 + 0.3);

    gl_FragColor = vec4(color, alpha);
  }
`

const TEAL = new THREE.Color('#06b6d4')
const PURPLE = new THREE.Color('#8b5cf6')
const CYAN = new THREE.Color('#22d3ee')

export default function FloatingParticles({ count = 200 }) {
  const pointsRef = useRef()
  const materialRef = useRef()
  const particleCount = count

  const { positions, sizes, opacities, phases, speeds, depths } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    const opacities = new Float32Array(particleCount)
    const phases = new Float32Array(particleCount)
    const speeds = new Float32Array(particleCount)
    const depths = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      const theta = Math.random() * Math.PI * 2
      const r = 2 + Math.random() * 8
      positions[i3] = Math.cos(theta) * r
      positions[i3 + 1] = Math.random() * 14 - 4
      positions[i3 + 2] = Math.sin(theta) * r - 5

      sizes[i] = 0.8 + Math.random() * 4.0
      opacities[i] = 0.1 + Math.random() * 0.5
      phases[i] = Math.random()
      speeds[i] = 0.15 + Math.random() * 0.5
      depths[i] = Math.random()
    }

    return { positions, sizes, opacities, phases, speeds, depths }
  }, [particleCount])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: TEAL },
      uColorB: { value: PURPLE },
      uColorC: { value: CYAN },
    }),
    []
  )

  useFrame((state) => {
    if (!pointsRef.current || !materialRef.current) return

    const time = state.clock.getElapsedTime()
    materialRef.current.uniforms.uTime.value = time

    const posArray = pointsRef.current.geometry.attributes.position.array
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      posArray[i3 + 1] += 0.003 + Math.sin(time * 0.1 + phases[i] * 5) * 0.001
      posArray[i3] += Math.sin(time * 0.15 + phases[i] * 8) * 0.0008
      posArray[i3 + 2] += Math.cos(time * 0.1 + phases[i] * 6) * 0.0004

      if (posArray[i3 + 1] > 10) {
        posArray[i3 + 1] = -4
        const theta = Math.random() * Math.PI * 2
        const r = 2 + Math.random() * 8
        posArray[i3] = Math.cos(theta) * r
        posArray[i3 + 2] = Math.sin(theta) * r - 5
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSize"
          count={particleCount}
          array={sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aOpacity"
          count={particleCount}
          array={opacities}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aPhase"
          count={particleCount}
          array={phases}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aSpeed"
          count={particleCount}
          array={speeds}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aDepth"
          count={particleCount}
          array={depths}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={particleVertexShader}
        fragmentShader={particleFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
