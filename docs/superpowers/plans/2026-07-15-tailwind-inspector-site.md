# Tailwind Inspector Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Entregar uma landing page institucional responsiva e acessível para o Tailwind Inspector, com formulário de suporte validado no servidor e envio via Resend.

**Architecture:** A página permanece majoritariamente como Server Components síncronos, com um único Client Component para o formulário. A Server Action delega validação e envio a módulos independentes; o adaptador Resend é a única fronteira que lê variáveis de ambiente e chama um serviço externo.

**Tech Stack:** Next.js 16.2.10 App Router, React 19.2.4, TypeScript strict, Tailwind CSS 4, Lucide React, Zod, Resend, Vitest 4, React Testing Library e jsdom.

## Global Constraints

- Preservar a estrutura `app/` sem criar `src/`.
- Não fazer downgrade de nenhuma dependência.
- Preservar alterações locais existentes e incorporar somente as que fazem parte direta deste site.
- Usar **Tailwind Inspector** como nome oficial; não usar “Tailwind Inspecto”.
- Manter a página em português do Brasil.
- Usar `#suporte` como URL temporária de instalação, centralizada em constante.
- Não adicionar banco, Redis, analytics, telemetria, biblioteca de formulários ou biblioteca de animação.
- Não implementar rate limiting em memória.
- Não persistir solicitações de suporte.
- Usar `Tailwind Inspector <onboarding@resend.dev>` como fallback de `RESEND_FROM_EMAIL`.
- Tratar cada Server Action como endpoint público e toda entrada como não confiável.
- Manter JavaScript cliente limitado ao formulário de suporte.

---

## File Structure

```text
app/
  actions/support.ts                  # Server Action fina usada pelo formulário
  components/
    brand.tsx                         # Logo substituível e wordmark acessível
    hero.tsx                          # Hero e screenshot principal
    how-it-works.tsx                  # Fluxo em três passos
    feature-sections.tsx              # Grupos de recursos e preview temporário
    privacy-section.tsx               # Declaração de privacidade da extensão
    site-footer.tsx                   # Rodapé e navegação curta
    site-header.tsx                   # Cabeçalho responsivo
    support-form.tsx                  # Único Client Component interativo
    support-section.tsx               # Composição do bloco de suporte
  support/
    handle-submission.ts              # Caso de uso puro e injetável
    support-email.server.ts           # Adaptador Resend e configuração de ambiente
    support-schema.ts                 # Schema, tipos e mensagens de validação
    support-state.ts                  # Contrato serializável da Server Action
  globals.css                         # Tokens, base, foco, fundos e motion reduction
  layout.tsx                          # Metadata e layout raiz
  page.tsx                            # Composição semântica da landing
  site-metadata.ts                    # Metadata estática isolada e testável
tests/
  page.test.tsx
  support-email.test.ts
  support-form.test.tsx
  support-handler.test.ts
  support-action.test.ts
  support-schema.test.ts
.env.example
vitest.config.mts
vitest.setup.ts
```

---

### Task 1: Test Harness and Dependencies

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Create: `vitest.config.mts`
- Create: `vitest.setup.ts`
- Create: `.env.example`
- Modify: `.gitignore`

**Interfaces:**
- Produces: `pnpm test`, `pnpm test:run` and `pnpm typecheck` commands.
- Produces: jsdom test environment with jest-dom matchers and `@/*` path resolution.

- [ ] **Step 1: Install only the missing runtime dependencies**

Run:

```bash
pnpm add zod resend
```

Expected: `zod` and `resend` appear under `dependencies`; existing versions remain unchanged.

- [ ] **Step 2: Install the missing test dependencies recommended by the local Next.js 16 Vitest guide**

Run:

```bash
pnpm add -D @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom @testing-library/user-event vite-tsconfig-paths
```

Expected: packages are added under `devDependencies` without downgrades.

- [ ] **Step 3: Add deterministic test scripts**

Modify `package.json` scripts to contain:

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "test": "vitest",
  "test:run": "vitest run",
  "typecheck": "tsc --noEmit"
}
```

- [ ] **Step 4: Configure Vitest**

Create `vitest.config.mts`:

```ts
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    restoreMocks: true,
  },
});
```

Create `vitest.setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 5: Document environment variables and ignore brainstorming state**

Create `.env.example`:

```dotenv
RESEND_API_KEY=
SUPPORT_EMAIL=
RESEND_FROM_EMAIL=Tailwind Inspector <onboarding@resend.dev>
```

Append these lines to `.gitignore` without removing existing entries:

```gitignore
.superpowers/
.env*.local
```

- [ ] **Step 6: Verify the harness**

Run:

```bash
pnpm test:run --passWithNoTests
pnpm typecheck
```

Expected: both commands exit with code 0.

- [ ] **Step 7: Commit**

```bash
git add package.json pnpm-lock.yaml vitest.config.mts vitest.setup.ts .env.example .gitignore
git commit -m "test: configure Vitest and support dependencies"
```

---

### Task 2: Support Validation and Email Boundary

**Files:**
- Create: `app/support/support-schema.ts`
- Create: `app/support/support-state.ts`
- Create: `app/support/support-email.server.ts`
- Create: `tests/support-schema.test.ts`
- Create: `tests/support-email.test.ts`

**Interfaces:**
- Produces: `supportRequestSchema`, `SupportRequest`, `SupportCategory`.
- Produces: `SupportActionState`, `initialSupportState`.
- Produces: `buildSupportEmail(input, config)` and `sendSupportEmail(input, dependencies?)`.

- [ ] **Step 1: Write failing schema tests**

Create `tests/support-schema.test.ts`:

```ts
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
  it("normalizes and accepts a valid request", () => {
    const parsed = supportRequestSchema.parse({ ...validRequest, name: "  Marcos  " });
    expect(parsed.name).toBe("Marcos");
  });

  it.each([
    ["name", "M"],
    ["email", "invalid"],
    ["subject", "Oi"],
    ["category", "billing"],
    ["message", "Curta demais"],
  ])("rejects invalid %s", (field, value) => {
    expect(supportRequestSchema.safeParse({ ...validRequest, [field]: value }).success).toBe(false);
  });
});
```

- [ ] **Step 2: Run schema tests and verify RED**

Run: `pnpm test:run tests/support-schema.test.ts`

Expected: FAIL because `@/app/support/support-schema` does not exist.

- [ ] **Step 3: Implement the schema and serializable state contract**

