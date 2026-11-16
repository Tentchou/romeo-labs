import { ArrowLeft, ArrowRight, CircleCheck, RotateCcw } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '../../components/Button.jsx'
import { config } from '../../config.js'
import { fill } from '../../i18n/fill.js'
import { useT } from '../../i18n/LanguageProvider.jsx'
import { isFilled } from '../../links.js'
import { formatBudget } from './budget.js'
import {
  answerRows,
  buildEmailSubject,
  buildMessage,
  mailtoMessageLink,
  whatsappMessageLink,
} from './message.js'
import { BudgetStep } from './steps/BudgetStep.jsx'
import { ContactStep, NAME_FIELD_ID } from './steps/ContactStep.jsx'
import { NeedsStep } from './steps/NeedsStep.jsx'
import { optionIcons } from './steps/optionIcons.js'
import { SingleChoiceStep } from './steps/SingleChoiceStep.jsx'
import { SummaryStep } from './steps/SummaryStep.jsx'
import { ThanksStep } from './steps/ThanksStep.jsx'
import { budgetSteps, useWizard } from './useWizard.js'
import { AUDIENCES, DEADLINES, PROJECT_TYPES, STAGES } from './wizardOptions.js'
import {
  QUESTION_STEPS,
  SUMMARY,
  THANKS,
  canGoBack,
  isStepComplete,
  stepNumber,
} from './wizardState.js'

const TITLE_ID = 'questionnaire-titre'

// Les questions à choix unique : la liste des réponses de chacune.
const SINGLE_CHOICES = {
  projectType: PROJECT_TYPES,
  audience: AUDIENCES,
  stage: STAGES,
  deadline: DEADLINES,
}

// Laisse WhatsApp ou la messagerie s'ouvrir avant d'afficher « Merci ».
const THANKS_DELAY_MS = 300

