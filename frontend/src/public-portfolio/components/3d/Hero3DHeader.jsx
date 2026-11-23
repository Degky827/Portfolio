import { useMemo } from 'react'
import * as THREE from 'three'

/**
 * Creates high-resolution procedural canvas textures for the 3D extruded title
 * and subtitle matching the portfolio hero specification.
 */
function createTitleTextures(name = 'Desalegn Kasaye') {
  if (typeof document === 'undefined') return { frontMap: null, depthMap: null }

  // 1. Front face texture with high-specular royal-to-sky gradient
  const frontCanvas = document.createElement('canvas')
  frontCanvas.width = 2048
  frontCanvas.height = 256
  const fCtx = frontCanvas.getContext('2d')
  if (!fCtx) return { frontMap: null, depthMap: null }

  fCtx.clearRect(0, 0, 2048, 256)
  fCtx.font = '900 120px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  fCtx.textAlign = 'center'
  fCtx.textBaseline = 'middle'

  // Royal-to-sky blue specular gradient
  const grad = fCtx.createLinearGradient(0, 50, 0, 200)
  grad.addColorStop(0.00, '#67B8FF')
  grad.addColorStop(0.35, '#2575F8')
  grad.addColorStop(0.70, '#1458E0')
  grad.addColorStop(1.00, '#0B3EAA')

  fCtx.fillStyle = grad
  fCtx.fillText(name, 1024, 128)

  // Subtle specular edge highlight
  fCtx.strokeStyle = 'rgba(255, 255, 255, 0.40)'
  fCtx.lineWidth = 2.5
  fCtx.strokeText(name, 1024, 128)

  const frontMap = new THREE.CanvasTexture(frontCanvas)
  frontMap.generateMipmaps = true
  frontMap.minFilter = THREE.LinearMipmapLinearFilter

  // 2. Extrusion depth slice texture (deep metallic indigo for 3D sides)
  const depthCanvas = document.createElement('canvas')
  depthCanvas.width = 2048
  depthCanvas.height = 256
  const dCtx = depthCanvas.getContext('2d')

  dCtx.clearRect(0, 0, 2048, 256)
  dCtx.font = '900 120px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  dCtx.textAlign = 'center'
  dCtx.textBaseline = 'middle'
  dCtx.fillStyle = '#062058'
  dCtx.fillText(name, 1024, 128)
  dCtx.strokeStyle = '#03102e'
  dCtx.lineWidth = 3
  dCtx.strokeText(name, 1024, 128)

  const depthMap = new THREE.CanvasTexture(depthCanvas)
  depthMap.generateMipmaps = true

  return { frontMap, depthMap }
}

/**
 * Creates high-resolution subtitle texture: [Flutter Logo] Fullstack | [</>] Flutter Developer
 */
function createSubtitleTexture(darkMode = false) {
  if (typeof document === 'undefined') return null

  const canvas = document.createElement('canvas')
  canvas.width = 2048
  canvas.height = 128
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  ctx.clearRect(0, 0, 2048, 128)

  const centerY = 64
  const textColor = darkMode ? '#ffffff' : '#0f172a'
  const dividerColor = '#0088FF'
  const cyanColor = '#00C8FF'

  ctx.font = '800 48px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  // Measure segments to layout symmetrically around center (x = 1024)
  // Left: [Flutter Logo] Fullstack
  // Center: |
  // Right: [</>] Flutter Developer
  const fullText = '   Fullstack   |   </> Flutter Developer'
  
  // Draw Flutter Icon on left
  const iconX = 740
  // Flutter blue chevron
  ctx.fillStyle = '#02569B'
  ctx.beginPath()
  ctx.moveTo(iconX, centerY - 24)
  ctx.lineTo(iconX + 24, centerY)
  ctx.lineTo(iconX + 10, centerY)
  ctx.lineTo(iconX - 4, centerY - 14)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = '#0175C2'
  ctx.beginPath()
  ctx.moveTo(iconX + 6, centerY - 6)
  ctx.lineTo(iconX + 22, centerY + 10)
  ctx.lineTo(iconX + 8, centerY + 24)
  ctx.lineTo(iconX - 8, centerY + 8)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = cyanColor
  ctx.beginPath()
  ctx.moveTo(iconX + 11, centerY)
  ctx.lineTo(iconX + 25, centerY + 14)
  ctx.lineTo(iconX + 15, centerY + 24)
  ctx.lineTo(iconX + 1, centerY + 10)
  ctx.closePath()
  ctx.fill()

  // Fullstack text
  ctx.fillStyle = textColor
  ctx.textAlign = 'left'
  ctx.fillText('Fullstack', iconX + 38, centerY)

  // Divider "|"
  ctx.fillStyle = dividerColor
  ctx.fillText('|', iconX + 258, centerY)

  // Code symbol </>
  ctx.fillStyle = textColor
  ctx.fillText('</>  Flutter Developer', iconX + 288, centerY)

  const texture = new THREE.CanvasTexture(canvas)
  texture.generateMipmaps = true
  return texture
}

/**
 * Creates high-resolution 3D background texture with Guilloche ribbon waves in purple (#6C2BFF)
 */
