import { useTexture } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useDocumentVisible } from '../hooks/useDocumentVisible'
import { useIntersectionVisible } from '../hooks/useIntersectionVisible'
import { createParticleDataFromImageSource, DEFAULT_LOGO_BASE_WIDTH } from './particleLogoCore'
import { ParticlePointsGroup } from './ParticlePointsGroup'
import { ABOUT_WORDMARK_PNG } from './aboutWordmarkAssets'

function AboutLights() {
  return (
    <>
      <ambientLight intensity={0.12} />
      <hemisphereLight intensity={0.32} color="#8a82a8" groundColor="#120818" />
      <directionalLight position={[6, 11, 9]} intensity={0.45} color="#ffd6c4" />
      <directionalLight position={[-9, 3, -7]} intensity={0.32} color="#6eb8ff" />
      <pointLight position={[0, 0.4, 4.8]} intensity={0.38} color="#fff4f8" distance={16} decay={2} />
    </>
  )
}

function AboutParticlesLayer({ assetUrl }: { assetUrl: string }) {
  const texture = useTexture(assetUrl)

  const particleData = useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.needsUpdate = true
    const img = texture.image as HTMLImageElement | ImageBitmap
    const srcW = 'naturalWidth' in img ? img.naturalWidth : img.width
    const srcH = 'naturalHeight' in img ? img.naturalHeight : img.height
    if (srcW < 2 || srcH < 2) {
      console.warn('[AboutWordmark] Image not ready or invalid size', srcW, srcH)
    }
    const collect = ABOUT_WORDMARK_PNG.treatAsOpaqueBitmap
      ? {
          maxDim: 520,
          sampleStep: 1,
          thinEdgeRandom: false,
          skipDarkPixels: true,
          darkLuminanceMax: 45,
        }
      : {
          maxDim: 520,
          sampleStep: 1,
          thinEdgeRandom: false,
        }
    const data = createParticleDataFromImageSource(
      img,
      srcW,
      srcH,
      DEFAULT_LOGO_BASE_WIDTH,
      { collect },
    )
    if (import.meta.env.DEV && data.count === 0) {
      console.warn('[AboutWordmark] 0 particles — check about.png / sampling')
    }
    return data
  }, [texture])

  return (
    <group scale={1.78}>
      <ParticlePointsGroup
        particleData={particleData}
        corePointSize={0.034}
        glowPointSize={0.15}
      />
    </group>
  )
}

export function AboutWordmarkParticles() {
  const rootRef = useRef<HTMLDivElement>(null)
  const docVisible = useDocumentVisible()
  const inView = useIntersectionVisible(rootRef, '100px')
  const runWebGl = docVisible && inView
  const devBust = useRef(import.meta.env.DEV ? `?v=${Date.now()}` : '').current
  const assetUrl = ABOUT_WORDMARK_PNG.url + devBust

  return (
    <div ref={rootRef} className="about-wordmark-stack">
      <Canvas
        className="about-wordmark-canvas"
        camera={{ position: [0, 0, 3.05], fov: 32, near: 0.1, far: 24 }}
        style={{ width: '100%', height: '100%', display: 'block' }}
        dpr={[1, 2]}
        frameloop={runWebGl ? 'always' : 'never'}
        gl={{
          antialias: true,
          alpha: true,
          premultipliedAlpha: false,
          powerPreference: 'high-performance',
          failIfMajorPerformanceCaveat: false,
          stencil: false,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0)
        }}
      >
        <AboutLights />
        <Suspense fallback={null}>
          <AboutParticlesLayer assetUrl={assetUrl} />
        </Suspense>
      </Canvas>
    </div>
  )
}

