import Image from "next/image";

import { howSteps, siteConfig } from "@/app/content";

export function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="scroll-mt-[72px] py-20 md:py-[120px]"
    >
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-6">
        <div className="mb-[58px] max-w-[690px]">
          <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.15em] text-accent">
            Do DevTools para a página
          </p>
          <h2 className="text-balance text-[clamp(2.35rem,4vw,4rem)] font-bold leading-[1.05] tracking-[-0.045em]">
            Como funciona
          </h2>
          <p className="mt-4 text-[1.0625rem] leading-7 text-copy">
            Um ciclo curto para testar ideias sem interromper o raciocínio.
          </p>
        </div>

        <ol className="mb-[54px] grid list-none border-y border-line p-0 md:grid-cols-3">
          {howSteps.map((step) => (
            <li
              key={step.number}
              className="border-b border-line px-[34px] py-[30px] last:border-b-0 md:min-h-[190px] md:border-b-0 md:border-r md:last:border-r-0"
            >
              <span className="font-mono text-xs leading-none text-accent">
                {step.number}
              </span>
              <h3 className="mb-[9px] mt-[30px] text-lg font-bold">
                {step.title}
              </h3>
              <p className="leading-[1.65] text-copy">{step.description}</p>
            </li>
          ))}
        </ol>

        <div className="overflow-hidden rounded-[18px] border border-[#164e63] bg-panel shadow-[0_24px_90px_rgb(8_145_178_/_14%)]">
          <Image
            src={siteConfig.workflowImage}
            alt="Classes Tailwind conectadas visualmente a ajustes de Flex e Grid"
            width={1717}
            height={916}
            sizes="(max-width: 900px) 100vw, 1100px"
            className="block w-full"
          />
        </div>
      </div>
    </section>
  );
}
