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
    float spiral = sin(pos.y * 4.0 + uTime * 2.0) * 0.08;
    pos.x += spiral;
    pos.z += cos(pos.y * 4.0 + uTime * 2.0) * 0.08;
    
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
    
    float pulse = 0.7 + 0.3 * sin(uTime * 2.0);
    vec3 color = uColor * pulse;
    
    float spiral = sin(vUv.y * 10.0 + uTime * 3.0) * 0.5 + 0.5;
    color += spiral * 0.2 * uColor;
    
    float alpha = (0.5 + fresnel * 0.5) * uGlow;
    
    gl_FragColor = vec4(color, alpha);
  }
`

export default function CodeShape({ color = '#10b981', isHovered = false }) {
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
    
    meshRef.current.rotation.y = time * 0.5
    meshRef.current.rotation.z = Math.sin(time * 0.3) * 0.2
    
    const targetY = Math.sin(time * 1.6) * 0.09
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.1)
    
    materialRef.current.uniforms.uTime.value = time
    materialRef.current.uniforms.uGlow.value = THREE.MathUtils.lerp(
      materialRef.current.uniforms.uGlow.value,
      isHovered ? 1.6 : 1.0,
      0.1
    )
  })

  return (
    <group>
      <mesh ref={meshRef} castShadow>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
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
        position={[0, 0.3, 0.3]}
        color={color}
        intensity={0.4}
        distance={2}
      />
    </group>
  )
}
