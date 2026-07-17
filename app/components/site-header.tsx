"use client";

import { Download, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { navigation, siteConfig } from "@/app/content";

import { Brand } from "./brand";

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMenuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-page/85 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[72px] w-full max-w-[1200px] items-center justify-between gap-7 px-5 sm:px-6">
        <Brand />
        <nav
          aria-label="Navegação principal"
          className="hidden items-center gap-4 text-sm lg:flex xl:gap-6"
        >
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="desktop-nav-link text-copy transition-colors hover:text-accent"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <a
            className="hidden min-h-[38px] items-center justify-center gap-2 rounded-lg border border-[#155e75] bg-[#0c2530] px-3.5 text-[0.8125rem] font-bold text-cyan-100 transition hover:-translate-y-px hover:border-accent hover:bg-[#103442] sm:inline-flex"
            href={siteConfig.storeUrl}
          >
            <Download size={16} aria-hidden="true" />
            Adicionar ao Chrome
          </a>
          <button
            type="button"
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={isMenuOpen}
            aria-controls="menu-mobile"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg border border-line bg-panel text-ink transition hover:border-accent hover:text-accent lg:hidden"
          >
            {isMenuOpen ? (
              <X size={22} aria-hidden="true" />
            ) : (
              <Menu size={22} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {isMenuOpen ? (
        <div
          id="menu-mobile"
          className="border-t border-line bg-page/95 px-5 py-4 shadow-[0_24px_50px_rgb(0_0_0/35%)] backdrop-blur-xl sm:px-6 lg:hidden"
        >
          <nav
            aria-label="Navegação mobile"
            className="mx-auto flex w-full max-w-[1200px] flex-col"
          >
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="border-b border-line py-3.5 font-medium text-copy transition-colors hover:text-accent"
              >
                {item.label}
              </a>
            ))}
            <a
              href={siteConfig.storeUrl}
              onClick={() => setIsMenuOpen(false)}
              className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-accent bg-accent px-[18px] font-bold text-[#031014] sm:hidden"
            >
              <Download size={17} aria-hidden="true" />
              Adicionar ao Chrome
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
