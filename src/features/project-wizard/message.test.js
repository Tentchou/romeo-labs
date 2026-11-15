import { describe, expect, it } from 'vitest'
import { config } from '../../config.js'
import { en } from '../../i18n/en.js'
import { fr } from '../../i18n/fr.js'
import { buildBudgetSteps } from './budget.js'
import {
  answerRows,
  buildEmailSubject,
  buildMessage,
  mailtoMessageLink,
  whatsappMessageLink,
} from './message.js'
import { UNSURE } from './wizardOptions.js'

const budgetSteps = buildBudgetSteps(config.budget.ranges)
const inFrench = { t: fr.wizard, brand: 'Romeo Labs', currency: 'FCFA', budgetSteps }
const inEnglish = { ...inFrench, t: en.wizard }

const answers = {
  projectType: 'mobile',
  audience: 'smallBusiness',
  needs: ['mobileMoney', 'notifications'],
  stage: 'idea',
  deadline: 'oneToThreeMonths',
  budgetPosition: budgetSteps.indexOf(700_000),
  budgetUnknown: false,
  name: 'Jean',
  city: 'Douala',
  message: 'Je veux vendre mes produits.',
}

describe('buildMessage', () => {
  it('écrit le message complet en français', () => {
    expect(buildMessage(answers, inFrench)).toBe(
      [
        'Bonjour Romeo Labs,',
        'Je souhaite démarrer un projet.',
        '',
        '- Type : Application mobile',
        '- Pour : Petite entreprise ou commerce',
        '- Besoins : Paiement Mobile Money, Notifications',
        "- Avancement : J'ai juste une idée",
        '- Délai : Dans 1 à 3 mois',
        '- Budget : 700 000 FCFA',
        '- Nom : Jean',
        '- Ville : Douala',
        '- Message : Je veux vendre mes produits.',
      ].join('\n'),
    )
  })

  it('écrit le message dans la langue choisie', () => {
    const message = buildMessage(answers, inEnglish)
    expect(message).toContain('Hello Romeo Labs,')
    expect(message).toContain('- Type: Mobile app')
    expect(message).toContain('- Budget: 700,000 FCFA')
  })

  it('omet la ville et le message non remplis', () => {
    const message = buildMessage({ ...answers, city: '', message: '   ' }, inFrench)
    expect(message).not.toContain('Ville')
    expect(message).not.toContain('Message')
    expect(message.endsWith('- Nom : Jean')).toBe(true)
  })

  it('omet toute ligne sans réponse', () => {
    const message = buildMessage({ name: 'Jean' }, inFrench)
    expect(message).toBe('Bonjour Romeo Labs,\nJe souhaite démarrer un projet.\n\n- Nom : Jean')
  })

  it('retire les espaces autour des réponses écrites', () => {
    expect(buildMessage({ name: '  Jean  ' }, inFrench)).toContain('- Nom : Jean')
  })

  it('écrit « Je ne sais pas encore » pour le budget et les besoins', () => {
    const message = buildMessage({ ...answers, needs: [UNSURE], budgetUnknown: true }, inFrench)
    expect(message).toContain('- Besoins : Je ne sais pas encore')
    expect(message).toContain('- Budget : Je ne sais pas encore')
  })

  it('écrit « Plus de 10 000 000 FCFA » pour la dernière position du budget', () => {
    const message = buildMessage({ ...answers, budgetPosition: budgetSteps.length }, inFrench)
    expect(message).toContain('- Budget : Plus de 10 000 000 FCFA')
  })
})

describe('answerRows', () => {
  it('relie chaque réponse à son écran du questionnaire', () => {
    const rows = answerRows({ ...answers, city: '' }, inFrench)
    expect(rows.map((row) => row.step)).toEqual([
      'projectType',
      'audience',
      'needs',
      'stage',
      'deadline',
      'budget',
      'contact',
      'contact',
    ])
    expect(rows[0]).toEqual({ step: 'projectType', label: 'Type', value: 'Application mobile' })
  })
})

describe('whatsappMessageLink', () => {
  it('commence par le numéro et porte le message dans « text »', () => {
    expect(whatsappMessageLink('237600000000', 'Bonjour')).toBe(
      'https://wa.me/237600000000?text=Bonjour',
    )
  })

  it('encode les accents, les retours à la ligne et « & »', () => {
    const link = whatsappMessageLink('237600000000', 'Délai : été\nVente & achat')
    const query = link.split('?text=')[1]

    expect(query).toContain('D%C3%A9lai')
    expect(query).toContain('%0A')
    expect(query).toContain('%26')
    expect(query).not.toMatch(/[\s&é]/)
  })

  it('redonne exactement le message une fois décodé', () => {
    const message = buildMessage({ ...answers, message: 'Vente & achat à 100 % ? #1' }, inFrench)
    const link = whatsappMessageLink('237600000000', message)

    expect(new URL(link).searchParams.get('text')).toBe(message)
  })
})

describe('mailtoMessageLink', () => {
  it("porte l'adresse, le sujet et le message encodés", () => {
    const link = mailtoMessageLink('bonjour@exemple.com', 'Nouveau projet : Jean', 'Ligne 1\nLigne 2')

    expect(link).toBe(
      'mailto:bonjour@exemple.com?subject=Nouveau%20projet%20%3A%20Jean&body=Ligne%201%0D%0ALigne%202',
    )
  })

  it('garde « & » dans le message sans casser le lien', () => {
    const link = mailtoMessageLink('bonjour@exemple.com', 'Sujet', 'Vente & achat')
    expect(link.split('&')).toHaveLength(2)
  })
})

describe('buildEmailSubject', () => {
  it('contient le nom du client', () => {
    expect(buildEmailSubject(answers, inFrench)).toBe('Nouveau projet : Jean')
    expect(buildEmailSubject(answers, inEnglish)).toBe('New project: Jean')
  })
})
