import { describe, expect, it } from 'vitest'
import { emailLink, isFilled, whatsappLink } from './links.js'

describe('isFilled', () => {
  it('refuse les valeurs à compléter, vides ou absentes', () => {
    expect(isFilled('[À COMPLÉTER]')).toBe(false)
    expect(isFilled('   ')).toBe(false)
    expect(isFilled(undefined)).toBe(false)
  })

  it('accepte une vraie valeur', () => {
    expect(isFilled('https://github.com/exemple')).toBe(true)
  })
})

describe('liens de contact', () => {
  it('construit le lien WhatsApp à partir du numéro', () => {
    expect(whatsappLink('237600000000')).toBe('https://wa.me/237600000000')
  })

  it('construit le lien e-mail', () => {
    expect(emailLink('bonjour@exemple.com')).toBe('mailto:bonjour@exemple.com')
  })
})
