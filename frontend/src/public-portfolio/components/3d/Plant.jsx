import { useMemo } from 'react'
import * as THREE from 'three'

/**
 * Creates a smooth 3D curved leaf geometry matching Image 1:
 * - Broad, pointed teardrop / elliptical tropical leaf
 * - Subtle central crease and gentle downward outward droop
 */
function createBroadLeafGeometry() {
  const shape = new THREE.Shape()
  // Start at base stem
  shape.moveTo(0, 0)
  // Right contour: curves outward to broad belly, then tapers to pointed tip
  shape.bezierCurveTo(0.045, 0.04, 0.075, 0.12, 0.065, 0.20)
  shape.bezierCurveTo(0.055, 0.26, 0.025, 0.32, 0, 0.35)
  // Left contour: curves back down symmetrically
  shape.bezierCurveTo(-0.025, 0.32, -0.055, 0.26, -0.065, 0.20)
  shape.bezierCurveTo(-0.075, 0.12, -0.045, 0.04, 0, 0)

  const geom = new THREE.ShapeGeometry(shape, 12)
  geom.computeVertexNormals()
  return geom
}

/**
 * Potted Tropical Plant matching Image 1:
 * - Clean white cylindrical porcelain planter pot with smooth rounded rim
 * - Rich dark soil disc
 * - Lush, dense tropical foliage with 18+ broad, glossy green leaves fanning out gracefully
 */
