import Image from "next/image";
import { ArrowDown, Download } from "lucide-react";

import { siteConfig } from "@/app/content";

export function Hero() {
  return (
    <section id="inicio" className="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">Chrome DevTools, aprimorado</p>
          <h1>
            Teste classes Tailwind.
            <br />
            <span>Veja o resultado agora.</span>
          </h1>
          <p className="hero-lead">
            Inspecione qualquer elemento, experimente utilitários e acompanhe
            cada mudança imediatamente — sem interromper seu fluxo para editar
            o código-fonte.
          </p>
          <div className="hero-actions">
            <a
              className="button button--primary"
              href={siteConfig.storeUrl}
            >
              <Download aria-hidden="true" size={18} />
              Adicionar ao Chrome
            </a>
            <a className="text-link" href="#como-funciona">
              Ver como funciona
              <ArrowDown aria-hidden="true" size={16} />
            </a>
          </div>
          <p className="hero-note">
            Funciona localmente. Sem analytics. Sem telemetria.
          </p>
        </div>

        <div className="hero-visual">
          <Image
            src={siteConfig.heroImage}
            alt="Interface do Tailwind Inspector aberta no Chrome DevTools"
            width={1536}
            height={1024}
            priority
            sizes="(max-width: 900px) 100vw, 58vw"
          />
        </div>
      </div>
    </section>
  );
}
