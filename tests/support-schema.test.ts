import { describe, expect, it } from "vitest";

import { supportRequestSchema } from "@/app/support/support-schema";

const validRequest = {
  name: "Marcos",
  email: "marcos@example.com",
  subject: "Problema ao editar classes",
  category: "problem",
  message: "Não consigo restaurar as classes originais do elemento.",
  website: "",
  startedAt: Date.now() - 5_000,
};

describe("supportRequestSchema", () => {
  it("normaliza e aceita uma solicitação válida", () => {
    const parsed = supportRequestSchema.parse({
      ...validRequest,
      name: "  Marcos  ",
    });

    expect(parsed.name).toBe("Marcos");
  });

  it.each([
    ["name", "M"],
    ["email", "invalid"],
    ["subject", "Oi"],
    ["category", "billing"],
    ["message", "Curta demais"],
  ])("rejeita o campo inválido %s", (field, value) => {
    const result = supportRequestSchema.safeParse({
      ...validRequest,
      [field]: value,
    });

    expect(result.success).toBe(false);
  });
});