export default function Plant({ position = [-1.24, 0.72, 0.06] }) {
  const potColor = useMemo(() => new THREE.Color('#ffffff'), [])
  const rimColor = useMemo(() => new THREE.Color('#f1f5f9'), [])
  const soilColor = useMemo(() => new THREE.Color('#22150b'), [])
  const stemColor = useMemo(() => new THREE.Color('#1f5424'), [])

  const leafGeom = useMemo(() => createBroadLeafGeometry(), [])

  // Leaf materials: gradient of rich tropical forest greens with satin specular sheen
  const leafMats = useMemo(() => [
    new THREE.MeshStandardMaterial({
      color: '#1b5e20',
      roughness: 0.32,
      metalness: 0.08,
      side: THREE.DoubleSide,
    }),
    new THREE.MeshStandardMaterial({
      color: '#2e7d32',
      roughness: 0.28,
      metalness: 0.08,
      side: THREE.DoubleSide,
    }),
    new THREE.MeshStandardMaterial({
      color: '#388e3c',
      roughness: 0.30,
      metalness: 0.08,
      side: THREE.DoubleSide,
    }),
    new THREE.MeshStandardMaterial({
      color: '#43a047',
      roughness: 0.32,
      metalness: 0.06,
      side: THREE.DoubleSide,
    }),
  ], [])

  // 18 lush tropical leaves radiating outwards and upwards in realistic organic tiers
  const leafNodes = useMemo(() => [
    // Bottom outer tier (arching wide over the pot rim)
    { rot: [0.75, 0.15, -0.45], scale: [1.2, 1.25, 1.0], pos: [0.06, 0.16, 0.04], matIdx: 1 },
    { rot: [0.70, 0.95, -0.30], scale: [1.25, 1.30, 1.0], pos: [0.08, 0.17, -0.03], matIdx: 0 },
    { rot: [0.65, 1.80, -0.20], scale: [1.15, 1.20, 1.0], pos: [0.02, 0.16, -0.08], matIdx: 2 },
    { rot: [0.72, 2.65, 0.15], scale: [1.20, 1.25, 1.0], pos: [-0.06, 0.17, -0.07], matIdx: 1 },
    { rot: [0.78, 3.45, 0.35], scale: [1.30, 1.35, 1.0], pos: [-0.08, 0.16, 0.01], matIdx: 0 },
    { rot: [0.70, 4.30, 0.40], scale: [1.25, 1.25, 1.0], pos: [-0.06, 0.17, 0.07], matIdx: 2 },
    { rot: [0.65, 5.15, 0.20], scale: [1.15, 1.20, 1.0], pos: [0.01, 0.16, 0.08], matIdx: 3 },

    // Middle tier (rising higher with strong presence)
    { rot: [0.50, 0.45, -0.25], scale: [1.10, 1.20, 1.0], pos: [0.05, 0.22, 0.03], matIdx: 2 },
    { rot: [0.55, 1.35, -0.15], scale: [1.15, 1.25, 1.0], pos: [0.04, 0.23, -0.05], matIdx: 1 },
    { rot: [0.48, 2.20, 0.10], scale: [1.10, 1.15, 1.0], pos: [-0.03, 0.24, -0.06], matIdx: 3 },
    { rot: [0.52, 3.05, 0.25], scale: [1.20, 1.30, 1.0], pos: [-0.06, 0.23, -0.01], matIdx: 0 },
    { rot: [0.50, 3.90, 0.30], scale: [1.15, 1.20, 1.0], pos: [-0.04, 0.24, 0.05], matIdx: 2 },
    { rot: [0.45, 4.75, 0.15], scale: [1.10, 1.15, 1.0], pos: [0.02, 0.22, 0.06], matIdx: 1 },

    // Top crown / center upright shoots
    { rot: [0.30, 0.80, -0.10], scale: [0.95, 1.10, 1.0], pos: [0.02, 0.28, -0.01], matIdx: 3 },
    { rot: [0.35, 2.50, 0.12], scale: [1.00, 1.15, 1.0], pos: [-0.02, 0.29, -0.02], matIdx: 1 },
    { rot: [0.28, 4.10, 0.15], scale: [0.95, 1.05, 1.0], pos: [-0.01, 0.30, 0.03], matIdx: 2 },
    { rot: [0.20, 5.50, -0.05], scale: [0.90, 1.00, 1.0], pos: [0.02, 0.31, 0.02], matIdx: 3 },
    { rot: [0.12, 1.50, 0.0], scale: [0.85, 1.00, 1.0], pos: [0.0, 0.33, 0.0], matIdx: 3 },
  ], [])

  return (
    <group position={position}>
      {/* ── Ceramic White Planter Pot ── */}
      <mesh position={[0, 0.10, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.115, 0.095, 0.20, 32]} />
        <meshStandardMaterial
          color={potColor}
          roughness={0.20}
          metalness={0.06}
        />
      </mesh>

      {/* ── Pot Lip / Top Rim ── */}
      <mesh position={[0, 0.20, 0]} castShadow>
        <torusGeometry args={[0.114, 0.010, 16, 32]} />
        <meshStandardMaterial
          color={rimColor}
          roughness={0.22}
          metalness={0.06}
        />
      </mesh>

      {/* ── Pot Bottom Foot Rim ── */}
      <mesh position={[0, 0.006, 0]}>
        <cylinderGeometry args={[0.096, 0.096, 0.012, 24]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.35} />
      </mesh>

      {/* ── Rich Dark Soil Top Disc ── */}
      <mesh position={[0, 0.192, 0]}>
        <cylinderGeometry args={[0.108, 0.108, 0.012, 24]} />
        <meshStandardMaterial color={soilColor} roughness={0.92} />
      </mesh>

      {/* ── 18 Lush Broad Leaves ── */}
      {leafNodes.map((leaf, i) => (
        <group key={i} position={leaf.pos} rotation={leaf.rot} scale={leaf.scale}>
          {/* Curved Stem */}
          <mesh position={[0, 0.04, 0]} castShadow>
            <cylinderGeometry args={[0.005, 0.008, 0.08, 8]} />
            <meshStandardMaterial color={stemColor} roughness={0.45} />
          </mesh>
          {/* Broad pointed leaf blade */}
          <mesh
            geometry={leafGeom}
            material={leafMats[leaf.matIdx]}
            position={[0, 0.08, 0]}
            rotation={[-0.20, 0, 0]}
            castShadow
          />
        </group>
      ))}
    </group>
  )
}
