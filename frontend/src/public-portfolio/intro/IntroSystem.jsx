import { lazy, useCallback, useEffect, useRef, memo, Suspense, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Bloom, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import SafeEffectComposer from '../../components/projects3d/SafeEffectComposer'
import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { useIntro } from './IntroContext'
import { useIntroAudio } from './audio/useIntroAudio'
import IntroControls from './IntroControls'
import * as THREE from 'three'

const SceneBeginning = lazy(() => import('./scenes/SceneBeginning'))
const SceneKnowledge = lazy(() => import('./scenes/SceneKnowledge'))
const SceneIntelligence = lazy(() => import('./scenes/SceneIntelligence'))
const SceneEngineering = lazy(() => import('./scenes/SceneEngineering'))
const SceneDeveloperDNA = lazy(() => import('./scenes/SceneDeveloperDNA'))
const SceneDigitalEcosystem = lazy(() => import('./scenes/SceneDigitalEcosystem'))
const ScenePowerSequence = lazy(() => import('./scenes/ScenePowerSequence'))
const SceneWelcome = lazy(() => import('./scenes/SceneWelcome'))
const SceneTransition = lazy(() => import('./scenes/SceneTransition'))

const SCENE_COMPONENTS = [
  SceneBeginning,
  SceneKnowledge,
  SceneIntelligence,
  SceneEngineering,
  SceneDeveloperDNA,
  SceneDigitalEcosystem,
  ScenePowerSequence,
  SceneWelcome,
  SceneTransition,
]

const SCENE_OVERLAY_TEXT = [
  { main: '', sub: '' },
  { main: '', sub: '' },
  { main: '', sub: '' },
  { main: '', sub: '' },
  { main: 'Developer Detected', sub: 'Desalegn Kasaye' },
  { main: '', sub: '' },
  { main: '', sub: '' },
  { main: 'SYSTEM ONLINE', sub: 'Developer Environment Ready' },
  { main: '', sub: '' },
]

const CAMERA_KEYFRAMES = [
  { pos: [0, 0.5, 5], look: [0, 0, 0] },
  { pos: [1.5, 1, 4.5], look: [0, 0, 0] },
  { pos: [0, 0.3, 3], look: [0, 0, 0] },
  { pos: [2.5, 1.5, 4], look: [0, 0, 0] },
  { pos: [0, 0.6, 4.5], look: [0, 0, 0] },
  { pos: [1, 1.2, 4], look: [0, 0, 0] },
  { pos: [0.5, 0.5, 3.5], look: [0, 0.3, -1] },
  { pos: [0, 0.6, 3.5], look: [0, 0.6, -1.5] },
  { pos: [0, 0.6, 2], look: [0, 0.6, -2] },
]

function FloatingDust({ count = 100 }) {
  const mesh = useRef()

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 12
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8
      arr[i * 3 + 2] = (Math.random() - 0.5) * 12
    }
    return arr
  }, [count])

  useFrame((state) => {
    if (!mesh.current) return
    const t = state.clock.getElapsedTime()
    const posAttr = mesh.current.geometry.attributes.position
    for (let i = 0; i < count; i++) {
      posAttr.array[i * 3 + 1] += Math.sin(t * 0.1 + i * 0.5) * 0.001
      posAttr.array[i * 3] += Math.cos(t * 0.05 + i * 0.3) * 0.0005
    }
    posAttr.needsUpdate = true
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        color="#06b6d4"
        size={0.015}
        transparent
        opacity={0.3}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

function CameraController() {
  const { camera } = useThree()
  const { currentScene, sceneProgress } = useIntro()
  const initialPos = useRef(new THREE.Vector3(0, 0.5, 5))

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    const kf = CAMERA_KEYFRAMES[currentScene] || CAMERA_KEYFRAMES[0]
    const nextKf = CAMERA_KEYFRAMES[Math.min(currentScene + 1, CAMERA_KEYFRAMES.length - 1)]

    const ease = sceneProgress < 0.5
      ? 2 * sceneProgress * sceneProgress
      : 1 - Math.pow(-2 * sceneProgress + 2, 2) / 2

    const pos = [
      THREE.MathUtils.lerp(kf.pos[0], nextKf.pos[0], ease * 0.3),
      THREE.MathUtils.lerp(kf.pos[1], nextKf.pos[1], ease * 0.3),
      THREE.MathUtils.lerp(kf.pos[2], nextKf.pos[2], ease * 0.3),
    ]

    const look = [
      THREE.MathUtils.lerp(kf.look[0], nextKf.look[0], ease * 0.3),
      THREE.MathUtils.lerp(kf.look[1], nextKf.look[1], ease * 0.3),
      THREE.MathUtils.lerp(kf.look[2], nextKf.look[2], ease * 0.3),
    ]

    camera.position.set(
      pos[0] + Math.sin(t * 0.15) * 0.15,
      pos[1] + Math.sin(t * 0.1) * 0.08,
      pos[2]
    )
    camera.lookAt(look[0], look[1], look[2])
  })

  return null
}

