import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ─── Inline Shaders ──────────────────────────────────────────────

const waveVertexShader = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  varying float vWave;

  void main() {
    vUv = uv;
    vec3 pos = position;

    float wave1 = sin(pos.x * 2.0 + uTime * 0.4) * 0.15;
    float wave2 = sin(pos.x * 4.0 - uTime * 0.6) * 0.08;
    float wave3 = cos(pos.x * 1.5 + uTime * 0.3) * 0.12;
    float combined = wave1 + wave2 + wave3;

    pos.y += combined;
    vWave = combined;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const waveFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying vec2 vUv;
  varying float vWave;

  void main() {
    float line = abs(vWave);
    float glow = 0.02 / (line + 0.02);
    glow = pow(glow, 1.5);

    vec3 color = mix(uColorA, uColorB, vUv.x + sin(uTime * 0.2) * 0.3);
    float alpha = glow * 0.6;

    // Fade at edges
    float edgeFade = smoothstep(0.0, 0.1, vUv.x) * smoothstep(1.0, 0.9, vUv.x);
    alpha *= edgeFade;

    gl_FragColor = vec4(color, alpha);
  }
`

const particleVertexShader = /* glsl */ `
  attribute float aSize;
  attribute float aOpacity;
  attribute float aPhase;
  uniform float uTime;
  varying float vOpacity;
  varying float vPhase;

  void main() {
    vOpacity = aOpacity;
    vPhase = aPhase;

    vec3 pos = position;
    pos.y += sin(uTime * 0.3 + aPhase) * 0.1;
    pos.x += cos(uTime * 0.2 + aPhase * 1.3) * 0.05;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const particleFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uTime;
  varying float vOpacity;
  varying float vPhase;

  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;

    float glow = 1.0 - smoothstep(0.0, 0.5, dist);
    glow = pow(glow, 2.0);

    float pulse = 0.7 + 0.3 * sin(uTime * 0.8 + vPhase * 6.28);
    float alpha = glow * vOpacity * pulse;

    gl_FragColor = vec4(uColor, alpha);
  }
`

const nodeVertexShader = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  uniform float uTime;
  varying float vPhase;

  void main() {
    vPhase = aPhase;

    vec3 pos = position;
    pos.y += sin(uTime * 0.4 + aPhase * 3.14) * 0.05;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * (400.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const nodeFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uTime;
  varying float vPhase;

  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;

    float core = 1.0 - smoothstep(0.0, 0.15, dist);
    float glow = 1.0 - smoothstep(0.0, 0.5, dist);
    glow = pow(glow, 1.5);

    float pulse = 0.6 + 0.4 * sin(uTime * 0.6 + vPhase * 6.28);
    float alpha = (core + glow * 0.5) * pulse;

    gl_FragColor = vec4(uColor * 1.5, alpha);
  }
`

// ─── Constants ────────────────────────────────────────────────────

const PARTICLE_COUNT = 200
const NODE_COUNT = 28
const CONNECTION_DISTANCE = 2.8
const BG_WIDTH = 16
const BG_HEIGHT = 8
const BG_DEPTH = 4

const PURPLE = new THREE.Color('#8b5cf6')
const CYAN = new THREE.Color('#22d3ee')
const INDIGO = new THREE.Color('#6366f1')
const LIGHT_PURPLE = new THREE.Color('#c4b5fd')
const LIGHT_CYAN = new THREE.Color('#67e8f9')

// ─── Wave Lines ──────────────────────────────────────────────────

function WaveLines() {
  const materialRef = useRef()

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: PURPLE },
      uColorB: { value: CYAN },
    }),
    []
  )

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime()
    }
  })

  // Generate multiple wave layers at different depths
  const layers = useMemo(() => {
    return [
      { y: 1.0, z: -3.5, opacity: 0.4, scale: [BG_WIDTH, 2, 1] },
      { y: 2.5, z: -4.0, opacity: 0.25, scale: [BG_WIDTH * 1.2, 1.5, 1] },
      { y: 0.0, z: -4.5, opacity: 0.15, scale: [BG_WIDTH * 0.8, 1, 1] },
    ]
  }, [])

  return (
    <group>
      {layers.map((layer, i) => (
        <mesh
          key={i}
          position={[0, layer.y, layer.z]}
          scale={layer.scale}
        >
          <planeGeometry args={[1, 1, 128, 32]} />
          <shaderMaterial
            ref={i === 0 ? materialRef : undefined}
            vertexShader={waveVertexShader}
            fragmentShader={waveFragmentShader}
            uniforms={uniforms}
            transparent
            depthWrite={false}
            side={THREE.DoubleSide}
            opacity={layer.opacity}
          />
        </mesh>
      ))}
    </group>
  )
}

