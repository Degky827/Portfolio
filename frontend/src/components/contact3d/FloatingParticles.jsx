import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = `
  attribute float aSize;
  attribute float aOpacity;
  attribute float aPhase;
  attribute float aSpeed;
  uniform float uTime;
  uniform vec2 uMouse;
  varying float vOpacity;
  varying float vPhase;
  varying float vDist;

  void main() {
    vOpacity = aOpacity;
    vPhase = aPhase;

    vec3 pos = position;
    float t = uTime * aSpeed;

    pos.y += sin(t + aPhase * 6.28) * 0.5;
    pos.x += cos(t * 0.7 + aPhase * 3.14) * 0.3;
    pos.z += sin(t * 0.5 + aPhase * 4.71) * 0.2;
    pos.x += sin(t * 0.15 + aPhase * 5.0) * 0.1;

    vec3 mouseEffect = vec3(uMouse.x * 0.8, uMouse.y * 0.5, 0.0);
    pos += mouseEffect * (1.0 - smoothstep(0.0, 12.0, length(pos)));

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    vDist = -mvPosition.z;
    gl_PointSize = aSize * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const fragmentShader = `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  uniform float uTime;
  varying float vOpacity;
  varying float vPhase;
  varying float vDist;

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

    float depthFade = 1.0 - smoothstep(5.0, 25.0, vDist);
    alpha *= depthFade;

    gl_FragColor = vec4(color, alpha);
  }
`

const INDIGO = new THREE.Color('#6366f1')
const CYAN = new THREE.Color('#06b6d4')
const PURPLE = new THREE.Color('#8b5cf6')

export default function FloatingParticles({ count = 120 }) {
  const pointsRef = useRef()
  const materialRef = useRef()
  const mouseRef = useRef({ x: 0, y: 0 })
  const particleCount = count

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const { positions, sizes, opacities, phases, speeds } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    const opacities = new Float32Array(particleCount)
    const phases = new Float32Array(particleCount)
    const speeds = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      const theta = Math.random() * Math.PI * 2
      const r = 3 + Math.random() * 10
      positions[i3] = Math.cos(theta) * r
      positions[i3 + 1] = Math.random() * 16 - 5
      positions[i3 + 2] = Math.sin(theta) * r - 6

      sizes[i] = 0.6 + Math.random() * 3.5
      opacities[i] = 0.08 + Math.random() * 0.45
      phases[i] = Math.random()
      speeds[i] = 0.12 + Math.random() * 0.45
    }

    return { positions, sizes, opacities, phases, speeds }
  }, [particleCount])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uColorA: { value: INDIGO },
      uColorB: { value: CYAN },
      uColorC: { value: PURPLE },
    }),
    []
  )

  useFrame((state) => {
    if (!pointsRef.current || !materialRef.current) return
    const time = state.clock.getElapsedTime()
    materialRef.current.uniforms.uTime.value = time

    const targetX = mouseRef.current.x * 0.5
    const targetY = mouseRef.current.y * 0.3
    materialRef.current.uniforms.uMouse.value.x += (targetX - materialRef.current.uniforms.uMouse.value.x) * 0.05
    materialRef.current.uniforms.uMouse.value.y += (targetY - materialRef.current.uniforms.uMouse.value.y) * 0.05

    const posArray = pointsRef.current.geometry.attributes.position.array
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      posArray[i3 + 1] += 0.003 + Math.sin(time * 0.1 + phases[i] * 5) * 0.001
      posArray[i3] += Math.sin(time * 0.15 + phases[i] * 8) * 0.0008
      posArray[i3 + 2] += Math.cos(time * 0.1 + phases[i] * 6) * 0.0004

      if (posArray[i3 + 1] > 12) {
        posArray[i3 + 1] = -5
        const theta = Math.random() * Math.PI * 2
        const r = 3 + Math.random() * 10
        posArray[i3] = Math.cos(theta) * r
        posArray[i3 + 2] = Math.sin(theta) * r - 6
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aSize" count={particleCount} array={sizes} itemSize={1} />
        <bufferAttribute attach="attributes-aOpacity" count={particleCount} array={opacities} itemSize={1} />
        <bufferAttribute attach="attributes-aPhase" count={particleCount} array={phases} itemSize={1} />
        <bufferAttribute attach="attributes-aSpeed" count={particleCount} array={speeds} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
