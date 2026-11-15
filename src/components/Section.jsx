// Une section de la page : un titre, une phrase d'introduction facultative, puis le contenu.
export function Section({ id, title, intro, children }) {
  const titleId = `${id}-titre`

  return (
    <section id={id} aria-labelledby={titleId} className="border-t border-line py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2
          id={titleId}
          className="text-3xl leading-tight font-bold tracking-tight text-balance sm:text-4xl"
        >
          {title}
        </h2>
        {intro && <p className="mt-4 max-w-2xl text-ink-soft">{intro}</p>}
        <div className="mt-8 sm:mt-12">{children}</div>
      </div>
    </section>
  )
}