Create `app/support/support-schema.ts`:

```ts
import { z } from "zod";

export const supportCategories = ["question", "problem", "suggestion", "other"] as const;

export const supportRequestSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome.").max(80, "Use no máximo 80 caracteres."),
  email: z.string().trim().email("Informe um e-mail válido.").max(254, "O e-mail é muito longo."),
  subject: z.string().trim().min(5, "Descreva o assunto com mais detalhes.").max(120, "Use no máximo 120 caracteres."),
  category: z.enum(supportCategories, { message: "Selecione uma categoria válida." }),
  message: z.string().trim().min(20, "A mensagem deve ter pelo menos 20 caracteres.").max(5_000, "A mensagem deve ter no máximo 5.000 caracteres."),
  website: z.string().max(200).default(""),
  startedAt: z.coerce.number().int().positive(),
}).strict();

export type SupportCategory = (typeof supportCategories)[number];
export type SupportRequest = z.infer<typeof supportRequestSchema>;
```

Create `app/support/support-state.ts`:

```ts
import type { SupportRequest } from "./support-schema";

export type SupportField = keyof Pick<SupportRequest, "name" | "email" | "subject" | "category" | "message">;

export type SupportActionState = {
  status: "idle" | "error" | "success";
  message: string;
  fieldErrors?: Partial<Record<SupportField, string[]>>;
};

export const initialSupportState: SupportActionState = { status: "idle", message: "" };
```

- [ ] **Step 4: Run schema tests and verify GREEN**

Run: `pnpm test:run tests/support-schema.test.ts`

Expected: 6 tests pass.

- [ ] **Step 5: Write failing email boundary tests**

Create `tests/support-email.test.ts`:

```ts
import { describe, expect, it, vi } from "vitest";
import { buildSupportEmail, sendSupportEmail } from "@/app/support/support-email.server";

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
  it("builds a text-only message with safe routing", () => {
    const email = buildSupportEmail(request, {
      supportEmail: "owner@gmail.com",
      fromEmail: "Tailwind Inspector <onboarding@resend.dev>",
    });
    expect(email).toMatchObject({
      to: ["owner@gmail.com"],
      replyTo: "marcos@example.com",
      subject: "[Tailwind Inspector] Ajuda com variantes",
    });
    expect(email).not.toHaveProperty("html");
  });

  it("throws a controlled configuration error when required variables are missing", async () => {
    await expect(sendSupportEmail(request, { env: {}, send: vi.fn() })).rejects.toThrow("Support email is not configured");
  });

  it("surfaces provider failures without exposing them to the action state", async () => {
    const send = vi.fn().mockResolvedValue({ error: { message: "provider detail" } });
    await expect(sendSupportEmail(request, {
      env: { RESEND_API_KEY: "key", SUPPORT_EMAIL: "owner@gmail.com" },
      send,
    })).rejects.toThrow("Support email delivery failed");
  });
});
```

- [ ] **Step 6: Run email tests and verify RED**

Run: `pnpm test:run tests/support-email.test.ts`

Expected: FAIL because `support-email.server.ts` does not exist.

- [ ] **Step 7: Implement the server-only Resend adapter**

Create `app/support/support-email.server.ts`:

```ts
import { Resend } from "resend";
import type { SupportRequest } from "./support-schema";

type Environment = Partial<Record<"RESEND_API_KEY" | "SUPPORT_EMAIL" | "RESEND_FROM_EMAIL", string>>;
type EmailPayload = { from: string; to: string[]; replyTo: string; subject: string; text: string };
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
  if (!env.RESEND_API_KEY || !env.SUPPORT_EMAIL) throw new Error("Support email is not configured");

  const payload = buildSupportEmail(input, {
    supportEmail: env.SUPPORT_EMAIL,
    fromEmail: env.RESEND_FROM_EMAIL || "Tailwind Inspector <onboarding@resend.dev>",
  });
  const send = dependencies?.send ?? ((data) => new Resend(env.RESEND_API_KEY).emails.send(data));
  const result = await send(payload);
  if (result.error) throw new Error("Support email delivery failed");
}
```

- [ ] **Step 8: Run support unit tests and verify GREEN**

Run: `pnpm test:run tests/support-schema.test.ts tests/support-email.test.ts`

Expected: all tests pass.

- [ ] **Step 9: Commit**

```bash
git add app/support tests/support-schema.test.ts tests/support-email.test.ts
git commit -m "feat: add validated support email boundary"
```

---

### Task 3: Support Submission Use Case and Server Action

**Files:**
- Create: `app/support/handle-submission.ts`
- Create: `app/actions/support.ts`
- Create: `tests/support-handler.test.ts`
- Create: `tests/support-action.test.ts`

**Interfaces:**
- Consumes: `supportRequestSchema`, `SupportActionState`, `sendSupportEmail`.
- Produces: `handleSupportSubmission(formData, dependencies?)`.
- Produces: `submitSupportRequest(previousState, formData)` matching `useActionState`.

- [ ] **Step 1: Write failing handler tests**

Create `tests/support-handler.test.ts` with helpers that append every field to `FormData`, then assert these behaviors:

```ts
import { describe, expect, it, vi } from "vitest";
import { handleSupportSubmission } from "@/app/support/handle-submission";

function validFormData(overrides: Record<string, string> = {}) {
  const values = {
    name: "Marcos",
    email: "marcos@example.com",
    subject: "Ajuda com variantes",
    category: "question",
    message: "Como aplico uma variante hover temporariamente?",
    website: "",
    startedAt: String(Date.now() - 5_000),
    ...overrides,
  };
  const formData = new FormData();
  Object.entries(values).forEach(([key, value]) => formData.set(key, value));
  return formData;
}

describe("handleSupportSubmission", () => {
  it("returns field errors without sending invalid data", async () => {
    const send = vi.fn();
    const state = await handleSupportSubmission(validFormData({ email: "invalid" }), { send });
    expect(state.fieldErrors?.email).toBeDefined();
    expect(send).not.toHaveBeenCalled();
  });

  it.each([
    ["filled honeypot", { website: "https://spam.test" }],
    ["submission under two seconds", { startedAt: String(Date.now()) }],
  ])("rejects %s without sending", async (_name, overrides) => {
    const send = vi.fn();
    const state = await handleSupportSubmission(validFormData(overrides), { send, now: () => Date.now() });
    expect(state).toMatchObject({ status: "error" });
    expect(send).not.toHaveBeenCalled();
  });

  it("sends valid requests and returns success", async () => {
    const send = vi.fn().mockResolvedValue(undefined);
    await expect(handleSupportSubmission(validFormData(), { send })).resolves.toMatchObject({ status: "success" });
    expect(send).toHaveBeenCalledOnce();
  });

  it("returns a generic message when delivery fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const send = vi.fn().mockRejectedValue(new Error("secret provider detail"));
    const state = await handleSupportSubmission(validFormData(), { send });
    expect(state.message).not.toContain("secret provider detail");
  });
});
```

