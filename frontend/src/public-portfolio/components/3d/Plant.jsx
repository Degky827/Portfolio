import { useMemo } from 'react'
import * as THREE from 'three'

/**
 * Creates an organic broad-leaf tropical foliage geometry matching Target Reference Image:
 * - Broad, ribbed tropical leaf with natural lateral curvature
 * - Gentle outward droop along the central vein
 */
function createLushLeafGeometry() {
  const shape = new THREE.Shape()
  // Start at base stem
  shape.moveTo(0, 0)
  // Right contour: broad gentle sweep outward, then tapering to graceful tip
  shape.bezierCurveTo(0.065, 0.05, 0.110, 0.16, 0.095, 0.28)
  shape.bezierCurveTo(0.080, 0.38, 0.035, 0.46, 0, 0.50)
  // Left contour: symmetrical return
  shape.bezierCurveTo(-0.035, 0.46, -0.080, 0.38, -0.095, 0.28)
  shape.bezierCurveTo(-0.110, 0.16, -0.065, 0.05, 0, 0)

  const geom = new THREE.ShapeGeometry(shape, 14)
  geom.computeVertexNormals()
  return geom
}

/**
 * Plant
 *
 * Lush Potted Tropical Plant matching Target Reference Image:
 * - Glossy white rounded ceramic planter pot
 * - Rich dark potting soil disc
 * - 22 broad, glossy tropical leaves fanning out in 4 graceful tiers
 * - Heights reach ~70% of monitor height
 */
