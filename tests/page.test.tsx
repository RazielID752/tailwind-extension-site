import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import Home from "@/app/page";
import { metadata } from "@/app/site-metadata";

vi.mock("@/app/components/support-form", () => ({
  SupportForm: () => <form aria-label="Formulário de suporte" />,
}));

describe("Home", () => {
  it("expõe metadata canônica do produto", () => {
    expect(metadata.title).toBe(
      "Tailwind Inspector — Tailwind CSS direto no Chrome DevTools",
    );
    expect(metadata.description).toContain("Chrome DevTools");
    expect(metadata.openGraph).toBeDefined();
  });

  it("apresenta o produto com landmarks e hierarquia semântica", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /teste classes tailwind/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Navegação principal" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Como funciona" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Segurança e privacidade" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Suporte" })).toBeInTheDocument();
  });

  it("mantém o destino temporário de instalação centralizado e honesto", () => {
    render(<Home />);
    const header = screen.getByRole("banner");

    expect(
      within(header).getByRole("link", { name: /adicionar ao chrome/i }),
    ).toHaveAttribute("href", "#suporte");
  });

  it("abre e fecha a navegação mobile", async () => {
    const user = userEvent.setup();
    render(<Home />);

    const toggle = screen.getByRole("button", { name: "Abrir menu" });

    expect(
      screen.queryByRole("navigation", { name: "Navegação mobile" }),
    ).not.toBeInTheDocument();

    await user.click(toggle);

    const mobileNavigation = screen.getByRole("navigation", {
      name: "Navegação mobile",
    });
    expect(toggle).toHaveAttribute("aria-expanded", "true");

    await user.click(
      within(mobileNavigation).getByRole("link", { name: "Recursos" }),
    );

    expect(
      screen.queryByRole("navigation", { name: "Navegação mobile" }),
    ).not.toBeInTheDocument();
  });

  it("expõe as garantias essenciais de privacidade", () => {
    render(<Home />);

    expect(screen.getByText(/sem analytics, telemetria/i)).toBeInTheDocument();
    expect(screen.getByText(/chrome\.storage\.local/i)).toBeInTheDocument();
    expect(
      screen.getByText(/páginas internas do chrome não são acessadas/i),
    ).toBeInTheDocument();
  });
});
