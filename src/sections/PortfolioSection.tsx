import { PortfolioWordmarkParticles } from '../scene/PortfolioWordmarkParticles'
import './PortfolioSection.css'

export function PortfolioSection() {
  return (
    <section className="portfolio-section scroll-next-section scroll-next-section--portfolio" aria-label="Portfolio">
      <div className="portfolio-inner">
        <p className="next-sec-kicker portfolio-reveal">04</p>

        <div className="portfolio-heading-wrap">
          <div className="portfolio-heading-spacer" aria-hidden />
          <h2 className="portfolio-heading-sr">Portfolio</h2>
          <div className="portfolio-particle-canvas-slot" aria-hidden>
            <PortfolioWordmarkParticles />
          </div>
        </div>

        <p className="portfolio-lead portfolio-reveal">
          Selected work — a glimpse into our cinematic worlds, product builds, and growth campaigns.
        </p>
      </div>
    </section>
  )
}

