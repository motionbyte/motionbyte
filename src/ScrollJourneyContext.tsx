import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react'

const CAMERA_Z_START = 2.9
const CAMERA_Z_END = 6.2

function clamp01(x: number) {
  return Math.min(1, Math.max(0, x))
}

function smoothstep(t: number, a: number, b: number) {
  if (b <= a) return t >= b ? 1 : 0
  const x = clamp01((t - a) / (b - a))
  return x * x * (3 - 2 * x)
}

export type ScrollJourneyValue = {
  heroProgress: number
  setHeroProgress: Dispatch<SetStateAction<number>>
  targetCameraZ: number
}

const ScrollJourneyContext = createContext<ScrollJourneyValue | null>(null)

function deriveFromHero(t: number): Pick<ScrollJourneyValue, 'targetCameraZ'> {
  const zT = smoothstep(t, 0.03, 0.82)
  return {
    targetCameraZ: CAMERA_Z_START + (CAMERA_Z_END - CAMERA_Z_START) * zT,
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
