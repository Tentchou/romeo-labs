// Un interrupteur à deux positions, fait de deux icônes et d'une pastille qui coulisse.
// Sert au thème clair / sombre. Zone cliquable de 48 px de haut.
// `label` dit aux lecteurs d'écran ce que fait le clic.
// `onRight` : vrai quand la pastille est à droite (sur la seconde icône).
export function IconSwitch({ left, right, onRight, label, onClick, className = '' }) {
  const slot = (icon, active) => (
    <span
      className={[
        'relative flex size-10 items-center justify-center',
        'transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none',
        active ? 'scale-100 opacity-100' : 'scale-90 opacity-45',
      ].join(' ')}
    >
      {icon}
    </span>
  )

  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`relative inline-flex h-12 w-[5.625rem] cursor-pointer items-center rounded-full border border-line p-1 transition-colors duration-150 hover:bg-ink/5 ${className}`}
    >
      {/* La pastille : elle glisse sous l'icône active. */}
      <span
        aria-hidden="true"
        className={[
          'absolute top-[3px] left-[3px] size-10 rounded-full border border-line bg-surface',
          'transition-transform duration-300 ease-[cubic-bezier(0.3,0.7,0.2,1)] motion-reduce:transition-none',
          onRight ? 'translate-x-10' : 'translate-x-0',
        ].join(' ')}
      />
      {slot(left, !onRight)}
      {slot(right, onRight)}
    </button>
  )
}
