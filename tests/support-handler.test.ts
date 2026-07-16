import { describe, expect, it, vi } from "vitest";

import { handleSupportSubmission } from "@/app/support/handle-submission";

const now = 1_800_000_000_000;

function validFormData(overrides: Record<string, string> = {}) {
  const values = {
    name: "Marcos",
    email: "marcos@example.com",
    subject: "Ajuda com variantes",
    category: "question",
    message: "Como aplico uma variante hover temporariamente?",
    website: "",
    startedAt: String(now - 5_000),
    ...overrides,
  };
  const formData = new FormData();

  Object.entries(values).forEach(([key, value]) => {
    formData.set(key, value);
  });

  return formData;
}

describe("handleSupportSubmission", () => {
  it("retorna erros de campo sem enviar dados inválidos", async () => {
    const send = vi.fn();

    const state = await handleSupportSubmission(
      validFormData({ email: "invalid" }),
      { send, now: () => now },
    );

    expect(state.fieldErrors?.email).toBeDefined();
    expect(send).not.toHaveBeenCalled();
  });

  it.each([
    ["honeypot preenchido", { website: "https://spam.test" }],
    ["envio em menos de dois segundos", { startedAt: String(now - 500) }],
  ])("rejeita %s sem enviar", async (_name, overrides) => {
    const send = vi.fn();

    const state = await handleSupportSubmission(validFormData(overrides), {
      send,
      now: () => now,
    });

    expect(state).toMatchObject({ status: "error" });
    expect(send).not.toHaveBeenCalled();
  });

  it("envia solicitações válidas e retorna sucesso", async () => {
    const send = vi.fn().mockResolvedValue(undefined);

    const state = await handleSupportSubmission(validFormData(), {
      send,
      now: () => now,
    });

    expect(state).toMatchObject({ status: "success" });
    expect(send).toHaveBeenCalledOnce();
  });

  it("retorna uma mensagem genérica quando a entrega falha", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const send = vi
      .fn()
      .mockRejectedValue(new Error("secret provider detail"));

    const state = await handleSupportSubmission(validFormData(), {
      send,
      now: () => now,
    });

    expect(state.status).toBe("error");
    expect(state.message).not.toContain("secret provider detail");
  });
});
