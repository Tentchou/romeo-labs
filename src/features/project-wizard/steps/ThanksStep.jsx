import { House } from 'lucide-react'
import { Button } from '../../../components/Button.jsx'

// L'écran « Merci » : la demande attend dans WhatsApp ou dans la messagerie.
export function ThanksStep({ text, homeLabel, onHome }) {
  return (
    <div>
      <p className="max-w-xl">{text}</p>
      <div className="mt-8">
        <Button icon={House} href="#top" onClick={onHome}>
          {homeLabel}
        </Button>
      </div>
    </div>
  )
}
