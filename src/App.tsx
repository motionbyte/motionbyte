import { Suspense, useCallback, useLayoutEffect, useRef, type WheelEvent } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  Bloom,
  BrightnessContrast,
  ChromaticAberration,
  EffectComposer,
  HueSaturation,
  Noise,
  Sepia,
  SMAA,
  ToneMapping,
  Vignette,
} from '@react-three/postprocessing'
import {
  BlendFunction,
  ToneMappingMode,
  VignetteTechnique,
} from 'postprocessing'
import * as THREE from 'three'
import { Logo3D } from './scene/Logo3D'
import { MagnifyCursor } from './scene/MagnifyCursor'
import { useScrollJourney } from './ScrollJourneyContext'
import './App.css'

const CA_OFFSET = new THREE.Vector2(0.001, 0.00065)

function JourneyCamera() {
  const { targetCameraZ } = useScrollJourney()
  const { camera } = useThree()

  useFrame(() => {
    const cam = camera as THREE.PerspectiveCamera
    const z = THREE.MathUtils.lerp(cam.position.z, targetCameraZ, 0.14)
    cam.position.set(0, 0, z)
    cam.up.set(0, 1, 0)
    cam.lookAt(0, 0, 0)
  })

  return null
}

function Scene() {
  return (
    <>
      <color attach="background" args={['#0a0a12']} />
      <fog attach="fog" args={['#0a0a12', 3.8, 14.5]} />
      <ambientLight intensity={0.055} />
      <hemisphereLight
        intensity={0.26}
        color="#7a7390"
        groundColor="#080818"
      />
      <directionalLight
        position={[6, 11, 9]}
        intensity={0.32}
        color="#ffd6c4"
      />
      <directionalLight
        position={[-9, 3, -7]}
        intensity={0.22}
        color="#6eb8ff"
      />
      <pointLight
        position={[0, 0.6, 5.4]}
        intensity={0.22}
        color="#fff0e6"
        distance={14}
        decay={2}
      />
      <JourneyCamera />
      <Suspense fallback={null}>
        <Logo3D />
      </Suspense>
      <EffectComposer>
        <SMAA />
        <Bloom
          luminanceThreshold={0.042}
          luminanceSmoothing={0.42}
          intensity={1.22}
          mipmapBlur
        />
        <ChromaticAberration
          offset={CA_OFFSET}
          radialModulation
          modulationOffset={0.22}
        />
        <HueSaturation hue={0.062} saturation={0.1} />
        <BrightnessContrast brightness={-0.022} contrast={0.19} />
        <ToneMapping
          mode={ToneMappingMode.ACES_FILMIC}
          whitePoint={3.65}
          middleGrey={0.58}
        />
        <Sepia
          intensity={0.42}
          blendFunction={BlendFunction.SOFT_LIGHT}
          opacity={0.1}
        />
        <Vignette
          technique={VignetteTechnique.ESKIL}
          offset={0.28}
          darkness={0.62}
        />
        <Noise
          premultiply
          blendFunction={BlendFunction.SOFT_LIGHT}
          opacity={0.14}
        />
        <MagnifyCursor radius={0.17} strength={0.58} />
      </EffectComposer>
    </>
  )
}

/** Logo ke baad fullscreen center — phir scroll se zoom-out exit */
function NarrativeStage() {
  const { text1, text2 } = useScrollJourney()

  return (
    <div className="narrative-stage">
      <div className="narrative-stack">
        <div className="narrative-panel">
          <div
            className="narrative-panel-mid"
            style={{
              opacity: text1.opacity,
              transform: `translate3d(0, ${text1.y}px, 0) scale(${text1.scale})`,
              visibility: text1.opacity < 0.02 ? 'hidden' : 'visible',
            }}
          >
            <p className="narrative-mark">Motion Byte</p>
            <p className="narrative-line">
              Wahi naam jo particles mein tha — ab type mein. Neeche scroll, ye bhi zoom out hoke screen se
              nikal jayega.
            </p>
          </div>
        </div>
        <div className="narrative-panel narrative-panel--b">
          <div
            className="narrative-panel-mid"
            style={{
              opacity: text2.opacity,
              transform: `translate3d(0, ${text2.y}px, 0) scale(${text2.scale})`,
              visibility: text2.opacity < 0.02 ? 'hidden' : 'visible',
            }}
          >
            <p className="narrative-line narrative-line--accent">
              Motion · glow · depth — jo logo mein dikha, wahi energy yahan
            </p>
            <p className="narrative-hint">Motion Byte — agla section neeche</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const { setHeroProgress, canvasOpacity } = useScrollJourney()

  const forwardWheelToScroll = useCallback((e: WheelEvent) => {
    const root = scrollRef.current
    if (!root) return
    root.scrollTop += e.deltaY
    e.preventDefault()
  }, [])

  const syncHeroProgress = useCallback(() => {
    const root = scrollRef.current
    const hero = heroRef.current
    if (!root || !hero) return
    const range = hero.offsetHeight - root.clientHeight
    const p = range > 0 ? Math.min(1, root.scrollTop / range) : 0
    setHeroProgress(p)
  }, [setHeroProgress])

  useLayoutEffect(() => {
    syncHeroProgress()
    window.addEventListener('resize', syncHeroProgress)
    return () => window.removeEventListener('resize', syncHeroProgress)
  }, [syncHeroProgress])

  return (
    <div className="app-page">
      <div
        ref={scrollRef}
        className="scroll-journey-root"
        onScroll={syncHeroProgress}
      >
        <div ref={heroRef} className="scroll-hero-block">
          <div className="scroll-sticky-view" onWheel={forwardWheelToScroll}>
            <div
              className="scroll-canvas-slot"
              style={{
                opacity: canvasOpacity,
                visibility: canvasOpacity < 0.02 ? 'hidden' : 'visible',
              }}
            >
              <Canvas
                className="app-canvas"
                style={{ width: '100%', height: '100%' }}
                camera={{ position: [0, 0, 4.2], fov: 32 }}
                dpr={[1, 2]}
                gl={{
                  antialias: true,
                  alpha: false,
                  powerPreference: 'high-performance',
                }}
              >
                <Scene />
              </Canvas>
            </div>
            <NarrativeStage />
          </div>
        </div>

        <section className="scroll-next-section" aria-label="Next">
          <p className="next-sec-kicker">02</p>
          <h2 className="next-sec-title">Agla section</h2>
          <p className="next-sec-body">
            Ye asli page scroll hai — hero scroll khatam hone ke baad yahan aa jate ho. Upar scroll se
            wapas logo + story.
          </p>
        </section>
      </div>
    </div>
  )
}
