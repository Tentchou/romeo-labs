import {
  GraduationCap,
  LayoutDashboard,
  MonitorSmartphone,
  ShieldCheck,
  Smartphone,
} from 'lucide-react'
import { useT } from '../i18n/LanguageProvider.jsx'
import { Section } from './Section.jsx'

// `key` désigne les textes dans les dictionnaires (services.web, services.mobile…).
const services = [
  { key: 'web', icon: MonitorSmartphone },
  { key: 'mobile', icon: Smartphone },
  { key: 'management', icon: LayoutDashboard },
  { key: 'security', icon: ShieldCheck },
  { key: 'training', icon: GraduationCap },
]

// Les services, en liste : une ligne fine entre chacun, pas de cartes.
export function Services() {
  const { t } = useT()

  return (
    <Section id="services" title={t.services.title}>
      <ul className="border-b border-line">
        {services.map(({ key, icon: Icon }, index) => (
          <li
            key={key}
            className="group grid grid-cols-[2.5rem_1fr_auto] items-start gap-x-4 border-t border-line py-6 sm:gap-x-6 sm:py-8"
          >
            <span aria-hidden="true" className="pt-1 font-mono text-base font-medium text-ink-soft">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div>
              <h3 className="text-xl leading-snug font-semibold sm:text-2xl">
                {t.services[key].title}
              </h3>
              <p className="mt-2 max-w-xl text-ink-soft">{t.services[key].text}</p>
            </div>
            <Icon
              aria-hidden="true"
              strokeWidth={1.5}
              className="mt-1 size-7 text-ink-soft transition-[color,transform] duration-200 group-hover:-translate-y-0.5 group-hover:text-accent-text motion-reduce:transform-none"
            />
          </li>
        ))}
      </ul>
    </Section>
  )
}
