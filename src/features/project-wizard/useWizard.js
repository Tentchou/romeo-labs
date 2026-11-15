// L'état du questionnaire côté React : il applique les règles de wizardState.js,
// sauvegarde la progression dans le navigateur et gère le passage automatique.

import { useCallback, useEffect, useReducer, useRef } from 'react'
import { config } from '../../config.js'
import { readStored, removeStored, writeStored } from '../../storage.js'
import { buildBudgetSteps, positionOfAmount } from './budget.js'
import {
  editStep,
  goBack,
  goNext,
  initialState,
  markSent,
  restoreState,
  setAnswer,
} from './wizardState.js'

const STORAGE_KEY = 'rl-wizard'

// Temps laissé au client pour voir sa réponse cochée avant l'écran suivant.
const AUTO_ADVANCE_MS = 300

export const budgetSteps = buildBudgetSteps(config.budget.ranges)
const defaultBudgetPosition = positionOfAmount(config.budget.defaultAmount, budgetSteps)

const pristine = initialState(defaultBudgetPosition)
const pristineJson = JSON.stringify(pristine)

function loadState() {
  try {
    const saved = JSON.parse(readStored(STORAGE_KEY))
    return restoreState(saved, { defaultBudgetPosition, budgetSteps })
  } catch {
    // Sauvegarde illisible : on repart de zéro.
    return pristine
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'answer':
      return setAnswer(state, action.field, action.value)
    case 'next':
      // `from` évite d'avancer deux fois si le client appuie deux fois de suite.
      return action.from && action.from !== state.step ? state : goNext(state)
    case 'back':
      return goBack(state)
    case 'edit':
      return editStep(state, action.step)
    case 'sent':
      return markSent(state, action.channel)
    case 'restart':
      return pristine
    default:
      return state
  }
}

export function useWizard() {
  const [state, dispatch] = useReducer(reducer, undefined, loadState)
  const timer = useRef(null)

  // Sauvegarde à chaque changement. Un questionnaire vierge ne laisse aucune trace.
  useEffect(() => {
    const json = JSON.stringify(state)
    if (json === pristineJson) removeStored(STORAGE_KEY)
    else writeStored(STORAGE_KEY, json)
  }, [state])

  useEffect(() => () => clearTimeout(timer.current), [])

  const answer = useCallback((field, value) => dispatch({ type: 'answer', field, value }), [])

  // Choix unique : on enregistre, puis on passe à la suite après un court instant.
  const choose = useCallback((field, value) => {
    dispatch({ type: 'answer', field, value })
    clearTimeout(timer.current)
    timer.current = setTimeout(() => dispatch({ type: 'next', from: field }), AUTO_ADVANCE_MS)
  }, [])

  const next = useCallback(() => dispatch({ type: 'next' }), [])

  const back = useCallback(() => {
    clearTimeout(timer.current)
    dispatch({ type: 'back' })
  }, [])

  const edit = useCallback((step) => dispatch({ type: 'edit', step }), [])

  const sent = useCallback((channel) => dispatch({ type: 'sent', channel }), [])

  const restart = useCallback(() => {
    clearTimeout(timer.current)
    dispatch({ type: 'restart' })
  }, [])

  return { ...state, answer, choose, next, back, edit, sent, restart }
}
