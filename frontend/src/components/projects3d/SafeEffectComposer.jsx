import { useState, useRef, useCallback } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { EffectComposer } from '@react-three/postprocessing'

function ensureContextAttributes(gl) {
  try {
    const ctx = gl.getContext()
    if (ctx) {
      const origGetContextAttributes = ctx.getContextAttributes.bind(ctx)
      ctx.getContextAttributes = () => {
        const attrs = origGetContextAttributes()
        if (attrs) return attrs
        return { alpha: true, depth: true, stencil: false, antialias: true, premultipliedAlpha: true, preserveDrawingBuffer: false }
      }
    }
  } catch (e) {
    // ignore
  }
}

export default function SafeEffectComposer({ children, ...props }) {
  const { gl } = useThree()
  const [ready, setReady] = useState(false)
  const patched = useRef(false)

  useFrame(() => {
    if (!ready) {
      if (!patched.current) {
        patched.current = true
        ensureContextAttributes(gl)
      }
      try {
        const ctx = gl.getContext()
        const attrs = ctx && ctx.getContextAttributes()
        if (attrs && typeof attrs.alpha === 'boolean') {
          setReady(true)
        }
      } catch (e) {
        setReady(true)
      }
    }
  })

  if (!ready || !gl) return null

  return (
    <EffectComposer {...props}>
      {children}
    </EffectComposer>
  )
}
