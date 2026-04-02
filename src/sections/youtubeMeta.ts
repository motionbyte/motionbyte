/** YouTube video id from youtu.be or youtube.com/watch?v= */
export function parseYoutubeVideoId(url: string): string | null {
  const u = url.trim()
  const short = u.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/)
  if (short) return short[1]
  const long = u.match(/[?&]v=([a-zA-Z0-9_-]{11})/)
  if (long) return long[1]
  return null
}

export function youtubeThumbnailUrl(videoId: string, quality: 'hq' | 'max' = 'hq') {
  const q = quality === 'max' ? 'maxresdefault' : 'hqdefault'
  return `https://img.youtube.com/vi/${videoId}/${q}.jpg`
}

export type YoutubeOEmbed = {
  title: string
  thumbnailUrl: string
}

/**
 * Title + thumbnail via noembed (no API key). Falls back to video id + static thumbnail if fetch fails.
 */
export async function fetchYoutubeMeta(videoUrl: string): Promise<YoutubeOEmbed> {
  const id = parseYoutubeVideoId(videoUrl)
  const fallbackThumb = id ? youtubeThumbnailUrl(id) : ''

  try {
    const endpoint = `https://noembed.com/embed?url=${encodeURIComponent(videoUrl)}`
    const res = await fetch(endpoint)
    if (!res.ok) throw new Error(String(res.status))
    const j = (await res.json()) as { title?: string; thumbnail_url?: string }
    return {
      title: typeof j.title === 'string' && j.title ? j.title : id ?? 'Video',
      thumbnailUrl: typeof j.thumbnail_url === 'string' && j.thumbnail_url ? j.thumbnail_url : fallbackThumb,
    }
  } catch {
    return {
      title: id ? `YouTube — ${id}` : 'Video',
      thumbnailUrl: fallbackThumb,
    }
  }
}
