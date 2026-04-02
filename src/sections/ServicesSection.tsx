import { ServicesWordmarkParticles } from '../scene/ServicesWordmarkParticles'
import { useEffect, useMemo, useState } from 'react'
import './ServicesSection.css'

const PRIMARY = [
  {
    id: 'ai',
    title: 'AI',
    preview: 'AI-powered films, music videos, and web series — concept to final frame.',
    description:
      'We create AI-powered films, music videos, and web series that transform ideas into immersive visual experiences. From concept development to final production, every frame is crafted with precision, blending storytelling, motion, and cutting-edge AI technology. Whether it’s long-form cinematic narratives, high-energy music visuals, or episodic storytelling, we ensure a consistent and impactful visual language that captures attention and leaves a lasting impression.',
  },
  {
    id: 'it',
    title: 'IT',
    preview: 'Websites, mobile apps, web apps — fast builds with clean UX.',
    description:
      'We build intelligent digital systems that power modern businesses. From scalable web applications and high-performance platforms to AI-driven solutions and seamless integrations, we transform complex ideas into efficient, user-focused products. Our approach combines clean design, robust architecture, and cutting-edge technology to deliver secure, scalable, and future-ready solutions that drive growth and performance.',
  },
  {
    id: 'promotions',
    title: 'Promotions',
    preview: 'Social media marketing, reels, audio trends — growth-focused content.',
    description:
      'We deliver high-impact digital promotions designed to maximize your reach, engagement, and conversions. From trending Instagram reels and viral audio strategies to targeted ad campaigns and influencer-driven growth, every move is optimized for results. Our data-backed approach ensures consistent visibility, audience expansion, and performance — delivering guaranteed growth outcomes while building a strong and lasting digital presence for your brand.',
  },
] as const

const SECONDARY = [
  'Websites',
  'Mobile apps',
  'Web apps',
  'Social media marketing',
  'Instagram reel trends',
  'Audio trends',
] as const

const AI_SECTIONS = [
  { title: 'Films', blurb: 'Long-form cinematic narratives shaped with AI.' },
  { title: 'Music Videos', blurb: 'High-impact visuals and motion that match the beat.' },
  { title: 'Web Series', blurb: 'Episodic storytelling with a consistent visual language.' },
] as const

const IT_ITEMS = [
  'Web Apps',
  'AI Systems',
  'Platforms',
  'APIs',
  'Automation',
  'Data',
  'Cloud',
  'Security',
  'UI/UX',
  'Design',
  'DevOps',
  'CMS',
  'Ecommerce',
  'SaaS',
  'Tools',
  'Analytics',
] as const

const PROMOTIONS_ITEMS = [
  'Instagram Trends',
  'Reels Trends',
  'Audio Trends',
  'Viral Marketing',
  'Content Boost',
  'Reach Growth',
  'Engagement Boost',
  'Follower Growth',
  'Brand Promotion',
  'Social Campaigns',
  'Influencer Marketing',
  'Hashtag Strategy',
  'Content Strategy',
  'Organic Growth',
  'Paid Ads',
  'Performance Ads',
  'Audience Targeting',
  'Lead Generation',
  'Conversion Boost',
  'Analytics',
] as const

