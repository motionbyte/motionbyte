/** Paths under /public — spaces encoded for stable URLs */
export type TeamMember = {
  id: string
  name: string
  role: string
  tag: string
  imageSrc: string
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'arunsingh-naruka',
    name: 'Arunsingh Naruka',
    role: 'Founding team',
    tag: 'Vision & story',
    imageSrc: encodeURI('/Our Team/arunsingh naruka.png'),
  },
  {
    id: 'aman-raj',
    name: 'Aman Raj',
    role: 'Founding team',
    tag: 'Build & scale',
    imageSrc: encodeURI('/Our Team/aman raj.png'),
  },
  {
    id: 'gunjan-soral',
    name: 'Gunjan Soral',
    role: 'Founding team',
    tag: 'Creative engine',
    imageSrc: encodeURI('/Our Team/gunjan soral.png'),
  },
]
