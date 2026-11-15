import { describe, expect, it } from 'vitest'
import { en } from '../../i18n/en.js'
import { fr } from '../../i18n/fr.js'
import {
  AUDIENCES,
  COMMON_NEEDS,
  DEADLINES,
  EXTRA_NEEDS,
  PROJECT_TYPES,
  STAGES,
  UNSURE,
  keepValidNeeds,
  needsFor,
  toggleNeed,
} from './wizardOptions.js'

describe("needsFor : les options de l'étape 3 dépendent de l'étape 1", () => {
  it('propose toujours les besoins communs et « Je ne sais pas encore »', () => {
    for (const type of PROJECT_TYPES) {
      expect(needsFor(type)).toEqual(expect.arrayContaining([...COMMON_NEEDS, UNSURE]))
    }
  })

  it('ajoute la présentation et la boutique pour un site web', () => {
    expect(needsFor('website')).toEqual(expect.arrayContaining(['showcase', 'shop']))
    expect(needsFor('website')).not.toContain('offline')
    expect(needsFor('website')).not.toContain('stock')
  })

  it('ajoute le hors-ligne et la carte pour une application mobile', () => {
    expect(needsFor('mobile')).toEqual(expect.arrayContaining(['offline', 'map']))
    expect(needsFor('mobile')).not.toContain('shop')
  })

  it('ajoute le stock, les factures et les rôles pour un logiciel de gestion', () => {
    expect(needsFor('management')).toEqual(expect.arrayContaining(['stock', 'invoices', 'roles']))
    expect(needsFor('management')).not.toContain('map')
  })

  it("n'ajoute rien pour une API ou « Autre chose »", () => {
    expect(needsFor('api')).toEqual([...COMMON_NEEDS, UNSURE])
    expect(needsFor('other')).toEqual([...COMMON_NEEDS, UNSURE])
  })

  it('place « Je ne sais pas encore » en dernier, sans doublon', () => {
    for (const type of PROJECT_TYPES) {
      const needs = needsFor(type)
      expect(needs.at(-1)).toBe(UNSURE)
      expect(new Set(needs).size).toBe(needs.length)
    }
  })
})

describe('toggleNeed', () => {
  it('coche puis décoche un besoin', () => {
    expect(toggleNeed([], 'accounts')).toEqual(['accounts'])
    expect(toggleNeed(['accounts', 'shop'], 'accounts')).toEqual(['shop'])
  })

  it('« Je ne sais pas encore » décoche tous les autres', () => {
    expect(toggleNeed(['accounts', 'shop'], UNSURE)).toEqual([UNSURE])
  })

  it('cocher un besoin décoche « Je ne sais pas encore »', () => {
    expect(toggleNeed([UNSURE], 'accounts')).toEqual(['accounts'])
  })

  it('ne modifie pas la liste reçue', () => {
    const selected = ['accounts']
    toggleNeed(selected, 'shop')
    expect(selected).toEqual(['accounts'])
  })
})

describe('keepValidNeeds', () => {
  it("retire les besoins qui n'existent plus après un changement de type de projet", () => {
    expect(keepValidNeeds(['shop', 'accounts'], 'mobile')).toEqual(['accounts'])
  })

  it('garde les besoins encore proposés', () => {
    expect(keepValidNeeds(['shop', 'accounts'], 'website')).toEqual(['shop', 'accounts'])
  })
})

describe('libellés', () => {
  const allNeeds = [...COMMON_NEEDS, ...Object.values(EXTRA_NEEDS).flat(), UNSURE]

  it.each([
    ['français', fr],
    ['anglais', en],
  ])('chaque option a un libellé en %s', (_, dictionary) => {
    const { options } = dictionary.wizard
    for (const id of PROJECT_TYPES) expect(options.projectType[id]).toBeTruthy()
    for (const id of AUDIENCES) expect(options.audience[id]).toBeTruthy()
    for (const id of allNeeds) expect(options.needs[id]).toBeTruthy()
    for (const id of STAGES) expect(options.stage[id]).toBeTruthy()
    for (const id of DEADLINES) expect(options.deadline[id]).toBeTruthy()
  })
})
