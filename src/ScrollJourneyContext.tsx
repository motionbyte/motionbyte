import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react'

/** Shuru — normal frame */
const CAMERA_Z_START = 4.2
/** Halka camera pull — asli “zoom out” logo group scale (text jaisa) se */
const CAMERA_Z_LOGO_OUT = 13

function clamp01(x: number) {
  return Math.min(1, Math.max(0, x))
}

function smoothstep(t: number, a: number, b: number) {
  if (b <= a) return t >= b ? 1 : 0
  const x = clamp01((t - a) / (b - a))
  return x * x * (3 - 2 * x)
}

export type NarrativePanel = {
  y: number
  opacity: number
  /** Zoom-out exit: scale above 1 */
  scale: number
}

/** Text exit jaisa: scale ↑ + upar + fade (logo 3D group par) */
export type LogoScrollTransform = {
  scale: number
  /** World Y — upar pass out */
  y: number
  /** Core + glow opacity multiplier */
  opacityMul: number
}

export type ScrollJourneyValue = {
  heroProgress: number
  setHeroProgress: Dispatch<SetStateAction<number>>
  /** WebGL layer — logo phase ke end par fade */
  canvasOpacity: number
  /** Logo par text jaisa zoom-out motion */
  logoScroll: LogoScrollTransform
  text1: NarrativePanel
  text2: NarrativePanel
  targetCameraZ: number
}

const ScrollJourneyContext = createContext<ScrollJourneyValue | null>(null)

/** Jab tak ye na ho, koi narrative text nahi (sirf logo) */
const LOGO_PHASE_END = 0.38

const TEXT_SCALE_EXIT = 1.45
const TEXT_START = 0.42

function logoScrollFromT(t: number): LogoScrollTransform {
  if (t >= TEXT_START) {
    return { scale: 1, y: 0, opacityMul: 0 }
  }
  // Text panels ke exit jaisa curve: scale = 1 + exit * 1.45, upar, fade
  const exitT = smoothstep(t, LOGO_PHASE_END * 0.18, LOGO_PHASE_END + 0.06)
  const fadeT = smoothstep(t, LOGO_PHASE_END * 0.4, LOGO_PHASE_END + 0.09)
  return {
    scale: 1 + exitT * TEXT_SCALE_EXIT,
    y: exitT * 1.5,
    opacityMul: 1 - fadeT,
  }
}

function deriveFromHero(t: number): Omit<ScrollJourneyValue, 'heroProgress' | 'setHeroProgress'> {
  const logoScroll = logoScrollFromT(t)

  const zT = smoothstep(t, 0, LOGO_PHASE_END)
  const targetCameraZ = CAMERA_Z_START + (CAMERA_Z_LOGO_OUT - CAMERA_Z_START) * zT

  const canvasOpacity = 1 - smoothstep(t, LOGO_PHASE_END * 0.5, LOGO_PHASE_END + 0.08)

  const emptyPanel: NarrativePanel = { y: 0, opacity: 0, scale: 1 }

  if (t < TEXT_START) {
    return {
      canvasOpacity,
      logoScroll,
      targetCameraZ,
      text1: emptyPanel,
      text2: emptyPanel,
    }
  }

  // Text 1: fade in → phir zoom-out style exit (scale up + up + fade)
  const in1 = smoothstep(t, TEXT_START, TEXT_START + 0.1)
  const exit1 = smoothstep(t, 0.58, 0.76)
  const text1: NarrativePanel = {
    opacity: in1 * (1 - exit1),
    scale: 1 + exit1 * TEXT_SCALE_EXIT,
    y: -exit1 * 100,
  }

  const in2 = smoothstep(t, 0.72, 0.84)
  const exit2 = smoothstep(t, 0.88, 0.995)
  const text2: NarrativePanel = {
    opacity: in2 * (1 - exit2),
    scale: 1 + exit2 * TEXT_SCALE_EXIT,
    y: -exit2 * 100,
  }

  return {
    canvasOpacity,
    logoScroll,
    targetCameraZ,
    text1,
    text2,
  }
}

export function ScrollJourneyProvider({ children }: { children: ReactNode }) {
  const [heroProgress, setHeroProgress] = useState(0)

  const value = useMemo((): ScrollJourneyValue => {
    const derived = deriveFromHero(heroProgress)
    return {
      heroProgress,
      setHeroProgress,
      ...derived,
    }
  }, [heroProgress])

  return (
    <ScrollJourneyContext.Provider value={value}>{children}</ScrollJourneyContext.Provider>
  )
}

export function useScrollJourney() {
  const v = useContext(ScrollJourneyContext)
  if (!v) throw new Error('useScrollJourney: ScrollJourneyProvider missing')
  return v
}
