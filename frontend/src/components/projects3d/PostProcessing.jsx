import { forwardRef, useMemo } from 'react'
import { EffectComposer, Bloom, Vignette, ChromaticAberration, ToneMapping } from '@react-three/postprocessing'
import { BlendFunction, ToneMappingMode } from 'postprocessing'
import * as THREE from 'three'

const PostProcessing = forwardRef(function PostProcessing({ isMobile, quality = 'high' }, ref) {
  const bloomIntensity = isMobile ? 0.4 : quality === 'ultra' ? 1.2 : 0.8
  const luminanceThreshold = isMobile ? 0.3 : 0.2
  const luminanceSmoothing = isMobile ? 1.5 : 0.9

  const chromaticOffset = useMemo(
    () => new THREE.Vector2(isMobile ? 0.0005 : 0.001, isMobile ? 0.0005 : 0.001),
    [isMobile]
  )

  return (
    <EffectComposer ref={ref} multisampling={isMobile ? 0 : 4}>
      <Bloom
        intensity={bloomIntensity}
        luminanceThreshold={luminanceThreshold}
        luminanceSmoothing={luminanceSmoothing}
        mipmapBlur
        radius={isMobile ? 0.4 : 0.6}
      />
      <Vignette
        offset={0.3}
        darkness={isMobile ? 0.4 : 0.65}
        blendFunction={BlendFunction.NORMAL}
      />
      {!isMobile && (
        <ChromaticAberration
          offset={chromaticOffset}
          blendFunction={BlendFunction.NORMAL}
          radialModulation={true}
          modulationOffset={0.4}
        />
      )}
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  )
})

export default PostProcessing
