import { describe, expect, it } from 'vitest'
import { en } from './en.js'
import { fr } from './fr.js'

// Liste tous les chemins de clés d'un dictionnaire : "header.langButton", etc.
function keyPaths(node, prefix = '') {
  return Object.entries(node).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key
    return value !== null && typeof value === 'object' ? keyPaths(value, path) : [path]
  })
}

function leafValues(node) {
  return Object.values(node).flatMap((value) =>
    value !== null && typeof value === 'object' ? leafValues(value) : [value],
  )
}

describe('dictionnaires FR et EN', () => {
  it('ont exactement les mêmes clés', () => {
    expect(keyPaths(en).sort()).toEqual(keyPaths(fr).sort())
  })

  it("n'ont aucun texte vide", () => {
    for (const value of [...leafValues(fr), ...leafValues(en)]) {
      expect(typeof value).toBe('string')
      expect(value.trim()).not.toBe('')
    }
  })
})
