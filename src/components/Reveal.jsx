import { useEffect, useRef } from 'react'

// Fait apparaître son contenu en douceur quand il entre dans l'écran.
// Sans JavaScript, ou si l'appareil demande moins de mouvement, le contenu
// est simplement visible : l'état « caché » n'est posé que par ce composant.
// `delay` (en millisecondes) décale l'apparition, pour un effet de cascade.
export function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const ref = useRef(null)

  useEffect(() => {
    const element = ref.current
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion || !('IntersectionObserver' in window)) return

    element.classList.add('reveal')
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        element.classList.add('reveal-in')
        observer.disconnect()
      },
      // L'élément apparaît un peu après être entré dans l'écran.
      { rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      className={className}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  )
}
