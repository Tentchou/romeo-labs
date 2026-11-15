import { describe, expect, it } from 'vitest'
import { config } from '../../config.js'
import { buildBudgetSteps, positionOfAmount } from './budget.js'
import {
  QUESTION_STEPS,
  SUMMARY,
  THANKS,
  canGoBack,
  editStep,
  firstIncompleteStep,
  goBack,
  goNext,
  initialState,
  isStepComplete,
  markSent,
  restoreState,
  setAnswer,
  stepNumber,
} from './wizardState.js'

const budgetSteps = buildBudgetSteps(config.budget.ranges)
const defaultBudgetPosition = positionOfAmount(config.budget.defaultAmount, budgetSteps)
const context = { defaultBudgetPosition, budgetSteps }

const start = initialState(defaultBudgetPosition)

const fullAnswers = {
  projectType: 'website',
  audience: 'self',
  needs: ['shop', 'accounts'],
  stage: 'idea',
  deadline: 'asap',
  budgetPosition: 3,
  budgetUnknown: false,
  name: 'Jean',
  city: '',
  message: '',
}

describe('initialState', () => {
  it('commence à la première question, sans réponse', () => {
    expect(start.step).toBe('projectType')
    expect(start.answers.projectType).toBeNull()
    expect(start.answers.needs).toEqual([])
  })

  it('place le curseur du budget sur le montant de départ', () => {
    expect(budgetSteps[start.answers.budgetPosition]).toBe(500_000)
  })
})

describe('stepNumber', () => {
  it('compte 7 questions, de 1 à 7', () => {
    expect(QUESTION_STEPS).toHaveLength(7)
    expect(stepNumber('projectType')).toBe(1)
    expect(stepNumber('contact')).toBe(7)
  })
})

describe('isStepComplete', () => {
  it('demande une réponse aux questions à choix unique', () => {
    expect(isStepComplete('projectType', start.answers)).toBe(false)
    expect(isStepComplete('projectType', fullAnswers)).toBe(true)
  })

  it('demande au moins un besoin', () => {
    expect(isStepComplete('needs', start.answers)).toBe(false)
    expect(isStepComplete('needs', fullAnswers)).toBe(true)
  })

  it('accepte toujours le budget', () => {
    expect(isStepComplete('budget', start.answers)).toBe(true)
  })

  it('demande un nom, mais pas la ville ni le message', () => {
    expect(isStepComplete('contact', { ...fullAnswers, name: '   ' })).toBe(false)
    expect(isStepComplete('contact', fullAnswers)).toBe(true)
  })
})

describe('setAnswer', () => {
  it('enregistre une réponse sans modifier l’état reçu', () => {
    const next = setAnswer(start, 'audience', 'self')
    expect(next.answers.audience).toBe('self')
    expect(start.answers.audience).toBeNull()
  })

  it('retire les besoins qui ne sont plus proposés quand le type de projet change', () => {
    const state = { ...start, answers: fullAnswers }
    expect(setAnswer(state, 'projectType', 'mobile').answers.needs).toEqual(['accounts'])
  })
})

describe('goNext', () => {
  it('reste sur place tant que la question est sans réponse', () => {
    expect(goNext(start)).toBe(start)
  })

  it('avance d’une question à la fois', () => {
    const state = goNext(setAnswer(start, 'projectType', 'website'))
    expect(state.step).toBe('audience')
  })

  it('arrive au récapitulatif après les coordonnées', () => {
    const state = goNext({ ...start, step: 'contact', answers: fullAnswers })
    expect(state.step).toBe(SUMMARY)
  })

  it('ne quitte pas le récapitulatif', () => {
    const state = { ...start, step: SUMMARY, answers: fullAnswers }
    expect(goNext(state)).toBe(state)
  })
})

describe('goBack', () => {
  it('ne recule pas depuis la première question ni depuis « Merci »', () => {
    expect(canGoBack(start)).toBe(false)
    expect(goBack(start)).toBe(start)
    expect(canGoBack({ ...start, step: THANKS })).toBe(false)
  })

  it('revient à la question précédente', () => {
    expect(goBack({ ...start, step: 'needs' }).step).toBe('audience')
  })

  it('revient aux coordonnées depuis le récapitulatif', () => {
    expect(goBack({ ...start, step: SUMMARY, answers: fullAnswers }).step).toBe('contact')
  })
})

