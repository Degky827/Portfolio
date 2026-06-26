import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PURPLE = new THREE.Color('#8b5cf6')
const CYAN = new THREE.Color('#22d3ee')
const INDIGO = new THREE.Color('#6366f1')
const DARK_NAVY = new THREE.Color('#070B14')

const gridVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying float vDist;

  void main() {
    vUv = uv;
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vDist = -mvPos.z;
    gl_Position = projectionMatrix * mvPos;
  }
`

const gridFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColor;
  varying vec2 vUv;
  varying float vDist;

  void main() {
    vec2 grid = abs(fract(vUv * 20.0 - 0.5) - 0.5);
    float line = min(grid.x, grid.y);
    float gridLine = 1.0 - smoothstep(0.0, 0.03, line);

    float pulse = 0.5 + 0.5 * sin(uTime * 0.3 + vUv.x * 6.28);
    float alpha = gridLine * 0.12 * pulse;

    float fade = 1.0 - smoothstep(0.0, 12.0, vDist);
    alpha *= fade;

    gl_FragColor = vec4(uColor, alpha);
  }
`

function AnimatedGrid() {
  const materialRef = useRef()

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: INDIGO },
    }),
    []
  )

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime()
    }
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[30, 30, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={gridVertexShader}
        fragmentShader={gridFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

const fogVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fogFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying vec2 vUv;

  void main() {
    float t = vUv.y;
    float wave1 = sin(vUv.x * 3.0 + uTime * 0.2) * 0.1;
    float wave2 = cos(vUv.x * 5.0 - uTime * 0.3) * 0.05;
    t += wave1 + wave2;

    vec3 color = mix(uColorA, uColorB, t);
    float alpha = 0.08 + 0.04 * sin(uTime * 0.4 + vUv.x * 4.0);

    float edgeFade = smoothstep(0.0, 0.3, vUv.y) * smoothstep(1.0, 0.7, vUv.y);
    alpha *= edgeFade;

    gl_FragColor = vec4(color, alpha);
  }
`

function GradientFog() {
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

  return (
    <group>
      <mesh position={[0, 3, -8]} scale={[24, 10, 1]}>
        <planeGeometry args={[1, 1, 64, 32]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={fogVertexShader}
          fragmentShader={fogFragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

const glowVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const glowFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColor;
  varying vec2 vUv;

  void main() {
    vec2 center = vUv - 0.5;
    float dist = length(center);
    float glow = 1.0 - smoothstep(0.0, 0.5, dist);
    glow = pow(glow, 3.0);

    float pulse = 0.6 + 0.4 * sin(uTime * 0.5);
    float alpha = glow * 0.25 * pulse;

    gl_FragColor = vec4(uColor, alpha);
  }
`

function AmbientGlow() {
  const materialRef = useRef()

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: PURPLE },
    }),
    []
  )

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime()
      const t = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.5 + 0.5
      materialRef.current.uniforms.uColor.value.lerpColors(PURPLE, CYAN, t)
    }
  })

  return (
    <mesh position={[0, 2, -6]} scale={[16, 8, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={glowVertexShader}
        fragmentShader={glowFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}

const volumetricVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const volumetricFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColor;
  varying vec2 vUv;

  void main() {
    float ray = 0.0;
    for (int i = 0; i < 8; i++) {
      float fi = float(i);
      float offset = sin(uTime * 0.3 + fi * 0.8) * 0.1;
      float width = 0.02 + fi * 0.005;
      float intensity = 1.0 / (1.0 + fi * 0.5);
      ray += intensity * smoothstep(width, 0.0, abs(vUv.x - 0.5 - offset));
    }

    float fade = smoothstep(1.0, 0.3, vUv.y) * smoothstep(0.0, 0.2, vUv.y);
    float alpha = ray * 0.15 * fade;

    gl_FragColor = vec4(uColor, alpha);
  }
`

function VolumetricLight() {
  const materialRef = useRef()

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('#6366f1') },
    }),
    []
  )

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime()
    }
  })

  return (
    <mesh position={[0, 5, -4]} rotation={[0.3, 0, 0]} scale={[6, 10, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={volumetricVertexShader}
        fragmentShader={volumetricFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

export default function SkillsBackground() {
  return (
    <group>
      <color attach="background" args={['#070B14']} />
      <fog attach="fog" args={[DARK_NAVY, 8, 22]} />
      <AnimatedGrid />
      <GradientFog />
      <AmbientGlow />
      <VolumetricLight />
    </group>
  )
}
