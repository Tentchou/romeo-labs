import { Check } from 'lucide-react'

// L'apparence d'une réponse : bordure fine, coins de 12 px, icône + texte,
// au moins 64 px de haut. Toutes les réponses ont la même forme, sur une ligne ou sur trois.
// Au repos le fond est transparent ; au survol, un fond très léger, en 150 ms.
// La réponse choisie change de bordure et de fond ET reçoit une coche : jamais la couleur seule.
export function optionCardClass(selected) {
  return [
    'rise flex min-h-16 w-full cursor-pointer items-center gap-4 rounded-xl border px-4 py-3 text-left',
    'transition-colors duration-150 ease-out motion-reduce:transition-none',
    selected ? 'border-action bg-action/10' : 'border-line bg-transparent hover:bg-ink/5',
  ].join(' ')
}

// Décale l'entrée de chaque réponse, pour qu'elles arrivent l'une après l'autre.
export function optionCardDelay(index) {
  return { animationDelay: `${index * 45}ms` }
}

// Le contenu d'une réponse : icône, texte, précision facultative, et la case de droite.
export function OptionCardBody({ icon: Icon, label, hint, selected }) {
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
          'flex size-7 shrink-0 items-center justify-center rounded-md border transition-colors duration-150',
          selected ? 'border-action bg-action text-on-action' : 'border-ink-soft bg-transparent',
        ].join(' ')}
      >
        {selected && <Check className="pop size-4" strokeWidth={3} />}
      </span>
    </>
  )
}
