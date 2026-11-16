import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { flushSync } from 'react-dom'
import { readStored, writeStored } from '../storage.js'

const STORAGE_KEY = 'rl-theme'

const ThemeContext = createContext(null)

// Au premier passage, on suit la préférence du système.
// Même règle que le script anti-flash de index.html.
function getInitialTheme() {
  const stored = readStored(STORAGE_KEY)
  if (stored === 'dark' || stored === 'light') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  // Change de thème. `origin` ({ x, y } dans la fenêtre) est le point d'où la
  // nouvelle couleur s'étend en cercle ; l'animation est dans index.css (theme-reveal).
  const toggleTheme = useCallback(
    (origin) => {
      const next = theme === 'dark' ? 'light' : 'dark'
      writeStored(STORAGE_KEY, next)

      const root = document.documentElement
      const apply = () => {
        root.classList.toggle('dark', next === 'dark')
        flushSync(() => setTheme(next))
      }

      // Navigateur sans cette animation, ou appareil qui demande moins de mouvement :
      // le thème change d'un coup.
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reducedMotion || !document.startViewTransition) {
        apply()
        return
      }

      const x = origin?.x ?? window.innerWidth / 2
      const y = origin?.y ?? 0
      // Le rayon qui couvre tout l'écran depuis ce point.
      const radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      )
      root.style.setProperty('--theme-x', `${x}px`)
      root.style.setProperty('--theme-y', `${y}px`)
      root.style.setProperty('--theme-r', `${radius}px`)
      document.startViewTransition(apply)
    },
    [theme],
  )

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

// Donne le thème en cours : const { theme, toggleTheme } = useTheme()
export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme() doit être utilisé dans un <ThemeProvider>.')
  return context
}