- [ ] **Step 2: Run handler tests and verify RED**

Run: `pnpm test:run tests/support-handler.test.ts`

Expected: FAIL because `handle-submission.ts` does not exist.

- [ ] **Step 3: Implement the use case**

Create `app/support/handle-submission.ts`:

```ts
import { sendSupportEmail } from "./support-email.server";
import { supportRequestSchema, type SupportRequest } from "./support-schema";
import type { SupportActionState } from "./support-state";

const genericError = "Não foi possível enviar sua solicitação agora. Tente novamente em alguns instantes.";

export async function handleSupportSubmission(
  formData: FormData,
  dependencies?: { send?: (input: SupportRequest) => Promise<void>; now?: () => number },
): Promise<SupportActionState> {
  const candidate = Object.fromEntries(
    ["name", "email", "subject", "category", "message", "website", "startedAt"].map((key) => [key, formData.get(key)]),
  );
  const parsed = supportRequestSchema.safeParse(candidate);
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    return {
      status: "error",
      message: "Revise os campos destacados.",
      fieldErrors: {
        name: errors.name,
        email: errors.email,
        subject: errors.subject,
        category: errors.category,
        message: errors.message,
      },
    };
  }

  const now = dependencies?.now ?? Date.now;
  if (parsed.data.website || now() - parsed.data.startedAt < 2_000) {
    return { status: "error", message: genericError };
  }

  try {
    await (dependencies?.send ?? sendSupportEmail)(parsed.data);
    return { status: "success", message: "Solicitação enviada. Responderemos pelo e-mail informado." };
  } catch (error) {
    console.error("Support request failed", error instanceof Error ? error.message : "Unknown error");
    return { status: "error", message: genericError };
  }
}
```

Create `app/actions/support.ts`:

```ts
"use server";

import { handleSupportSubmission } from "@/app/support/handle-submission";
import type { SupportActionState } from "@/app/support/support-state";

export async function submitSupportRequest(
  _previousState: SupportActionState,
  formData: FormData,
): Promise<SupportActionState> {
  return handleSupportSubmission(formData);
}
```

- [ ] **Step 4: Run handler tests and verify GREEN**

Run: `pnpm test:run tests/support-handler.test.ts`

Expected: all 5 cases pass with no secret value in returned state.

- [ ] **Step 5: Verify the Server Action delegates and returns only the safe state**

Create `tests/support-action.test.ts`:

```ts
import { beforeEach, describe, expect, it, vi } from "vitest";
import { submitSupportRequest } from "@/app/actions/support";
import { handleSupportSubmission } from "@/app/support/handle-submission";
import { initialSupportState } from "@/app/support/support-state";

vi.mock("@/app/support/handle-submission", () => ({ handleSupportSubmission: vi.fn() }));

describe("submitSupportRequest", () => {
  beforeEach(() => vi.mocked(handleSupportSubmission).mockReset());

  it("delegates FormData and returns the serializable UI state", async () => {
    const formData = new FormData();
    vi.mocked(handleSupportSubmission).mockResolvedValue({ status: "success", message: "Enviada." });
    await expect(submitSupportRequest(initialSupportState, formData)).resolves.toEqual({ status: "success", message: "Enviada." });
    expect(handleSupportSubmission).toHaveBeenCalledWith(formData);
  });
});
```

Run: `pnpm test:run tests/support-action.test.ts`

Expected: the test passes.

- [ ] **Step 6: Run typecheck and all support tests**

Run: `pnpm typecheck && pnpm test:run tests/support-*.test.*`

Expected: exit code 0.

- [ ] **Step 7: Commit**

```bash
git add app/actions/support.ts app/support/handle-submission.ts tests/support-handler.test.ts tests/support-action.test.ts
git commit -m "feat: handle secure support submissions"
```

---

### Task 4: Accessible Support Form

**Files:**
- Create: `app/components/support-form.tsx`
- Create: `tests/support-form.test.tsx`

**Interfaces:**
- Consumes: `submitSupportRequest`, `initialSupportState`.
- Produces: `<SupportForm />` with fields `name`, `email`, `subject`, `category`, `message`, `website`, `startedAt`.

- [ ] **Step 1: Write failing form tests**

Create `tests/support-form.test.tsx` and mock `React.useActionState` for deterministic idle, error and success states. Assert:

```tsx
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as React from "react";
import { SupportForm } from "@/app/components/support-form";

vi.mock("react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react")>()),
  useActionState: vi.fn(),
}));

describe("SupportForm", () => {
  beforeEach(() => {
    vi.mocked(React.useActionState).mockReturnValue([
      { status: "idle", message: "" }, vi.fn(), false,
    ] as never);
  });

  it("renders every visible field with an accessible label", () => {
    render(<SupportForm />);
    expect(screen.getByLabelText("Nome")).toBeRequired();
    expect(screen.getByLabelText("E-mail")).toHaveAttribute("type", "email");
    expect(screen.getByLabelText("Assunto")).toBeRequired();
    expect(screen.getByLabelText("Categoria")).toBeRequired();
    expect(screen.getByLabelText("Mensagem")).toBeRequired();
  });

  it("associates server errors with their fields", () => {
    vi.mocked(React.useActionState).mockReturnValueOnce([
      { status: "error", message: "Revise os campos destacados.", fieldErrors: { email: ["Informe um e-mail válido."] } },
      vi.fn(),
      false,
    ] as never);
    render(<SupportForm />);
    expect(screen.getByLabelText("E-mail")).toHaveAccessibleDescription("Informe um e-mail válido.");
  });

  it("announces success feedback", () => {
    vi.mocked(React.useActionState).mockReturnValueOnce([
      { status: "success", message: "Solicitação enviada." }, vi.fn(), false,
    ] as never);
    render(<SupportForm />);
    expect(screen.getByRole("status")).toHaveTextContent("Solicitação enviada.");
  });

  it("disables submission while pending", () => {
    vi.mocked(React.useActionState).mockReturnValueOnce([
      { status: "idle", message: "" }, vi.fn(), true,
    ] as never);
    render(<SupportForm />);
    expect(screen.getByRole("button", { name: /enviando/i })).toBeDisabled();
  });
});
```

