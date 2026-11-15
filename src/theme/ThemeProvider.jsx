import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
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

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark'
      writeStored(STORAGE_KEY, next)
      return next
    })
  }, [])

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

// Donne le thème en cours : const { theme, toggleTheme } = useTheme()
export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme() doit être utilisé dans un <ThemeProvider>.')
  return context
}
