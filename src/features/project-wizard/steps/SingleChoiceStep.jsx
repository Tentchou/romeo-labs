import { OptionCardBody, optionCardClass, optionCardDelay } from './OptionCard.jsx'

// Une question à choix unique : le client appuie sur une carte, et le
// questionnaire passe tout seul à la suite (voir useWizard.js).
// Sert aux étapes « projet », « pour qui », « avancement » et « délai ».
export function SingleChoiceStep({ titleId, options, labels, icons, value, onChoose }) {
  return (
    <div role="group" aria-labelledby={titleId} className="grid gap-3 sm:grid-cols-2">
      {options.map((id, index) => {
        const selected = value === id
        return (
          <button
            key={id}
            type="button"
            aria-pressed={selected}
            onClick={() => onChoose(id)}
            className={optionCardClass(selected)}
            style={optionCardDelay(index)}
          >
            <OptionCardBody icon={icons[id]} label={labels[id]} selected={selected} />
          </button>
        )
      })}
    </div>
  )
}
