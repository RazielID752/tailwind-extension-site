import { Resend } from "resend";

import type { SupportRequest } from "./support-schema";

type Environment = Partial<
  Record<"RESEND_API_KEY" | "SUPPORT_EMAIL" | "RESEND_FROM_EMAIL", string>
>;

type EmailPayload = {
  from: string;
  to: string[];
  replyTo: string;
  subject: string;
  text: string;
};

type SendResult = Promise<{ error?: { message: string } | null }>;

const categoryLabels = {
  question: "Dúvida",
  problem: "Problema",
  suggestion: "Sugestão",
  other: "Outro",
} satisfies Record<SupportRequest["category"], string>;

export function buildSupportEmail(
  input: SupportRequest,
  config: { supportEmail: string; fromEmail: string },
): EmailPayload {
  return {
    from: config.fromEmail,
    to: [config.supportEmail],
    replyTo: input.email,
    subject: `[Tailwind Inspector] ${input.subject}`,
    text: [
      "Nova solicitação de suporte",
      "",
      `Nome: ${input.name}`,
      `E-mail: ${input.email}`,
      `Categoria: ${categoryLabels[input.category]}`,
      `Assunto: ${input.subject}`,
      "",
      "Mensagem:",
      input.message,
    ].join("\n"),
  };
}

export async function sendSupportEmail(
  input: SupportRequest,
  dependencies?: {
    env?: Environment;
    send?: (payload: EmailPayload) => SendResult;
  },
): Promise<void> {
  const env = dependencies?.env ?? process.env;

  if (!env.RESEND_API_KEY || !env.SUPPORT_EMAIL) {
    throw new Error("Support email is not configured");
  }

  const payload = buildSupportEmail(input, {
    supportEmail: env.SUPPORT_EMAIL,
    fromEmail:
      env.RESEND_FROM_EMAIL ||
      "Tailwind Inspector <onboarding@resend.dev>",
  });
  const send =
    dependencies?.send ??
    ((data: EmailPayload) =>
      new Resend(env.RESEND_API_KEY).emails.send(data));
  const result = await send(payload);

  if (result.error) {
    throw new Error("Support email delivery failed");
  }
}
