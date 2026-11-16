// Les deux drapeaux de l'interrupteur de langue, dessinés en rond.
// Décoratifs : le bouton qui les contient porte le libellé pour les lecteurs d'écran.

export function FlagFr() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-6">
      <clipPath id="drapeau-fr">
        <circle cx="12" cy="12" r="11" />
      </clipPath>
      <g clipPath="url(#drapeau-fr)">
        <rect width="8" height="24" fill="#1F3F9E" />
        <rect x="8" width="8" height="24" fill="#FFFFFF" />
        <rect x="16" width="8" height="24" fill="#D8343F" />
      </g>
      <circle cx="12" cy="12" r="11" fill="none" className="stroke-line" />
    </svg>
  )
}

export function FlagEn() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-6">
      <clipPath id="drapeau-en">
        <circle cx="12" cy="12" r="11" />
      </clipPath>
      <g clipPath="url(#drapeau-en)">
        <rect width="24" height="24" fill="#1F3F9E" />
        <path d="M0 0 24 24M24 0 0 24" stroke="#FFFFFF" strokeWidth="5" />
        <path d="M0 0 24 24M24 0 0 24" stroke="#D8343F" strokeWidth="1.8" />
        <path d="M12 0V24M0 12H24" stroke="#FFFFFF" strokeWidth="7" />
        <path d="M12 0V24M0 12H24" stroke="#D8343F" strokeWidth="4" />
      </g>
      <circle cx="12" cy="12" r="11" fill="none" className="stroke-line" />
    </svg>
  )
}