describe('correction depuis le récapitulatif', () => {
  const summary = { ...start, step: SUMMARY, answers: fullAnswers }

  it('ouvre la question à corriger', () => {
    const state = editStep(summary, 'deadline')
    expect(state.step).toBe('deadline')
    expect(state.editing).toBe(true)
  })

  it('retourne au récapitulatif après la correction', () => {
    const state = goNext(setAnswer(editStep(summary, 'deadline'), 'deadline', 'noRush'))
    expect(state.step).toBe(SUMMARY)
    expect(state.editing).toBe(false)
  })

  it('retourne au récapitulatif avec « Retour »', () => {
    expect(goBack(editStep(summary, 'deadline')).step).toBe(SUMMARY)
  })

  it('repasse par les besoins si le nouveau type de projet les a tous retirés', () => {
    const onlyShop = { ...summary, answers: { ...fullAnswers, needs: ['shop'] } }
    const state = goNext(setAnswer(editStep(onlyShop, 'projectType'), 'projectType', 'mobile'))
    expect(state.step).toBe('needs')
    expect(state.editing).toBe(true)
  })

  it('refuse un écran qui n’est pas une question', () => {
    expect(editStep(summary, THANKS)).toBe(summary)
  })
})

describe('markSent', () => {
  it('affiche « Merci » et retient le moyen d’envoi', () => {
    const state = markSent({ ...start, step: SUMMARY, answers: fullAnswers }, 'email')
    expect(state.step).toBe(THANKS)
    expect(state.sentBy).toBe('email')
  })
})

describe('firstIncompleteStep', () => {
  it('donne la première question sans réponse', () => {
    expect(firstIncompleteStep({ ...fullAnswers, stage: null })).toBe('stage')
  })

  it('donne le récapitulatif quand tout est rempli', () => {
    expect(firstIncompleteStep(fullAnswers)).toBe(SUMMARY)
  })
})

describe('restoreState', () => {
  it('repart de zéro sans sauvegarde ou avec une sauvegarde abîmée', () => {
    expect(restoreState(null, context)).toEqual(start)
    expect(restoreState('texte', context)).toEqual(start)
    expect(restoreState({ step: 'needs' }, context)).toEqual(start)
  })

  it('reprend là où le client s’était arrêté', () => {
    const saved = { step: 'stage', answers: { ...fullAnswers, stage: null } }
    const state = restoreState(JSON.parse(JSON.stringify(saved)), context)
    expect(state.step).toBe('stage')
    expect(state.answers.needs).toEqual(['shop', 'accounts'])
  })

  it('ne reprend jamais plus loin que la première question sans réponse', () => {
    const state = restoreState({ step: SUMMARY, answers: { ...fullAnswers, audience: null } }, context)
    expect(state.step).toBe('audience')
  })

  it('écarte les valeurs inconnues', () => {
    const state = restoreState(
      {
        step: 'ailleurs',
        answers: {
          projectType: 'pirate',
          needs: ['shop', 'accounts', 'inconnu'],
          budgetPosition: 9999,
          name: 42,
        },
      },
      context,
    )
    expect(state.step).toBe('projectType')
    expect(state.answers.projectType).toBeNull()
    expect(state.answers.needs).toEqual(['accounts'])
    expect(state.answers.budgetPosition).toBe(budgetSteps.length)
    expect(state.answers.name).toBe('')
  })

  it('retient le moyen d’envoi seulement sur l’écran « Merci »', () => {
    const sent = restoreState({ step: THANKS, sentBy: 'email', answers: fullAnswers }, context)
    expect(sent.sentBy).toBe('email')

    const notSent = restoreState({ step: SUMMARY, sentBy: 'email', answers: fullAnswers }, context)
    expect(notSent.sentBy).toBeNull()
  })
})
