const variants = {
  primary: 'bg-action text-on-action',
  secondary: 'bg-surface text-ink border-2 border-line',
  whatsapp: 'bg-whatsapp text-on-whatsapp',
}

const sizes = {
  // Bouton d'action : 56 px de haut, toute la largeur sur téléphone.
  large: 'min-h-14 w-full px-6 text-lg sm:w-auto',
  // Bouton de l'en-tête : zone cliquable de 48 px.
  compact: 'min-h-12 px-3 text-base',
}

// Un bouton a toujours une icône ET un mot.
// Avec `href`, il devient un lien ; sinon c'est un <button>.
export function Button({
  icon: Icon,
  children,
  variant = 'primary',
  size = 'large',
  href,
  className = '',
  ...rest
}) {
  const classes = [
    'inline-flex items-center justify-center gap-2 rounded-control font-semibold whitespace-nowrap',
    'cursor-pointer transition-opacity hover:opacity-90 motion-reduce:transition-none',
    variants[variant],
    sizes[size],
    className,
  ].join(' ')

  const content = (
    <>
      <Icon aria-hidden="true" className="size-5 shrink-0" />
      <span>{children}</span>
    </>
  )

  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {content}
      </a>
    )
  }

  return (
    <button type="button" className={classes} {...rest}>
      {content}
    </button>
  )
}
