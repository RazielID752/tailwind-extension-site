import Image from "next/image";

import { howSteps, siteConfig } from "@/app/content";

export function HowItWorks() {
  return (
    <section id="como-funciona" className="section how">
      <div className="container">
        <div className="section-heading">
          <p className="eyebrow">Do DevTools para a página</p>
          <h2>Como funciona</h2>
          <p>
            Um ciclo curto para testar ideias sem interromper o raciocínio.
          </p>
        </div>

        <ol className="steps">
          {howSteps.map((step) => (
            <li key={step.number}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>

        <div className="workflow-visual">
          <Image
            src={siteConfig.workflowImage}
            alt="Classes Tailwind conectadas visualmente a ajustes de Flex e Grid"
            width={1717}
            height={916}
            sizes="(max-width: 900px) 100vw, 1100px"
          />
        </div>
      </div>
    </section>
  );
}
