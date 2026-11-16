import { Moon, Sun } from 'lucide-react'
import { useT } from '../i18n/LanguageProvider.jsx'
import { useTheme } from '../theme/ThemeProvider.jsx'
import { IconSwitch } from './IconSwitch.jsx'
import { LangSwitch } from './LangSwitch.jsx'
import { Logo } from './Logo.jsx'

// En-tête fixe : logo, langue et thème, toujours visibles. Pas de menu caché.
// Sur téléphone, l'interrupteur du thème flotte en bas à droite de l'écran.
export function Header() {
  const { t } = useT()
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  // Le changement de thème part du centre de l'interrupteur (voir ThemeProvider).
  function handleTheme(event) {
    const box = event.currentTarget.getBoundingClientRect()
    toggleTheme({ x: box.left + box.width / 2, y: box.top + box.height / 2 })
  }

  return (
    <header className="fixed inset-x-0 top-0 z-10 border-b border-line bg-page">
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between gap-2 px-4 sm:px-6">
        <a href="#top" aria-label={t.header.homeLabel} className="flex items-center rounded-lg">
          <Logo />
        </a>
        <div className="flex items-center gap-2">
          <LangSwitch />
          <IconSwitch
            left={<Sun aria-hidden="true" className="size-5" />}
            right={<Moon aria-hidden="true" className="size-5" />}
            onRight={isDark}
            label={isDark ? t.header.themeToLightLabel : t.header.themeToDarkLabel}
            onClick={handleTheme}
            className="max-sm:fixed max-sm:right-4 max-sm:bottom-4 max-sm:z-20 max-sm:bg-page max-sm:shadow-lg"
          />
        </div>
      </div>
    </header>
  )
}
