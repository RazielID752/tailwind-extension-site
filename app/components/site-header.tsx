import { Download } from "lucide-react";

import { navigation, siteConfig } from "@/app/content";

import { Brand } from "./brand";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Brand />
        <nav aria-label="Navegação principal">
          {navigation.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <a className="button button--small" href={siteConfig.storeUrl}>
          <Download size={16} aria-hidden="true" />
          Adicionar ao Chrome
        </a>
      </div>
    </header>
  );
}
