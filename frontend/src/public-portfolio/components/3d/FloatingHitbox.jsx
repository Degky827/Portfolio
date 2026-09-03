import { useWorkspace } from './WorkspaceContext'

/**
 * FloatingHitbox
 *
 * Invisible clickable mesh for sections that don't have a dedicated 3D object.
 * Renders a transparent box at the given position that opens a section on click.
 */
export default function FloatingHitbox({ position = [0, 0, 0], size = [0.5, 0.5, 0.5], section }) {
  const workspace = useWorkspace()

  return (
    <mesh
      position={position}
      onClick={(e) => {
        e.stopPropagation()
        workspace?.openSection?.(section)
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto'
      }}
    >
      <boxGeometry args={size} />
      <meshStandardMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  )
}