function SceneRenderer() {
  const { currentScene, sceneProgress, nextScene } = useIntro()
  const audio = useIntroAudio()
  const hasPlayedAudio = useRef({})

  useEffect(() => {
    hasPlayedAudio.current = {}
  }, [currentScene])

  useEffect(() => {
    if (sceneProgress > 0.08 && !hasPlayedAudio.current[`${currentScene}-start`]) {
      hasPlayedAudio.current[`${currentScene}-start`] = true
      switch (currentScene) {
        case 0: audio.playHeartbeat(); break
        case 1: audio.playParticleBirth(); break
        case 2: audio.playNeuralPulse(); break
        case 3: audio.playBlueprint(); break
        case 4: audio.playScanPulse(); break
        case 5: audio.playDataFlow(); break
        case 6: audio.playPowerOn(); break
        case 7: audio.playDigitalChime(); break
        case 8: audio.playWhoosh(); break
      }
    }
  }, [sceneProgress, currentScene, audio])

  const SceneComponent = SCENE_COMPONENTS[currentScene]

  const handleSceneComplete = useCallback(() => {
    nextScene()
  }, [nextScene])

  return (
    <Suspense fallback={null}>
      {SceneComponent && (
        <SceneComponent progress={sceneProgress} onComplete={handleSceneComplete} />
      )}
    </Suspense>
  )
}

function PostProcessing() {
  return (
    <SafeEffectComposer multisampling={0}>
      <Bloom
        intensity={1.5}
        luminanceThreshold={0.08}
        luminanceSmoothing={0.9}
        mipmapBlur
        radius={0.85}
      />
      <Vignette
        offset={0.25}
        darkness={0.75}
        blendFunction={BlendFunction.NORMAL}
      />
    </SafeEffectComposer>
  )
}

function IntroOverlay() {
  const { currentScene, sceneProgress, introComplete } = useIntro()
  const overlay = SCENE_OVERLAY_TEXT[currentScene]

  if (introComplete || !overlay) return null
  if (!overlay.main && !overlay.sub) return null

  const opacity = currentScene === 7
    ? Math.min(sceneProgress * 2, 1)
    : currentScene === 8
      ? Math.max(1 - sceneProgress * 2, 0)
      : Math.min(sceneProgress * 3, 1) * Math.max(1 - (sceneProgress - 0.7) * 3, 0)

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
      <div className="text-center" style={{ opacity }}>
        {overlay.main && (
          <div
            className="font-mono text-2xl sm:text-3xl md:text-4xl font-bold tracking-wider mb-2"
            style={{
              color: '#06b6d4',
              textShadow: '0 0 30px #06b6d440, 0 0 60px #06b6d420',
            }}
          >
            {overlay.main}
          </div>
        )}
        {overlay.sub && (
          <div
            className="font-mono text-sm sm:text-base tracking-widest"
            style={{ color: '#8b5cf6', textShadow: '0 0 15px #8b5cf630' }}
          >
            {overlay.sub}
          </div>
        )}
      </div>
    </div>
  )
}

function IntroSystem() {
  const { currentScene, introComplete, isPlaying, playIntro } = useIntro()
  const { pathname } = useLocation()

  useEffect(() => {
    const isRoot = pathname === '/' || pathname === ''
    const isPublic = !pathname.startsWith('/admin') && !pathname.startsWith('/workspace') && !pathname.startsWith('/login')
    if (!introComplete && !isPlaying && isRoot && isPublic) {
      playIntro()
    }
  }, [pathname, introComplete, isPlaying, playIntro])

  const hideIntro = pathname.startsWith('/login') || pathname.startsWith('/admin') || pathname.startsWith('/workspace')
  if (introComplete || hideIntro) return null

  return (
    <div className="fixed inset-0 z-[9999]" style={{ backgroundColor: '#000000' }}>
      <Canvas
        camera={{ position: [0, 0.5, 5], fov: 50, near: 0.1, far: 100 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.3,
        }}
        style={{ background: '#000000' }}
      >
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 6, 22]} />

        <CameraController />
        <SceneRenderer />
        <FloatingDust count={120} />
        <PostProcessing />
      </Canvas>

      <IntroOverlay />
      <IntroControls />

      <div className="absolute top-5 left-5 z-50 font-mono text-[10px] tracking-[0.2em] uppercase" style={{ color: '#06b6d418' }}>
        DESALEGN OS v3.0
      </div>
      <div className="absolute top-5 right-5 z-50 font-mono text-[10px] tracking-[0.2em] uppercase" style={{ color: '#06b6d418' }}>
        {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
      </div>
    </div>
  )
}

export default memo(IntroSystem)
