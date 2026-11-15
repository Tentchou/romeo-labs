import { CircleAlert } from 'lucide-react'

// Un message d'erreur, annoncé tout de suite aux lecteurs d'écran.
export function ErrorMessage({ id, children }) {
  return (
    <p id={id} role="alert" className="mt-3 flex items-start gap-2 font-semibold text-danger">
      <CircleAlert aria-hidden="true" className="mt-1 size-5 shrink-0" />
      <span>{children}</span>
    </p>
  )
}
