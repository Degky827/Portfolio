import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Float, Stars } from '@react-three/drei'
import * as THREE from 'three'
import TechChip3D from './TechChip3D'
import TechChipsErrorBoundary from './TechChipsErrorBoundary'

const DEFAULT_TECHS = ['React', 'Node', 'MongoDB', 'Next.js', 'Java', 'HTML', 'CSS']

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

function CameraRig({ isMobile }) {
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

  useFrame((_, delta) => {
    if (isMobile) return
    const speed = 1.5
    target.current.x = THREE.MathUtils.lerp(target.current.x, mouse.current.x * 0.3, delta * speed)
    target.current.y = THREE.MathUtils.lerp(target.current.y, mouse.current.y * 0.2, delta * speed)
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, target.current.x, delta * speed)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 1 + target.current.y, delta * speed)
    camera.lookAt(0, 0.5, 0)
  })

  return null
}

function ChipArrangement({ techs, isMobile }) {
  const positions = useMemo(() => {
    if (isMobile) {
      return techs.map((_, i) => {
        const row = Math.floor(i / 2)
        const col = i % 2
        const x = col === 0 ? -1.4 : 1.4
        const y = 1.8 - row * 1.3
        return [x, y, 0]
      })
    }

    const cols = techs.length <= 4 ? techs.length : Math.min(4, techs.length)
    const totalWidth = (cols - 1) * 2.8
    const startX = -totalWidth / 2

    return techs.map((_, i) => {
      const row = Math.floor(i / 4)
      const col = i % 4
      const x = startX + col * 2.8
      const y = 1.5 - row * 1.5
      const z = -Math.abs(col - (cols - 1) / 2) * 0.3
      return [x, y, z]
    })
  }, [techs.length, isMobile])

  return (
    <group>
      {techs.map((tech, i) => (
        <TechChip3D
          key={tech}
          name={tech}
          position={positions[i]}
          index={i}
        />
      ))}
    </group>
  )
}

function VolumetricFog() {
  const meshRef = useRef()

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.material.uniforms.uTime.value = state.clock.getElapsedTime()
  })

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#6366f1') },
  }), [])

  return (
    <mesh ref={meshRef} position={[0, 1, -6]} scale={[25, 12, 1]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform vec3 uColor;
          varying vec2 vUv;
          void main() {
            float noise = sin(vUv.x * 4.0 + uTime * 0.3) * cos(vUv.y * 3.0 + uTime * 0.2) * 0.5 + 0.5;
            float fog = smoothstep(0.0, 0.5, vUv.y) * smoothstep(1.0, 0.5, vUv.y);
            float alpha = noise * fog * 0.06;
            vec3 color = uColor * (0.8 + 0.2 * sin(uTime * 0.3));
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

export default function TechChipsScene({
  techs = DEFAULT_TECHS,
  className = '',
  height = '400px',
}) {
  const isMobile = useIsMobile()

  return (
    <TechChipsErrorBoundary>
      <div className={`relative w-full ${className}`} style={{ height }}>
        <div className="absolute inset-0">
          <Canvas
            camera={{ position: [0, 1, 7], fov: 50, near: 0.1, far: 100 }}
            dpr={isMobile ? [1, 1] : [1, 1.5]}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: 'high-performance',
              stencil: false,
              depth: true,
            }}
            style={{ background: 'transparent' }}
          >
            <fog attach="fog" args={['#070B14', 6, 18]} />

            <ambientLight intensity={0.3} color="#c7d2fe" />

            <directionalLight
              position={[4, 6, 5]}
              intensity={0.8}
              color="#818cf8"
            />

            <pointLight position={[-4, 3, -2]} intensity={0.6} color="#8b5cf6" distance={15} decay={2} />
            <pointLight position={[4, 2, -1]} intensity={0.5} color="#22d3ee" distance={12} decay={2} />
            <pointLight position={[0, -2, 3]} intensity={0.3} color="#6366f1" distance={10} decay={2} />

            <CameraRig isMobile={isMobile} />

            <ChipArrangement techs={techs} isMobile={isMobile} />

            <VolumetricFog />

            <Stars
              radius={30}
              depth={30}
              count={isMobile ? 200 : 600}
              factor={2}
              saturation={0}
              fade
              speed={0.4}
            />

            <Environment preset="night" />
          </Canvas>
        </div>
      </div>
    </TechChipsErrorBoundary>
  )
}
