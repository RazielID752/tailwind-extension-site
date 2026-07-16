import { z } from "zod";

export const supportCategories = [
  "question",
  "problem",
  "suggestion",
  "other",
] as const;

export const supportRequestSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Informe seu nome.")
      .max(80, "Use no máximo 80 caracteres."),
    email: z
      .string()
      .trim()
      .email("Informe um e-mail válido.")
      .max(254, "O e-mail é muito longo."),
    subject: z
      .string()
      .trim()
      .min(5, "Descreva o assunto com mais detalhes.")
      .max(120, "Use no máximo 120 caracteres."),
    category: z.enum(supportCategories, {
      message: "Selecione uma categoria válida.",
    }),
    message: z
      .string()
      .trim()
      .min(20, "A mensagem deve ter pelo menos 20 caracteres.")
      .max(5_000, "A mensagem deve ter no máximo 5.000 caracteres."),
    website: z.string().max(200).default(""),
    startedAt: z.coerce.number().int().positive(),
  })
  .strict();

export type SupportCategory = (typeof supportCategories)[number];
export type SupportRequest = z.infer<typeof supportRequestSchema>;
