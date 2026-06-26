import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  varying float vElevation;
  
  void main() {
    vUv = uv;
    vec3 pos = position;
    
    float wave1 = sin(pos.x * 3.0 + uTime * 2.0) * 0.15;
    float wave2 = cos(pos.x * 5.0 - uTime * 1.5) * 0.08;
    float wave3 = sin(pos.x * 7.0 + uTime * 2.5) * 0.04;
    
    pos.y += wave1 + wave2 + wave3;
    vElevation = pos.y;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uGlow;
  varying vec2 vUv;
  varying float vElevation;
  
  void main() {
    float normalizedElevation = (vElevation + 0.3) / 0.6;
    
    vec3 color = uColor * (0.8 + normalizedElevation * 0.4);
    
    float edgeFade = smoothstep(0.0, 0.1, vUv.x) * smoothstep(1.0, 0.9, vUv.x);
    float alpha = (0.5 + normalizedElevation * 0.3) * edgeFade * uGlow;
    
    float glow = pow(normalizedElevation, 2.0) * 0.5;
    color += glow * uColor;
    
    gl_FragColor = vec4(color, alpha);
  }
`

export default function WaveObject({ color = '#06b6d4', isHovered = false }) {
  const meshRef = useRef()
  const materialRef = useRef()

  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(color) },
      uTime: { value: 0 },
      uGlow: { value: 1.0 },
    }),
    [color]
  )

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return
    const time = state.clock.getElapsedTime()
    
    meshRef.current.rotation.y = time * 0.2
    
    const targetY = Math.sin(time) * 0.05
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.1)
    
    materialRef.current.uniforms.uTime.value = time
    materialRef.current.uniforms.uGlow.value = THREE.MathUtils.lerp(
      materialRef.current.uniforms.uGlow.value,
      isHovered ? 1.6 : 1.0,
      0.1
    )
  })

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 4, 0, 0]} castShadow>
      <planeGeometry args={[1, 0.8, 64, 32]} />
      <shaderMaterial
        ref={materialRef}
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
