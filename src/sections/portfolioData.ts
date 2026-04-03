export type PortfolioSectionId = 'music-videos' | 'films-series' | 'websites'

/** One “track” / video inside a music-video project */
export type PortfolioTrack = {
  id: string
  youtubeUrl: string
  client: string
  creationDate: string
  story: string
  experience: string
}

/** Websites tab: case study modal (client, URL, stack, narrative) */
export type PortfolioWebsiteMeta = {
  webUrl: string
  client: string
  technology: string
  /** Short overview — shown in modal under title */
  description: string
  /** Full case study copy */
  caseStudy: string
}

export type PortfolioItem = {
  id: string
  title: string
  summary: string
  /** YouTube (legacy) — direct link on tile when no tracks */
  youtubeUrl?: string
  /** Music videos: open catalog modal → pockets; then detail modal per track */
  tracks?: PortfolioTrack[]
  /** Websites: opens case-study modal */
  website?: PortfolioWebsiteMeta
}

export type PortfolioSectionConfig = {
  id: PortfolioSectionId
  label: string
  shortLabel: string
  lead: string
  items: PortfolioItem[]
}

export const PORTFOLIO_SECTIONS: readonly PortfolioSectionConfig[] = [
  {
    id: 'music-videos',
    label: 'Music Videos',
    shortLabel: 'MV',
    lead: 'High-impact visuals cut to the beat — from concept to final grade.',
    items: [
      {
        id: 'mv-yt-1',
        title: 'Music video — 1',
        summary: 'Tap to open the catalog — song title loads from YouTube.',
        tracks: [
          {
            id: 'mv-yt-1-t',
            youtubeUrl: 'https://youtu.be/Jf4yeB-Fc-k',
            client: '—',
            creationDate: '—',
            story:
              'Story beats and visual arc for this release — update with your real production notes.',
            experience:
              'What we delivered on set / in post — update with your real experience.',
          },
        ],
      },
      {
        id: 'mv-yt-2',
        title: 'Music video — 2',
        summary: 'Tap to open the catalog — song title loads from YouTube.',
        tracks: [
          {
            id: 'mv-yt-2-t',
            youtubeUrl: 'https://youtu.be/Vd8RNh2LcxM',
            client: '—',
            creationDate: '—',
            story: '—',
            experience: '—',
          },
        ],
      },
      {
        id: 'mv-yt-3',
        title: 'Music video — 3',
        summary: 'Tap to open the catalog — song title loads from YouTube.',
        tracks: [
          {
            id: 'mv-yt-3-t',
            youtubeUrl: 'https://youtu.be/a0ohyXl116k',
            client: '—',
            creationDate: '—',
            story: '—',
            experience: '—',
          },
        ],
      },
      {
        id: 'mv-yt-4',
        title: 'Music video — 4',
        summary: 'Tap to open the catalog — song title loads from YouTube.',
        tracks: [
          {
            id: 'mv-yt-4-t',
            youtubeUrl: 'https://youtu.be/1xWhAY87sSo',
            client: '—',
            creationDate: '—',
            story: '—',
            experience: '—',
          },
        ],
      },
      {
        id: 'mv-yt-5',
        title: 'Music video — 5',
        summary: 'Tap to open the catalog — song title loads from YouTube.',
        tracks: [
          {
            id: 'mv-yt-5-t',
            youtubeUrl: 'https://youtu.be/15MN6UGOQTU',
            client: '—',
            creationDate: '—',
            story: '—',
            experience: '—',
          },
        ],
      },
    ],
  },
  {
    id: 'films-series',
    label: 'Films / Series',
    shortLabel: 'F/S',
    lead: 'Long-form storytelling — episodic or feature-length, built for streaming.',
    items: [
      {
        id: 'fs-1',
        title: 'Pilot — the threshold',
        summary: 'Series opener establishing tone, cast, and recurring visual language.',
      },
      {
        id: 'fs-2',
        title: 'Short film — drift',
        summary: 'Cinematic short with AI-assisted world-building and sound design.',
      },
    ],
  },
  {
    id: 'websites',
    label: 'Websites',
    shortLabel: 'Web',
    lead: 'Fast, responsive sites — product pages, landing flows, and CMS-backed content.',
    items: [
      {
        id: 'web-thelostsymbols',
        title: 'The Lost Symbols',
        summary: 'Artist / project hub — releases, lore, and a journey fans can scroll.',
        website: {
          webUrl: 'https://thelostsymbols.in',
          client: 'The Lost Symbols',
          technology: 'React, TypeScript, Vite, responsive CSS, performance-tuned assets',
          description:
            'A focused digital home for the world around The Lost Symbols: clear story beats, music drops, and visual identity that stays sharp on every device.',
          caseStudy:
            'We designed the site as a single narrative surface rather than a generic template. The hero establishes tone immediately; sections below carry release timelines, embedded media, and calls-to-action without clutter. Typography and spacing follow a tight system so long-form copy and imagery stay readable on mobile-first traffic.\n\nPerformance was a priority: lean bundles, optimized imagery, and layout stability so first paint feels instant even on mid-tier networks. The result is a site that feels as intentional as the music — easy to share, easy to update, and ready to grow with new campaigns.',
        },
      },
      {
        id: 'web-jaipur2026',
        title: 'Jaipur 2026',
        summary: 'City & campaign presence — schedules, stories, and a clear visitor path.',
        website: {
          webUrl: 'https://jaipur2026.com',
          client: 'Jaipur 2026 (campaign)',
          technology: 'Modern static/SSR-friendly stack, semantic HTML, accessible components, CDN-ready assets',
          description:
            'Jaipur 2026 needed a confident, readable web front: what’s happening, why it matters, and how audiences can engage — without overwhelming detail on first load.',
          caseStudy:
            'We structured the page hierarchy around three goals: orientation (what is Jaipur 2026), exploration (highlights and narrative), and action (routes, links, and follow-ons). Visual hierarchy uses strong section breaks and contrast so scanning on phones works as well as on desktop.\n\nContent blocks are modular so the team can swap modules as schedules and messaging evolve. Accessibility and SEO-friendly markup help discovery and compliance; loading patterns keep interaction smooth during traffic spikes around announcements.',
        },
      },
    ],
  },
] as const
