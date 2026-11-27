import { memo, useRef, useMemo, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Float, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

// Preload the anatomical 3D brain model
useGLTF.preload('/models/brain.glb')

// ── Studio HDRI Reflection Environment ──
// Generates photorealistic studio reflection panels (soft white lights + dark contrast)
// that create the authentic chrome / liquid mercury reflection shown in reference Image 2
function StudioChromeEnvironment() {
  const { gl, scene } = useThree()

  useEffect(() => {
    const pmremGenerator = new THREE.PMREMGenerator(gl)
    pmremGenerator.compileEquirectangularShader()
    const roomEnv = new RoomEnvironment()
    const envMap = pmremGenerator.fromScene(roomEnv, 0.04).texture
    scene.environment = envMap

    return () => {
      pmremGenerator.dispose()
      envMap.dispose()
      roomEnv.dispose()
    }
  }, [gl, scene])

  return null
}

// ── Realistic Chrome 3D Brain Model ──
function ChromeAnatomicalBrain({ isDark }) {
  const groupRef = useRef()
  const { scene } = useGLTF('/models/brain.glb')

  // Clone and apply high-contrast chrome material
  const chromeModel = useMemo(() => {
    const clone = scene.clone(true)

    // Liquid polished chrome material matching Reference Image 2:
    // Mirror-like metalness, high specular reflectance, smooth clearcoat, and deep black crevices
    const chromeMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(isDark ? '#e6edf5' : '#f8fafc'),
      metalness: 0.98,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      reflectivity: 1.0,
      envMapIntensity: isDark ? 2.4 : 2.0,
      roughnessMap: null,
    })

    clone.traverse((child) => {
      if (child.isMesh) {
        child.material = chromeMaterial
        child.castShadow = true
        child.receiveShadow = true
      }
    })

    // Correct anatomical orientation:
    // In raw GLTF coordinates:
    // +Z is superior (top of head), -Z is inferior (brainstem pointing down)
    // -Y is anterior (frontal lobe/forehead), +Y is posterior (occipital/back)
    // Rotating -Math.PI / 2 on X maps:
    // -> Z to +Y (Top of head straight UP, brainstem straight DOWN)
    // -> -Y to +Z (Front of head pointing towards +Z)
    clone.rotation.set(-Math.PI / 2, 0, 0)
    return clone
  }, [scene, isDark])

  // Subtle breathing pulsation
  useFrame((state) => {
    if (groupRef.current) {
      const s = 0.48 + Math.sin(state.clock.elapsedTime * 1.8) * 0.006
      groupRef.current.scale.set(s, s, s)
    }
  })

  return (
    // Initial side/lateral 3/4 profile view matching Reference Image 2
    <group ref={groupRef} position={[0, -0.05, 0]} rotation={[0.08, Math.PI * 0.46, 0]}>
      <primitive object={chromeModel} />
    </group>
  )
}

// ── Ambient Synaptic Sparkles ──
function SynapticSparkles() {
  const count = 45
  const pointsRef = useRef()

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * 2 * Math.PI
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 1.05 + Math.random() * 0.35
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta) * 0.85
      arr[i * 3 + 1] = r * Math.cos(phi) * 0.95
      arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta) * 0.9
    }
    return arr
  }, [])

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.08
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.028}
        color="#38bdf8"
        transparent
        opacity={0.75}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

// ── Scene Lighting & Camera Stage ──
function BrainStage({ isDark }) {
  return (
    <>
      {/* Studio HDRI Environment for realistic chrome reflections */}
      <StudioChromeEnvironment />

      {/* Balanced Studio Lighting */}
      <ambientLight intensity={isDark ? 0.4 : 0.6} />

      {/* Main Front-Right Specular Light */}
      <directionalLight position={[5, 6, 5]} intensity={isDark ? 2.5 : 2.2} color="#ffffff" />

      {/* Cool Rim Light from Back-Left */}
      <directionalLight position={[-5, 3, -4]} intensity={1.5} color="#93c5fd" />

      {/* Soft Fill from Below */}
      <directionalLight position={[0, -4, 2]} intensity={0.8} color="#e2e8f0" />

      {/* Subtle Cyan Bottom Glow */}
      <pointLight position={[0, -1.8, 0]} intensity={1.6} color="#0284c7" distance={4.5} />

      {/* Levitating Chrome Brain */}
      <Float speed={1.3} rotationIntensity={0.1} floatIntensity={0.15}>
        <ChromeAnatomicalBrain isDark={isDark} />
        <SynapticSparkles />
      </Float>

      {/* Smooth 360° Drag Rotation */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={true}
        autoRotateSpeed={1.2}
        rotateSpeed={0.85}
        dampingFactor={0.06}
        minPolarAngle={Math.PI * 0.15}
        maxPolarAngle={Math.PI * 0.85}
      />
    </>
  )
}

// ── Fallback Loader ──
function BrainLoader() {
  return (
    <mesh>
      <sphereGeometry args={[0.6, 24, 24]} />
      <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} wireframe />
    </mesh>
  )
}

// ── Exported Component ──
const Certificate3DBrain = memo(() => {
  const isDark =
    typeof document !== 'undefined' &&
    document.documentElement.classList.contains('dark')

  return (
    <div className="w-72 h-72 sm:w-80 sm:h-80 select-none cursor-grab active:cursor-grabbing relative flex items-center justify-center">
      <Canvas
        camera={{ position: [0, 0.15, 4.6], fov: 38 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: isDark ? 1.25 : 1.15,
        }}
        className="w-full h-full"
      >
        <Suspense fallback={<BrainLoader />}>
          <BrainStage isDark={isDark} />
        </Suspense>
      </Canvas>
    </div>
  )
})

Certificate3DBrain.displayName = 'Certificate3DBrain'

export default Certificate3DBrain
