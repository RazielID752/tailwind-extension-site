import { sendSupportEmail } from "./support-email.server";
import {
  supportRequestSchema,
  type SupportRequest,
} from "./support-schema";
import type { SupportActionState } from "./support-state";

const genericError =
  "Não foi possível enviar sua solicitação agora. Tente novamente em alguns instantes.";

const supportFields = [
  "name",
  "email",
  "subject",
  "category",
  "message",
  "website",
  "startedAt",
] as const;

export async function handleSupportSubmission(
  formData: FormData,
  dependencies?: {
    send?: (input: SupportRequest) => Promise<void>;
    now?: () => number;
  },
): Promise<SupportActionState> {
  const candidate = Object.fromEntries(
    supportFields.map((field) => [field, formData.get(field)]),
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

  const currentTime = (dependencies?.now ?? Date.now)();

  if (
    parsed.data.website ||
    currentTime - parsed.data.startedAt < 2_000
  ) {
    return { status: "error", message: genericError };
  }

  try {
    await (dependencies?.send ?? sendSupportEmail)(parsed.data);

    return {
      status: "success",
      message:
        "Solicitação enviada. Responderemos pelo e-mail informado.",
    };
  } catch (error) {
    console.error("Support request failed", {
      cause: error instanceof Error ? error.name : "UnknownError",
    });

    return { status: "error", message: genericError };
  }
}
