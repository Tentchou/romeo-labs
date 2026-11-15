import { config } from '../config.js'

const base = import.meta.env.BASE_URL

// Le symbole suivi du nom. Les deux versions du symbole sont dans la page ;
// le CSS affiche celle qui correspond au thème, sans attendre JavaScript.
export function Logo() {
  return (
    <span className="flex items-center gap-2">
      <img src={`${base}logo-clair.svg`} alt="" width="36" height="36" className="size-9 dark:hidden" />
      <img
        src={`${base}logo-sombre.svg`}
        alt=""
        width="36"
        height="36"
        className="hidden size-9 dark:block"
      />
      <span className="text-lg font-bold whitespace-nowrap text-ink">{config.brand}</span>
    </span>
  )
}
