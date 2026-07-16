import { navigation } from "@/app/content";

import { Brand } from "./brand";

export function SiteFooter() {
  return (
    <footer className="border-t border-line py-[42px]">
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 items-center gap-x-[60px] gap-y-[30px] px-5 sm:grid-cols-[auto_1fr] sm:px-6">
        <Brand />
        <nav
          aria-label="Navegação do rodapé"
          className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-copy sm:justify-self-end [&_a]:transition-colors [&_a:hover]:text-ink"
        >
          {navigation.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <p className="m-0 text-xs text-[#637387] sm:col-span-2">
          © 2026 Tailwind Inspector. Feito para um fluxo de desenvolvimento mais
          direto.
        </p>
      </div>
    </footer>
  );
}
