import { navigation } from "@/app/content";

import { Brand } from "./brand";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <Brand />
        <nav aria-label="Navegação do rodapé">
          {navigation.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <p>
          © 2026 Tailwind Inspector. Feito para um fluxo de desenvolvimento mais
          direto.
        </p>
      </div>
    </footer>
  );
}
