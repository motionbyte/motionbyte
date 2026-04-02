import { useEffect, useState } from 'react'

/** True while the page tab is foreground — pause WebGL when user switches tabs (no visible change). */
export function useDocumentVisible() {
  const [visible, setVisible] = useState(
    () => typeof document !== 'undefined' && document.visibilityState === 'visible',
  )

  useEffect(() => {
    const onVis = () => setVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  return visible
}
