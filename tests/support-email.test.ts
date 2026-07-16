import { describe, expect, it, vi } from "vitest";

import {
  buildSupportEmail,
  sendSupportEmail,
} from "@/app/support/support-email.server";

const request = {
  name: "Marcos",
  email: "marcos@example.com",
  subject: "Ajuda com variantes",
  category: "question" as const,
  message: "Como aplico uma variante hover temporariamente?",
  website: "",
  startedAt: 1,
};

describe("support email", () => {
  it("compõe uma mensagem de texto com roteamento seguro", () => {
    const email = buildSupportEmail(request, {
      supportEmail: "owner@gmail.com",
      fromEmail: "Tailwind Inspector <onboarding@resend.dev>",
    });

    expect(email).toMatchObject({
      to: ["owner@gmail.com"],
      replyTo: "marcos@example.com",
      subject: "[Tailwind Inspector] Ajuda com variantes",
    });
    expect(email.text).toContain("Categoria: Dúvida");
    expect(email).not.toHaveProperty("html");
  });

  it("usa o remetente de desenvolvimento quando nenhum foi informado", async () => {
    const send = vi.fn().mockResolvedValue({ error: null });

    await sendSupportEmail(request, {
      env: {
        RESEND_API_KEY: "key",
        SUPPORT_EMAIL: "owner@gmail.com",
      },
      send,
    });

    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "Tailwind Inspector <onboarding@resend.dev>",
      }),
    );
  });

  it("falha de forma controlada sem as variáveis obrigatórias", async () => {
    await expect(
      sendSupportEmail(request, { env: {}, send: vi.fn() }),
    ).rejects.toThrow("Support email is not configured");
  });

  it("normaliza falhas do provedor", async () => {
    const send = vi
      .fn()
      .mockResolvedValue({ error: { message: "provider detail" } });

    await expect(
      sendSupportEmail(request, {
        env: {
          RESEND_API_KEY: "key",
          SUPPORT_EMAIL: "owner@gmail.com",
        },
        send,
      }),
    ).rejects.toThrow("Support email delivery failed");
  });
});
