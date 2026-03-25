import { AboutWordmarkParticles } from '../scene/AboutWordmarkParticles'
import './AboutSection.css'

export function AboutSection() {
  return (
    <section className="about-section scroll-next-section" aria-label="About Motion Byte">
      <article className="about-content">
        <p className="next-sec-kicker about-reveal">02</p>
        <div className="about-heading-wrap about-reveal">
          <div className="about-heading-spacer" aria-hidden />
          <h2 className="about-heading-sr">About Motion Byte</h2>
          <div className="about-particle-canvas-slot" aria-hidden>
            <AboutWordmarkParticles />
          </div>
        </div>

        <p className="next-sec-body about-reveal">
          Every story begins as a spark... We turn that spark into <strong className="about-emph">cinema</strong>.
        </p>

        <p className="next-sec-body about-reveal">
          <strong>Motion Byte</strong> is an AI-powered creative studio where imagination meets technology to shape the
          future of storytelling. We don&apos;t just create videos - we build <strong className="about-emph">entire worlds</strong>.
        </p>

        <p className="next-sec-body about-reveal">
          From high-impact <strong className="about-emph">music videos</strong>, to immersive{' '}
          <strong className="about-emph">series</strong>, to visually striking <strong className="about-emph">films</strong> - we use the power of
          AI to bring the impossible to life. What once required massive budgets and resources... we recreate with
          intelligence, precision, and vision.
        </p>

        <p className="next-sec-body about-reveal">
          Our focus is simple:{' '}
          <strong className="about-emph">Control the story. Dominate the visuals. Deliver the emotion.</strong>
        </p>

        <p className="next-sec-body about-reveal">
          Everything else - websites, apps, design - is secondary. Our true craft lies in{' '}
          <strong>
            making <span className="about-emph">stories feel alive</span>
          </strong>
          .
        </p>

        <p className="next-sec-body about-reveal">
          We create space for artists to express without limits. We give brands a cinematic identity. And we transform
          raw ideas into experiences that stay with the audience.
        </p>

        <p className="next-sec-body about-reveal">
          This is not just a studio. This is a <strong className="about-emph">new era of storytelling</strong>.
        </p>

        <p className="next-sec-body about-reveal">
          <strong>
            <span className="about-emph">If you have a vision - we&apos;ll turn it into cinema.</span> If you don&apos;t -
            we&apos;ll show you what&apos;s possible.
          </strong>
        </p>

        <p className="next-sec-body next-sec-body--closing about-reveal">
          <strong>Welcome to Motion Byte.</strong>
        </p>
      </article>
    </section>
  )
}

