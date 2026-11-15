import { useT } from '../i18n/LanguageProvider.jsx'
import { Section } from './Section.jsx'

// Les clés des trois étapes dans les dictionnaires (how.describe, how.reply, how.start).
const steps = ['describe', 'reply', 'start']

export function HowItWorks() {
  const { t } = useT()

  return (
    <Section id="etapes" title={t.how.title}>
      <ol className="grid gap-8 md:grid-cols-3">
        {steps.map((key, index) => (
          <li key={key} className="flex gap-4 md:flex-col">
            <span
              aria-hidden="true"
              className="flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-accent font-mono text-2xl font-medium text-accent-text"
            >
              {index + 1}
            </span>
            <div>
              <h3 className="text-xl leading-snug font-semibold">{t.how[key].title}</h3>
              <p className="mt-2 text-ink-soft">{t.how[key].text}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  )
}
