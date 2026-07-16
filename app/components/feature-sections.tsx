import { Braces, History, LayoutGrid } from "lucide-react";

import { featureGroups } from "@/app/content";

const featureIcons = [Braces, LayoutGrid, History] as const;

export function FeatureSections() {
  return (
    <section id="recursos" className="section features">
      <div className="container">
        <div className="section-heading">
          <p className="eyebrow">Ferramentas para o fluxo real</p>
          <h2>Menos alternância. Mais precisão.</h2>
          <p>Do primeiro teste ao código que você decide manter.</p>
        </div>

        <div className="feature-groups">
          {featureGroups.map((group, index) => {
            const Icon = featureIcons[index];

            return (
              <article key={group.title} className="feature-group">
                <div className="feature-intro">
                  <Icon aria-hidden="true" />
                  <h3>{group.title}</h3>
                  <p>{group.description}</p>
                </div>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        <aside className="preview-callout">
          <div>
            <p className="eyebrow">Preview isolado</p>
            <h3>Preview para classes ainda não compiladas</h3>
          </div>
          <p>
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
