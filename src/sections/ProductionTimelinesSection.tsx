import './ProductionTimelinesSection.css'

const RANGE_CARDS = [
  { label: 'Music videos', range: '5–15 days', note: 'Typical 3–5 min piece' },
  { label: 'Short films', range: '2–4 weeks', note: 'Roughly 5–20 min runtime' },
  { label: 'Web series (per ep.)', range: '3–6 weeks', note: 'About 20–40 min per episode' },
  { label: 'Feature films', range: '3–8 months', note: '60–120 min, AI-hybrid pipeline' },
] as const

const PROJECTS = [
  {
    id: 'mv',
    icon: '🎬',
    title: 'Music video',
    runtime: '3–5 min',
    totalLabel: 'Total time',
    total: '5–15 days',
    highlights: ['Fast projects: 5–7 days', 'High-end cinematic: 10–15 days'],
    rows: [
      { stage: 'Concept', work: 'Idea, mood, references', time: '1–2 days' },
      { stage: 'Previs (AI)', work: 'Shot planning, look test', time: '1–2 days' },
      { stage: 'Production', work: 'AI scenes + optional shoot', time: '2–5 days' },
      { stage: 'Post', work: 'Edit + color + VFX', time: '2–5 days' },
      { stage: 'Final', work: 'Revisions + export', time: '1–2 days' },
    ],
  },
  {
    id: 'sf',
    icon: '🎬',
    title: 'Short film',
    runtime: '5–20 min',
    totalLabel: 'Total time',
    total: '2–4 weeks',
    highlights: ['Heavy VFX → plan for ~4 weeks', 'Simple narrative → often 2–3 weeks'],
    rows: [
      { stage: 'Writing', work: 'Script + structure', time: '3–5 days' },
      { stage: 'Pre-production', work: 'Storyboard + planning', time: '3–5 days' },
      { stage: 'Production', work: 'AI + shoot', time: '5–10 days' },
      { stage: 'Post', work: 'Editing + VFX + sound', time: '5–10 days' },
      { stage: 'Final', work: 'Revisions', time: '2–3 days' },
    ],
  },
  {
    id: 'ws',
    icon: '🎬',
    title: 'Web series',
    runtime: '20–40 min / episode',
    totalLabel: 'Per episode',
    total: '3–6 weeks',
    highlights: [
      'Season (6–8 eps), parallel work: about 2–4 months',
      'Sequential delivery: often 4–8 months',
    ],
    rows: [
      { stage: 'Writing', work: 'Episode script', time: '5–7 days' },
      { stage: 'Pre-production', work: 'Planning + assets', time: '5–7 days' },
      { stage: 'Production', work: 'AI + shoot', time: '10–15 days' },
      { stage: 'Post', work: 'Edit + VFX + sound', time: '10–15 days' },
      { stage: 'Final', work: 'Delivery', time: '2–3 days' },
    ],
  },
  {
    id: 'ff',
    icon: '🎬',
    title: 'Feature film',
    runtime: '60–120 min',
    totalLabel: 'Total time (AI hybrid)',
    total: '3–8 months',
    highlights: ['Heavy VFX / cinematic scale → 6–8 months', 'Medium scale → often 3–5 months'],
    rows: [
      { stage: 'Writing', work: 'Script', time: '2–4 weeks' },
      { stage: 'Pre-production', work: 'Planning + design', time: '3–6 weeks' },
      { stage: 'Production', work: 'AI + shoot', time: '4–10 weeks' },
      { stage: 'Post', work: 'Edit + VFX + sound', time: '4–12 weeks' },
      { stage: 'Final', work: 'Revisions + mastering', time: '1–2 weeks' },
    ],
  },
] as const

const COMPARE_ROWS = [
  { type: 'Music video', traditional: '20–30 days', hybrid: '5–15 days' },
  { type: 'Short film', traditional: '2–3 months', hybrid: '2–4 weeks' },
  { type: 'Web series episode', traditional: '2–3 months', hybrid: '3–6 weeks' },
  { type: 'Feature film', traditional: '1–2 years', hybrid: '3–8 months' },
] as const

