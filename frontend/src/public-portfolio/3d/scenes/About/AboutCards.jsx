import { useMemo } from 'react'
import useAboutData from '../../hooks/useAboutData'
import AboutGlassCard from './AboutGlassCard'

/**
 * AboutCards
 *
 * Positions 4 story pillar cards as interactive 3D glass panels
 * inside the About laboratory room.
 *
 * Layout: 2x2 grid on the left side of the room,
 * each card floating with staggered animation.
 *
 * All content loaded from the existing About API.
 */
export default function AboutCards() {
  const { sections } = useAboutData()

  // Take up to 4 sections
  const cards = useMemo(() => sections.slice(0, 4), [sections])

  // 2x2 grid positions in 3D space (left side of room)
  // Cards face the camera (which is at z ~8 looking toward -z)
  const positions = useMemo(() => [
    [-3.2, 2.0, -2.5],   // top-left
    [-3.2, 0.3, -2.5],   // bottom-left
    [0.2, 2.0, -2.5],    // top-right
    [0.2, 0.3, -2.5],    // bottom-right
  ], [])

  // Accent colors per card
  const accents = useMemo(() => [
    '#8b5cf6', // purple
    '#22d3ee', // cyan
    '#6366f1', // indigo
    '#a78bfa', // violet
  ], [])

  if (cards.length === 0) return null

  return (
    <group>
      {cards.map((section, i) => (
        <AboutGlassCard
          key={i}
          title={section.title || ''}
          content={section.content || ''}
          index={i}
          position={positions[i]}
          width={3.0}
          height={1.5}
          accentColor={accents[i]}
        />
      ))}
    </group>
  )
}
