import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Home from "@/app/page";

vi.mock("@/app/components/support-form", () => ({
  SupportForm: () => <form aria-label="Formulário de suporte" />,
}));

describe("Home", () => {
  it("apresenta o produto com landmarks e hierarquia semântica", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /teste classes tailwind.*veja o resultado agora/i,
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

  it("expõe as garantias essenciais de privacidade", () => {
    render(<Home />);

    expect(screen.getByText(/sem analytics, telemetria/i)).toBeInTheDocument();
    expect(screen.getByText(/chrome\.storage\.local/i)).toBeInTheDocument();
    expect(
      screen.getByText(/páginas internas do chrome não são acessadas/i),
    ).toBeInTheDocument();
  });
});
