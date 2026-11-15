import { Mail, MessageCircle, Pencil } from 'lucide-react'
import { Button } from '../../../components/Button.jsx'
import { fill } from '../../../i18n/fill.js'

// Le récapitulatif : chaque réponse avec son lien « Modifier », puis les boutons d'envoi.
// `rows` vient de answerRows() ; `emailHref` est absent si l'adresse n'est pas renseignée.
export function SummaryStep({ rows, labels, editLabel, editLabelFull, whatsappHref, emailHref, onEdit, onSent }) {
  return (
    <div>
      <dl className="divide-y divide-line border-y border-line">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center gap-3 py-3">
            <div className="min-w-0 flex-1">
              <dt className="text-base text-ink-soft">{row.label}</dt>
              <dd className="leading-snug font-semibold wrap-break-word whitespace-pre-line">{row.value}</dd>
            </div>
            <button
              type="button"
              onClick={() => onEdit(row.step)}
              aria-label={fill(editLabelFull, { label: row.label })}
              className="inline-flex min-h-12 shrink-0 cursor-pointer items-center gap-2 rounded-control px-3 text-base font-semibold text-action"
            >
              <Pencil aria-hidden="true" className="size-5" />
              <span>{editLabel}</span>
            </button>
          </div>
        ))}
      </dl>

      <div className="mt-8 flex flex-col gap-3">
        <Button
          icon={MessageCircle}
          variant="whatsapp"
          href={whatsappHref}
          external
          fullWidth
          onClick={() => onSent('whatsapp')}
        >
          {labels.whatsapp}
        </Button>
        {emailHref && (
          <Button
            icon={Mail}
            variant="secondary"
            href={emailHref}
            fullWidth
            onClick={() => onSent('email')}
          >
            {labels.email}
          </Button>
        )}
      </div>
    </div>
  )
}
