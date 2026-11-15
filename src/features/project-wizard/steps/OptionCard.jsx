import { Check } from 'lucide-react'

// L'apparence d'une grande carte de réponse : icône + texte, au moins 64 px de haut.
// La carte choisie change de bordure ET reçoit une coche : jamais la couleur seule.
export function optionCardClass(selected) {
  return [
    'flex min-h-16 w-full cursor-pointer items-center gap-4 rounded-card border-2 p-4 text-left',
    'transition-colors motion-reduce:transition-none',
    selected ? 'border-action bg-surface' : 'border-line bg-page',
  ].join(' ')
}

// Le contenu d'une carte. `shape` : "round" pour un choix unique, "square" pour une case à cocher.
export function OptionCardBody({ icon: Icon, label, hint, selected, shape = 'round' }) {
  return (
    <>
      <Icon aria-hidden="true" className="size-7 shrink-0 text-accent-text" />
      <span className="min-w-0 flex-1">
        <span className="block leading-snug font-semibold">{label}</span>
        {hint && <span className="block text-base text-ink-soft">{hint}</span>}
      </span>
      <span
        aria-hidden="true"
        className={[
          'flex size-7 shrink-0 items-center justify-center border-2',
          shape === 'round' ? 'rounded-full' : 'rounded-md',
          selected ? 'border-action bg-action text-on-action' : 'border-ink-soft bg-surface',
        ].join(' ')}
      >
        {selected && <Check className="size-5" strokeWidth={3} />}
      </span>
    </>
  )
}