- [ ] **Step 2: Run form tests and verify RED**

Run: `pnpm test:run tests/support-form.test.tsx`

Expected: FAIL because `SupportForm` does not exist.

- [ ] **Step 3: Implement the form**

Create `app/components/support-form.tsx` as a Client Component that:

```tsx
"use client";

import { Send } from "lucide-react";
import { cloneElement, isValidElement, useActionState, useEffect, useRef, useState, type ReactNode } from "react";
import { submitSupportRequest } from "@/app/actions/support";
import { initialSupportState } from "@/app/support/support-state";

const categories = [
  ["question", "Dúvida"],
  ["problem", "Problema"],
  ["suggestion", "Sugestão"],
  ["other", "Outro"],
] as const;

export function SupportForm() {
  const [state, formAction, pending] = useActionState(submitSupportRequest, initialSupportState);
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
      setStartedAt(Date.now());
    }
  }, [state.status]);

  const error = (field: "name" | "email" | "subject" | "category" | "message") => state.fieldErrors?.[field]?.[0];

  return (
    <form ref={formRef} action={formAction} className="support-form" noValidate>
      <input type="hidden" name="startedAt" value={startedAt} />
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website">Não preencha este campo</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="form-grid">
        <Field label="Nome" name="name" error={error("name")}><input id="name" name="name" minLength={2} maxLength={80} required /></Field>
        <Field label="E-mail" name="email" error={error("email")}><input id="email" name="email" type="email" maxLength={254} required /></Field>
      </div>
      <Field label="Assunto" name="subject" error={error("subject")}><input id="subject" name="subject" minLength={5} maxLength={120} required /></Field>
      <Field label="Categoria" name="category" error={error("category")}>
        <select id="category" name="category" defaultValue="" required>
          <option value="" disabled>Selecione uma categoria</option>
          {categories.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </Field>
      <Field label="Mensagem" name="message" error={error("message")}><textarea id="message" name="message" rows={6} minLength={20} maxLength={5000} required /></Field>
      <p className="form-privacy">Os dados informados serão usados somente para responder a esta solicitação.</p>
      <div className="form-footer">
        <p role="status" aria-live="polite" className={`form-status form-status--${state.status}`}>{state.message}</p>
        <button type="submit" disabled={pending} className="button button--primary">
          {pending ? "Enviando…" : "Enviar solicitação"}<Send aria-hidden="true" size={17} />
        </button>
      </div>
    </form>
  );
}

function Field({ label, name, error, children }: { label: string; name: string; error?: string; children: ReactNode }) {
  const errorId = `${name}-error`;
  return <div className="field"><label htmlFor={name}>{label}</label>{isValidElement(children) ? cloneElement(children, { "aria-describedby": error ? errorId : undefined, "aria-invalid": Boolean(error) } as object) : children}{error && <p id={errorId} className="field-error">{error}</p>}</div>;
}
```

- [ ] **Step 4: Run form tests and verify GREEN**

Run: `pnpm test:run tests/support-form.test.tsx`

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add app/components/support-form.tsx tests/support-form.test.tsx
git commit -m "feat: add accessible support form"
```

---

### Task 5: Landing Page Content and Semantic Composition

**Files:**
- Create: `app/content.ts`
- Create: `app/components/brand.tsx`
- Create: `app/components/site-header.tsx`
- Create: `app/components/hero.tsx`
- Create: `app/components/how-it-works.tsx`
- Create: `app/components/feature-sections.tsx`
- Create: `app/components/privacy-section.tsx`
- Create: `app/components/support-section.tsx`
- Create: `app/components/site-footer.tsx`
- Modify: `app/page.tsx`
- Create: `tests/page.test.tsx`
- Add existing user assets: `public/tailwind-Inspector-logo.png`
- Add existing user assets: `public/Extensao-devtools-tailwind.png`
- Add existing user assets: `public/Imagem-raw-1717x916.png`

**Interfaces:**
- Produces: `siteConfig` with replaceable logo, screenshots and store URL.
- Produces: synchronous `<Home />` Server Component with one `h1`, `main`, navigation anchors and support section.

- [ ] **Step 1: Write the failing landing page test**

Create `tests/page.test.tsx`:

```tsx
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Home from "@/app/page";

vi.mock("@/app/components/support-form", () => ({
  SupportForm: () => <form aria-label="Formulário de suporte" />,
}));

describe("Home", () => {
  it("renders the product story with semantic landmarks", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { level: 1, name: /teste classes tailwind/i })).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Navegação principal" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Como funciona" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Segurança e privacidade" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Suporte" })).toBeInTheDocument();
  });

  it("keeps the temporary install destination centralized and honest", () => {
    render(<Home />);
    const header = screen.getByRole("banner");
    expect(within(header).getByRole("link", { name: /adicionar ao chrome/i })).toHaveAttribute("href", "#suporte");
  });
});
```

- [ ] **Step 2: Run page test and verify RED**

Run: `pnpm test:run tests/page.test.tsx`

Expected: FAIL because the current page is empty.

- [ ] **Step 3: Centralize brand and product content**

Create `app/content.ts` exporting this contract:

```ts
export const siteConfig = {
  name: "Tailwind Inspector",
  storeUrl: "#suporte",
  logo: "/tailwind-Inspector-logo.png",
  heroImage: "/Extensao-devtools-tailwind.png",
  workflowImage: "/Imagem-raw-1717x916.png",
} as const;

export const navigation = [
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Recursos", href: "#recursos" },
  { label: "Privacidade", href: "#privacidade" },
  { label: "Suporte", href: "#suporte" },
] as const;

export const howSteps = [
  { number: "01", title: "Selecione", description: "Escolha qualquer elemento no painel Elements do Chrome DevTools." },
  { number: "02", title: "Experimente", description: "Filtre, adicione e ajuste utilitários com feedback imediato na página." },
  { number: "03", title: "Copie ou restaure", description: "Leve o resultado para o projeto ou retorne às classes originais em um clique." },
] as const;

