import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

const TEAL = '#06b6d4'
const PURPLE = '#8b5cf6'
const INDIGO = '#6366f1'

export default function EnvironmentLights() {
  const rimRef = useRef()
  const accent1Ref = useRef()
  const accent2Ref = useRef()
  const accent3Ref = useRef()

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    if (rimRef.current) {
      rimRef.current.intensity = 0.7 + Math.sin(time * 0.5) * 0.2
    }
    if (accent1Ref.current) {
      accent1Ref.current.intensity = 0.6 + Math.sin(time * 0.7 + 1) * 0.3
    }
    if (accent2Ref.current) {
      accent2Ref.current.intensity = 0.5 + Math.sin(time * 0.4 + 2) * 0.2
    }
    if (accent3Ref.current) {
      accent3Ref.current.intensity = 0.4 + Math.sin(time * 0.6 + 3) * 0.2
    }
  })

  return (
    <>
      <ambientLight color="#c7d2fe" intensity={0.15} />

      <directionalLight
        color={INDIGO}
        intensity={0.9}
        position={[5, 8, 5]}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={30}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      <pointLight ref={rimRef} color={TEAL} intensity={0.7} position={[-5, 3, -3]} distance={15} />
      <pointLight ref={accent1Ref} color={PURPLE} intensity={0.6} position={[5, 2, -2]} distance={12} />
      <pointLight ref={accent2Ref} color={INDIGO} intensity={0.5} position={[0, 6, -4]} distance={14} />
      <pointLight ref={accent3Ref} color={TEAL} intensity={0.4} position={[-3, 1, 3]} distance={10} />
      <pointLight color={PURPLE} intensity={0.3} position={[3, -1, 2]} distance={8} />
    </>
  )
}
