import { Suspense, lazy, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Preload, Float } from '@react-three/drei'
import * as THREE from 'three'

const Desk = lazy(() => import('./Desk'))
const Monitor = lazy(() => import('./Monitor'))
const Keyboard = lazy(() => import('./Keyboard'))
const PC = lazy(() => import('./PC'))
const Speaker = lazy(() => import('./Speaker'))

/**
 * WorkspaceScene
 *
 * Fullscreen 3D workspace with a futuristic desk setup.
 * Purple neon environment, dark room, soft fog.
 *
 * Usage:
 *   <WorkspaceScene />  // renders fullscreen Canvas
 */
export default function WorkspaceScene() {
  const fogColor = useMemo(() => new THREE.Color('#0a0a1a'), [])
  const purpleColor = useMemo(() => new THREE.Color('#8b5cf6'), [])
  const cyanColor = useMemo(() => new THREE.Color('#22d3ee'), [])

  return (
    <div className="w-full h-screen bg-[#0a0a1a]">
      <Canvas
        camera={{ position: [0, 2, 5], fov: 50, near: 0.1, far: 100 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        shadows
        style={{ background: '#0a0a1a' }}
      >
        <color attach="background" args={['#0a0a1a']} />
        <fog attach="fog" args={[fogColor, 6, 18]} />

        {/* Ambient fill */}
        <ambientLight intensity={0.08} color="#c7d2fe" />

        {/* Key light - warm indigo from above */}
        <directionalLight
          position={[3, 5, 4]}
          intensity={0.8}
          color="#818cf8"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={0.1}
          shadow-camera-far={20}
          shadow-camera-left={-5}
          shadow-camera-right={5}
          shadow-camera-top={5}
          shadow-camera-bottom={-5}
        />

        {/* Purple rim light - left */}
        <pointLight
          position={[-4, 2, -2]}
          intensity={1.2}
          color={purpleColor}
          distance={15}
        />

        {/* Cyan accent light - right */}
        <pointLight
          position={[4, 1, -1]}
          intensity={0.6}
          color={cyanColor}
          distance={12}
        />

        {/* Floor bounce light */}
        <pointLight
          position={[0, -1, 2]}
          intensity={0.3}
          color="#a78bfa"
          distance={8}
        />

        {/* Under-desk purple glow */}
        <pointLight
          position={[0, 0.3, 0.5]}
          intensity={0.4}
          color={purpleColor}
          distance={3}
        />

        {/* Ground plane with shadow reception */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.01, 0]}
          receiveShadow
        >
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial
            color="#050210"
            roughness={0.8}
            metalness={0.2}
          />
        </mesh>

        {/* Ground glow strip */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 1.5]}>
          <planeGeometry args={[4, 0.5]} />
          <meshStandardMaterial
            color={purpleColor}
            emissive={purpleColor}
            emissiveIntensity={0.5}
            transparent
            opacity={0.3}
          />
        </mesh>

        {/* Back wall */}
        <mesh position={[0, 2.5, -2]} receiveShadow>
          <planeGeometry args={[12, 6]} />
          <meshStandardMaterial
            color="#080418"
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>

        {/* Wall accent glow strip */}
        <mesh position={[0, 3.5, -1.99]}>
          <boxGeometry args={[8, 0.02, 0.01]} />
          <meshStandardMaterial
            color={purpleColor}
            emissive={purpleColor}
            emissiveIntensity={2}
          />
        </mesh>

        <mesh position={[0, 1.5, -1.99]}>
          <boxGeometry args={[6, 0.01, 0.01]} />
          <meshStandardMaterial
            color={cyanColor}
            emissive={cyanColor}
            emissiveIntensity={1.5}
          />
        </mesh>

        {/* 3D Models */}
        <Suspense fallback={null}>
          {/* Desk centered */}
          <Desk position={[0, 0, 0]} />

          {/* Monitor on desk */}
          <Monitor position={[0, 0, -0.3]} />

          {/* Keyboard on desk */}
          <Keyboard position={[0, 0, 0.25]} />

          {/* Mouse on desk */}
          <Float speed={2} rotationIntensity={0} floatIntensity={0.1}>
            <group position={[0.9, 0.78, 0.3]}>
              <mesh castShadow>
                <boxGeometry args={[0.12, 0.03, 0.18]} />
                <meshStandardMaterial
                  color="#0f0a2a"
                  roughness={0.2}
                  metalness={0.8}
                />
              </mesh>
              {/* Mouse scroll wheel */}
              <mesh position={[0, 0.02, -0.03]}>
                <cylinderGeometry args={[0.01, 0.01, 0.02, 8]} />
                <meshStandardMaterial
                  color={cyanColor}
                  emissive={cyanColor}
                  emissiveIntensity={2}
                />
              </mesh>
              {/* Mouse glow */}
              <mesh position={[0, -0.01, 0]}>
                <boxGeometry args={[0.1, 0.005, 0.16]} />
                <meshStandardMaterial
                  color={purpleColor}
                  emissive={purpleColor}
                  emissiveIntensity={1}
                  transparent
                  opacity={0.5}
                />
              </mesh>
            </group>
          </Float>

          {/* PC Tower - left side of desk */}
          <PC position={[-2.2, 0, 0.3]} />

          {/* Speakers */}
          <Speaker position={[-1.8, 0.78, 0.1]} side="left" />
          <Speaker position={[1.8, 0.78, 0.1]} side="right" />
        </Suspense>

        <Preload all />

        {/* Subtle orbit controls for interactivity */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={3}
          maxDistance={10}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.2}
          autoRotate
          autoRotateSpeed={0.3}
          target={[0, 1, 0]}
        />
      </Canvas>
    </div>
  )
}
