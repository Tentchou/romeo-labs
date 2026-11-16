import { config } from '../config.js'

const base = import.meta.env.BASE_URL

// Le symbole de Romeo Labs, tel que fourni : les deux fichiers d'origine
// (public/logo-clair.svg et public/logo-sombre.svg) sont affichés sans aucune
// retouche — ni filtre, ni recoloration. Le CSS montre celui qui correspond au thème,
// sans attendre JavaScript. `className` ne règle que la taille.
export function LogoMark({ className = '' }) {
  return (
    <>
      <img src={`${base}logo-clair.svg`} alt="" className={`${className} dark:hidden`} />
      <img src={`${base}logo-sombre.svg`} alt="" className={`${className} hidden dark:block`} />
    </>
  )
}

// Le symbole (48 px) suivi du nom.
export function Logo() {
  return (
    <span className="flex items-center gap-3">
      <LogoMark className="size-12" />
      <span className="font-display text-xl font-bold tracking-tight whitespace-nowrap text-ink">
        {config.brand}
      </span>
    </span>
  )
}
