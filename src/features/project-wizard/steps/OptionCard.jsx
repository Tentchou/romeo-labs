import { Check } from 'lucide-react'

// L'apparence d'une réponse : une pilule à bordure fine, icône + texte, au moins 64 px de haut.
// La carte choisie change de bordure ET reçoit une coche : jamais la couleur seule.
export function optionCardClass(selected) {
  return [
    'rise flex min-h-16 w-full cursor-pointer items-center gap-4 rounded-pill border py-3 pr-4 pl-6 text-left',
    // Survol et appui : précis et rapides, sans rebond.
    'transition-[border-color,background-color,transform] duration-150 ease-out',
    'hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]',
    'motion-reduce:transform-none motion-reduce:transition-none',
    selected ? 'border-action bg-action/10' : 'border-line bg-page hover:border-ink-soft',
  ].join(' ')
}

// Décale l'entrée de chaque réponse, pour qu'elles arrivent l'une après l'autre.
export function optionCardDelay(index) {
  return { animationDelay: `${index * 45}ms` }
}

// Le contenu d'une carte. `shape` : "round" pour un choix unique, "square" pour une case à cocher.
export function OptionCardBody({ icon: Icon, label, hint, selected, shape = 'round' }) {
  return (
    <>
      <Icon aria-hidden="true" strokeWidth={1.5} className="size-7 shrink-0 text-accent-text" />
      <span className="min-w-0 flex-1">
        <span className="block leading-snug font-semibold">{label}</span>
        {hint && <span className="block text-base text-ink-soft">{hint}</span>}
      </span>
      <span
        aria-hidden="true"
        className={[
          'flex size-7 shrink-0 items-center justify-center border transition-colors duration-150',
          shape === 'round' ? 'rounded-full' : 'rounded-md',
          selected ? 'border-action bg-action text-on-action' : 'border-ink-soft bg-surface',
        ].join(' ')}
      >
        {selected && <Check className="pop size-4" strokeWidth={3} />}
      </span>
    </>
  )
}