export function ProductionTimelinesSection() {
  return (
    <section
      id="section-timelines"
      className="timelines-section scroll-next-section scroll-next-section--timelines"
      aria-labelledby="timelines-heading"
    >
      <div className="timelines-inner">
        <div className="timelines-filmstrip" aria-hidden>
          <span className="timelines-filmstrip-hole" />
          <span className="timelines-filmstrip-hole" />
          <span className="timelines-filmstrip-hole" />
          <span className="timelines-filmstrip-hole" />
          <span className="timelines-filmstrip-hole" />
        </div>

        <p className="next-sec-kicker timelines-reveal">04</p>

        <h2 id="timelines-heading" className="timelines-heading timelines-reveal">
          Production <span className="timelines-heading-accent">timelines</span>
        </h2>

        <p className="timelines-lead timelines-reveal">
          Ranges — not fixed promises. Every project scales with{' '}
          <strong>creative scope</strong>, <strong>visual complexity</strong>, and <strong>how much polish</strong> you
          want in the final picture.
        </p>

        <blockquote className="timelines-disclaimer timelines-reveal">
          <p>
            Timelines vary based on project scale, complexity, and level of visual detail. Our AI-powered workflow
            significantly reduces production time compared to traditional methods.
          </p>
        </blockquote>

        <div className="timelines-principles timelines-reveal" role="group" aria-label="How we estimate">
          <div className="timelines-principle timelines-principle--bad">
            <span className="timelines-principle-mark" aria-hidden>
              ✕
            </span>
            <span>Avoid single fixed dates (“done in exactly 10 days”) unless scope is locked.</span>
          </div>
          <div className="timelines-principle timelines-principle--good">
            <span className="timelines-principle-mark" aria-hidden>
              ✓
            </span>
            <span>Use transparent ranges and scale the pipeline with scope — that’s how real productions work.</span>
          </div>
        </div>

        <p className="timelines-slab-label timelines-reveal">At a glance</p>
        <ul className="timelines-range-grid timelines-reveal">
          {RANGE_CARDS.map((c) => (
            <li key={c.label} className="timelines-range-card">
              <span className="timelines-range-label">{c.label}</span>
              <span className="timelines-range-value">{c.range}</span>
              <span className="timelines-range-note">{c.note}</span>
            </li>
          ))}
        </ul>

        <p className="timelines-slab-label timelines-reveal">Stage-by-stage breakdowns</p>
        <p className="timelines-slab-hint timelines-reveal">Tap a row to expand details on mobile.</p>

        <div className="timelines-accordions timelines-reveal">
          {PROJECTS.map((p) => (
            <details key={p.id} className="timelines-details">
              <summary className="timelines-summary">
                <span className="timelines-summary-icon" aria-hidden>
                  {p.icon}
                </span>
                <span className="timelines-summary-text">
                  <span className="timelines-summary-title">{p.title}</span>
                  <span className="timelines-summary-meta">
                    {p.runtime} · <strong>{p.total}</strong>
                  </span>
                </span>
                <span className="timelines-summary-chevron" aria-hidden />
              </summary>
              <div className="timelines-panel">
                <p className="timelines-panel-total">
                  <span className="timelines-panel-total-label">{p.totalLabel}</span>
                  <span className="timelines-panel-total-value">{p.total}</span>
                </p>
                <ul className="timelines-highlights">
                  {p.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
                <div className="timelines-table-wrap" role="region" aria-label={`${p.title} stages`} tabIndex={0}>
                  <table className="timelines-table">
                    <thead>
                      <tr>
                        <th scope="col">Stage</th>
                        <th scope="col">Work</th>
                        <th scope="col">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {p.rows.map((r) => (
                        <tr key={r.stage}>
                          <td>{r.stage}</td>
                          <td>{r.work}</td>
                          <td>{r.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </details>
          ))}
        </div>

        <div className="timelines-compare timelines-reveal">
          <div className="timelines-compare-header">
            <h3 className="timelines-compare-title">Traditional vs AI-hybrid</h3>
            <p className="timelines-compare-sub">
              Where Motion Byte wins on calendar — your clearest selling story for clients who know how long legacy
              pipelines take.
            </p>
          </div>
          <div className="timelines-table-wrap timelines-table-wrap--compare" role="region" aria-label="Comparison table">
            <table className="timelines-table timelines-table--compare">
              <thead>
                <tr>
                  <th scope="col">Type</th>
                  <th scope="col">Traditional</th>
                  <th scope="col">Motion Byte (AI hybrid)</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((r) => (
                  <tr key={r.type}>
                    <td>{r.type}</td>
                    <td className="timelines-table-muted">{r.traditional}</td>
                    <td>
                      <span className="timelines-table-highlight">{r.hybrid}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="timelines-foot timelines-reveal">
          Share ranges early, refine after a scope call — that keeps expectations aligned and delivery predictable.
        </p>
      </div>
    </section>
  )
}
