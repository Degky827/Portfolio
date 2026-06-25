import { useRef, useState, useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html, Float } from '@react-three/drei'
import * as THREE from 'three'

/**
 * ProfileCard3D
 *
 * Floating glassmorphism profile card positioned above the monitor.
 * Features: profile image, name, title, animated skill bars,
 * social icons, mouse parallax, and floating animation.
 */

const SKILLS = [
  { name: 'React', level: 92, color: '#61dafb', icon: '⚛' },
  { name: 'Node.js', level: 85, color: '#68a063', icon: '⬢' },
  { name: 'Three.js', level: 78, color: '#8b5cf6', icon: '△' },
  { name: 'Flutter', level: 70, color: '#02569b', icon: '◆' },
]

const SOCIAL_LINKS = [
  { name: 'GitHub', icon: 'GH', color: '#d4d4d4' },
  { name: 'LinkedIn', icon: 'LI', color: '#0077b5' },
  { name: 'Twitter', icon: 'TW', color: '#1da1f2' },
]

function SkillBar({ name, level, color, icon, delay }) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setWidth(level), 300 + delay)
    return () => clearTimeout(timer)
  }, [level, delay])

  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '4px',
      }}>
        <span style={{
          fontSize: '11px',
          color: '#d4d4d4',
          fontFamily: "'JetBrains Mono', monospace",
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}>
          <span style={{ color, fontSize: '10px' }}>{icon}</span>
          {name}
        </span>
        <span style={{
          fontSize: '10px',
          color: '#808080',
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          {level}%
        </span>
      </div>
      <div style={{
        width: '100%',
        height: '4px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '2px',
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${width}%`,
          height: '100%',
          background: `linear-gradient(90deg, ${color}, ${color}88)`,
          borderRadius: '2px',
          transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: `0 0 8px ${color}66`,
        }} />
      </div>
    </div>
  )
}

function ProfileCardContent({ mouseRef }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div
      style={{
        width: '280px',
        padding: '20px',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        color: '#d4d4d4',
        userSelect: 'none',
        pointerEvents: 'none',
      }}
    >
      {/* Glassmorphism Card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(15, 10, 42, 0.85) 0%, rgba(30, 27, 75, 0.75) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '16px',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        boxShadow: `
          0 0 20px rgba(139, 92, 246, 0.15),
          0 0 40px rgba(99, 102, 241, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.05)
        `,
        overflow: 'hidden',
        position: 'relative',
      }}>
        {/* Top glow accent */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '60%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, #8b5cf6, transparent)',
        }} />

        {/* Profile Section */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          marginBottom: '16px',
        }}>
          {/* Avatar with glow ring */}
          <div style={{
            position: 'relative',
            width: '56px',
            height: '56px',
            flexShrink: 0,
          }}>
            <div style={{
              position: 'absolute',
              inset: '-3px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #8b5cf6, #22d3ee)',
              animation: 'spin 4s linear infinite',
            }} />
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1e1b4b, #0f0a2a)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              fontWeight: 'bold',
              color: '#8b5cf6',
              position: 'relative',
              zIndex: 1,
              border: '2px solid #0f0a2a',
            }}>
              DA
            </div>
            {/* Online indicator */}
            <div style={{
              position: 'absolute',
              bottom: '2px',
              right: '2px',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#4ec9b0',
              border: '2px solid #0f0a2a',
              zIndex: 2,
              boxShadow: '0 0 6px #4ec9b0',
            }} />
          </div>

          {/* Name & Title */}
          <div>
            <h3 style={{
              margin: 0,
              fontSize: '15px',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.3px',
              lineHeight: 1.2,
            }}>
              Desalegn Abreha
            </h3>
            <p style={{
              margin: '2px 0 0',
              fontSize: '11px',
              color: '#8b5cf6',
              fontWeight: 500,
            }}>
              Full-Stack Developer
            </p>
            <p style={{
              margin: '2px 0 0',
              fontSize: '10px',
              color: '#808080',
            }}>
              Software Engineering Student
            </p>
          </div>
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.3), transparent)',
          marginBottom: '14px',
        }} />

        {/* Skills Section */}
        <div style={{ marginBottom: '14px' }}>
          <p style={{
            fontSize: '10px',
            color: '#808080',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '10px',
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            Core Skills
          </p>
          {SKILLS.map((skill, i) => (
            <SkillBar
              key={skill.name}
              {...skill}
              delay={i * 150}
            />
          ))}
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.3), transparent)',
          marginBottom: '12px',
        }} />

        {/* Social Links */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
        }}>
          {SOCIAL_LINKS.map((link) => (
            <div
              key={link.name}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: 700,
                color: link.color,
                fontFamily: "'JetBrains Mono', monospace",
                transition: 'all 0.2s',
              }}
            >
              {link.icon}
            </div>
          ))}
        </div>

        {/* Bottom glow accent */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '40%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, #22d3ee, transparent)',
        }} />
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}

export default function ProfileCard3D({ position = [0, 2.8, 0.5] }) {
  const groupRef = useRef()
  const { viewport } = useThree()
  const mouseRef = useRef({ x: 0, y: 0 })

  const parallaxStrength = useMemo(() => {
    const base = 0.15
    return viewport.width < 4 ? base * 0.6 : base
  }, [viewport.width])

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.getElapsedTime()

    // Floating animation
    groupRef.current.position.y = position[1] + Math.sin(t * 0.8) * 0.05
    groupRef.current.position.x = position[0] + Math.sin(t * 0.5) * 0.02

    // Mouse parallax
    const targetRotY = mouseRef.current.x * parallaxStrength
    const targetRotX = -mouseRef.current.y * parallaxStrength * 0.5
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotY,
      0.05
    )
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotX,
      0.05
    )
  })

  return (
    <group ref={groupRef} position={position}>
      <Float
        speed={1.5}
        rotationIntensity={0.1}
        floatIntensity={0.3}
        floatingRange={[-0.02, 0.02]}
      >
        <Html
          transform
          occlude={false}
          distanceFactor={4}
          style={{
            transition: 'all 0.3s ease',
          }}
        >
          <ProfileCardContent mouseRef={mouseRef} />
        </Html>
      </Float>
    </group>
  )
}
