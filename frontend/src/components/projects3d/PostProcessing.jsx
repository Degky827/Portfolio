import { forwardRef, useMemo } from 'react'
import { EffectComposer, Bloom, Vignette, ChromaticAberration, ToneMapping, DepthOfField, Noise } from '@react-three/postprocessing'
import { BlendFunction, ToneMappingMode } from 'postprocessing'
import * as THREE from 'three'

const PostProcessing = forwardRef(function PostProcessing({ isMobile, quality = 'high' }, ref) {
  const bloomIntensity = isMobile ? 0.4 : quality === 'ultra' ? 1.2 : 0.8
  const luminanceThreshold = isMobile ? 0.4 : 0.2
  const luminanceSmoothing = isMobile ? 1.5 : 1.0

  const chromaticOffset = useMemo(
    () => new THREE.Vector2(isMobile ? 0.0003 : 0.0008, isMobile ? 0.0003 : 0.0008),
    [isMobile]
  )

  return (
    <EffectComposer ref={ref} multisampling={isMobile ? 0 : 2}>
      <Bloom
        intensity={bloomIntensity}
        luminanceThreshold={luminanceThreshold}
        luminanceSmoothing={luminanceSmoothing}
        mipmapBlur
        radius={isMobile ? 0.3 : 0.6}
      />
      {!isMobile && quality === 'ultra' && (
        <DepthOfField
          focusDistance={0.02}
          focalLength={0.05}
          bokehScale={2}
          height={480}
        />
      )}
      <Vignette
        offset={0.3}
        darkness={isMobile ? 0.3 : 0.6}
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
      {!isMobile && (
        <Noise
          opacity={0.01}
          blendFunction={BlendFunction.SOFT_LIGHT}
        />
      )}
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  )
})

export default PostProcessing
