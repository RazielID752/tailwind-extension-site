import { LifeBuoy, ShieldCheck } from "lucide-react";

import { SupportForm } from "./support-form";

export function SupportSection() {
  return (
    <section
      id="suporte"
      className="scroll-mt-[72px] border-t border-line bg-[#070a0e] py-20 md:py-[120px]"
    >
      <div className="mx-auto grid w-full max-w-[1200px] items-start gap-14 px-5 sm:px-6 lg:grid-cols-[0.75fr_1.25fr] lg:gap-[90px]">
        <div className="lg:sticky lg:top-[116px]">
          <LifeBuoy
            aria-hidden="true"
            className="mb-[30px] h-[42px] w-[42px] text-accent"
          />
          <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.15em] text-accent">
            Fale com a gente
          </p>
          <h2 className="text-balance text-[clamp(2.35rem,4vw,4rem)] font-bold leading-[1.05] tracking-[-0.045em]">
            Suporte
          </h2>
          <p className="mt-4 max-w-[470px] text-[1.0625rem] leading-7 text-copy">
            Encontrou um problema, tem uma dúvida ou quer sugerir uma melhoria?
            Envie os detalhes para que possamos responder pelo e-mail informado.
          </p>
          <div className="mt-7 flex max-w-[420px] items-start gap-[11px] text-[0.8125rem] leading-[1.6] text-[#8090a3]">
            <ShieldCheck
              aria-hidden="true"
              className="shrink-0 text-accent"
            />
            <span>
              Seus dados serão usados somente para responder a esta solicitação.
            </span>
          </div>
        </div>
        <SupportForm />
      </div>
    </section>
  );
}
