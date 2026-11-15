import { Mail, MessageCircle } from 'lucide-react'
import { config } from '../config.js'
import { useT } from '../i18n/LanguageProvider.jsx'
import { emailLink, isFilled, whatsappLink } from '../links.js'
import { Button } from './Button.jsx'
import { Section } from './Section.jsx'

export function Contact() {
  const { t } = useT()

  return (
    <Section id="contact" title={t.contact.title} intro={t.contact.intro}>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Button
          icon={MessageCircle}
          variant="whatsapp"
          href={whatsappLink(config.whatsappNumber)}
          external
        >
          {t.contact.whatsapp}
        </Button>
        {isFilled(config.email) && (
          <Button icon={Mail} variant="secondary" href={emailLink(config.email)}>
            {t.contact.email}
          </Button>
        )}
      </div>
    </Section>
  )
}
