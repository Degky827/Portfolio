import { useHeroData, useHeroSettings, useHeroContent } from '../hooks/useHeroData'
import { useResponsive } from '../hooks/useResponsive'
import HeroModel from './Hero/HeroModel'
import HeroText from './Hero/HeroText'
import HeroLights from './Hero/HeroLights'
import HeroParticles from './Hero/HeroParticles'
import HeroEffects from './Hero/HeroEffects'
import HeroAnimation, { useMousePosition } from './Hero/HeroAnimation'

/**
 * HeroScene
 *
 * Complete 3D Hero experience.
 * Fetches the exact same data as the 2D Hero from the admin panel.
 */
export default function HeroScene({ sectionProgress = 0, isActive = false }) {
  const { heroContent } = useHeroData()
  const settings = useHeroSettings()
  const { particleCount, textScale, modelScale } = useResponsive()
  const mouseRef = useMousePosition()

  const {
    greeting,
    fullName,
    nameAmharic,
    badge,
    fullText,
    introduction,
    profilePhotoUrl,
    stats,
    socialLinks,
  } = useHeroContent(heroContent, settings)

  return (
    <group>
      <HeroAnimation sectionProgress={sectionProgress} mouseRef={mouseRef} />
      <HeroLights sectionProgress={sectionProgress} />
      <HeroParticles sectionProgress={sectionProgress} particleCount={particleCount} />
      <HeroEffects sectionProgress={sectionProgress} mouseRef={mouseRef} />
      <HeroModel
        sectionProgress={sectionProgress}
        mouseRef={mouseRef}
        modelScale={modelScale}
        profilePhotoUrl={profilePhotoUrl}
      />
      <HeroText
        greeting={greeting}
        fullName={fullName}
        nameAmharic={nameAmharic}
        badge={badge}
        fullText={fullText}
        introduction={introduction}
        stats={stats}
        socialLinks={socialLinks}
        textScale={textScale}
        sectionProgress={sectionProgress}
        mouseRef={mouseRef}
      />
    </group>
  )
}