// Le questionnaire : une seule question par écran.
// Ce composant n'affiche que ; les règles sont dans wizardState.js et useWizard.js.
export function ProjectWizard() {
  const { t } = useT()
  const w = t.wizard
  const wizard = useWizard()
  const { step, answers } = wizard

  const titleRef = useRef(null)
  const previousStep = useRef(step)
  const skipNextFocus = useRef(false)
  // L'écran sur lequel le client a voulu continuer sans avoir répondu.
  const [errorStep, setErrorStep] = useState(null)
  // L'erreur disparaît dès que la réponse est donnée.
  const showError = errorStep === step && !isStepComplete(step, answers)

  // À chaque nouvel écran, le titre de la question reçoit le focus.
  useEffect(() => {
    if (previousStep.current === step) return
    previousStep.current = step
    if (skipNextFocus.current) {
      skipNextFocus.current = false
      return
    }
    titleRef.current?.focus()
  }, [step])

  const isQuestion = QUESTION_STEPS.includes(step)
  const isSingleChoice = step in SINGLE_CHOICES
  const started = step !== QUESTION_STEPS[0] || answers.projectType !== null

  const wording = { t: w, brand: config.brand, currency: config.budget.currency, budgetSteps }
  const amountText = formatBudget(answers.budgetPosition, {
    steps: budgetSteps,
    currency: config.budget.currency,
    labels: w.budget,
  })

  const title =
    step === SUMMARY ? w.summary.title : step === THANKS ? w.thanks.title : w.questions[step]
  const hint =
    step === SUMMARY ? w.summary.intro : isSingleChoice ? w.hints.single : w.hints[step]

  function handleSubmit(event) {
    event.preventDefault()
    if (!isQuestion || isSingleChoice) return
    if (isStepComplete(step, answers)) {
      setErrorStep(null)
      wizard.next()
      return
    }
    setErrorStep(step)
    if (step === 'contact') document.getElementById(NAME_FIELD_ID)?.focus()
  }

  function handleSent(channel) {
    setTimeout(() => wizard.sent(channel), THANKS_DELAY_MS)
  }

  // « Revenir à l'accueil » : on efface tout, et la page remonte en haut
  // (sans ramener le focus sur le questionnaire).
  function handleHome() {
    skipNextFocus.current = true
    wizard.restart()
  }

  function renderStep() {
    if (isSingleChoice) {
      return (
        <SingleChoiceStep
          titleId={TITLE_ID}
          options={SINGLE_CHOICES[step]}
          labels={w.options[step]}
          icons={optionIcons[step]}
          value={answers[step]}
          onChoose={(value) => wizard.choose(step, value)}
        />
      )
    }

    switch (step) {
      case 'needs':
        return (
          <NeedsStep
            titleId={TITLE_ID}
            projectType={answers.projectType}
            selected={answers.needs}
            onChange={(needs) => wizard.answer('needs', needs)}
            labels={w.options.needs}
            hints={w.options.needHints}
            error={showError ? w.errors.needs : null}
          />
        )
      case 'budget':
        return (
          <BudgetStep
            position={answers.budgetPosition}
            unknown={answers.budgetUnknown}
            steps={budgetSteps}
            amountText={amountText}
            labels={w.budget}
            onPosition={(position) => wizard.answer('budgetPosition', position)}
            onUnknown={(unknown) => wizard.answer('budgetUnknown', unknown)}
          />
        )
      case 'contact':
        return (
          <ContactStep
            answers={answers}
            onChange={wizard.answer}
            labels={w.fields}
            error={showError ? w.errors.name : null}
          />
        )
      case SUMMARY: {
        const message = buildMessage(answers, wording)
        return (
          <SummaryStep
            rows={answerRows(answers, wording)}
            labels={w.summary}
            editLabel={w.edit}
            editLabelFull={w.editLabel}
            whatsappHref={whatsappMessageLink(config.whatsappNumber, message)}
            emailHref={
              isFilled(config.email)
                ? mailtoMessageLink(config.email, buildEmailSubject(answers, wording), message)
                : null
            }
            onEdit={wizard.edit}
            onSent={handleSent}
          />
        )
      }
      default:
        return (
          <ThanksStep
            text={wizard.sentBy === 'email' ? w.thanks.email : w.thanks.whatsapp}
            homeLabel={w.thanks.home}
            onHome={handleHome}
          />
        )
    }
  }

  return (
    <div className="rounded-card border border-line bg-surface p-4 sm:p-8">
      {step !== THANKS && (
        <div className="flex min-h-12 items-center justify-between gap-4">
          <p aria-live="polite" className="font-mono text-base font-medium whitespace-nowrap text-ink-soft">
            {isQuestion &&
              fill(w.progress, { n: stepNumber(step), total: QUESTION_STEPS.length })}
          </p>
          {started && (
            <button
              type="button"
              onClick={wizard.restart}
              className="-mr-2 inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-control px-2 text-base font-semibold whitespace-nowrap text-action"
            >
              <RotateCcw aria-hidden="true" className="size-5" />
              <span>{w.restart}</span>
            </button>
          )}
        </div>
      )}

      {isQuestion && (
        <div aria-hidden="true" className="mt-2 h-1 overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-500 ease-out motion-reduce:transition-none"
            style={{ width: `${(stepNumber(step) / QUESTION_STEPS.length) * 100}%` }}
          />
        </div>
      )}

      {/* `key` rejoue la transition douce à chaque nouvel écran. */}
      <form key={step} noValidate onSubmit={handleSubmit} className="step-in mt-6">
        <h3
          id={TITLE_ID}
          ref={titleRef}
          tabIndex={-1}
          className="flex items-center gap-3 font-display text-2xl leading-tight font-bold tracking-tight text-balance sm:text-3xl"
        >
          {step === THANKS && (
            <CircleCheck aria-hidden="true" className="size-8 shrink-0 text-whatsapp" />
          )}
          {title}
        </h3>
        {hint && <p className="mt-2 text-ink-soft">{hint}</p>}

        <div className="mt-6">{renderStep()}</div>

        {step !== THANKS && (
          <div className="mt-8 flex flex-col gap-3 sm:flex-row-reverse sm:justify-between">
            {isQuestion && !isSingleChoice && (
              <Button type="submit" icon={ArrowRight}>
                {w.next}
              </Button>
            )}
            {canGoBack(wizard) && (
              <Button icon={ArrowLeft} variant="secondary" onClick={wizard.back}>
                {w.back}
              </Button>
            )}
          </div>
        )}
      </form>
    </div>
  )
}