// ─── Particle System ─────────────────────────────────────────────

function ParticleSystem() {
  const pointsRef = useRef()
  const materialRef = useRef()

  const { positions, sizes, opacities, phases } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const sizes = new Float32Array(PARTICLE_COUNT)
    const opacities = new Float32Array(PARTICLE_COUNT)
    const phases = new Float32Array(PARTICLE_COUNT)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * BG_WIDTH * 1.5
      positions[i3 + 1] = Math.random() * BG_HEIGHT - 1
      positions[i3 + 2] = -3 - Math.random() * BG_DEPTH

      sizes[i] = 1.5 + Math.random() * 3.0
      opacities[i] = 0.2 + Math.random() * 0.5
      phases[i] = Math.random()
    }

    return { positions, sizes, opacities, phases }
  }, [])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: LIGHT_PURPLE },
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
      posArray[i3 + 1] += 0.003
      posArray[i3] += Math.sin(time * 0.3 + phases[i] * 10) * 0.001

      if (posArray[i3 + 1] > BG_HEIGHT) {
        posArray[i3 + 1] = -1
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

// ─── Glowing Nodes ───────────────────────────────────────────────

function GlowingNodes() {
  const pointsRef = useRef()
  const materialRef = useRef()

  const { positions, sizes, phases } = useMemo(() => {
    const positions = new Float32Array(NODE_COUNT * 3)
    const sizes = new Float32Array(NODE_COUNT)
    const phases = new Float32Array(NODE_COUNT)

    for (let i = 0; i < NODE_COUNT; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * BG_WIDTH * 1.2
      positions[i3 + 1] = Math.random() * BG_HEIGHT * 0.8 - 0.5
      positions[i3 + 2] = -3.2 - Math.random() * 2.5

      sizes[i] = 4 + Math.random() * 6
      phases[i] = Math.random()
    }

    return { positions, sizes, phases }
  }, [])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: PURPLE.clone() },
    }),
    []
  )

  useFrame((state) => {
    if (materialRef.current) {
      const time = state.clock.getElapsedTime()
      materialRef.current.uniforms.uTime.value = time

      // Slowly shift color between purple and cyan
      const t = Math.sin(time * 0.15) * 0.5 + 0.5
      materialRef.current.uniforms.uColor.value.lerpColors(PURPLE, CYAN, t)
    }
  })

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={NODE_COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSize"
          count={NODE_COUNT}
          array={sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aPhase"
          count={NODE_COUNT}
          array={phases}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={nodeVertexShader}
        fragmentShader={nodeFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// ─── Neon Connections ────────────────────────────────────────────

function NeonConnections() {
  const lineRef = useRef()
  const materialRef = useRef()

  const { nodePositions, linePositions, lineColors } = useMemo(() => {
    const nodePositions = new Float32Array(NODE_COUNT * 3)
    for (let i = 0; i < NODE_COUNT; i++) {
      const i3 = i * 3
      nodePositions[i3] = (Math.random() - 0.5) * BG_WIDTH * 1.2
      nodePositions[i3 + 1] = Math.random() * BG_HEIGHT * 0.8 - 0.5
      nodePositions[i3 + 2] = -3.2 - Math.random() * 2.5
    }

    // Build connections between nearby nodes
    const maxConnections = NODE_COUNT * 3
    const linePositions = new Float32Array(maxConnections * 6) // 2 verts per line * 3 components
    const lineColors = new Float32Array(maxConnections * 6)    // 2 verts * 3 components

    let lineIdx = 0
    for (let i = 0; i < NODE_COUNT && lineIdx < maxConnections; i++) {
      for (let j = i + 1; j < NODE_COUNT && lineIdx < maxConnections; j++) {
        const i3 = i * 3
        const j3 = j * 3
        const dx = nodePositions[i3] - nodePositions[j3]
        const dy = nodePositions[i3 + 1] - nodePositions[j3 + 1]
        const dz = nodePositions[i3 + 2] - nodePositions[j3 + 2]
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

        if (dist < CONNECTION_DISTANCE) {
          const idx = lineIdx * 6
          linePositions[idx] = nodePositions[i3]
          linePositions[idx + 1] = nodePositions[i3 + 1]
          linePositions[idx + 2] = nodePositions[i3 + 2]
          linePositions[idx + 3] = nodePositions[j3]
          linePositions[idx + 4] = nodePositions[j3 + 1]
          linePositions[idx + 5] = nodePositions[j3 + 2]

          // Color gradient based on distance
          const t = dist / CONNECTION_DISTANCE
          const r = INDIGO.r * (1 - t) + PURPLE.r * t
          const g = INDIGO.g * (1 - t) + PURPLE.g * t
          const b = INDIGO.b * (1 - t) + PURPLE.b * t

          lineColors[idx] = r
          lineColors[idx + 1] = g
          lineColors[idx + 2] = b
          lineColors[idx + 3] = r
          lineColors[idx + 4] = g
          lineColors[idx + 5] = b

          lineIdx++
        }
      }
    }

    // Trim to actual line count
    return {
      nodePositions,
      linePositions: linePositions.slice(0, lineIdx * 6),
      lineColors: lineColors.slice(0, lineIdx * 6),
    }
  }, [])

  useFrame((state) => {
    if (materialRef.current) {
      const time = state.clock.getElapsedTime()
      materialRef.current.opacity = 0.15 + Math.sin(time * 0.5) * 0.08
    }
  })

  const lineCount = linePositions.length / 6

  return (
    <lineSegments frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={lineCount * 2}
          array={linePositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={lineCount * 2}
          array={lineColors}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        ref={materialRef}
        vertexColors
        transparent
        opacity={0.2}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  )
}

// ─── Ambient Light Pulses ────────────────────────────────────────

function AmbientPulses() {
  const light1Ref = useRef()
  const light2Ref = useRef()
  const light3Ref = useRef()

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    if (light1Ref.current) {
      light1Ref.current.intensity = 0.3 + Math.sin(time * 0.4) * 0.2
    }
    if (light2Ref.current) {
      light2Ref.current.intensity = 0.25 + Math.sin(time * 0.5 + 1.5) * 0.15
    }
    if (light3Ref.current) {
      light3Ref.current.intensity = 0.2 + Math.sin(time * 0.3 + 3.0) * 0.15
    }
  })

  return (
    <group>
      <pointLight
        ref={light1Ref}
        position={[-3, 2, -3.5]}
        color={PURPLE}
        distance={10}
        decay={2}
      />
      <pointLight
        ref={light2Ref}
        position={[4, 1, -4]}
        color={CYAN}
        distance={10}
        decay={2}
      />
      <pointLight
        ref={light3Ref}
        position={[0, 3, -4.5]}
        color={INDIGO}
        distance={8}
        decay={2}
      />
    </group>
  )
}

// ─── Main Export ──────────────────────────────────────────────────

export default function NeonBackground() {
  return (
    <group>
      <WaveLines />
      <ParticleSystem />
      <GlowingNodes />
      <NeonConnections />
      <AmbientPulses />
    </group>
  )
}
