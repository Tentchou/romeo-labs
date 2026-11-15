import { GraduationCap, LayoutDashboard, MonitorSmartphone, Smartphone } from 'lucide-react'
import { useT } from '../i18n/LanguageProvider.jsx'
import { Section } from './Section.jsx'

// `key` désigne les textes dans les dictionnaires (services.web, services.mobile…).
const services = [
  { key: 'web', icon: MonitorSmartphone },
  { key: 'mobile', icon: Smartphone },
  { key: 'management', icon: LayoutDashboard },
  { key: 'training', icon: GraduationCap },
]

export function Services() {
  const { t } = useT()

  return (
    <Section id="services" title={t.services.title}>
      <ul className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {services.map(({ key, icon: Icon }) => (
          <li key={key} className="rounded-card border border-line bg-surface p-6">
            <span className="flex size-12 items-center justify-center rounded-control bg-page text-action">
              <Icon aria-hidden="true" className="size-6" />
            </span>
            <h3 className="mt-4 text-xl leading-snug font-semibold">{t.services[key].title}</h3>
            <p className="mt-2 text-ink-soft">{t.services[key].text}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}