export const featureGroups = [
  {
    title: "Classes sob controle",
    description: "Trabalhe com a lista completa sem perder contexto.",
    items: ["Filtre rapidamente as classes do elemento selecionado.", "Cole e edite várias classes de uma vez.", "Adicione, edite, remova ou desative classes temporariamente.", "Identifique conflitos como p-4 e p-8 antes da substituição."],
  },
  {
    title: "Layouts sem tentativa e erro",
    description: "Transforme decisões de layout em controles diretos.",
    items: ["Ajuste Flex e Grid por meio de controles visuais.", "Aplique breakpoints e variantes como md, hover, focus e dark.", "Simule estados com o botão :hov.", "Consulte o Box Model e os estilos CSS computados."],
  },
  {
    title: "Um fluxo que não perde seu trabalho",
    description: "Experimente com segurança e leve apenas o resultado final.",
    items: ["Use Undo, Redo ou restaure as classes originais.", "Copie como classes, className ou atributo HTML.", "Salve classes favoritas, recentes e snippets.", "Visualize cada alteração imediatamente na página inspecionada."],
  },
] as const;

export const privacyPoints = [
  "Sem coleta, venda, compartilhamento ou envio de dados para servidores externos.",
  "Sem analytics, telemetria, anúncios, serviços externos ou código remoto.",
  "Favoritos, recentes e snippets permanecem no chrome.storage.local.",
  "Alterações temporárias desaparecem ao restaurar, recarregar ou encerrar a sessão.",
] as const;
```

- [ ] **Step 4: Build focused synchronous components**

Implement components with these exact responsibilities and copy:

```tsx
// app/components/brand.tsx
import Image from "next/image";
import { siteConfig } from "@/app/content";

export function Brand() {
  return <a href="#inicio" className="brand" aria-label="Tailwind Inspector — início"><Image src={siteConfig.logo} alt="" width={238} height={46} priority /></a>;
}
```

```tsx
// app/components/site-header.tsx
import { Chrome } from "lucide-react";
import { navigation, siteConfig } from "@/app/content";
import { Brand } from "./brand";

export function SiteHeader() {
  return <header className="site-header"><div className="container header-inner"><Brand /><nav aria-label="Navegação principal">{navigation.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}</nav><a className="button button--small" href={siteConfig.storeUrl}><Chrome size={16} aria-hidden="true" />Adicionar ao Chrome</a></div></header>;
}
```

```tsx
// app/components/hero.tsx
import Image from "next/image";
import { ArrowDown, Chrome } from "lucide-react";
import { siteConfig } from "@/app/content";

export function Hero() {
  return <section id="inicio" className="hero"><div className="container hero-grid"><div className="hero-copy"><p className="eyebrow">Chrome DevTools, aprimorado</p><h1>Teste classes Tailwind.<br /><span>Veja o resultado agora.</span></h1><p className="hero-lead">Inspecione qualquer elemento, experimente utilitários e acompanhe cada mudança imediatamente — sem interromper seu fluxo para editar o código-fonte.</p><div className="hero-actions"><a className="button button--primary" href={siteConfig.storeUrl}><Chrome aria-hidden="true" size={18} />Adicionar ao Chrome</a><a className="text-link" href="#como-funciona">Ver como funciona<ArrowDown aria-hidden="true" size={16} /></a></div><p className="hero-note">Funciona localmente. Sem analytics. Sem telemetria.</p></div><div className="hero-visual"><Image src={siteConfig.heroImage} alt="Interface do Tailwind Inspector aberta no Chrome DevTools" width={1536} height={1024} priority sizes="(max-width: 900px) 100vw, 58vw" /></div></div></section>;
}
```

```tsx
// app/components/how-it-works.tsx
import Image from "next/image";
import { howSteps, siteConfig } from "@/app/content";

export function HowItWorks() {
  return <section id="como-funciona" className="section how"><div className="container"><div className="section-heading"><p className="eyebrow">Do DevTools para a página</p><h2>Como funciona</h2><p>Um ciclo curto para testar ideias sem interromper o raciocínio.</p></div><ol className="steps">{howSteps.map((step) => <li key={step.number}><span>{step.number}</span><h3>{step.title}</h3><p>{step.description}</p></li>)}</ol><div className="workflow-visual"><Image src={siteConfig.workflowImage} alt="Classes Tailwind conectadas visualmente a ajustes de Flex e Grid" width={1717} height={916} sizes="(max-width: 900px) 100vw, 1100px" /></div></div></section>;
}
```

```tsx
// app/components/feature-sections.tsx
import { Braces, History, LayoutGrid } from "lucide-react";
import { featureGroups } from "@/app/content";

const icons = [Braces, LayoutGrid, History] as const;

export function FeatureSections() {
  return <section id="recursos" className="section features"><div className="container"><div className="section-heading"><p className="eyebrow">Ferramentas para o fluxo real</p><h2>Menos alternância. Mais precisão.</h2><p>Do primeiro teste ao código que você decide manter.</p></div><div className="feature-groups">{featureGroups.map((group, index) => { const Icon = icons[index]; return <article key={group.title} className="feature-group"><div className="feature-intro"><Icon aria-hidden="true" /><h3>{group.title}</h3><p>{group.description}</p></div><ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul></article>; })}</div><aside className="preview-callout"><div><p className="eyebrow">Preview isolado</p><h3>Preview para classes ainda não compiladas</h3></div><p>Quando uma classe não existir no CSS compilado, o Tailwind Inspector pode gerar uma regra temporária para utilitários comuns e valores arbitrários validados. O CSS fica isolado no elemento selecionado, não altera arquivos do projeto e desaparece ao restaurar ou recarregar.</p></aside></div></section>;
}
```

```tsx
// app/components/privacy-section.tsx
import { Check, LockKeyhole } from "lucide-react";
import { privacyPoints } from "@/app/content";

export function PrivacySection() {
  return <section id="privacidade" className="section privacy"><div className="container privacy-panel"><div className="privacy-grid"><div><LockKeyhole aria-hidden="true" className="privacy-icon" /><p className="eyebrow">Local por padrão</p><h2>Segurança e privacidade</h2><p className="privacy-lead">O Tailwind Inspector acessa apenas o elemento selecionado e as informações CSS necessárias para aplicar previews temporários.</p></div><ul>{privacyPoints.map((point) => <li key={point}><Check aria-hidden="true" />{point}</li>)}</ul></div><div className="privacy-footnote"><p>As permissões são usadas somente em páginas HTTP, HTTPS e arquivos locais autorizados para aplicar previews, detectar navegações e copiar resultados quando você solicitar. Páginas internas do Chrome não são acessadas.</p><p>O formulário de suporte deste site envia pelo Resend apenas os dados que você decidir informar.</p></div></div></section>;
}
```

```tsx
// app/components/support-section.tsx
import { LifeBuoy, ShieldCheck } from "lucide-react";
import { SupportForm } from "./support-form";

