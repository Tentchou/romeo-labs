import { useT } from '../i18n/LanguageProvider.jsx'

const variants = {
  primary: 'bg-action text-on-action',
  secondary: 'bg-surface text-ink border border-line hover:border-ink-soft',
  whatsapp: 'bg-whatsapp text-on-whatsapp',
}

// Un bouton d'action : 56 px de haut, en forme de pilule, avec une icône ET un mot.
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
    'group inline-flex min-h-14 items-center justify-center gap-2 rounded-full px-7 text-lg font-semibold whitespace-nowrap',
    // Survol et appui : précis et rapides, sans rebond.
    'cursor-pointer transition-[transform,border-color,opacity] duration-150 ease-out',
    'hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]',
    'motion-reduce:transform-none motion-reduce:transition-none',
    variants[variant],
    fullWidth ? 'w-full' : 'w-full sm:w-auto',
    className,
  ].join(' ')

  const content = (
    <>
      <Icon
        aria-hidden="true"
        className="size-5 shrink-0 transition-transform duration-150 group-hover:scale-110 motion-reduce:transform-none"
      />
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
