import { ErrorMessage } from './ErrorMessage.jsx'

export const NAME_FIELD_ID = 'questionnaire-nom'
const NAME_ERROR_ID = 'questionnaire-nom-erreur'

const fieldClass =
  'mt-2 block w-full rounded-full border border-line bg-page px-6 text-lg text-ink transition-colors duration-150 hover:border-ink-soft focus:border-action'

function Label({ htmlFor, children, optional }) {
  return (
    <label htmlFor={htmlFor} className="block font-semibold">
      {children}
      {optional && <span className="font-normal text-ink-soft"> {optional}</span>}
    </label>
  )
}

// Étape 7 : le nom (obligatoire), la ville et un message (facultatifs).
// Pas de numéro de téléphone : WhatsApp le transmet déjà.
export function ContactStep({ answers, onChange, labels, error }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Label htmlFor={NAME_FIELD_ID}>{labels.name}</Label>
        <input
          id={NAME_FIELD_ID}
          type="text"
          autoComplete="name"
          maxLength={80}
          required
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? NAME_ERROR_ID : undefined}
          value={answers.name}
          onChange={(event) => onChange('name', event.target.value)}
          className={`${fieldClass} min-h-14 ${error ? 'border-danger' : ''}`}
        />
        {error && <ErrorMessage id={NAME_ERROR_ID}>{error}</ErrorMessage>}
      </div>

      <div>
        <Label htmlFor="questionnaire-ville" optional={labels.optional}>
          {labels.city}
        </Label>
        <input
          id="questionnaire-ville"
          type="text"
          autoComplete="address-level2"
          maxLength={80}
          value={answers.city}
          onChange={(event) => onChange('city', event.target.value)}
          className={`${fieldClass} min-h-14`}
        />
      </div>

      <div>
        <Label htmlFor="questionnaire-message" optional={labels.optional}>
          {labels.message}
        </Label>
        <textarea
          id="questionnaire-message"
          rows={4}
          maxLength={1000}
          value={answers.message}
          onChange={(event) => onChange('message', event.target.value)}
          className={`${fieldClass} rounded-3xl! py-3`}
        />
      </div>
    </div>
  )
}
