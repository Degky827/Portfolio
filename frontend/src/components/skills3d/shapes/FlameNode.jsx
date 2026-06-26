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
    float flame = sin(pos.y * 5.0 + uTime * 3.0) * 0.1;
    pos.x += flame;
    pos.z += flame * 0.5;
    
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
    
    float heightFade = smoothstep(0.0, 0.5, vUv.y) * smoothstep(1.0, 0.5, vUv.y);
    float flicker = 0.7 + 0.3 * sin(uTime * 8.0 + vUv.y * 10.0);
    
    vec3 hotCore = vec3(1.0, 0.9, 0.6);
    vec3 color = mix(uColor, hotCore, fresnel * 0.4);
    color *= flicker * heightFade;
    
    float alpha = (0.6 + fresnel * 0.4) * heightFade * uGlow;
    
    gl_FragColor = vec4(color, alpha);
  }
`

export default function FlameNode({ color = '#ef4444', isHovered = false }) {
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
    
    const scale = 1 + Math.sin(time * 3) * 0.08
    meshRef.current.scale.set(scale, 1 + Math.sin(time * 2) * 0.05, scale)
    
    materialRef.current.uniforms.uTime.value = time
    materialRef.current.uniforms.uGlow.value = THREE.MathUtils.lerp(
      materialRef.current.uniforms.uGlow.value,
      isHovered ? 1.8 : 1.0,
      0.1
    )
  })

  return (
    <group>
      <mesh ref={meshRef} castShadow>
        <octahedronGeometry args={[0.35, 0]} />
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
        position={[0, 0.3, 0]}
        color={color}
        intensity={0.6}
        distance={2}
      />
    </group>
  )
}
