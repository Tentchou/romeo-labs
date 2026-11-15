import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { readStored, writeStored } from '../storage.js'
import { en } from './en.js'
import { fr } from './fr.js'

const STORAGE_KEY = 'rl-lang'
const dictionaries = { fr, en }

const LanguageContext = createContext(null)

// Français par défaut ; anglais si le navigateur est en anglais ;
// le choix du visiteur, s'il existe, passe avant tout.
function getInitialLang() {
  const stored = readStored(STORAGE_KEY)
  if (stored === 'fr' || stored === 'en') return stored
  return navigator.language?.toLowerCase().startsWith('en') ? 'en' : 'fr'
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(getInitialLang)
  const t = dictionaries[lang]

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = t.meta.title
  }, [lang, t])

  const toggleLang = useCallback(() => {
    setLang((current) => {
      const next = current === 'fr' ? 'en' : 'fr'
      writeStored(STORAGE_KEY, next)
      return next
    })
  }, [])

  const value = useMemo(() => ({ lang, t, toggleLang }), [lang, t, toggleLang])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

// Donne les textes de la langue en cours : const { t } = useT()
export function useT() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useT() doit être utilisé dans un <LanguageProvider>.')
  return context
}
