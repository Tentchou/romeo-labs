import { useT } from '../i18n/LanguageProvider.jsx'

const variants = {
  primary: 'bg-action text-on-action',
  secondary: 'bg-surface text-ink border-2 border-line',
  whatsapp: 'bg-whatsapp text-on-whatsapp',
}

const sizes = {
  // Bouton d'action : 56 px de haut.
  large: 'min-h-14 px-6 text-lg',
  // Bouton de l'en-tête : zone cliquable de 48 px.
  compact: 'min-h-12 px-3 text-base',
}

// Un bouton a toujours une icône ET un mot.
// Avec `href`, il devient un lien ; sinon c'est un <button>.
// `external` ouvre le lien dans un nouvel onglet et l'annonce aux lecteurs d'écran.
// `fullWidth` garde toute la largeur sur tous les écrans (par défaut : sur téléphone seulement).
export function Button({
  icon: Icon,
  children,
  variant = 'primary',
  size = 'large',
  href,
  external = false,
  fullWidth = false,
  className = '',
  ...rest
}) {
  const { t } = useT()

  const width = size === 'compact' ? '' : fullWidth ? 'w-full' : 'w-full sm:w-auto'
  const classes = [
    'inline-flex items-center justify-center gap-2 rounded-control font-semibold whitespace-nowrap',
    'cursor-pointer transition-opacity hover:opacity-90 motion-reduce:transition-none',
    variants[variant],
    sizes[size],
    width,
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
