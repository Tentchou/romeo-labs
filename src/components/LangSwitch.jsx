import { useT } from '../i18n/LanguageProvider.jsx'

// Les codes affichés, dans l'ordre : EN | FR.
const LANGS = ['en', 'fr']

// Le sélecteur de langue : « EN | FR » côte à côte.
// La langue active est en gras, de la couleur principale ; l'autre est estompée.
// Un clic change la langue tout de suite, sans animation.
export function LangSwitch() {
  const { t, lang, toggleLang } = useT()

  return (
    <button
      type="button"
      onClick={toggleLang}
      aria-label={t.header.langButtonLabel}
      className="inline-flex min-h-12 cursor-pointer items-center gap-3 rounded-full px-4 text-lg transition-colors duration-150 hover:bg-ink/5"
    >
      {LANGS.map((code, index) => (
        <span key={code} className="contents">
          {index > 0 && <span aria-hidden="true" className="h-5 w-px bg-ink/30" />}
          <span className={code === lang ? 'font-bold text-action' : 'text-ink opacity-50'}>
            {code.toUpperCase()}
          </span>
        </span>
      ))}
    </button>
  )
}
