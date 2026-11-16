import { useT } from '../i18n/LanguageProvider.jsx'
import { Section } from './Section.jsx'

// Les clés des trois étapes dans les dictionnaires (how.describe, how.reply, how.start).
const steps = ['describe', 'reply', 'start']

// Les trois étapes : un grand chiffre posé sur un trait fin.
export function HowItWorks() {
  const { t } = useT()

  return (
    <Section id="etapes" title={t.how.title}>
      <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
        {steps.map((key, index) => (
          <li key={key} className="border-t border-ink pt-5">
            <span
              aria-hidden="true"
              className="block font-display text-6xl leading-none font-extrabold text-accent-text"
            >
              {index + 1}
            </span>
            <h3 className="mt-5 text-xl leading-snug font-semibold">{t.how[key].title}</h3>
            <p className="mt-2 text-ink-soft">{t.how[key].text}</p>
          </li>
        ))}
      </ol>
    </Section>
  )
}
