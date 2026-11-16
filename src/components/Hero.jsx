import { MessageCircle, Rocket } from 'lucide-react'
import { config } from '../config.js'
import { useT } from '../i18n/LanguageProvider.jsx'
import { whatsappLink } from '../links.js'
import { Button } from './Button.jsx'
import { LogoStage } from './LogoStage.jsx'

// L'accueil : aligné à gauche, les éléments entrent l'un après l'autre.
export function Hero() {
  const { t } = useT()

  return (
    <section aria-labelledby="accueil-titre" className="py-16 sm:py-28">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-12 px-4 sm:px-6">
        <div className="max-w-3xl">
          <p className="rise flex items-center gap-3 font-mono text-base font-medium text-ink-soft">
            <span aria-hidden="true" className="size-2.5 shrink-0 rounded-[3px] bg-accent" />
            {t.hero.eyebrow}
          </p>
          <h1
            id="accueil-titre"
            className="rise mt-6 font-display text-[2.75rem] leading-[1.02] font-extrabold tracking-tight text-balance sm:text-7xl"
            style={{ animationDelay: '80ms' }}
          >
            {t.brand.tagline}
          </h1>
          <p
            className="rise mt-6 max-w-xl text-xl leading-relaxed text-ink-soft"
            style={{ animationDelay: '160ms' }}
          >
            {t.hero.subtitle}
          </p>
          <div
            className="rise mt-10 flex flex-col gap-4 sm:flex-row"
            style={{ animationDelay: '240ms' }}
          >
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
        <LogoStage />
      </div>
    </section>
  )
}
