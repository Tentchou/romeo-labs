import { useT } from '../i18n/LanguageProvider.jsx'
import { Logo } from './Logo.jsx'

export function Footer() {
  const { t } = useT()

  return (
    <footer className="border-t border-line py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 sm:px-6">
        <Logo />
        <p className="text-ink-soft">{t.brand.tagline}</p>
        <p className="font-mono text-base font-medium text-ink-soft">{t.footer.copyright}</p>
      </div>
    </footer>
  )
}
