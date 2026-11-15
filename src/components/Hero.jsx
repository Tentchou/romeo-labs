import { MessageCircle, Rocket } from 'lucide-react'
import { config } from '../config.js'
import { useT } from '../i18n/LanguageProvider.jsx'
import { whatsappLink } from '../links.js'
import { Button } from './Button.jsx'

// Le motif du logo en grand, purement décoratif, sur les grands écrans.
function HeroMark() {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className="hidden w-64 shrink-0 lg:block xl:w-72"
      fill="none"
    >
      <rect x="2" y="2" width="60" height="60" rx="14" className="stroke-line" strokeWidth="1.5" />
      <rect x="16" y="16" width="32" height="32" rx="8" className="stroke-action" strokeWidth="4" />
      <rect x="26" y="26" width="12" height="12" rx="3" className="fill-accent" />
    </svg>
  )
}

export function Hero() {
  const { t } = useT()

  return (
    <section aria-labelledby="accueil-titre" className="py-16 sm:py-24">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-12 px-4 sm:px-6">
        <div className="max-w-2xl">
          <h1
            id="accueil-titre"
            className="text-[2.5rem] leading-[1.1] font-bold tracking-tight text-balance sm:text-6xl"
          >
            {t.brand.tagline}
          </h1>
          <p className="mt-6 text-xl leading-relaxed text-ink-soft">{t.hero.subtitle}</p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Button icon={Rocket} href="#projet">
              {t.hero.start}
            </Button>
            <Button
              icon={MessageCircle}
              variant="whatsapp"
              href={whatsappLink(config.whatsappNumber)}
              external
            >
              {t.hero.whatsapp}
            </Button>
          </div>
        </div>
        <HeroMark />
      </div>
    </section>
  )
}
