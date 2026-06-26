import { Suspense, useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Preload, Stars } from '@react-three/drei'
import * as THREE from 'three'
import FloatingParticles from './FloatingParticles'
import EnvironmentLights from './EnvironmentLights'
import SkillsBackground from './SkillsBackground'
import SkillsErrorBoundary from './SkillsErrorBoundary'

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return isMobile
}

function MouseParallaxCamera({ isMobile }) {
  const { camera } = useThree()
  const mouse = useRef({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useFrame((state, delta) => {
    if (isMobile) return

    const speed = 2
    target.current.x = THREE.MathUtils.lerp(target.current.x, mouse.current.x * 0.5, delta * speed)
    target.current.y = THREE.MathUtils.lerp(target.current.y, mouse.current.y * 0.3, delta * speed)

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, target.current.x, delta * speed)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 2 + target.current.y, delta * speed)
    camera.lookAt(0, 1, 0)
  })

  return null
}

function VolumetricFog() {
  const meshRef = useRef()

  useFrame((state) => {
    if (!meshRef.current) return
    const time = state.clock.getElapsedTime()
    meshRef.current.material.uniforms.uTime.value = time
  })

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#06b6d4') },
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
      float noise = sin(vUv.x * 5.0 + uTime * 0.5) * cos(vUv.y * 3.0 + uTime * 0.3) * 0.5 + 0.5;
      float fog = smoothstep(0.0, 0.5, vUv.y) * smoothstep(1.0, 0.6, vUv.y);
      float alpha = noise * fog * 0.08;

      float pulse = 0.8 + 0.2 * sin(uTime * 0.4);
      vec3 color = uColor * pulse;

      gl_FragColor = vec4(color, alpha);
    }
  `

  return (
    <mesh ref={meshRef} position={[0, 2, -5]} scale={[20, 8, 1]}>
      <planeGeometry args={[1, 1, 32, 32]} />
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

function AnimatedLightRays() {
  const meshRef = useRef()

  useFrame((state) => {
    if (!meshRef.current) return
    const time = state.clock.getElapsedTime()
    meshRef.current.material.uniforms.uTime.value = time
    meshRef.current.rotation.z = time * 0.05
  })

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#8b5cf6') },
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
      for (int i = 0; i < 8; i++) {
        float fi = float(i);
        float offset = sin(uTime * 0.3 + fi * 0.8) * 0.15;
        float width = 0.01 + fi * 0.003;
        float intensity = 1.0 / (1.0 + fi * 0.4);
        ray += intensity * smoothstep(width, 0.0, abs(vUv.x - 0.5 - offset));
      }

      float fade = smoothstep(1.0, 0.2, vUv.y) * smoothstep(0.0, 0.1, vUv.y);
      float alpha = ray * 0.12 * fade;

      vec3 color = uColor * (0.8 + 0.2 * sin(uTime * 0.5));

      gl_FragColor = vec4(color, alpha);
    }
  `

  return (
    <mesh ref={meshRef} position={[2, 5, -3]} rotation={[0.3, 0, 0]} scale={[4, 8, 1]}>
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

function LensFlare() {
  const meshRef = useRef()

  useFrame((state) => {
    if (!meshRef.current) return
    const time = state.clock.getElapsedTime()
    const scale = 1 + Math.sin(time * 2) * 0.1
    meshRef.current.scale.set(scale, scale, 1)
    meshRef.current.material.opacity = 0.15 + Math.sin(time * 1.5) * 0.05
  })

  return (
    <mesh ref={meshRef} position={[3, 4, -4]}>
      <circleGeometry args={[0.8, 32]} />
      <meshBasicMaterial
        color="#8b5cf6"
        transparent
        opacity={0.2}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  )
}

function NeonGlow() {
  const meshRef = useRef()

  useFrame((state) => {
    if (!meshRef.current) return
    const time = state.clock.getElapsedTime()
    meshRef.current.material.opacity = 0.1 + Math.sin(time * 0.8) * 0.05
  })

  return (
    <mesh ref={meshRef} position={[0, 3, -6]}>
      <ringGeometry args={[2, 4, 64]} />
      <meshBasicMaterial
        color="#06b6d4"
        transparent
        opacity={0.1}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

function GlassReflections({ isMobile }) {
  if (isMobile) return null

  const meshRef = useRef()

  useFrame((state) => {
    if (!meshRef.current) return
    const time = state.clock.getElapsedTime()
    meshRef.current.rotation.x = time * 0.1
    meshRef.current.rotation.y = time * 0.15
  })

  return (
    <mesh ref={meshRef} position={[0, 0, -3]}>
      <icosahedronGeometry args={[1.5, 1]} />
      <meshBasicMaterial
        color="#8b5cf6"
        wireframe
        transparent
        opacity={0.05}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

export default function SkillsScene({ children }) {
  const isMobile = useIsMobile()
  const particleCount = isMobile ? 80 : 200

  return (
    <div className="relative w-full min-h-screen" style={{ perspective: '1200px' }}>
      <div className="fixed inset-0 z-0">
        <SkillsErrorBoundary>
          <Canvas
            camera={{ position: [0, 2, 10], fov: 50, near: 0.1, far: 100 }}
            dpr={isMobile ? [1, 1] : [1, 1.5]}
            gl={{
              antialias: !isMobile,
              alpha: true,
              powerPreference: 'high-performance',
              stencil: false,
              depth: true,
            }}
            style={{ background: '#070B14' }}
          >
            <Suspense fallback={null}>
              <MouseParallaxCamera isMobile={isMobile} />

              <fog attach="fog" args={['#070B14', 8, 25]} />

              <SkillsBackground />
              <EnvironmentLights />
              <FloatingParticles count={particleCount} />

              {!isMobile && (
                <>
                  <VolumetricFog />
                  <AnimatedLightRays />
                  <LensFlare />
                  <NeonGlow />
                  <GlassReflections isMobile={isMobile} />
                </>
              )}

              <Stars
                radius={50}
                depth={50}
                count={isMobile ? 500 : 2000}
                factor={2}
                saturation={0}
                fade
                speed={0.5}
              />

              <Preload all />
            </Suspense>
          </Canvas>
        </SkillsErrorBoundary>
      </div>

      <div
        className="relative z-10"
        style={{
          transformStyle: 'preserve-3d',
          transform: 'translateZ(0)',
        }}
      >
        {children}
      </div>
    </div>
  )
}
