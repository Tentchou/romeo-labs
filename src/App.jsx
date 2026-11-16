import { Channels } from './components/Channels.jsx'
import { Contact } from './components/Contact.jsx'
import { Footer } from './components/Footer.jsx'
import { Header } from './components/Header.jsx'
import { Hero } from './components/Hero.jsx'
import { HowItWorks } from './components/HowItWorks.jsx'
import { Section } from './components/Section.jsx'
import { Services } from './components/Services.jsx'
import { ProjectWizard } from './features/project-wizard/ProjectWizard.jsx'
import { useT } from './i18n/LanguageProvider.jsx'

export default function App() {
  const { t } = useT()

  return (
    <div id="top">
      <a
        href="#contenu"
        className="sr-only rounded-lg bg-action px-4 py-3 font-semibold text-on-action focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-20"
      >
        {t.header.skipToContent}
      </a>
      <Header />
      {/* pt-18 : laisse la place de l'en-tête fixe */}
      <main id="contenu" className="pt-18">
        <Hero />
        <Services />
        <HowItWorks />
        <Section id="projet" title={t.project.title} intro={t.project.intro}>
          <ProjectWizard />
        </Section>
        <Channels />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
