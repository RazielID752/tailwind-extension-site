import { Check, LockKeyhole } from "lucide-react";

import { privacyPoints } from "@/app/content";

export function PrivacySection() {
  return (
    <section id="privacidade" className="section privacy">
      <div className="container privacy-panel">
        <div className="privacy-grid">
          <div>
            <LockKeyhole aria-hidden="true" className="privacy-icon" />
            <p className="eyebrow">Local por padrão</p>
            <h2>Segurança e privacidade</h2>
            <p className="privacy-lead">
              O Tailwind Inspector acessa apenas o elemento selecionado e as
              informações CSS necessárias para aplicar previews temporários.
            </p>
          </div>

          <ul>
            {privacyPoints.map((point) => (
              <li key={point}>
                <Check aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="privacy-footnote">
          <p>
            As permissões são usadas somente em páginas HTTP, HTTPS e arquivos
            locais autorizados para aplicar previews, detectar navegações e
            copiar resultados quando você solicitar. Páginas internas do
            Chrome não são acessadas.
          </p>
          <p>
            O formulário de suporte deste site envia pelo Resend apenas os
            dados que você decidir informar.
          </p>
        </div>
      </div>
    </section>
  );
}
