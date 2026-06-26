import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const particleVertexShader = `
  attribute float aSize;
  attribute float aOpacity;
  attribute float aPhase;
  attribute float aSpeed;
  uniform float uTime;
  varying float vOpacity;
  varying float vPhase;

  void main() {
    vOpacity = aOpacity;
    vPhase = aPhase;

    vec3 pos = position;
    float t = uTime * aSpeed;

    pos.y += sin(t + aPhase * 6.28) * 0.3;
    pos.x += cos(t * 0.7 + aPhase * 3.14) * 0.15;
    pos.z += sin(t * 0.5 + aPhase * 4.71) * 0.1;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * (250.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const particleFragmentShader = `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uTime;
  varying float vOpacity;
  varying float vPhase;

  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;

    float core = 1.0 - smoothstep(0.0, 0.12, dist);
    float glow = 1.0 - smoothstep(0.0, 0.5, dist);
    glow = pow(glow, 2.0);

    float pulse = 0.6 + 0.4 * sin(uTime * 0.8 + vPhase * 6.28);
    float alpha = (core + glow * 0.4) * vOpacity * pulse;

    vec3 color = mix(uColorA, uColorB, vPhase);

    gl_FragColor = vec4(color, alpha);
  }
`

const TEAL = new THREE.Color('#06b6d4')
const PURPLE = new THREE.Color('#8b5cf6')

export default function FloatingParticles({ count = 200 }) {
  const pointsRef = useRef()
  const materialRef = useRef()
  const particleCount = count

  const { positions, sizes, opacities, phases, speeds } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    const opacities = new Float32Array(particleCount)
    const phases = new Float32Array(particleCount)
    const speeds = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 20
      positions[i3 + 1] = Math.random() * 12 - 3
      positions[i3 + 2] = (Math.random() - 0.5) * 10 - 2

      sizes[i] = 1.0 + Math.random() * 3.5
      opacities[i] = 0.15 + Math.random() * 0.45
      phases[i] = Math.random()
      speeds[i] = 0.2 + Math.random() * 0.6
    }

    return { positions, sizes, opacities, phases, speeds }
  }, [particleCount])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: TEAL },
      uColorB: { value: PURPLE },
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
      posArray[i3 + 1] += 0.002
      posArray[i3] += Math.sin(time * 0.2 + phases[i] * 10) * 0.0005

      if (posArray[i3 + 1] > 9) {
        posArray[i3 + 1] = -3
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
