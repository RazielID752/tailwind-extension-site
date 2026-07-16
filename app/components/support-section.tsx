import { LifeBuoy, ShieldCheck } from "lucide-react";

import { SupportForm } from "./support-form";

export function SupportSection() {
  return (
    <section id="suporte" className="section support">
      <div className="container support-grid">
        <div className="support-copy">
          <LifeBuoy aria-hidden="true" />
          <p className="eyebrow">Fale com a gente</p>
          <h2>Suporte</h2>
          <p>
            Encontrou um problema, tem uma dúvida ou quer sugerir uma melhoria?
            Envie os detalhes para que possamos responder pelo e-mail informado.
          </p>
          <div className="support-assurance">
            <ShieldCheck aria-hidden="true" />
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
