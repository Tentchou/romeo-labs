import { Globe, Moon, Sun } from 'lucide-react'
import { useT } from '../i18n/LanguageProvider.jsx'
import { useTheme } from '../theme/ThemeProvider.jsx'
import { Button } from './Button.jsx'
import { Logo } from './Logo.jsx'

// En-tête fixe : logo, langue et thème, toujours visibles. Pas de menu caché.
export function Header() {
  const { t, toggleLang } = useT()
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <header className="fixed inset-x-0 top-0 z-10 border-b border-line bg-page">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-2 sm:px-6">
        <a
          href="#top"
          aria-label={t.header.homeLabel}
          className="flex min-h-12 items-center rounded-control"
        >
          <Logo />
        </a>
        <div className="flex items-center gap-2">
          <Button
            icon={Globe}
            variant="secondary"
            size="compact"
            className="max-sm:px-2"
            onClick={toggleLang}
            aria-label={t.header.langButtonLabel}
          >
            {t.header.langButton}
          </Button>
          <Button
            icon={isDark ? Sun : Moon}
            variant="secondary"
            size="compact"
            className="max-sm:px-2"
            onClick={toggleTheme}
            aria-label={isDark ? t.header.themeToLightLabel : t.header.themeToDarkLabel}
          >
            {isDark ? t.header.themeToLight : t.header.themeToDark}
          </Button>
        </div>
      </div>
    </header>
  )
}
