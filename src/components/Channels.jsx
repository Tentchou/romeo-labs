import { BriefcaseBusiness, CodeXml, Music2, SquarePlay, ThumbsUp } from 'lucide-react'
import { config } from '../config.js'
import { useT } from '../i18n/LanguageProvider.jsx'
import { isFilled } from '../links.js'
import { Button } from './Button.jsx'
import { Section } from './Section.jsx'

// `key` désigne à la fois le lien dans config.links et le nom dans les dictionnaires.
const channels = [
  { key: 'youtube', icon: SquarePlay },
  { key: 'tiktok', icon: Music2 },
  { key: 'facebook', icon: ThumbsUp },
  { key: 'linkedin', icon: BriefcaseBusiness },
  { key: 'github', icon: CodeXml },
]

export function Channels() {
  const { t } = useT()
  const available = channels.filter(({ key }) => isFilled(config.links[key]))

  // Tant qu'aucun lien n'est rempli dans config.js, la section n'apparaît pas.
  if (available.length === 0) return null

  return (
    <Section id="chaines" title={t.channels.title} intro={t.channels.intro}>
      <ul className="grid gap-3 sm:grid-cols-2">
        {available.map(({ key, icon }) => (
          <li key={key}>
            <Button icon={icon} variant="secondary" href={config.links[key]} external fullWidth>
              {t.channels[key]}
            </Button>
          </li>
        ))}
      </ul>
    </Section>
  )
}
