import { Suspense, useCallback, useEffect, useLayoutEffect, useRef } from 'react'
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

function smoothstep(t: number, a: number, b: number) {
  if (b <= a) return t >= b ? 1 : 0
  const x = Math.min(1, Math.max(0, (t - a) / (b - a)))
  return x * x * (3 - 2 * x)
}

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
      <fog attach="fog" args={['#0b0818', 4.6, 16.8]} />
      <ambientLight intensity={0.085} />
      <hemisphereLight
        intensity={0.26}
        color="#7a7390"
        groundColor="#080818"
      />
      <directionalLight
        position={[6, 11, 9]}
        intensity={0.38}
        color="#ffd6c4"
      />
      <directionalLight
        position={[-9, 3, -7]}
        intensity={0.28}
        color="#6eb8ff"
      />
      <pointLight
        position={[0, 0.6, 5.4]}
        intensity={0.3}
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
          luminanceThreshold={0.028}
          luminanceSmoothing={0.5}
          intensity={1.48}
          mipmapBlur
        />
        <ChromaticAberration
          offset={CA_OFFSET}
          radialModulation
          modulationOffset={0.22}
        />
        <HueSaturation hue={0.062} saturation={0.18} />
        <BrightnessContrast brightness={0.012} contrast={0.24} />
        <ToneMapping
          mode={ToneMappingMode.ACES_FILMIC}
          whitePoint={3.65}
          middleGrey={0.58}
        />
        <Sepia
          intensity={0.42}
          blendFunction={BlendFunction.SOFT_LIGHT}
          opacity={0.06}
        />
        <Vignette
          technique={VignetteTechnique.ESKIL}
          offset={0.28}
          darkness={0.44}
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

export default function App() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const { heroProgress, setHeroProgress } = useScrollJourney()

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

  useEffect(() => {
    const root = scrollRef.current
    if (!root) return
    const nodes = Array.from(root.querySelectorAll<HTMLElement>('.about-reveal'))
    if (nodes.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      },
      {
        root,
        threshold: 0.2,
        rootMargin: '0px 0px -8% 0px',
      },
    )
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].style.transitionDelay = `${Math.min(i * 75, 525)}ms`
      observer.observe(nodes[i])
    }
    return () => observer.disconnect()
  }, [])

  const dock = smoothstep(heroProgress, 0.02, 0.74)
  const logoScale = 1 - dock * 0.56
  const logoY = -dock * 35
  const logoOpacity = 1

  return (
    <div className="app-page">
      <div
        ref={scrollRef}
        className="scroll-journey-root"
        onScroll={syncHeroProgress}
      >
        <div ref={heroRef} className="scroll-hero-block">
          <div className="scroll-sticky-view">
            <div
              className="scroll-canvas-slot"
              style={{
                opacity: logoOpacity,
                transform: `translate3d(0, ${logoY}vh, 0) scale(${logoScale})`,
              }}
            >
              <Canvas
                className="app-canvas"
                style={{ width: '100%', height: '100%' }}
                camera={{ position: [0, 0, 2.9], fov: 32 }}
                dpr={[1, 2]}
                gl={{
                  antialias: true,
                  alpha: true,
                  premultipliedAlpha: false,
                  powerPreference: 'high-performance',
                }}
                onCreated={({ gl, scene }) => {
                  scene.background = null
                  gl.setClearColor(0x000000, 0)
                }}
              >
                <Scene />
              </Canvas>
            </div>
          </div>
          <div className="logo-dock-spacer" />

          <section className="scroll-next-section" aria-label="About Motion Byte">
            <article className="about-content">
              <p className="next-sec-kicker about-reveal">02</p>
              <h2 className="next-sec-title about-reveal">About Motion Byte</h2>

              <p className="next-sec-body about-reveal">
                Every story begins as a spark... We turn that spark into <strong>cinema</strong>.
              </p>

              <p className="next-sec-body about-reveal">
                <strong>Motion Byte</strong> is an AI-powered creative studio where imagination meets technology to
                shape the future of storytelling. We don&apos;t just create videos - we build <strong>entire worlds</strong>.
              </p>

              <p className="next-sec-body about-reveal">
                From high-impact <strong>music videos</strong>, to immersive <strong>series</strong>, to visually
                striking <strong>films</strong> - we use the power of AI to bring the impossible to life. What once
                required massive budgets and resources... we recreate with intelligence, precision, and vision.
              </p>

              <p className="next-sec-body about-reveal">
                Our focus is simple: <strong>Control the story. Dominate the visuals. Deliver the emotion.</strong>
              </p>

              <p className="next-sec-body about-reveal">
                Everything else - websites, apps, design - is secondary. Our true craft lies in <strong>making
                stories feel alive</strong>.
              </p>

              <p className="next-sec-body about-reveal">
                We create space for artists to express without limits. We give brands a cinematic identity. And we
                transform raw ideas into experiences that stay with the audience.
              </p>

              <p className="next-sec-body about-reveal">
                This is not just a studio. This is a <strong>new era of storytelling</strong>.
              </p>

              <p className="next-sec-body about-reveal">
                <strong>
                  If you have a vision - we&apos;ll turn it into cinema. If you don&apos;t - we&apos;ll show you what&apos;s
                  possible.
                </strong>
              </p>

              <p className="next-sec-body next-sec-body--closing about-reveal">
                <strong>Welcome to Motion Byte.</strong>
              </p>
            </article>
          </section>
        </div>
      </div>
    </div>
  )
}
