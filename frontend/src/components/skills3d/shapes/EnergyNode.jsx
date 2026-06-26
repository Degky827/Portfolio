import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = /* glsl */ `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    
    vec3 pos = position;
    float breathe = sin(uTime * 2.0) * 0.05;
    pos *= 1.0 + breathe;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uGlow;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  void main() {
    vec3 viewDir = normalize(-vPosition);
    float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 3.0);
    
    float pulse = 0.7 + 0.3 * sin(uTime * 2.0);
    vec3 color = uColor * pulse;
    
    vec3 highlight = vec3(1.0, 1.0, 1.0);
    color = mix(color, highlight, fresnel * 0.6);
    
    float alpha = (0.5 + fresnel * 0.5) * uGlow;
    
    gl_FragColor = vec4(color, alpha);
  }
`

export default function EnergyNode({ color = '#f59e0b', isHovered = false }) {
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
    
    meshRef.current.rotation.x = time * 0.5
    meshRef.current.rotation.y = time * 0.7
    
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
        <icosahedronGeometry args={[0.35, 1]} />
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
        position={[0, 0, 0]}
        color={color}
        intensity={0.5}
        distance={2}
      />
    </group>
  )
}
