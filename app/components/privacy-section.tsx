import { Check, LockKeyhole } from "lucide-react";

import { privacyPoints } from "@/app/content";

export function PrivacySection() {
  return (
    <section
      id="privacidade"
      className="scroll-mt-[72px] bg-page py-20 md:py-[120px]"
    >
      <div className="mx-auto w-[calc(100%-2.5rem)] max-w-[1200px] overflow-hidden rounded-[20px] border border-line bg-panel sm:w-[calc(100%-3rem)]">
        <div className="grid gap-12 p-6 sm:p-[42px] lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:p-16">
          <div>
            <LockKeyhole
              aria-hidden="true"
              className="mb-[30px] h-[42px] w-[42px] text-accent"
            />
            <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.15em] text-accent">
              Local por padrão
            </p>
            <h2 className="text-balance text-[clamp(2.35rem,4vw,4rem)] font-bold leading-[1.05] tracking-[-0.045em]">
              Segurança e privacidade
            </h2>
            <p className="mt-4 text-[1.0625rem] leading-7 text-copy">
              O Tailwind Inspector acessa apenas o elemento selecionado e as
              informações CSS necessárias para aplicar previews temporários.
            </p>
          </div>

          <ul className="m-0 list-none p-0">
            {privacyPoints.map((point) => (
              <li
                key={point}
                className="flex items-start gap-3.5 border-b border-line py-3.5 leading-[1.6] text-[#c9d3df]"
              >
                <Check
                  aria-hidden="true"
                  className="mt-[3px] h-[18px] w-[18px] shrink-0 text-positive"
                />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-5 border-t border-line bg-[#080d12] px-6 py-6 text-[0.8125rem] leading-[1.6] text-[#77879b] sm:px-[42px] lg:grid-cols-2 lg:gap-10 lg:px-16 [&_p]:m-0">
          <p>
            As permissões são usadas somente em páginas HTTP, HTTPS e arquivos
            locais autorizados para aplicar previews, detectar navegações e
            copiar resultados quando você solicitar. Páginas internas do
            Chrome não são acessadas.
          </p>
          <p>
            O formulário de suporte deste site envia apenas os
            dados que você decidir informar.
          </p>
        </div>
      </div>
    </section>
  );
}
