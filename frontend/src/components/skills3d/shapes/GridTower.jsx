import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = /* glsl */ `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    vUv = uv;
    
    vec3 pos = position;
    float wave = sin(pos.y * 8.0 + uTime * 3.0) * 0.04;
    pos.x += wave;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uGlow;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  
  void main() {
    vec3 viewDir = normalize(-vPosition);
    float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 2.0);
    
    float pulse = 0.6 + 0.4 * sin(uTime * 1.8);
    vec3 color = uColor * pulse;
    
    float scanline = sin(vUv.y * 40.0) * 0.5 + 0.5;
    color += scanline * 0.1 * uColor;
    
    vec3 highlight = vec3(0.8, 0.9, 1.0);
    color = mix(color, highlight, fresnel * 0.4);
    
    float alpha = (0.5 + fresnel * 0.5) * uGlow;
    
    gl_FragColor = vec4(color, alpha);
  }
`

export default function GridTower({ color = '#14b8a6', isHovered = false }) {
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
    
    meshRef.current.rotation.y = time * 0.3
    
    const scale = 1 + Math.sin(time * 1.5) * 0.05
    meshRef.current.scale.set(1, scale, 1)
    
    materialRef.current.uniforms.uTime.value = time
    materialRef.current.uniforms.uGlow.value = THREE.MathUtils.lerp(
      materialRef.current.uniforms.uGlow.value,
      isHovered ? 1.5 : 1.0,
      0.1
    )
  })

  return (
    <group>
      <mesh ref={meshRef} castShadow>
        <boxGeometry args={[0.3, 0.8, 0.3]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
        />
      </mesh>
      
      <pointLight
        position={[0, 0.4, 0]}
        color={color}
        intensity={0.3}
        distance={1.5}
      />
    </group>
  )
}
