import { TEAM_MEMBERS } from './teamData'
import './OurTeamSection.css'

export function OurTeamSection() {
  return (
    <section
      id="section-team"
      className="team-section scroll-next-section scroll-next-section--team"
      aria-label="Our Team"
    >
      <div className="team-inner">
        <div className="team-head team-reveal">
          <p className="next-sec-kicker">05</p>
          <div className="team-title-row">
            <h2 className="team-title">
              <span className="team-title-line" aria-hidden>
                Our
              </span>
              <span className="team-title-accent">Team</span>
            </h2>
            <p className="team-tagline">
              The minds behind <span className="team-tagline-mark">Motion Byte</span> — where cinema meets code.
            </p>
          </div>
        </div>

        <p className="team-lead team-reveal">
          Three founders. One obsession: stories that hit harder than budget or gear ever could.
        </p>

        <div className="team-roster" role="list">
          {TEAM_MEMBERS.map((m, i) => (
            <article
              key={m.id}
              className={`team-card team-reveal team-card--${i + 1}`}
              role="listitem"
            >
              <div className="team-card-glow" aria-hidden />
              <div className="team-card-frame">
                <div className="team-card-corners" aria-hidden />
                <div className="team-card-visual">
                  <img
                    className="team-card-img"
                    src={m.imageSrc}
                    alt={m.name}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="team-card-scan" aria-hidden />
                  <div className="team-card-vignette" aria-hidden />
                </div>
                <div className="team-card-meta">
                  <h3 className="team-card-name">{m.name}</h3>
                  <p className="team-card-tag">{m.tag}</p>
                  <p className="team-card-role">{m.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