export function SupportSection() {
  return <section id="suporte" className="section support"><div className="container support-grid"><div className="support-copy"><LifeBuoy aria-hidden="true" /><p className="eyebrow">Fale com a gente</p><h2>Suporte</h2><p>Encontrou um problema, tem uma dúvida ou quer sugerir uma melhoria? Envie os detalhes para que possamos responder pelo e-mail informado.</p><div className="support-assurance"><ShieldCheck aria-hidden="true" /><span>Seus dados serão usados somente para responder a esta solicitação.</span></div></div><SupportForm /></div></section>;
}
```

```tsx
// app/components/site-footer.tsx
import { navigation } from "@/app/content";
import { Brand } from "./brand";

export function SiteFooter() {
  return <footer className="site-footer"><div className="container footer-inner"><Brand /><nav aria-label="Navegação do rodapé">{navigation.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}</nav><p>© 2026 Tailwind Inspector. Feito para um fluxo de desenvolvimento mais direto.</p></div></footer>;
}
```

- [ ] **Step 5: Compose the page**

Replace `app/page.tsx` with:

```tsx
import { FeatureSections } from "./components/feature-sections";
import { Hero } from "./components/hero";
import { HowItWorks } from "./components/how-it-works";
import { PrivacySection } from "./components/privacy-section";
import { SiteFooter } from "./components/site-footer";
import { SiteHeader } from "./components/site-header";
import { SupportSection } from "./components/support-section";

export default function Home() {
  return <><a className="skip-link" href="#conteudo">Pular para o conteúdo</a><SiteHeader /><main id="conteudo"><Hero /><HowItWorks /><FeatureSections /><PrivacySection /><SupportSection /></main><SiteFooter /></>;
}
```

- [ ] **Step 6: Run the page test and verify GREEN**

Run: `pnpm test:run tests/page.test.tsx`

Expected: both tests pass.

- [ ] **Step 7: Commit**

```bash
git add app/content.ts app/components app/page.tsx tests/page.test.tsx public/tailwind-Inspector-logo.png public/Extensao-devtools-tailwind.png public/Imagem-raw-1717x916.png
git commit -m "feat: build Tailwind Inspector landing content"
```

---

### Task 6: Visual System, Responsive Layout, and SEO

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Create: `app/site-metadata.ts`

**Interfaces:**
- Consumes: semantic class names from Tasks 4 and 5.
- Produces: approved “Precisão DevTools” visual direction across mobile and desktop.
- Produces: complete static `Metadata` for the home page.

- [ ] **Step 1: Add a metadata assertion to the page test**

Append to `tests/page.test.tsx`:

```ts
import { metadata } from "@/app/site-metadata";

