"use client";

import { Send } from "lucide-react";
import { useActionState, useEffect, useRef, type ReactNode } from "react";

import { submitSupportRequest } from "@/app/actions/support";
import {
  initialSupportState,
  type SupportActionState,
  type SupportField,
} from "@/app/support/support-state";

const categories = [
  ["question", "Dúvida"],
  ["problem", "Problema"],
  ["suggestion", "Sugestão"],
  ["other", "Outro"],
] as const;

type SupportAction = (
  previousState: SupportActionState,
  formData: FormData,
) => Promise<SupportActionState>;

export function SupportForm({
  action = submitSupportRequest,
}: {
  action?: SupportAction;
}) {
  const [state, formAction, pending] = useActionState(
    action,
    initialSupportState,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const startedAtRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }

    if (state.status === "idle" || state.status === "success") {
      startedAtRef.current?.setAttribute("value", String(Date.now()));
    }
  }, [state.status]);

  const error = (field: SupportField) => state.fieldErrors?.[field]?.[0];

  return (
    <form
      ref={formRef}
      action={formAction}
      className="support-form"
      noValidate
    >
      <input ref={startedAtRef} type="hidden" name="startedAt" />

      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website">Não preencha este campo</label>
        <input
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="form-grid">
        <Field label="Nome" name="name" error={error("name")}>
          <input
            id="name"
            name="name"
            minLength={2}
            maxLength={80}
            required
            aria-describedby={error("name") ? "name-error" : undefined}
            aria-invalid={Boolean(error("name"))}
          />
        </Field>

        <Field label="E-mail" name="email" error={error("email")}>
          <input
            id="email"
            name="email"
            type="email"
            maxLength={254}
            required
            aria-describedby={error("email") ? "email-error" : undefined}
            aria-invalid={Boolean(error("email"))}
          />
        </Field>
      </div>

      <Field label="Assunto" name="subject" error={error("subject")}>
        <input
          id="subject"
          name="subject"
          minLength={5}
          maxLength={120}
          required
          aria-describedby={error("subject") ? "subject-error" : undefined}
          aria-invalid={Boolean(error("subject"))}
        />
      </Field>

      <Field label="Categoria" name="category" error={error("category")}>
        <select
          id="category"
          name="category"
          defaultValue=""
          required
          aria-describedby={error("category") ? "category-error" : undefined}
          aria-invalid={Boolean(error("category"))}
        >
          <option value="" disabled>
            Selecione uma categoria
          </option>
          {categories.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Mensagem" name="message" error={error("message")}>
        <textarea
          id="message"
          name="message"
          rows={6}
          minLength={20}
          maxLength={5_000}
          required
          aria-describedby={error("message") ? "message-error" : undefined}
          aria-invalid={Boolean(error("message"))}
        />
      </Field>

      <p className="form-privacy">
        Os dados informados serão usados somente para responder a esta
        solicitação.
      </p>

      <div className="form-footer">
        <p
          role="status"
          aria-live="polite"
          className={`form-status form-status--${state.status}`}
        >
          {state.message}
        </p>
        <button
          type="submit"
          disabled={pending}
          className="button button--primary"
        >
          {pending ? "Enviando…" : "Enviar solicitação"}
          <Send aria-hidden="true" size={17} />
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  error,
  children,
}: {
  label: string;
  name: SupportField;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      {children}
      {error ? (
        <p id={`${name}-error`} className="field-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
