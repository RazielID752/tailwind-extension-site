import { Download } from "lucide-react";

import { navigation, siteConfig } from "@/app/content";

import { Brand } from "./brand";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-page/85 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[72px] w-full max-w-[1200px] items-center justify-between gap-7 px-5 sm:px-6">
        <Brand />
        <nav
          aria-label="Navegação principal"
          className="hidden items-center gap-4 text-sm text-copy lg:flex xl:gap-6 [&_a]:transition-colors [&_a:hover]:text-ink"
        >
          {navigation.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <a
          className="hidden min-h-[38px] items-center justify-center gap-2 rounded-lg border border-[#155e75] bg-[#0c2530] px-3.5 text-[0.8125rem] font-bold text-cyan-100 transition hover:-translate-y-px hover:border-accent hover:bg-[#103442] sm:inline-flex"
          href={siteConfig.storeUrl}
        >
          <Download size={16} aria-hidden="true" />
          Adicionar ao Chrome
        </a>
      </div>
    </header>
  );
}
