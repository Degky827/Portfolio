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
    float wave = sin(pos.y * 6.0 + uTime * 3.0) * 0.03;
    pos.x += wave;
    pos.z += wave * 0.5;
    
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
    float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 2.5);
    
    float pulse = 0.6 + 0.4 * sin(uTime * 1.5);
    vec3 color = uColor * pulse;
    
    vec3 core = vec3(1.0, 0.95, 0.9);
    color = mix(color, core, fresnel * 0.3);
    
    float alpha = (0.6 + fresnel * 0.4) * uGlow;
    
    gl_FragColor = vec4(color, alpha);
  }
`

export default function ToolChip({ color = '#6366f1', isHovered = false }) {
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
    
    meshRef.current.rotation.y = time * 0.6
    
    const targetY = Math.sin(time * 1.4) * 0.07
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
      <mesh ref={meshRef} castShadow rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.3, 0.08, 16, 32]} />
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
        position={[0, 0, 0.3]}
        color={color}
        intensity={0.4}
        distance={1.5}
      />
    </group>
  )
}
