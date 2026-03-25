import { useTexture } from '@react-three/drei'
import { useMemo } from 'react'
import * as THREE from 'three'
import { createParticleDataFromImageSource, DEFAULT_LOGO_BASE_WIDTH } from './particleLogoCore'
import { ParticlePointsGroup } from './ParticlePointsGroup'

export function Logo3D() {
  const texture = useTexture('/logo.png')

  const particleData = useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.needsUpdate = true
    const img = texture.image as HTMLImageElement | ImageBitmap
    const srcW = 'naturalWidth' in img ? img.naturalWidth : img.width
    const srcH = 'naturalHeight' in img ? img.naturalHeight : img.height
    return createParticleDataFromImageSource(img, srcW, srcH, DEFAULT_LOGO_BASE_WIDTH)
  }, [texture])

  return <ParticlePointsGroup particleData={particleData} />
}
