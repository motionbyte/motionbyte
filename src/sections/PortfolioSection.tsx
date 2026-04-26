import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { PortfolioWordmarkParticles } from '../scene/PortfolioWordmarkParticles'
import {
  PORTFOLIO_SECTIONS,
  type PortfolioItem,
  type PortfolioSectionId,
  type PortfolioTrack,
} from './portfolioData'
import { fetchYoutubeMeta, parseYoutubeVideoId, type YoutubeOEmbed } from './youtubeMeta'
import { PortfolioTreasureGate } from './PortfolioTreasureGate'
import './PortfolioSection.css'

type MvModalState =
  | null
  | { kind: 'catalog'; item: PortfolioItem }
  | { kind: 'detail'; item: PortfolioItem; track: PortfolioTrack }

function musicVideoHeading(item: PortfolioItem, meta: Record<string, YoutubeOEmbed>) {
  const t0 = item.tracks?.[0]
  return t0 ? meta[t0.id]?.title ?? item.title : item.title
}

export function PortfolioSection() {
  const [activeId, setActiveId] = useState<PortfolioSectionId>('music-videos')
  const [portfolioWorksOpen, setPortfolioWorksOpen] = useState(false)
  const [mvModal, setMvModal] = useState<MvModalState>(null)
  const [websiteModal, setWebsiteModal] = useState<PortfolioItem | null>(null)
  const [ytMeta, setYtMeta] = useState<Record<string, YoutubeOEmbed>>({})

  const active = useMemo(
    () => PORTFOLIO_SECTIONS.find((s) => s.id === activeId) ?? PORTFOLIO_SECTIONS[0],
    [activeId],
  )

  /** Prefetch YouTube titles once the works grid is opened. */
  useEffect(() => {
    if (!portfolioWorksOpen) return
    const mv = PORTFOLIO_SECTIONS.find((s) => s.id === 'music-videos')
    if (!mv) return
    const tracks = mv.items.flatMap((item) => (item.tracks?.[0] ? [item.tracks[0]] : []))
    if (!tracks.length) return
    let cancelled = false
    ;(async () => {
      const updates: Record<string, YoutubeOEmbed> = {}
      await Promise.all(
        tracks.map(async (t) => {
          updates[t.id] = await fetchYoutubeMeta(t.youtubeUrl)
        }),
      )
      if (!cancelled)
        setYtMeta((prev) => {
          const next = { ...prev }
          for (const [id, meta] of Object.entries(updates)) {
            if (!next[id]) next[id] = meta
          }
          return next
        })
    })()
    return () => {
      cancelled = true
    }
  }, [portfolioWorksOpen])

  useEffect(() => {
    if (!mvModal) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      e.preventDefault()
      if (mvModal.kind === 'detail') setMvModal({ kind: 'catalog', item: mvModal.item })
      else setMvModal(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mvModal])

  useEffect(() => {
    if (!websiteModal) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      e.preventDefault()
      setWebsiteModal(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [websiteModal])

  useEffect(() => {
    if (!mvModal || mvModal.kind !== 'catalog') return
    const tracks = mvModal.item.tracks ?? []
    let cancelled = false
    ;(async () => {
      const updates: Record<string, YoutubeOEmbed> = {}
      await Promise.all(
        tracks.map(async (t) => {
          const m = await fetchYoutubeMeta(t.youtubeUrl)
          if (!cancelled) updates[t.id] = m
        }),
      )
      if (!cancelled) setYtMeta((prev) => ({ ...prev, ...updates }))
    })()
    return () => {
      cancelled = true
    }
  }, [mvModal])

  useEffect(() => {
    if (!mvModal || mvModal.kind !== 'detail') return
    const t = mvModal.track
    let cancelled = false
    ;(async () => {
      const m = await fetchYoutubeMeta(t.youtubeUrl)
      if (!cancelled)
        setYtMeta((prev) => (prev[t.id] ? prev : { ...prev, [t.id]: m }))
    })()
    return () => {
      cancelled = true
    }
  }, [mvModal])

  const modalRoot = typeof document !== 'undefined' ? document.body : null

  return (
    <>
    <section
      id="section-portfolio"
      className="portfolio-section scroll-next-section scroll-next-section--portfolio"
      aria-label="Portfolio"
    >
      <div className="portfolio-inner">
        <p className="next-sec-kicker portfolio-reveal">05</p>

        <div className="portfolio-heading-wrap">
          <div className="portfolio-heading-spacer" aria-hidden />
          <h2 className="portfolio-heading-sr">Portfolio</h2>
          <div className="portfolio-particle-canvas-slot" aria-hidden>
            <PortfolioWordmarkParticles />
          </div>
        </div>

        {!portfolioWorksOpen ? (
          <PortfolioTreasureGate onOpen={() => setPortfolioWorksOpen(true)} />
        ) : (
          <>
            <p className="portfolio-lead portfolio-reveal is-visible">
              Selected work — a glimpse into our cinematic worlds, product builds, and growth campaigns.
            </p>

            <div className="portfolio-app portfolio-reveal is-visible" role="region" aria-label="Portfolio categories">
              <div className="portfolio-app-segments" role="tablist" aria-label="Portfolio sections">
                {PORTFOLIO_SECTIONS.map((sec) => (
                  <button
                    key={sec.id}
                    type="button"
                    role="tab"
                    id={`portfolio-tab-${sec.id}`}
                    aria-selected={activeId === sec.id}
                    aria-controls={`portfolio-panel-${sec.id}`}
                    className={`portfolio-segment${activeId === sec.id ? ' is-active' : ''}`}
                    onClick={() => setActiveId(sec.id)}
                  >
                    <span className="portfolio-segment-label">{sec.label}</span>
                  </button>
                ))}
              </div>

              <div
                className="portfolio-app-panel"
                role="tabpanel"
                id={`portfolio-panel-${active.id}`}
                aria-labelledby={`portfolio-tab-${active.id}`}
              >
                <p className="portfolio-panel-lead">{active.lead}</p>

                <ul className="portfolio-panel-grid">
                  {active.items.map((item) => {
                    const hasTracks = Boolean(item.tracks?.length)
                    const hasWebsite = Boolean(item.website?.webUrl)
                    const cardHeading = musicVideoHeading(item, ytMeta)
                    return (
                      <li key={item.id} className="portfolio-panel-tile">
                        {hasTracks ? (
                          <button
                            type="button"
                            className="portfolio-panel-tile-btn"
                            onClick={() => setMvModal({ kind: 'catalog', item })}
                            aria-label={`Open ${cardHeading} catalog`}
                          >
                            <h3 className="portfolio-panel-tile-title">{cardHeading}</h3>
                            <p className="portfolio-panel-tile-summary">{item.summary}</p>
                            <span className="portfolio-panel-tile-cta" aria-hidden>
                              Open catalog
                            </span>
                            <span className="portfolio-panel-tile-meta" aria-hidden>
                              {active.shortLabel}
                            </span>
                          </button>
                        ) : hasWebsite ? (
                          <button
                            type="button"
                            className="portfolio-panel-tile-btn"
                            onClick={() => setWebsiteModal(item)}
                            aria-label={`Open ${item.title} case study`}
                          >
                            <h3 className="portfolio-panel-tile-title">{item.title}</h3>
                            <p className="portfolio-panel-tile-summary">{item.summary}</p>
                            <span className="portfolio-panel-tile-cta" aria-hidden>
                              View case study
                            </span>
                            <span className="portfolio-panel-tile-meta" aria-hidden>
                              {active.shortLabel}
                            </span>
                          </button>
                        ) : (
                          <div className="portfolio-panel-tile-inner">
                            <h3 className="portfolio-panel-tile-title">{item.title}</h3>
                            <p className="portfolio-panel-tile-summary">{item.summary}</p>
                            {item.youtubeUrl ? (
                              <a
                                className="portfolio-panel-tile-link"
                                href={item.youtubeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Watch on YouTube ↗
                              </a>
                            ) : null}
                            <span className="portfolio-panel-tile-meta" aria-hidden>
                              {active.shortLabel}
                            </span>
                          </div>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </section>

      {modalRoot
        ? createPortal(
            <>
      {/* Music video: catalog (pockets) */}
      <div
        className={`portfolio-mv-overlay${mvModal?.kind === 'catalog' ? ' is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={mvModal?.kind !== 'catalog'}
        onMouseDown={(e) => {
          if (e.currentTarget === e.target) setMvModal(null)
        }}
      >
        {mvModal?.kind === 'catalog' ? (
          <div className="portfolio-mv-sheet">
            <div className="portfolio-mv-topbar portfolio-mv-topbar--simple">
              <div className="portfolio-mv-title">{musicVideoHeading(mvModal.item, ytMeta)}</div>
              <button type="button" className="portfolio-mv-close" onClick={() => setMvModal(null)} aria-label="Close">
                ✕
              </button>
            </div>
            <div className="portfolio-mv-body">
              <p className="portfolio-mv-hint">Song titles load from YouTube. Tap a square for details.</p>
              <ul className="portfolio-mv-pocket-grid">
                {(mvModal.item.tracks ?? []).map((track) => {
                  const meta = ytMeta[track.id]
                  return (
                    <li key={track.id}>
                      <button
                        type="button"
                        className="portfolio-mv-pocket"
                        onClick={() => setMvModal({ kind: 'detail', item: mvModal.item, track })}
                      >
                        <span className="portfolio-mv-pocket-thumb-wrap">
                          {meta?.thumbnailUrl ? (
                            <img
                              className="portfolio-mv-pocket-thumb"
                              src={meta.thumbnailUrl}
                              alt=""
                              decoding="async"
                            />
                          ) : (
                            <span className="portfolio-mv-pocket-skeleton" aria-hidden />
                          )}
                        </span>
                        <span className="portfolio-mv-pocket-label">
                          {meta?.title ?? 'Loading…'}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        ) : null}
      </div>

      {/* Music video: detail (split) */}
      <div
        className={`portfolio-mv-overlay portfolio-mv-overlay--detail${mvModal?.kind === 'detail' ? ' is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={mvModal?.kind !== 'detail'}
        onMouseDown={(e) => {
          if (e.currentTarget !== e.target) return
          setMvModal((prev) => (prev?.kind === 'detail' ? { kind: 'catalog', item: prev.item } : null))
        }}
      >
        {mvModal?.kind === 'detail' ? (
          <div className="portfolio-mv-sheet portfolio-mv-sheet--wide">
            <div className="portfolio-mv-topbar">
              <button
                type="button"
                className="portfolio-mv-back"
                onClick={() => setMvModal({ kind: 'catalog', item: mvModal.item })}
                aria-label="Back to catalog"
              >
                ← Back
              </button>
              <div className="portfolio-mv-title portfolio-mv-title--truncate">
                {ytMeta[mvModal.track.id]?.title ?? mvModal.track.id}
              </div>
              <button
                type="button"
                className="portfolio-mv-close"
                onClick={() => setMvModal(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="portfolio-mv-detail">
              <div className="portfolio-mv-detail-media">
                {parseYoutubeVideoId(mvModal.track.youtubeUrl) ? (
                  <div className="portfolio-mv-detail-embed-wrap">
                    <iframe
                      className="portfolio-mv-detail-embed"
                      title="YouTube video preview"
                      src={`https://www.youtube.com/embed/${parseYoutubeVideoId(mvModal.track.youtubeUrl)}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                ) : ytMeta[mvModal.track.id]?.thumbnailUrl ? (
                  <img
                    className="portfolio-mv-detail-thumb"
                    src={ytMeta[mvModal.track.id]!.thumbnailUrl}
                    alt=""
                    decoding="async"
                  />
                ) : null}
                <a
                  className="portfolio-mv-yt-link"
                  href={mvModal.track.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Watch on YouTube ↗
                </a>
              </div>
              <div className="portfolio-mv-detail-copy">
                <dl className="portfolio-mv-fields">
                  <div className="portfolio-mv-field">
                    <dt>Client</dt>
                    <dd>{mvModal.track.client}</dd>
                  </div>
                  <div className="portfolio-mv-field">
                    <dt>Creation date</dt>
                    <dd>{mvModal.track.creationDate}</dd>
                  </div>
                  <div className="portfolio-mv-field">
                    <dt>Story</dt>
                    <dd>{mvModal.track.story}</dd>
                  </div>
                  <div className="portfolio-mv-field">
                    <dt>Experience</dt>
                    <dd>{mvModal.track.experience}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Website case study */}
      <div
        className={`portfolio-mv-overlay portfolio-web-overlay${websiteModal ? ' is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!websiteModal}
        aria-labelledby={websiteModal ? 'portfolio-web-title' : undefined}
        onMouseDown={(e) => {
          if (e.currentTarget === e.target) setWebsiteModal(null)
        }}
      >
        {websiteModal?.website ? (
          <div className="portfolio-mv-sheet portfolio-mv-sheet--wide portfolio-web-sheet">
            <div className="portfolio-mv-topbar portfolio-mv-topbar--simple">
              <div className="portfolio-mv-title" id="portfolio-web-title">
                {websiteModal.title}
              </div>
              <button
                type="button"
                className="portfolio-mv-close"
                onClick={() => setWebsiteModal(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="portfolio-mv-body portfolio-web-body">
              <p className="portfolio-web-lead">{websiteModal.website.description}</p>
              <dl className="portfolio-mv-fields portfolio-web-fields">
                <div className="portfolio-mv-field">
                  <dt>Client</dt>
                  <dd>{websiteModal.website.client}</dd>
                </div>
                <div className="portfolio-mv-field">
                  <dt>Web URL</dt>
                  <dd>
                    <a
                      className="portfolio-web-external"
                      href={websiteModal.website.webUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {websiteModal.website.webUrl.replace(/^https?:\/\//, '')} ↗
                    </a>
                  </dd>
                </div>
                <div className="portfolio-mv-field">
                  <dt>Technology</dt>
                  <dd>{websiteModal.website.technology}</dd>
                </div>
              </dl>
              <div className="portfolio-web-casestudy">
                <h3 className="portfolio-web-casestudy-heading">Case study</h3>
                <div className="portfolio-web-casestudy-copy">
                  {websiteModal.website.caseStudy.split(/\n\n+/).map((block, i) => (
                    <p key={i}>{block.trim()}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
            </>,
            modalRoot,
          )
        : null}
    </>
  )
}
