import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { SupportForm } from "@/app/components/support-form";
import type { SupportActionState } from "@/app/support/support-state";

describe("SupportForm", () => {
  it("renderiza todos os campos visíveis com rótulos acessíveis", () => {
    render(<SupportForm />);

    expect(screen.getByLabelText("Nome")).toBeRequired();
    expect(screen.getByLabelText("E-mail")).toHaveAttribute("type", "email");
    expect(screen.getByLabelText("Assunto")).toBeRequired();
    expect(screen.getByLabelText("Categoria")).toBeRequired();
    expect(screen.getByLabelText("Mensagem")).toBeRequired();
  });

  it("associa erros retornados pelo servidor aos campos", async () => {
    const user = userEvent.setup();
    const action = vi.fn(async (): Promise<SupportActionState> => ({
      status: "error",
      message: "Revise os campos destacados.",
      fieldErrors: { email: ["Informe um e-mail válido."] },
    }));
    render(<SupportForm action={action} />);

    await user.click(
      screen.getByRole("button", { name: "Enviar solicitação" }),
    );

    expect(await screen.findByText("Informe um e-mail válido.")).toBeVisible();
    expect(screen.getByLabelText("E-mail")).toHaveAccessibleDescription(
      "Informe um e-mail válido.",
    );
  });

  it("anuncia o feedback de sucesso", async () => {
    const user = userEvent.setup();
    const action = vi.fn(async (): Promise<SupportActionState> => ({
      status: "success",
      message: "Solicitação enviada.",
    }));
    render(<SupportForm action={action} />);

    await user.click(
      screen.getByRole("button", { name: "Enviar solicitação" }),
    );

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Solicitação enviada.",
    );
  });

  it("desabilita o envio enquanto a ação está pendente", async () => {
    const user = userEvent.setup();
    let resolveAction: (state: SupportActionState) => void = () => undefined;
    const action = vi.fn(
      () =>
        new Promise<SupportActionState>((resolve) => {
          resolveAction = resolve;
        }),
    );
    render(<SupportForm action={action} />);

    await user.click(
      screen.getByRole("button", { name: "Enviar solicitação" }),
    );

    expect(screen.getByRole("button", { name: "Enviando…" })).toBeDisabled();
    resolveAction({ status: "success", message: "Enviada." });
    expect(await screen.findByText("Enviada.")).toBeVisible();
  });
});
