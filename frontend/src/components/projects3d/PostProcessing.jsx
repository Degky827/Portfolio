import { forwardRef } from 'react'
import { Bloom, Vignette, ToneMapping } from '@react-three/postprocessing'
import { BlendFunction, ToneMappingMode } from 'postprocessing'
import SafeEffectComposer from './SafeEffectComposer'

const PostProcessing = forwardRef(function PostProcessing({ isMobile, quality = 'high' }, ref) {
  const bloomIntensity = isMobile ? 0.4 : quality === 'ultra' ? 1.0 : 0.7
  const luminanceThreshold = isMobile ? 0.4 : 0.2
  const luminanceSmoothing = isMobile ? 1.5 : 1.0

  return (
    <SafeEffectComposer ref={ref} multisampling={isMobile ? 0 : 2}>
      <Bloom
        intensity={bloomIntensity}
        luminanceThreshold={luminanceThreshold}
        luminanceSmoothing={luminanceSmoothing}
        mipmapBlur
        radius={isMobile ? 0.3 : 0.5}
      />
      <Vignette
        offset={0.3}
        darkness={isMobile ? 0.3 : 0.5}
        blendFunction={BlendFunction.NORMAL}
      />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </SafeEffectComposer>
  )
})

export default PostProcessing
