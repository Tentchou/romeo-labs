import { needsFor, toggleNeed } from '../wizardOptions.js'
import { ErrorMessage } from './ErrorMessage.jsx'
import { OptionCardBody, optionCardClass, optionCardDelay } from './OptionCard.jsx'
import { optionIcons } from './optionIcons.js'

const ERROR_ID = 'questionnaire-besoins-erreur'

// Étape 3 : plusieurs réponses possibles. Les besoins proposés dépendent du type de projet.
export function NeedsStep({ titleId, projectType, selected, onChange, labels, hints, error }) {
  return (
    <div
      role="group"
      aria-labelledby={titleId}
      aria-describedby={error ? ERROR_ID : undefined}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {needsFor(projectType).map((need, index) => {
          const checked = selected.includes(need)
          return (
            <label
              key={need}
              style={optionCardDelay(index)}
              className={`${optionCardClass(checked)} has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-action`}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={checked}
                onChange={() => onChange(toggleNeed(selected, need))}
              />
              <OptionCardBody
                icon={optionIcons.needs[need]}
                label={labels[need]}
                hint={hints[need]}
                selected={checked}
                shape="square"
              />
            </label>
          )
        })}
      </div>
      {error && <ErrorMessage id={ERROR_ID}>{error}</ErrorMessage>}
    </div>
  )
}
