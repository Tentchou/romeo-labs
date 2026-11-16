import { useT } from '../i18n/LanguageProvider.jsx'

// Boutons pleins : la couleur est là dès le départ.
const filled = {
  primary: 'bg-action text-on-action hover:opacity-90',
  secondary: 'bg-transparent text-ink border border-line hover:bg-ink/5',
  whatsapp: 'bg-whatsapp text-on-whatsapp hover:opacity-90',
}

// Boutons « au trait » (`outline`) : fond transparent au repos, bordure fine de la
// couleur du bouton ; c'est le survol (ou l'appui, sur téléphone) qui les remplit.
const outlined = {
  primary:
    'bg-transparent border border-action text-action hover:bg-action hover:text-on-action active:bg-action active:text-on-action',
  secondary: filled.secondary,
  whatsapp:
    'bg-transparent border border-whatsapp text-whatsapp hover:bg-whatsapp hover:text-on-whatsapp active:bg-whatsapp active:text-on-whatsapp',
}

// Un bouton d'action : 56 px de haut, en forme de pilule, avec une icône ET un mot.
// Avec `href`, il devient un lien ; sinon c'est un <button>.
// `outline` : transparent au repos, coloré au survol (voir plus haut).
// `external` ouvre le lien dans un nouvel onglet et l'annonce aux lecteurs d'écran.
// `fullWidth` garde toute la largeur sur tous les écrans (par défaut : sur téléphone seulement).
export function Button({
  icon: Icon,
  children,
  variant = 'primary',
  outline = false,
  href,
  external = false,
  fullWidth = false,
  className = '',
  ...rest
}) {
  const { t } = useT()

  const classes = [
    'inline-flex min-h-14 items-center justify-center gap-2 rounded-full px-7 text-lg font-semibold whitespace-nowrap',
    'cursor-pointer transition-[background-color,color,opacity] duration-150 ease-out motion-reduce:transition-none',
    (outline ? outlined : filled)[variant],
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