export default function Plant({ position = [-1.24, 0.72, 0.06] }) {
  const potColor = useMemo(() => new THREE.Color('#ffffff'), [])
  const rimColor = useMemo(() => new THREE.Color('#f8fafc'), [])
  const soilColor = useMemo(() => new THREE.Color('#1c1208'), [])
  const stemColor = useMemo(() => new THREE.Color('#226829'), [])

  const leafGeom = useMemo(() => createLushLeafGeometry(), [])

  // Leaf materials: vibrant lush tropical greens with satin waxy sheen
  const leafMats = useMemo(() => [
    new THREE.MeshStandardMaterial({
      color: '#1a6322',
      roughness: 0.26,
      metalness: 0.06,
      side: THREE.DoubleSide,
    }),
    new THREE.MeshStandardMaterial({
      color: '#257d2d',
      roughness: 0.24,
      metalness: 0.06,
      side: THREE.DoubleSide,
    }),
    new THREE.MeshStandardMaterial({
      color: '#2f9338',
      roughness: 0.25,
      metalness: 0.05,
      side: THREE.DoubleSide,
    }),
    new THREE.MeshStandardMaterial({
      color: '#3ea647',
      roughness: 0.27,
      metalness: 0.05,
      side: THREE.DoubleSide,
    }),
  ], [])

  // 22 broad tropical leaves radiating outwards and upwards in 4 organic tiers
  const leafNodes = useMemo(() => [
    // Tier 1: Outer lower tier (arching gracefully over pot rim, framing desk)
    { rot: [0.82, 0.10, -0.55], scale: [1.25, 1.25, 1.0], pos: [0.08, 0.18, 0.05], matIdx: 1 },
    { rot: [0.78, 0.90, -0.40], scale: [1.30, 1.30, 1.0], pos: [0.10, 0.19, -0.04], matIdx: 0 },
    { rot: [0.72, 1.75, -0.25], scale: [1.20, 1.20, 1.0], pos: [0.03, 0.18, -0.10], matIdx: 2 },
    { rot: [0.80, 2.60, 0.20], scale: [1.25, 1.25, 1.0], pos: [-0.08, 0.19, -0.08], matIdx: 1 },
    { rot: [0.85, 3.40, 0.45], scale: [1.35, 1.35, 1.0], pos: [-0.10, 0.18, 0.02], matIdx: 0 },
    { rot: [0.76, 4.25, 0.50], scale: [1.30, 1.30, 1.0], pos: [-0.08, 0.19, 0.09], matIdx: 2 },
    { rot: [0.72, 5.10, 0.25], scale: [1.20, 1.25, 1.0], pos: [0.02, 0.18, 0.10], matIdx: 3 },

    // Tier 2: Mid-lower tier (spreading wide to left and front)
    { rot: [0.60, 0.40, -0.30], scale: [1.15, 1.20, 1.0], pos: [0.06, 0.25, 0.04], matIdx: 2 },
    { rot: [0.65, 1.30, -0.20], scale: [1.20, 1.25, 1.0], pos: [0.05, 0.26, -0.06], matIdx: 1 },
    { rot: [0.58, 2.15, 0.15], scale: [1.15, 1.20, 1.0], pos: [-0.04, 0.27, -0.07], matIdx: 3 },
    { rot: [0.62, 3.00, 0.35], scale: [1.25, 1.30, 1.0], pos: [-0.07, 0.26, -0.02], matIdx: 0 },
    { rot: [0.60, 3.85, 0.38], scale: [1.20, 1.25, 1.0], pos: [-0.05, 0.27, 0.06], matIdx: 2 },
    { rot: [0.55, 4.70, 0.20], scale: [1.15, 1.20, 1.0], pos: [0.03, 0.25, 0.07], matIdx: 1 },

    // Tier 3: Upper canopy (reaching high towards 70% of monitor height)
    { rot: [0.40, 0.70, -0.15], scale: [1.10, 1.15, 1.0], pos: [0.04, 0.32, 0.02], matIdx: 3 },
    { rot: [0.45, 1.60, -0.10], scale: [1.15, 1.20, 1.0], pos: [0.02, 0.33, -0.04], matIdx: 2 },
    { rot: [0.38, 2.45, 0.15], scale: [1.10, 1.15, 1.0], pos: [-0.03, 0.34, -0.03], matIdx: 1 },
    { rot: [0.42, 3.30, 0.25], scale: [1.15, 1.20, 1.0], pos: [-0.04, 0.33, 0.03], matIdx: 3 },
    { rot: [0.38, 4.15, 0.20], scale: [1.10, 1.15, 1.0], pos: [-0.02, 0.34, 0.05], matIdx: 2 },
    { rot: [0.35, 5.00, -0.05], scale: [1.05, 1.10, 1.0], pos: [0.03, 0.33, 0.04], matIdx: 1 },

    // Tier 4: Center upright crown shoots
    { rot: [0.18, 0.90, -0.05], scale: [0.95, 1.10, 1.0], pos: [0.02, 0.38, 0.01], matIdx: 3 },
    { rot: [0.22, 2.70, 0.10], scale: [1.00, 1.15, 1.0], pos: [-0.02, 0.39, -0.01], matIdx: 2 },
    { rot: [0.12, 4.40, 0.05], scale: [0.95, 1.05, 1.0], pos: [0.0, 0.41, 0.02], matIdx: 3 },
  ], [])

  return (
    <group position={position}>
      {/* ── Ceramic White Planter Pot ── */}
      <mesh position={[0, 0.11, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.130, 0.105, 0.22, 32]} />
        <meshStandardMaterial
          color={potColor}
          roughness={0.16}
          metalness={0.06}
        />
      </mesh>

      {/* ── Pot Lip / Top Rim ── */}
      <mesh position={[0, 0.22, 0]} castShadow>
        <torusGeometry args={[0.128, 0.012, 16, 32]} />
        <meshStandardMaterial
          color={rimColor}
          roughness={0.18}
          metalness={0.06}
        />
      </mesh>

      {/* ── Pot Bottom Foot Rim ── */}
      <mesh position={[0, 0.007, 0]}>
        <cylinderGeometry args={[0.106, 0.106, 0.014, 28]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.25} />
      </mesh>

      {/* ── Rich Dark Soil Disc ── */}
      <mesh position={[0, 0.21, 0]}>
        <cylinderGeometry args={[0.122, 0.122, 0.012, 28]} />
        <meshStandardMaterial color={soilColor} roughness={0.92} />
      </mesh>

      {/* ── 22 Lush Broad Leaves ── */}
      {leafNodes.map((leaf, i) => (
        <group key={i} position={leaf.pos} rotation={leaf.rot} scale={leaf.scale}>
          {/* Curved Stem */}
          <mesh position={[0, 0.04, 0]} castShadow>
            <cylinderGeometry args={[0.005, 0.009, 0.09, 8]} />
            <meshStandardMaterial color={stemColor} roughness={0.4} />
          </mesh>
          {/* Broad pointed leaf blade with subtle outward curve */}
          <mesh
            geometry={leafGeom}
            material={leafMats[leaf.matIdx]}
            position={[0, 0.08, 0]}
            rotation={[-0.22, 0, 0]}
            castShadow
          />
        </group>
      ))}
    </group>
  )
}
