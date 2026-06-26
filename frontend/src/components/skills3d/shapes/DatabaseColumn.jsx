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
    float wave = sin(pos.y * 10.0 + uTime * 2.0) * 0.02;
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
    
    float pulse = 0.6 + 0.4 * sin(uTime * 1.5 + vUv.y * 3.0);
    vec3 color = uColor * pulse;
    
    float grid = sin(vUv.y * 20.0) * 0.5 + 0.5;
    color += grid * 0.1 * uColor;
    
    float alpha = (0.5 + fresnel * 0.5) * uGlow;
    
    gl_FragColor = vec4(color, alpha);
  }
`

export default function DatabaseColumn({ color = '#8b5cf6', isHovered = false }) {
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
    
    meshRef.current.rotation.y = time * 0.4
    
    const targetY = Math.sin(time * 1.1) * 0.08
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.1)
    
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
        <cylinderGeometry args={[0.25, 0.25, 0.9, 16]} />
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
        position={[0, 0.5, 0]}
        color={color}
        intensity={0.3}
        distance={1.5}
      />
    </group>
  )
}
