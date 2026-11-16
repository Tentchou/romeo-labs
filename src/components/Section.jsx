import { Reveal } from './Reveal.jsx'

// Une section de la page, en deux colonnes sur grand écran :
// à gauche son numéro, son titre et une phrase d'introduction ; à droite le contenu.
// Le numéro (01, 02…) est compté par le CSS : voir `.section-index` dans index.css.
export function Section({ id, title, intro, children }) {
  const titleId = `${id}-titre`

  return (
    <section id={id} aria-labelledby={titleId} className="border-t border-line py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:grid lg:grid-cols-12 lg:gap-x-12">
        <Reveal className="lg:col-span-4">
          {/* Sur grand écran, le titre reste en vue pendant qu'on lit le contenu. */}
          <div className="lg:sticky lg:top-28">
            <p
              aria-hidden="true"
              className="section-index font-mono text-base font-medium text-accent-text"
            />
            <h2
              id={titleId}
              className="mt-3 font-display text-3xl leading-[1.1] font-bold tracking-tight text-balance sm:text-4xl"
            >
              {title}
            </h2>
            {intro && <p className="mt-4 max-w-md text-ink-soft">{intro}</p>}
          </div>
        </Reveal>
        <Reveal delay={120} className="mt-10 lg:col-span-8 lg:mt-0">
          {children}
        </Reveal>
      </div>
    </section>
  )
}