export function ServicesSection() {
  const [openId, setOpenId] = useState<(typeof PRIMARY)[number]['id'] | null>(null)
  const [termsOpen, setTermsOpen] = useState(false)
  const openItem = useMemo(() => PRIMARY.find((x) => x.id === openId) ?? null, [openId])

  useEffect(() => {
    if (!openId) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (termsOpen) setTermsOpen(false)
      else setOpenId(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openId, termsOpen])

  useEffect(() => {
    if (!openId) setTermsOpen(false)
  }, [openId])

  return (
    <section
      id="section-services"
      className="services-section scroll-next-section scroll-next-section--services"
      aria-label="Services"
    >
      <div className="services-inner">
        <p className="next-sec-kicker services-reveal">03</p>

        <div className="services-heading-wrap">
          <div className="services-heading-spacer" aria-hidden />
          <h2 className="services-heading-sr">Services</h2>
          <div className="services-particle-canvas-slot" aria-hidden>
            <ServicesWordmarkParticles />
          </div>
        </div>

        <div className="services-lead services-reveal">
          <p className="services-lead-paragraph">
            Our core expertise lies in crafting long-form cinematic experiences powered by advanced AI technology, where
            storytelling meets innovation. We specialize in creating AI-driven films, music videos, and web series that
            are not only visually compelling but also strategically designed to engage modern audiences across digital
            platforms. From concept development, scripting, and visual design to production, post-production, and
            distribution-ready content, we handle every stage with precision and creative depth.
          </p>
          <p className="services-lead-paragraph">
            Alongside our cinematic focus, our services extend into high-performance IT solutions and result-driven
            digital promotions that amplify visibility and reach. Whether it’s building scalable web applications,
            designing seamless user experiences, or executing viral marketing strategies through social media trends,
            reels, and targeted campaigns — every service we offer is aligned with a single vision: delivering
            impactful, future-ready digital experiences that drive growth, engagement, and long-term brand value.
          </p>
        </div>

        <div className="services-primary services-reveal">
          <p className="services-primary-label">Primary focus</p>
          <ul className="services-primary-grid">
            {PRIMARY.map((item) => (
              <li key={item.id} className="services-primary-card">
                <button
                  type="button"
                  className="services-primary-tile"
                  onClick={() => setOpenId(item.id)}
                  aria-label={`Open ${item.title}`}
                >
                  <h3 className="services-primary-title">{item.title}</h3>
                  <p className="services-primary-blurb">{item.preview}</p>
                  <span className="services-primary-cta" aria-hidden>
                    Open
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="services-secondary services-reveal">
          <p className="services-secondary-label">We also deliver</p>
          <ul className="services-chip-list">
            {SECONDARY.map((label) => (
              <li key={label} className="services-chip">
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div
        className={`services-app-overlay${openId ? ' is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!openId}
        onMouseDown={(e) => {
          if (e.currentTarget === e.target) setOpenId(null)
        }}
      >
        <div className="services-app-sheet">
          <div className="services-app-topbar">
            <div className="services-app-title">{openItem?.title ?? ''}</div>
            <button type="button" className="services-app-close" onClick={() => setOpenId(null)} aria-label="Close">
              ✕
            </button>
          </div>
          <div className="services-app-body">
            {openId === 'promotions' ? (
              <p className="services-app-lead">
                {openItem?.description ?? ''}{' '}
                <button
                  type="button"
                  className="services-terms-link"
                  onClick={() => setTermsOpen(true)}
                >
                  (Terms &amp; Conditions Apply)
                </button>
              </p>
            ) : (
              <p className="services-app-lead">{openItem?.description ?? ''}</p>
            )}

            {openId === 'ai' ? (
              <div className="services-app-section-wrap">
                <div className="services-app-section-label">Sections</div>
                <ul className="services-app-section-grid">
                  {AI_SECTIONS.map((s) => (
                    <li key={s.title} className="services-app-section-card">
                      <div className="services-app-section-title">{s.title}</div>
                      <div className="services-app-section-blurb">{s.blurb}</div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : openId === 'it' ? (
              <div className="services-app-section-wrap">
                <div className="services-app-section-label">Capabilities</div>
                <ul className="services-app-chip-grid">
                  {IT_ITEMS.map((label) => (
                    <li key={label} className="services-app-chip">
                      {label}
                    </li>
                  ))}
                </ul>
              </div>
            ) : openId === 'promotions' ? (
              <div className="services-app-section-wrap">
                <div className="services-app-section-label">Promotions</div>
                <ul className="services-app-chip-grid">
                  {PROMOTIONS_ITEMS.map((label) => (
                    <li key={label} className="services-app-chip">
                      {label}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="services-app-placeholder">
                <div className="services-app-placeholder-title">App screen</div>
                <div className="services-app-placeholder-sub">Yahan hum content/sections baad mein add kar denge.</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className={`services-terms-overlay${termsOpen ? ' is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!termsOpen}
        onMouseDown={(e) => {
          if (e.currentTarget === e.target) setTermsOpen(false)
        }}
      >
        <div className="services-terms-sheet">
          <div className="services-terms-topbar">
            <div className="services-terms-title">Terms &amp; Conditions</div>
            <button
              type="button"
              className="services-app-close"
              onClick={() => setTermsOpen(false)}
              aria-label="Close terms"
            >
              ✕
            </button>
          </div>
          <div className="services-terms-body">
            <ul className="services-terms-list">
              <li className="services-terms-item">Conditions list placeholder (you will provide later).</li>
              <li className="services-terms-item">Example: Results depend on niche, budget, and account health.</li>
              <li className="services-terms-item">Example: Timelines vary by campaign and approvals.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
