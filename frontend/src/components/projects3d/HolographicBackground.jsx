import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const TEAL = new THREE.Color('#06b6d4')
const PURPLE = new THREE.Color('#8b5cf6')
const INDIGO = new THREE.Color('#6366f1')

function AnimatedGrid() {
  const meshRef = useRef()

  useFrame((state) => {
    if (!meshRef.current) return
    const time = state.clock.getElapsedTime()
    meshRef.current.material.uniforms.uTime.value = time
  })

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: TEAL },
  }), [])

  const vertexShader = `
    varying vec2 vUv;
    varying float vDist;
    void main() {
      vUv = uv;
      vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
      vDist = -mvPos.z;
      gl_Position = projectionMatrix * mvPos;
    }
  `

  const fragmentShader = `
    uniform float uTime;
    uniform vec3 uColor;
    varying vec2 vUv;
    varying float vDist;

    void main() {
      vec2 uv = vUv * 40.0;
      float gridX = step(0.95, fract(uv.x));
      float gridY = step(0.95, fract(uv.y));
      float grid = max(gridX, gridY);

      float dist = length(vUv - 0.5) * 2.0;
      float fade = 1.0 - smoothstep(0.3, 1.0, dist);

      float pulse = 0.6 + 0.4 * sin(uTime * 0.5 + dist * 3.0);
      float alpha = grid * fade * 0.15 * pulse;

      float depthFade = 1.0 - smoothstep(2.0, 20.0, vDist);
      alpha *= depthFade;

      vec3 color = mix(uColor, vec3(0.545, 0.361, 0.965), dist * 0.5);

      gl_FragColor = vec4(color, alpha);
    }
  `

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[50, 50, 1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

function GradientFog() {
  const meshRef = useRef()

  useFrame((state) => {
    if (!meshRef.current) return
    const time = state.clock.getElapsedTime()
    meshRef.current.material.uniforms.uTime.value = time
  })

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColorA: { value: PURPLE },
    uColorB: { value: TEAL },
  }), [])

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `

  const fragmentShader = `
    uniform float uTime;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    varying vec2 vUv;

    void main() {
      float wave = sin(vUv.x * 3.0 + uTime * 0.3) * 0.1;
      float fog = smoothstep(0.0, 0.5, vUv.y + wave) * smoothstep(1.0, 0.5, vUv.y + wave);
      float alpha = fog * 0.12;

      float t = sin(uTime * 0.2) * 0.5 + 0.5;
      vec3 color = mix(uColorA, uColorB, t);

      gl_FragColor = vec4(color, alpha);
    }
  `

  return (
    <mesh ref={meshRef} position={[0, 2, -10]}>
      <planeGeometry args={[30, 12, 1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

function AmbientGlow() {
  const meshRef = useRef()

  useFrame((state) => {
    if (!meshRef.current) return
    const time = state.clock.getElapsedTime()
    meshRef.current.material.uniforms.uTime.value = time
    const s = 1 + Math.sin(time * 0.3) * 0.1
    meshRef.current.scale.set(s, s, 1)
  })

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColorA: { value: PURPLE },
    uColorB: { value: TEAL },
  }), [])

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `

  const fragmentShader = `
    uniform float uTime;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    varying vec2 vUv;

    void main() {
      float dist = length(vUv - 0.5) * 2.0;
      float glow = 1.0 - smoothstep(0.0, 1.0, dist);
      glow = pow(glow, 3.0);

      float t = sin(uTime * 0.4) * 0.5 + 0.5;
      vec3 color = mix(uColorA, uColorB, t);

      float alpha = glow * 0.25;

      gl_FragColor = vec4(color, alpha);
    }
  `

  return (
    <mesh ref={meshRef} position={[0, 1, -4]}>
      <planeGeometry args={[16, 10, 1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

function VolumetricLight() {
  const meshRef = useRef()

  useFrame((state) => {
    if (!meshRef.current) return
    const time = state.clock.getElapsedTime()
    meshRef.current.material.uniforms.uTime.value = time
  })

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: TEAL },
  }), [])

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `

  const fragmentShader = `
    uniform float uTime;
    uniform vec3 uColor;
    varying vec2 vUv;

    void main() {
      float ray = 0.0;
      for (int i = 0; i < 6; i++) {
        float fi = float(i);
        float offset = sin(uTime * 0.2 + fi * 1.2) * 0.12;
        float width = 0.008 + fi * 0.004;
        float intensity = 1.0 / (1.0 + fi * 0.5);
        ray += intensity * smoothstep(width, 0.0, abs(vUv.x - 0.5 - offset));
      }

      float fade = smoothstep(1.0, 0.1, vUv.y) * smoothstep(0.0, 0.15, vUv.y);
      float alpha = ray * 0.08 * fade;

      vec3 color = uColor * (0.8 + 0.2 * sin(uTime * 0.6));

      gl_FragColor = vec4(color, alpha);
    }
  `

  return (
    <mesh ref={meshRef} position={[-2, 5, -5]} rotation={[0.2, 0, 0]} scale={[4, 10, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

function LightOrbs() {
  const group = useRef()

  useFrame((state) => {
    if (!group.current) return
    const time = state.clock.getElapsedTime()
    group.current.children.forEach((child, i) => {
      child.position.y = 1 + Math.sin(time * 0.5 + i * 2.1) * 0.8
      child.position.x = (i - 1.5) * 3 + Math.cos(time * 0.3 + i * 1.7) * 0.5
      child.material.opacity = 0.15 + Math.sin(time * 0.8 + i * 1.3) * 0.08
      const s = 0.6 + Math.sin(time * 0.6 + i) * 0.15
      child.scale.set(s, s, s)
    })
  })

  return (
    <group ref={group}>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[(i - 1.5) * 3, 1, -6]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? '#06b6d4' : '#8b5cf6'}
            transparent
            opacity={0.15}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}

export default function HolographicBackground() {
  return (
    <group>
      <AnimatedGrid />
      <GradientFog />
      <AmbientGlow />
      <VolumetricLight />
      <LightOrbs />
    </group>
  )
}
