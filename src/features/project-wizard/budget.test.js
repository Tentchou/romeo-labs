import { describe, expect, it } from 'vitest'
import { config } from '../../config.js'
import { en } from '../../i18n/en.js'
import { fr } from '../../i18n/fr.js'
import {
  buildBudgetSteps,
  clampPosition,
  formatBudget,
  groupThousands,
  isAboveMax,
  lastPosition,
  positionOfAmount,
} from './budget.js'

const steps = buildBudgetSteps(config.budget.ranges)
const inFrench = { steps, currency: config.budget.currency, labels: fr.wizard.budget }
const inEnglish = { steps, currency: config.budget.currency, labels: en.wizard.budget }

describe('buildBudgetSteps', () => {
  it('donne des paliers strictement croissants, donc sans doublon', () => {
    for (let i = 1; i < steps.length; i++) {
      expect(steps[i]).toBeGreaterThan(steps[i - 1])
    }
  })

  it('va de 100 000 à 10 000 000', () => {
    expect(steps[0]).toBe(100_000)
    expect(steps.at(-1)).toBe(10_000_000)
  })

  it('suit la graduation progressive', () => {
    // 17 paliers de 25 000, puis 15 de 100 000, puis 16 de 500 000.
    expect(steps).toHaveLength(48)
    expect(steps.slice(0, 3)).toEqual([100_000, 125_000, 150_000])
    expect(steps.slice(16, 19)).toEqual([500_000, 600_000, 700_000])
    expect(steps.slice(31, 34)).toEqual([2_000_000, 2_500_000, 3_000_000])
  })

  it('construit une liste simple à partir de tranches quelconques', () => {
    expect(buildBudgetSteps([{ from: 10, to: 30, step: 10 }])).toEqual([10, 20, 30])
  })
})

describe('positions du curseur', () => {
  it('ajoute une dernière position après le dernier montant', () => {
    expect(lastPosition(steps)).toBe(48)
    expect(isAboveMax(48, steps)).toBe(true)
    expect(isAboveMax(47, steps)).toBe(false)
  })

  it('garde la position dans les limites', () => {
    expect(clampPosition(-3, steps)).toBe(0)
    expect(clampPosition(999, steps)).toBe(48)
    expect(clampPosition(12, steps)).toBe(12)
  })

  it('retrouve la position du montant de départ défini dans config.js', () => {
    const position = positionOfAmount(config.budget.defaultAmount, steps)
    expect(steps[position]).toBe(config.budget.defaultAmount)
  })

  it('choisit le palier suivant pour un montant entre deux paliers', () => {
    expect(steps[positionOfAmount(510_000, steps)]).toBe(600_000)
  })
})

describe('formatBudget', () => {
  it('écrit 100 000 comme « 100 000 FCFA »', () => {
    expect(formatBudget(0, inFrench)).toBe('100 000 FCFA')
  })

  it('sépare les milliers et les millions', () => {
    expect(formatBudget(steps.indexOf(700_000), inFrench)).toBe('700 000 FCFA')
    expect(formatBudget(positionOfAmount(2_500_000, steps), inFrench)).toBe('2 500 000 FCFA')
  })

  it('écrit la dernière position comme « Plus de 10 000 000 FCFA »', () => {
    expect(formatBudget(lastPosition(steps), inFrench)).toBe('Plus de 10 000 000 FCFA')
  })

  it('écrit le dernier montant sans « Plus de »', () => {
    expect(formatBudget(lastPosition(steps) - 1, inFrench)).toBe('10 000 000 FCFA')
  })

  it("suit l'usage anglais", () => {
    expect(formatBudget(0, inEnglish)).toBe('100,000 FCFA')
    expect(formatBudget(lastPosition(steps), inEnglish)).toBe('More than 10,000,000 FCFA')
  })
})

describe('groupThousands', () => {
  it('sépare les milliers', () => {
    expect(groupThousands(999, ' ')).toBe('999')
    expect(groupThousands(1000, ' ')).toBe('1 000')
    expect(groupThousands(1_250_000, ',')).toBe('1,250,000')
  })
})
