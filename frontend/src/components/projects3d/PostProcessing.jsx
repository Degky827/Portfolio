import { forwardRef, useMemo } from 'react'
import { EffectComposer, Bloom, Vignette, ChromaticAberration, ToneMapping, DepthOfField, Noise } from '@react-three/postprocessing'
import { BlendFunction, ToneMappingMode } from 'postprocessing'
import * as THREE from 'three'

const PostProcessing = forwardRef(function PostProcessing({ isMobile, quality = 'high' }, ref) {
  const bloomIntensity = isMobile ? 0.5 : quality === 'ultra' ? 1.4 : 1.0
  const luminanceThreshold = isMobile ? 0.35 : 0.15
  const luminanceSmoothing = isMobile ? 1.5 : 0.8

  const chromaticOffset = useMemo(
    () => new THREE.Vector2(isMobile ? 0.0005 : 0.0012, isMobile ? 0.0005 : 0.0012),
    [isMobile]
  )

  return (
    <EffectComposer ref={ref} multisampling={isMobile ? 0 : 4}>
      <Bloom
        intensity={bloomIntensity}
        luminanceThreshold={luminanceThreshold}
        luminanceSmoothing={luminanceSmoothing}
        mipmapBlur
        radius={isMobile ? 0.4 : 0.7}
      />
      {!isMobile && (
        <DepthOfField
          focusDistance={0.02}
          focalLength={0.05}
          bokehScale={3}
          height={480}
        />
      )}
      <Vignette
        offset={0.3}
        darkness={isMobile ? 0.4 : 0.7}
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
          opacity={0.015}
          blendFunction={BlendFunction.SOFT_LIGHT}
        />
      )}
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  )
})

export default PostProcessing
