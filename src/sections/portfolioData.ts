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

export type PortfolioItem = {
  id: string
  title: string
  summary: string
  /** YouTube (legacy) — direct link on tile when no tracks */
  youtubeUrl?: string
  /** Music videos: open catalog modal → pockets; then detail modal per track */
  tracks?: PortfolioTrack[]
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
        id: 'web-1',
        title: 'Studio launch site',
        summary: 'Single-page narrative with scroll storytelling and case-study blocks.',
      },
      {
        id: 'web-2',
        title: 'Product marketing site',
        summary: 'Component library, docs, and conversion-focused landing sections.',
      },
    ],
  },
] as const
