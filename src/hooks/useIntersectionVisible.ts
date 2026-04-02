import { useEffect, useState, type RefObject } from 'react'

/**
 * True while `ref` intersects the viewport — pause off-screen WebGL (no change while user sees that section).
 */
export function useIntersectionVisible<T extends HTMLElement>(
  ref: RefObject<T | null>,
  rootMargin = '80px',
) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => setVisible(e.isIntersecting),
      { threshold: 0, root: null, rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, rootMargin])

  return visible
}