function createGuilloche3DTexture() {
  if (typeof document === 'undefined') return null

  const canvas = document.createElement('canvas')
  canvas.width = 2048
  canvas.height = 1024
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  ctx.clearRect(0, 0, 2048, 1024)
  ctx.strokeStyle = '#6C2BFF'

  // Left fan curves (30 curves)
  for (let i = 0; i < 30; i++) {
    const t = i / 29
    const startX = (-120 + t * 90) * 1.5 + 200
    const startY = (820 - t * 140) * 1.1
    const cp1X = (60 + t * 120) * 1.5 + 200
    const cp1Y = (560 - t * 240) * 1.1
    const cp2X = (140 + t * 260) * 1.5 + 200
    const cp2Y = (220 - t * 180) * 1.1
    const endX = (380 + t * 320) * 1.5 + 200
    const endY = (40 + t * 160) * 1.1

    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, endX, endY)
    ctx.globalAlpha = 0.12 + t * 0.32
    ctx.lineWidth = 1.2 + t * 0.5
    ctx.stroke()
  }

  // Center loops
  for (let i = 0; i < 22; i++) {
    const t = i / 21
    const topY = (-120 + t * 50) * 1.1 + 100
    const midY = (80 + t * 90) * 1.1 + 100
    const bottomY = (220 + t * 110) * 1.1 + 100
    const leftX = (760 - t * 70) * 1.2
    const rightX = (940 + t * 90) * 1.2
    const startX = (850 + (t - 0.5) * 35) * 1.2

    ctx.beginPath()
    ctx.moveTo(startX, topY)
    ctx.bezierCurveTo(leftX, midY, leftX, bottomY, startX, bottomY)
    ctx.bezierCurveTo(startX + 60, bottomY, rightX, midY, startX, topY)
    ctx.globalAlpha = 0.10 + t * 0.22
    ctx.lineWidth = 1.0 + t * 0.4
    ctx.stroke()
  }

  // Right ribbon bundle (36 curves)
  for (let i = 0; i < 36; i++) {
    const t = i / 35
    const startX = 1450 + t * 160
    const startY = 80 - t * 60
    const cp1X = 1380 + t * 180
    const cp1Y = 380 + t * 120
    const cp2X = 1420 + t * 160
    const cp2Y = 650 + t * 140
    const endX = 1580 + t * 140
    const endY = 960 + t * 40

    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, endX, endY)
    ctx.globalAlpha = 0.14 + t * 0.35
    ctx.lineWidth = 1.1 + t * 0.45
    ctx.stroke()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.generateMipmaps = true
  return texture
}

/**
 * Hero3DHeader
 *
 * True 3D Title Banner, Subtitle, and Guilloche Background Curves in Three.js space:
 * - 3D Extruded Title "Desalegn Kasaye" with 8 stacked extrusion depth planes:
 *   When the camera rotates to the side, YOU SEE THE REAL 3D EXTRUDED SIDES OF THE LETTERS!
 * - 3D Subtitle with Flutter branding floating right below the title.
 * - 3D Guilloche curve backdrop at z = -1.2 providing real stereoscopic 3D parallax.
 */
export default function Hero3DHeader({ name = 'Desalegn Kasaye', darkMode = false }) {
  const { frontMap, depthMap } = useMemo(() => createTitleTextures(name), [name])
  const subtitleMap = useMemo(() => createSubtitleTexture(darkMode), [darkMode])
  const backgroundMap = useMemo(() => createGuilloche3DTexture(), [])

  // 8 extrusion depth slices to give the letters physical 3D thickness when rotated to the side
  const depthSlices = useMemo(() => [
    { z: -0.035, opacity: 0.95 },
    { z: -0.025, opacity: 0.90 },
    { z: -0.015, opacity: 0.85 },
    { z: -0.005, opacity: 0.80 },
    { z: 0.005, opacity: 0.75 },
    { z: 0.015, opacity: 0.70 },
    { z: 0.025, opacity: 0.65 },
  ], [])

  return (
    <group position={[0, 0, 0]}>
      {/* ── 3D Guilloche Waves Backdrop (z = -1.2 for deep 3D perspective parallax) ── */}
      {backgroundMap && (
        <mesh position={[0, 0.72, -1.25]}>
          <planeGeometry args={[9.2, 4.8]} />
          <meshBasicMaterial
            map={backgroundMap}
            transparent
            opacity={0.85}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* ── 3D Extruded Title Banner: "Desalegn Kasaye" (Positioned at y = 1.74) ── */}
      <group position={[0, 1.74, 0.0]}>
        {/* Extrusion Depth Slices (Rendered behind front face to show 3D side thickness on rotation) */}
        {depthMap && depthSlices.map((slice, i) => (
          <mesh key={`depth-${i}`} position={[0, 0, slice.z]}>
            <planeGeometry args={[2.75, 0.34]} />
            <meshBasicMaterial
              map={depthMap}
              transparent
              opacity={slice.opacity}
              depthWrite={false}
            />
          </mesh>
        ))}

        {/* Crisp Front Face with Specular Royal-to-Sky Gradient */}
        {frontMap && (
          <mesh position={[0, 0, 0.035]}>
            <planeGeometry args={[2.75, 0.34]} />
            <meshBasicMaterial
              map={frontMap}
              transparent
              opacity={1.0}
            />
          </mesh>
        )}
      </group>

      {/* ── 3D Subtitle Banner: [Flutter Logo] Fullstack | </> Flutter Developer (y = 1.52) ── */}
      {subtitleMap && (
        <mesh position={[0, 1.52, 0.035]}>
          <planeGeometry args={[2.45, 0.155]} />
          <meshBasicMaterial
            map={subtitleMap}
            transparent
            opacity={0.95}
          />
        </mesh>
      )}
    </group>
  )
}
