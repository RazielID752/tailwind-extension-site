import Image from "next/image";
import { ArrowDown, Download } from "lucide-react";

import { siteConfig } from "@/app/content";
import Link from "next/link";

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-clip border-b border-line"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgb(34_211_238_/_3.5%)_1px,transparent_1px),linear-gradient(90deg,rgb(34_211_238_/_3.5%)_1px,transparent_1px)] bg-[size:52px_52px] [mask-image:linear-gradient(to_bottom,black,transparent_82%)]"
      />
      <div className="mx-auto grid min-h-[720px] w-full max-w-[1200px] items-center gap-14 px-5 py-14 sm:px-6 md:py-20 lg:grid-cols-[minmax(0,0.8fr)_minmax(520px,1.2fr)] lg:gap-[52px]">
        <div className="relative z-[1] pt-10 lg:pt-0">
          <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.15em] text-accent">
            Chrome DevTools, aprimorado
          </p>
          <h1 className="max-w-[720px] text-balance text-[clamp(2.5rem,12vw,4.25rem)] font-bold leading-[0.98] lg:text-[clamp(3.25rem,4.7vw,4.8rem)]">
            Teste classes <span className="text-accent font-light">Tailwind.</span>
            <br />

          </h1>
          <p className="mt-7 max-w-[640px] text-[clamp(1rem,1.3vw,1.1875rem)] leading-[1.7] text-[#a5b2c3]">
            Inspecione qualquer elemento, experimente utilitários e acompanhe
            cada mudança imediatamente — sem interromper seu fluxo para editar
            o código-fonte.
          </p>
          <div className="mt-[34px] flex flex-col items-stretch gap-[22px] sm:flex-row sm:items-center">
            <Link
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-accent bg-accent px-[18px] font-bold text-[#031014] shadow-[0_10px_36px_rgb(34_211_238/13%)] transition hover:-translate-y-px hover:bg-accent-soft"
              href={siteConfig.storeUrl}
            >
              <Download aria-hidden="true" size={18} />
              Adicionar ao Chrome
            </Link>
            <Link
              className="inline-flex items-center gap-2 text-[0.9375rem] font-bold text-[#d8e1eb] transition-colors hover:text-accent"
              href="#como-funciona"
            >
              Ver como funciona
              <ArrowDown aria-hidden="true" size={16} />
            </Link>
          </div>
          <p className="mt-[22px] font-mono text-xs leading-6 text-[#637387]">
            Funciona localmente. Sem analytics. Sem telemetria.
          </p>
        </div>

        <div className="relative lg:-mr-[4vw]">
          <Image
            src={siteConfig.heroImage}
            alt="Interface do Tailwind Inspector aberta no Chrome DevTools"
            width={900}
            height={700}
            priority
            sizes="(max-width: 900px) 100vw, 58vw"
            className="rounded-[18px] border border-[#164e63] bg-panel shadow-[0_24px_90px_rgb(8_145_178_/_14%)]"
          />
        </div>
      </div>
    </section>
  );
}
