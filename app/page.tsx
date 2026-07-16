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
      <a
        className="fixed left-4 top-3 z-[100] -translate-y-[160%] rounded-lg bg-accent px-3.5 py-2.5 font-extrabold text-[#031014] transition-transform focus:translate-y-0"
        href="#conteudo"
      >
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