it("exposes canonical product metadata", () => {
  expect(metadata.title).toBe("Tailwind Inspector — Tailwind CSS direto no Chrome DevTools");
  expect(metadata.description).toContain("Chrome DevTools");
  expect(metadata.openGraph).toBeDefined();
});
```

- [ ] **Step 2: Run the metadata test and verify RED**

Run: `pnpm test:run tests/page.test.tsx`

Expected: FAIL because the current title is “Tailwind Inspecto”.

- [ ] **Step 3: Isolate metadata and update the root layout without changing the existing Inter setup**

Create `app/site-metadata.ts`:

```ts
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tailwind Inspector — Tailwind CSS direto no Chrome DevTools",
  description: "Teste, ajuste e copie classes Tailwind CSS diretamente no painel Elements do Chrome DevTools.",
  keywords: ["Tailwind CSS", "Chrome DevTools", "extensão Chrome", "frontend", "desenvolvimento web"],
  openGraph: {
    title: "Tailwind Inspector",
    description: "Teste e ajuste classes Tailwind diretamente no Chrome DevTools.",
    type: "website",
    locale: "pt_BR",
    images: [{ url: "/Extensao-devtools-tailwind.png", width: 1536, height: 1024, alt: "Tailwind Inspector no Chrome DevTools" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tailwind Inspector",
    description: "Teste e ajuste classes Tailwind diretamente no Chrome DevTools.",
    images: ["/Extensao-devtools-tailwind.png"],
  },
};
```

In `app/layout.tsx`, remove the inline metadata declaration, import it with `export { metadata } from "./site-metadata";`, keep the existing Inter declaration, set `<html lang="pt-BR" className={`${inter.variable} h-full antialiased`}>`, and use `body` without introducing another client boundary.

- [ ] **Step 4: Implement the visual tokens and responsive system in `app/globals.css`**

Replace starter styles with Tailwind 4 import plus these required foundations, then style every semantic class introduced above:

```css
@import "tailwindcss";

:root {
  --background: #05070a;
  --surface: #0b1016;
  --surface-raised: #101720;
  --border: #1f2b38;
  --foreground: #f5f7fa;
  --muted: #8b9aae;
  --cyan: #22d3ee;
  --cyan-strong: #06b6d4;
  --blue: #3b82f6;
  --danger: #fb7185;
  --success: #67e8a5;
  --container: 1200px;
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; background: var(--background); }
body { margin: 0; background: var(--background); color: var(--foreground); font-family: var(--font-inter), Arial, sans-serif; }
button, input, select, textarea { font: inherit; }
a { color: inherit; text-decoration: none; }
img { max-width: 100%; height: auto; }
:focus-visible { outline: 2px solid var(--cyan); outline-offset: 4px; }
.container { width: min(calc(100% - 40px), var(--container)); margin-inline: auto; }
.skip-link { position: fixed; left: 16px; top: 12px; z-index: 100; transform: translateY(-160%); background: var(--cyan); color: #031014; padding: 10px 14px; border-radius: 8px; font-weight: 800; }
.skip-link:focus { transform: translateY(0); }
.honeypot { position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { scroll-behavior: auto !important; transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; }
}

@media (max-width: 900px) {
  .container { width: min(calc(100% - 32px), var(--container)); }
  .site-header nav { display: none; }
  .hero-grid, .support-grid, .privacy-grid, .feature-group, .preview-callout { grid-template-columns: 1fr; }
  .hero-grid { min-height: 0; gap: 56px; padding-block: 50px 70px; }
  .hero-copy { padding-top: 40px; }
  .hero h1 { font-size: clamp(2.5rem, 12vw, 4.25rem); }
  .hero-visual { margin-right: 0; }
  .section { padding-block: 84px; }
  .steps { grid-template-columns: 1fr; }
  .steps li { min-height: 0; border-right: 0; border-bottom: 1px solid var(--border); }
  .feature-group, .preview-callout { gap: 30px; }
  .privacy-grid { gap: 48px; padding: 42px; }
  .privacy-footnote { grid-template-columns: 1fr; padding-inline: 42px; }
  .support-copy { position: static; }
  .form-grid { grid-template-columns: 1fr; }
}

@media (max-width: 560px) {
  .header-inner .button { display: none; }
  .hero-actions { align-items: stretch; flex-direction: column; }
  .hero-actions .button { justify-content: center; }
  .support-form, .privacy-grid, .preview-callout { padding: 24px; }
  .privacy-footnote { padding-inline: 24px; }
  .form-footer { align-items: stretch; flex-direction: column; }
  .footer-inner { grid-template-columns: 1fr; }
  .footer-inner nav { flex-wrap: wrap; justify-self: start; }
}
```

Add these exact component rules before the media queries shown above:

```css
.site-header { position: sticky; top: 0; z-index: 50; border-bottom: 1px solid color-mix(in srgb, var(--border) 78%, transparent); background: color-mix(in srgb, var(--background) 86%, transparent); backdrop-filter: blur(18px); }
.header-inner { display: flex; min-height: 72px; align-items: center; justify-content: space-between; gap: 28px; }
.brand { display: inline-flex; align-items: center; flex: 0 0 auto; }
.brand img { width: 210px; height: auto; }
.site-header nav, .site-footer nav { display: flex; align-items: center; gap: 26px; color: var(--muted); font-size: 0.875rem; }
.site-header nav a, .site-footer nav a { transition: color 160ms ease; }
.site-header nav a:hover, .site-footer nav a:hover { color: var(--foreground); }
.button { display: inline-flex; min-height: 44px; align-items: center; justify-content: center; gap: 9px; border: 1px solid #155e75; border-radius: 9px; padding: 0 18px; background: #0c2530; color: #cffafe; font-weight: 750; transition: transform 160ms ease, border-color 160ms ease, background 160ms ease; }
.button:hover { transform: translateY(-1px); border-color: var(--cyan); background: #103442; }
.button:disabled { cursor: not-allowed; opacity: 0.58; transform: none; }
.button--primary { border-color: var(--cyan); background: var(--cyan); color: #031014; box-shadow: 0 10px 36px rgba(34, 211, 238, 0.13); }
.button--primary:hover { background: #67e8f9; color: #031014; }
.button--small { min-height: 38px; padding-inline: 14px; font-size: 0.8125rem; }
.hero { position: relative; overflow: clip; border-bottom: 1px solid var(--border); }
.hero::before { position: absolute; inset: 0; z-index: -1; background-image: linear-gradient(rgba(34, 211, 238, 0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.035) 1px, transparent 1px); background-size: 52px 52px; mask-image: linear-gradient(to bottom, black, transparent 82%); content: ""; }
.hero-grid { display: grid; min-height: 720px; grid-template-columns: minmax(0, 0.8fr) minmax(520px, 1.2fr); align-items: center; gap: 52px; padding-block: 82px 76px; }
.hero-copy { position: relative; z-index: 1; }
.eyebrow { margin: 0 0 16px; color: var(--cyan); font-size: 0.75rem; font-weight: 800; letter-spacing: 0.15em; text-transform: uppercase; }
.hero h1, .section-heading h2, .privacy h2, .support h2 { margin: 0; letter-spacing: -0.045em; text-wrap: balance; }
.hero h1 { max-width: 720px; font-size: clamp(3.25rem, 5.7vw, 5.8rem); line-height: 0.98; }
.hero h1 span { color: var(--cyan); }
.hero-lead { max-width: 640px; margin: 28px 0 0; color: #a5b2c3; font-size: clamp(1rem, 1.3vw, 1.1875rem); line-height: 1.7; }
.hero-actions { display: flex; align-items: center; gap: 22px; margin-top: 34px; }
.text-link { display: inline-flex; align-items: center; gap: 8px; color: #d8e1eb; font-size: 0.9375rem; font-weight: 700; }
.hero-note { margin: 22px 0 0; color: #637387; font: 0.75rem/1.5 ui-monospace, SFMono-Regular, Menlo, monospace; }
.hero-visual { position: relative; margin-right: -9vw; }
.hero-visual img, .workflow-visual { border: 1px solid #164e63; border-radius: 18px; background: var(--surface); box-shadow: 0 24px 90px rgba(8, 145, 178, 0.14); }
.section { padding-block: 120px; scroll-margin-top: 72px; }
.section-heading { max-width: 690px; margin-bottom: 58px; }
.section-heading h2, .privacy h2, .support h2 { font-size: clamp(2.35rem, 4vw, 4rem); line-height: 1.05; }
.section-heading > p:last-child, .privacy-lead, .support-copy > p { color: var(--muted); font-size: 1.0625rem; line-height: 1.75; }
.steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; margin: 0 0 54px; padding: 0; list-style: none; border-block: 1px solid var(--border); }
.steps li { min-height: 190px; padding: 30px 34px; border-right: 1px solid var(--border); }
.steps li:last-child { border-right: 0; }
.steps span { color: var(--cyan); font: 0.75rem/1 ui-monospace, SFMono-Regular, Menlo, monospace; }
.steps h3 { margin: 30px 0 9px; font-size: 1.125rem; }
.steps p { margin: 0; color: var(--muted); line-height: 1.65; }
.workflow-visual { overflow: hidden; }
.workflow-visual img { display: block; width: 100%; }
.features { border-block: 1px solid var(--border); background: #070a0e; }
.feature-groups { border-top: 1px solid var(--border); }
.feature-group { display: grid; grid-template-columns: 0.8fr 1.2fr; gap: 80px; padding-block: 52px; border-bottom: 1px solid var(--border); }
.feature-intro > svg { color: var(--cyan); }
.feature-intro h3, .preview-callout h3 { margin: 20px 0 10px; font-size: 1.45rem; }
.feature-intro p { margin: 0; color: var(--muted); line-height: 1.65; }
.feature-group ul, .privacy-panel ul { margin: 0; padding: 0; list-style: none; }
.feature-group li { position: relative; padding: 13px 0 13px 24px; color: #c4ceda; border-bottom: 1px solid #151e28; line-height: 1.55; }
.feature-group li::before { position: absolute; left: 0; color: var(--cyan); content: "+"; }
.preview-callout { display: grid; grid-template-columns: 0.8fr 1.2fr; gap: 80px; margin-top: 60px; padding: 36px; border: 1px solid #164e63; border-radius: 16px; background: #08141b; }
.preview-callout p:last-child { margin: 0; color: #aebbc9; line-height: 1.75; }
.privacy { background: var(--background); }
.privacy-panel { overflow: hidden; border: 1px solid var(--border); border-radius: 20px; background: var(--surface); }
.privacy-grid { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 80px; padding: 64px; }
.privacy-icon, .support-copy > svg { width: 42px; height: 42px; margin-bottom: 30px; color: var(--cyan); }
.privacy-panel li { display: flex; align-items: flex-start; gap: 14px; padding: 14px 0; color: #c9d3df; border-bottom: 1px solid var(--border); line-height: 1.6; }
.privacy-panel li svg { width: 18px; height: 18px; flex: 0 0 auto; margin-top: 3px; color: var(--success); }
.privacy-footnote { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; padding: 24px 64px; border-top: 1px solid var(--border); background: #080d12; color: #77879b; font-size: 0.8125rem; line-height: 1.6; }
.privacy-footnote p { margin: 0; }
.support { border-top: 1px solid var(--border); background: #070a0e; }
.support-grid { display: grid; grid-template-columns: 0.75fr 1.25fr; gap: 90px; align-items: start; }
.support-copy { position: sticky; top: 116px; }
.support-copy > p { max-width: 470px; }
.support-assurance { display: flex; align-items: flex-start; gap: 11px; max-width: 420px; margin-top: 28px; color: #8090a3; font-size: 0.8125rem; line-height: 1.6; }
.support-assurance svg { flex: 0 0 auto; color: var(--cyan); }
.support-form { position: relative; padding: 36px; border: 1px solid var(--border); border-radius: 18px; background: var(--surface); }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
.field { margin-bottom: 20px; }
.field label { display: block; margin-bottom: 8px; color: #d8e1eb; font-size: 0.875rem; font-weight: 700; }
.field input, .field select, .field textarea { width: 100%; min-height: 46px; border: 1px solid #2a3848; border-radius: 8px; background: #070b10; color: var(--foreground); padding: 11px 13px; transition: border-color 150ms ease, box-shadow 150ms ease; }
.field textarea { min-height: 150px; resize: vertical; }
.field input:focus, .field select:focus, .field textarea:focus { border-color: var(--cyan); box-shadow: 0 0 0 3px rgba(34, 211, 238, 0.1); outline: 0; }
.field [aria-invalid="true"] { border-color: var(--danger); }
.field-error { margin: 7px 0 0; color: #fda4af; font-size: 0.8125rem; }
.form-privacy { margin: 0; color: #708095; font-size: 0.75rem; line-height: 1.6; }
.form-footer { display: flex; min-height: 62px; align-items: flex-end; justify-content: space-between; gap: 20px; margin-top: 18px; }
.form-status { margin: 0; color: var(--muted); font-size: 0.8125rem; line-height: 1.55; }
.form-status--success { color: var(--success); }
.form-status--error { color: #fda4af; }
.site-footer { border-top: 1px solid var(--border); padding-block: 42px; }
.footer-inner { display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 30px 60px; }
.footer-inner nav { justify-self: end; }
.footer-inner > p { grid-column: 1 / -1; margin: 0; color: #637387; font-size: 0.75rem; }
```

- [ ] **Step 5: Run tests, typecheck and lint**

Run:

```bash
pnpm test:run
pnpm typecheck
pnpm lint
```

Expected: all commands exit with code 0 and no warnings from React.

- [ ] **Step 6: Commit**

```bash
git add app/globals.css app/layout.tsx app/site-metadata.ts tests/page.test.tsx
git commit -m "feat: apply responsive visual system and SEO"
```

---

### Task 7: Production and Browser Verification

**Files:**
- Modify only files proven necessary by verification failures.

**Interfaces:**
- Verifies: full story from static page through Server Action UI states and production compilation.

- [ ] **Step 1: Run the complete automated verification**

Run:

```bash
pnpm test:run
pnpm typecheck
pnpm lint
pnpm build
```

Expected: all commands exit with code 0. The build reports `/` as a prerendered route with a Server Action available for support submissions.

- [ ] **Step 2: Start the local Next.js server**

Run: `pnpm dev`

Expected: server starts on the first available localhost port without compilation errors.

- [ ] **Step 3: Verify desktop behavior at 1440 × 1000**

Check in the browser:

- page loads with no console errors;
- header, hero and screenshot are visible without overlap;
- all anchor links land below the sticky header;
- only one `h1` exists;
- temporary install links land on the support section;
- keyboard navigation shows visible focus in logical order;
- empty submission exposes native or server validation without layout shift;
- simulated Server Action failure produces a generic message and retains entered values.

- [ ] **Step 4: Verify mobile behavior at 390 × 844**

Check in the browser:

- no horizontal overflow;
- logo remains legible;
- navigation CTA is available in hero even when header navigation is collapsed;
- screenshots remain readable and contained;
- form fields and button are full-width with 44px minimum touch targets;
- success/error feedback remains adjacent to the submit action.

- [ ] **Step 5: Inspect rendered SEO and accessibility basics**

Confirm in browser DOM:

- `<html lang="pt-BR">`;
- title and meta description match Task 6;
- Open Graph and Twitter image tags point to `/Extensao-devtools-tailwind.png`;
- decorative icons are hidden from assistive technology;
- screenshot alt text is descriptive;
- support status uses `aria-live`.

- [ ] **Step 6: Re-run verification after any fix**

Run:

```bash
pnpm test:run && pnpm typecheck && pnpm lint && pnpm build
```

Expected: all checks pass after browser-discovered fixes.

- [ ] **Step 7: Commit verification fixes if any**

```bash
git add app tests
git commit -m "fix: polish verified landing experience"
```

If no files changed, do not create an empty commit.
