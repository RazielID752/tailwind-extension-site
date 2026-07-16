import { FeatureSections } from "./components/feature-sections";
import { Hero } from "./components/hero";
import { HowItWorks } from "./components/how-it-works";
import { PrivacySection } from "./components/privacy-section";
import { SiteFooter } from "./components/site-footer";
import { SiteHeader } from "./components/site-header";
import { SupportSection } from "./components/support-section";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <SiteHeader />
      <main id="conteudo">
        <Hero />
        <HowItWorks />
        <FeatureSections />
        <PrivacySection />
        <SupportSection />
      </main>
      <SiteFooter />
    </>
  );
}
