import { Braces, History, LayoutGrid } from "lucide-react";

import { featureGroups } from "@/app/content";

const featureIcons = [Braces, LayoutGrid, History] as const;

export function FeatureSections() {
  return (
    <section
      id="recursos"
      className="scroll-mt-[72px] border-y border-line bg-[#070a0e] py-20 md:py-[120px]"
    >
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-6">
        <div className="mb-[58px] max-w-[690px]">
          <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.15em] text-accent">
            Ferramentas para o fluxo real
          </p>
          <h2 className="text-balance text-[clamp(2.35rem,4vw,4rem)] font-bold leading-[1.05] tracking-[-0.045em]">
            Menos alternância. Mais precisão.
          </h2>
          <p className="mt-4 text-[1.0625rem] leading-7 text-copy">
            Do primeiro teste ao código que você decide manter.
          </p>
        </div>

        <div className="border-t border-line">
          {featureGroups.map((group, index) => {
            const Icon = featureIcons[index];

            return (
              <article
                key={group.title}
                className="grid gap-[30px] border-b border-line py-[52px] lg:grid-cols-[0.8fr_1.2fr] lg:gap-20"
              >
                <div>
                  <Icon aria-hidden="true" className="text-accent" />
                  <h3 className="mb-2.5 mt-5 text-[1.45rem] font-bold">
                    {group.title}
                  </h3>
                  <p className="leading-[1.65] text-copy">
                    {group.description}
                  </p>
                </div>
                <ul className="m-0 list-none p-0">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="relative border-b border-[#151e28] py-[13px] pl-6 leading-[1.55] text-[#c4ceda] before:absolute before:left-0 before:text-accent before:content-['+']"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        <aside className="mt-[60px] grid gap-[30px] rounded-2xl border border-[#164e63] bg-[#08141b] p-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:p-9">
          <div>
            <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.15em] text-accent">
              Preview isolado
            </p>
            <h3 className="text-[1.45rem] font-bold">
              Preview para classes ainda não compiladas
            </h3>
          </div>
          <p className="leading-7 text-[#aebbc9]">
            Quando uma classe não existir no CSS compilado, o Tailwind
            Inspector pode gerar uma regra temporária para utilitários comuns e
            valores arbitrários validados. O CSS fica isolado no elemento
            selecionado, não altera arquivos do projeto e desaparece ao
            restaurar ou recarregar.
          </p>
        </aside>
      </div>
    </section>
  );
}
