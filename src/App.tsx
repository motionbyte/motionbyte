import { Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  Bloom,
  BrightnessContrast,
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
import { useDocumentVisible } from './hooks/useDocumentVisible'
import { useIntersectionVisible } from './hooks/useIntersectionVisible'
import { AboutSection } from './sections/AboutSection'
import { ServicesSection } from './sections/ServicesSection'
import { PortfolioSection } from './sections/PortfolioSection'
import { OurTeamSection } from './sections/OurTeamSection'
import { ContactSection } from './sections/ContactSection'
import { Footer } from './Footer'
import { useScrollJourney } from './ScrollJourneyContext'
import './App.css'

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
  const heroCanvasSlotRef = useRef<HTMLDivElement>(null)
  const docVisible = useDocumentVisible()
  const heroCanvasInView = useIntersectionVisible(heroCanvasSlotRef, '120px')
  const runHeroWebGl = docVisible && heroCanvasInView
  const { heroProgress, setHeroProgress } = useScrollJourney()
  const [showMobileAboutCue, setShowMobileAboutCue] = useState(true)

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

  const updateMobileAboutCue = useCallback(() => {
    const root = scrollRef.current
    const hero = heroRef.current
    if (!root || !hero) return
    setShowMobileAboutCue(root.scrollTop < hero.offsetHeight * 0.72)
  }, [])

  const onScrollRoot = useCallback(() => {
    syncHeroProgress()
    updateMobileAboutCue()
  }, [syncHeroProgress, updateMobileAboutCue])

  const scrollToAboutSection = useCallback(() => {
    const el = document.getElementById('section-about')
    if (!el) return
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' })
  }, [])

  useLayoutEffect(() => {
    updateMobileAboutCue()
    window.addEventListener('resize', updateMobileAboutCue)
    return () => window.removeEventListener('resize', updateMobileAboutCue)
  }, [updateMobileAboutCue])

  useEffect(() => {
    const root = scrollRef.current
    if (!root) return
    const nodes = Array.from(
      root.querySelectorAll<HTMLElement>(
        '.about-reveal, .services-reveal, .portfolio-reveal, .team-reveal, .contact-reveal, .footer-reveal',
      ),
    )
    if (nodes.length === 0) return

    const updateReveal = () => {
      const vh = root.clientHeight
      const enterLine = vh * 0.82
      const leaveLine = -vh * 0.2

      for (const node of nodes) {
        const r = node.getBoundingClientRect()
        const isVisible = r.top <= enterLine && r.bottom >= leaveLine
        node.classList.toggle('is-visible', isVisible)
      }
    }

    updateReveal()
    root.addEventListener('scroll', updateReveal, { passive: true })
    window.addEventListener('resize', updateReveal)
    return () => {
      root.removeEventListener('scroll', updateReveal)
      window.removeEventListener('resize', updateReveal)
    }
  }, [])

  // Dock jaldi complete karo aur uske baad same pose hold rakho.
  const dock = smoothstep(heroProgress, 0.02, 0.45)
  const logoScale = 1 - dock * 0.34
  const logoY = -dock * 14
  const logoOpacity = 1

  return (
    <div className="app-page">
      <div
        ref={scrollRef}
        className="scroll-journey-root"
        onScroll={onScrollRoot}
      >
        <div ref={heroRef} className="scroll-hero-block">
          <div className="scroll-sticky-view">
            <div
              ref={heroCanvasSlotRef}
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
                frameloop={runHeroWebGl ? 'always' : 'never'}
                gl={{
                  antialias: true,
                  alpha: true,
                  premultipliedAlpha: false,
                  powerPreference: 'high-performance',
                  stencil: false,
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
        </div>

        <AboutSection />
        <ServicesSection />
        <PortfolioSection />
        <OurTeamSection />
        <ContactSection />
        <Footer />
      </div>

      <button
        type="button"
        className={`mobile-about-jump${showMobileAboutCue ? '' : ' mobile-about-jump--hide'}`}
        onClick={scrollToAboutSection}
        aria-label="About Motion Byte section par jayein"
      >
        <span className="mobile-about-jump-icon" aria-hidden>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 5v11m0 0l-4.5 4.5M12 16l4.5 4.5"
              stroke="currentColor"
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="mobile-about-jump-label">About</span>
      </button>
    </div>
  )
}
