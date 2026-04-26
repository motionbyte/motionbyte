import './Footer.css'

const NAV = [
  { href: '#section-about', label: 'About' },
  { href: '#section-services', label: 'Services' },
  { href: '#section-timelines', label: 'Timelines' },
  { href: '#section-portfolio', label: 'Portfolio' },
  { href: '#section-team', label: 'Team' },
  { href: '#section-contact', label: 'Contact' },
] as const

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-glass">
        <div className="site-footer-inner">
          <div className="site-footer-brand">
            <span className="site-footer-logo">Motion Byte</span>
            <p className="site-footer-tagline">Cinema meets code.</p>
          </div>

          <nav className="site-footer-nav" aria-label="Page sections">
            <ul className="site-footer-links">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a className="site-footer-link" href={item.href}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <p className="site-footer-copy">© {new Date().getFullYear()} Motion Byte. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
