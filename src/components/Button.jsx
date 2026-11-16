import { useT } from '../i18n/LanguageProvider.jsx'

// Au survol : un changement de fond léger, en 150 ms, et rien d'autre.
const variants = {
  primary: 'bg-action text-on-action hover:opacity-90',
  // Fond transparent au repos, fond très léger au survol.
  secondary: 'bg-transparent text-ink border border-line hover:bg-ink/5',
  whatsapp: 'bg-whatsapp text-on-whatsapp hover:opacity-90',
}

// Un bouton d'action : 56 px de haut, coins de 12 px, avec une icône ET un mot.
// Avec `href`, il devient un lien ; sinon c'est un <button>.
// `external` ouvre le lien dans un nouvel onglet et l'annonce aux lecteurs d'écran.
// `fullWidth` garde toute la largeur sur tous les écrans (par défaut : sur téléphone seulement).
export function Button({
  icon: Icon,
  children,
  variant = 'primary',
  href,
  external = false,
  fullWidth = false,
  className = '',
  ...rest
}) {
  const { t } = useT()

  const classes = [
    'inline-flex min-h-14 items-center justify-center gap-2 rounded-xl px-6 text-lg font-semibold whitespace-nowrap',
    'cursor-pointer transition-[background-color,opacity] duration-150 ease-out motion-reduce:transition-none',
    variants[variant],
    fullWidth ? 'w-full' : 'w-full sm:w-auto',
    className,
  ].join(' ')

  const content = (
    <>
      <Icon aria-hidden="true" className="size-5 shrink-0" />
      <span>{children}</span>
    </>
  )

  if (href) {
    const externalProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {}
    return (
      <a href={href} className={classes} {...externalProps} {...rest}>
        {content}
        {external && <span className="sr-only">{t.common.newTab}</span>}
      </a>
    )
  }

  return (
    <button type="button" className={classes} {...rest}>
      {content}
    </button>
  )
}
