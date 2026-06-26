import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
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
    float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 3.0);
    
    float pulse = 0.7 + 0.3 * sin(uTime * 1.5);
    vec3 core = uColor * 2.0;
    vec3 edge = uColor * 0.5;
    
    vec3 color = mix(core, edge, fresnel);
    color += fresnel * uColor * 2.0 * pulse;
    
    float alpha = (0.4 + fresnel * 0.6) * uGlow;
    
    gl_FragColor = vec4(color, alpha);
  }
`

function ElectronRing({ radius, speed, color, offset }) {
  const ringRef = useRef()
  
  useFrame((state) => {
    if (!ringRef.current) return
    const time = state.clock.getElapsedTime()
    ringRef.current.rotation.x = time * speed + offset
    ringRef.current.rotation.z = Math.cos(time * 0.5 + offset) * 0.3
  })
  
  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[radius, 0.015, 8, 64]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2}
        transparent
        opacity={0.8}
      />
    </mesh>
  )
}

export default function AtomSphere({ color = '#61dafb', isHovered = false }) {
  const coreRef = useRef()
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
    const time = state.clock.getElapsedTime()
    
    if (coreRef.current) {
      coreRef.current.rotation.y = time * 0.3
      const scale = 1 + Math.sin(time * 2) * 0.05
      coreRef.current.scale.setScalar(scale)
    }
    
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = time
      materialRef.current.uniforms.uGlow.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uGlow.value,
        isHovered ? 1.8 : 1.0,
        0.1
      )
    }
  })
  
  return (
    <group>
      <mesh ref={coreRef} castShadow>
        <sphereGeometry args={[0.25, 32, 32]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
        />
      </mesh>
      
      <ElectronRing radius={0.4} speed={1.5} color={color} offset={0} />
      <ElectronRing radius={0.5} speed={1.2} color={color} offset={Math.PI / 3} />
      <ElectronRing radius={0.45} speed={1.8} color={color} offset={(Math.PI * 2) / 3} />
    </group>
  )
}
