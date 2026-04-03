import { useCallback, useEffect, useRef, useState } from 'react'

type Props = {
  onOpen: () => void
}

export function PortfolioTreasureGate({ onOpen }: Props) {
  const [phase, setPhase] = useState<'idle' | 'unlocking'>('idle')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    },
    [],
  )

  const runUnlock = useCallback(() => {
    if (phase !== 'idle') return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      onOpen()
      return
    }
    setPhase('unlocking')
    timerRef.current = setTimeout(() => {
      onOpen()
      setPhase('idle')
      timerRef.current = null
    }, 950)
  }, [phase, onOpen])

  return (
    <div
      className={`portfolio-treasure-gate portfolio-reveal is-visible${phase === 'unlocking' ? ' portfolio-treasure-gate--unlocking' : ''}`}
      aria-busy={phase === 'unlocking'}
    >
      <div className="portfolio-treasure-gate-aurora" aria-hidden />
      <div className="portfolio-treasure-gate-frame" aria-hidden />

      <div className="portfolio-treasure-gate-hero">
        <p className="portfolio-treasure-gate-eyebrow">The archive</p>
        <div className="portfolio-treasure-gate-chest-wrap">
          <svg
            className="portfolio-treasure-chest"
            viewBox="0 0 200 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <defs>
              <linearGradient id="tc-gold" x1="40" y1="0" x2="160" y2="160" gradientUnits="userSpaceOnUse">
                <stop stopColor="#f4d58d" />
                <stop offset="0.45" stopColor="#c9a227" />
                <stop offset="1" stopColor="#6b4c1a" />
              </linearGradient>
              <linearGradient id="tc-wood" x1="100" y1="70" x2="100" y2="155" gradientUnits="userSpaceOnUse">
                <stop stopColor="#2a1838" />
                <stop offset="1" stopColor="#120a18" />
              </linearGradient>
            </defs>

            {/* Glow burst (behind chest) */}
            <ellipse
              className="portfolio-treasure-chest-burst"
              cx="100"
              cy="118"
              rx="72"
              ry="48"
              fill="url(#tc-gold)"
              opacity="0.15"
            />

            {/* Chest body */}
            <path
              d="M36 88 L36 132 Q36 148 52 148 L148 148 Q164 148 164 132 L164 88 Q164 76 152 72 L48 72 Q36 76 36 88Z"
              fill="url(#tc-wood)"
              stroke="url(#tc-gold)"
              strokeWidth="2"
            />
            <path d="M48 88 L152 88" stroke="url(#tc-gold)" strokeWidth="1.2" opacity="0.5" />
            <circle cx="100" cy="112" r="10" fill="#1a0f22" stroke="url(#tc-gold)" strokeWidth="2" />
            <circle cx="100" cy="112" r="4" fill="#c9a227" opacity="0.9" />

            {/* Hinged lid */}
            <g className="portfolio-treasure-chest-lid" style={{ transformOrigin: '100px 78px' }}>
              <path
                d="M36 78 L36 52 Q36 36 52 32 L148 32 Q164 36 164 52 L164 78 Q164 64 152 60 L48 60 Q36 64 36 78Z"
                fill="url(#tc-wood)"
                stroke="url(#tc-gold)"
                strokeWidth="2"
              />
              <path
                d="M52 48 L148 48"
                stroke="url(#tc-gold)"
                strokeWidth="1.2"
                opacity="0.45"
              />
              <path
                d="M100 38 L100 52"
                stroke="url(#tc-gold)"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.8"
              />
            </g>

            {/* Floating rune sparks */}
            <g className="portfolio-treasure-chest-sparks" opacity="0.85">
              <path d="M28 56 L32 60 L28 64 L24 60Z" fill="#e8c547" className="portfolio-treasure-spark s1" />
              <path d="M172 48 L176 52 L172 56 L168 52Z" fill="#e8c547" className="portfolio-treasure-spark s2" />
              <path d="M100 18 L104 24 L100 30 L96 24Z" fill="#f4e4a8" className="portfolio-treasure-spark s3" />
            </g>
          </svg>

          <div className="portfolio-treasure-gate-rays" aria-hidden />
        </div>

        <button
          type="button"
          className="portfolio-treasure-gate-btn"
          onClick={runUnlock}
          disabled={phase === 'unlocking'}
          aria-expanded="false"
        >
          <span className="portfolio-treasure-gate-btn-label">Browse work</span>
          <span className="portfolio-treasure-gate-btn-sub" aria-hidden>
            {phase === 'unlocking' ? 'Opening…' : 'Unlock the vault'}
          </span>
        </button>
      </div>

      <p className="portfolio-treasure-gate-hint">
        Music videos, films &amp; series, websites — step inside when the seal breaks.
      </p>
    </div>
  )
}
