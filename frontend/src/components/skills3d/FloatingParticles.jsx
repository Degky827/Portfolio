import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 300
const BURST_COUNT = 50

const particleVertexShader = /* glsl */ `
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

const particleFragmentShader = /* glsl */ `
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

const CYAN = new THREE.Color('#22d3ee')
const PURPLE = new THREE.Color('#8b5cf6')
const INDIGO = new THREE.Color('#6366f1')
const LIGHT_CYAN = new THREE.Color('#67e8f9')

export default function FloatingParticles() {
  const pointsRef = useRef()
  const materialRef = useRef()

  const { positions, sizes, opacities, phases, speeds } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const sizes = new Float32Array(PARTICLE_COUNT)
    const opacities = new Float32Array(PARTICLE_COUNT)
    const phases = new Float32Array(PARTICLE_COUNT)
    const speeds = new Float32Array(PARTICLE_COUNT)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
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
  }, [])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: CYAN },
      uColorB: { value: PURPLE },
    }),
    []
  )

  useFrame((state) => {
    if (!pointsRef.current || !materialRef.current) return

    const time = state.clock.getElapsedTime()
    materialRef.current.uniforms.uTime.value = time

    const posArray = pointsRef.current.geometry.attributes.position.array
    for (let i = 0; i < PARTICLE_COUNT; i++) {
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
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSize"
          count={PARTICLE_COUNT}
          array={sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aOpacity"
          count={PARTICLE_COUNT}
          array={opacities}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aPhase"
          count={PARTICLE_COUNT}
          array={phases}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aSpeed"
          count={PARTICLE_COUNT}
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

const burstVertexShader = /* glsl */ `
  attribute float aSize;
  attribute float aOpacity;
  attribute float aPhase;
  attribute vec3 aVelocity;
  uniform float uTime;
  uniform float uBurstTime;
  varying float vOpacity;
  varying float vPhase;

  void main() {
    vOpacity = aOpacity;
    vPhase = aPhase;

    float elapsed = uTime - uBurstTime;
    if (elapsed < 0.0 || elapsed > 3.0) {
      vOpacity = 0.0;
      gl_Position = vec4(0.0);
      gl_PointSize = 0.0;
      return;
    }

    float decay = 1.0 - elapsed / 3.0;
    vec3 pos = position + aVelocity * elapsed * 2.0;
    pos.y -= 0.5 * elapsed * elapsed;

    vOpacity = aOpacity * decay;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * decay * (200.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const burstFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  varying float vOpacity;
  varying float vPhase;

  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;

    float glow = 1.0 - smoothstep(0.0, 0.5, dist);
    glow = pow(glow, 1.5);
    float alpha = glow * vOpacity;

    gl_FragColor = vec4(uColor, alpha);
  }
`

function BurstParticles() {
  const pointsRef = useRef()
  const materialRef = useRef()

  const { positions, sizes, opacities, phases, velocities } = useMemo(() => {
    const positions = new Float32Array(BURST_COUNT * 3)
    const sizes = new Float32Array(BURST_COUNT)
    const opacities = new Float32Array(BURST_COUNT)
    const phases = new Float32Array(BURST_COUNT)
    const velocities = new Float32Array(BURST_COUNT * 3)

    for (let i = 0; i < BURST_COUNT; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 2
      positions[i3 + 1] = Math.random() * 2
      positions[i3 + 2] = (Math.random() - 0.5) * 2

      sizes[i] = 2 + Math.random() * 4
      opacities[i] = 0.3 + Math.random() * 0.5
      phases[i] = Math.random()

      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      const speed = 1 + Math.random() * 2
      velocities[i3] = Math.sin(phi) * Math.cos(theta) * speed
      velocities[i3 + 1] = Math.cos(phi) * speed * 0.5 + 1
      velocities[i3 + 2] = Math.sin(phi) * Math.sin(theta) * speed
    }

    return { positions, sizes, opacities, phases, velocities }
  }, [])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uBurstTime: { value: -10 },
      uColor: { value: LIGHT_CYAN },
    }),
    []
  )

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime()
    }
  })

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={BURST_COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSize"
          count={BURST_COUNT}
          array={sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aOpacity"
          count={BURST_COUNT}
          array={opacities}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aPhase"
          count={BURST_COUNT}
          array={phases}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aVelocity"
          count={BURST_COUNT}
          array={velocities}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={burstVertexShader}
        fragmentShader={burstFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export { BurstParticles }
