import { Header } from './components/Header.jsx'
import { useT } from './i18n/LanguageProvider.jsx'

export default function App() {
  const { t } = useT()

  return (
    <div id="top">
      <a
        href="#contenu"
        className="sr-only rounded-control bg-action px-4 py-3 font-semibold text-on-action focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-20"
      >
        {t.header.skipToContent}
      </a>
      <Header />
      {/* pt-16 : laisse la place de l'en-tête fixe */}
      <main id="contenu" className="mx-auto max-w-5xl px-4 pt-16 sm:px-6">
        <h1 className="py-16 text-4xl leading-tight font-bold sm:text-5xl">{t.brand.tagline}</h1>
      </main>
    </div>
  )
}
