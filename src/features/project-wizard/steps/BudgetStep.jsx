import { Minus, Plus } from 'lucide-react'
import { Button } from '../../../components/Button.jsx'
import { clampPosition, lastPosition } from '../budget.js'
import { OptionCardBody, optionCardClass } from './OptionCard.jsx'
import { optionIcons } from './optionIcons.js'

// Étape 6 : le budget. Un curseur natif, le montant écrit en gros,
// deux boutons « Moins » et « Plus », et une case « Je ne sais pas encore ».
// `amountText` est le montant déjà mis en forme (« 500 000 FCFA »).
export function BudgetStep({ position, unknown, steps, amountText, labels, onPosition, onUnknown }) {
  const max = lastPosition(steps)
  const move = (delta) => onPosition(clampPosition(position + delta, steps))

  return (
    <div>
      <p
        className={`text-center font-mono text-3xl leading-tight font-medium text-balance sm:text-5xl ${
          unknown ? 'opacity-40' : ''
        }`}
      >
        {amountText}
      </p>

      <input
        type="range"
        className="budget-range mt-4"
        min={0}
        max={max}
        step={1}
        value={position}
        disabled={unknown}
        aria-label={labels.slider}
        aria-valuetext={amountText}
        onChange={(event) => onPosition(clampPosition(Number(event.target.value), steps))}
      />

      <div className="mt-2 grid grid-cols-2 gap-3">
        <Button
          icon={Minus}
          variant="secondary"
          fullWidth
          disabled={unknown || position <= 0}
          onClick={() => move(-1)}
          className="disabled:cursor-not-allowed disabled:opacity-40"
        >
          {labels.less}
        </Button>
        <Button
          icon={Plus}
          variant="secondary"
          fullWidth
          disabled={unknown || position >= max}
          onClick={() => move(1)}
          className="disabled:cursor-not-allowed disabled:opacity-40"
        >
          {labels.more}
        </Button>
      </div>

      <label
        className={`${optionCardClass(unknown)} mt-6 has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-action`}
      >
        <input
          type="checkbox"
          className="sr-only"
          checked={unknown}
          onChange={(event) => onUnknown(event.target.checked)}
        />
        <OptionCardBody
          icon={optionIcons.needs.unsure}
          label={labels.unknown}
          selected={unknown}
        />
      </label>
    </div>
  )
}
