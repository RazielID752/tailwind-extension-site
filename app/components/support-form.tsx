"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type BaseSyntheticEvent,
  type ReactNode,
} from "react";
import { useForm } from "react-hook-form";

import { submitSupportRequest } from "@/app/actions/support";
import {
  supportFormSchema,
  type SupportFormValues,
} from "@/app/support/support-schema";
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

const controlClassName =
  "min-h-[46px] w-full rounded-lg border border-[#2a3848] bg-[#070b10] px-[13px] py-[11px] text-ink outline-none transition focus:border-accent focus:shadow-[0_0_0_3px_rgb(34_211_238_/_10%)] aria-[invalid=true]:border-negative";

type SupportAction = (
  previousState: SupportActionState,
  formData: FormData,
) => Promise<SupportActionState>;

export function SupportForm({
  action = submitSupportRequest,
}: {
  action?: SupportAction;
}) {
  const [submission, setSubmission] = useState(initialSupportState);
  const startedAtRef = useRef<HTMLInputElement>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SupportFormValues>({
    resolver: zodResolver(supportFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  useEffect(() => {
    if (submission.status === "success") reset();

    if (submission.status === "idle" || submission.status === "success") {
      startedAtRef.current?.setAttribute("value", String(Date.now()));
    }
  }, [reset, submission.status]);

  const error = (field: SupportField) =>
    errors[field]?.message ?? submission.fieldErrors?.[field]?.[0];

  const submit = async (
    _values: SupportFormValues,
    event?: BaseSyntheticEvent,
  ) => {
    const form = event?.target;
    if (!(form instanceof HTMLFormElement)) return;

    setSubmission(initialSupportState);

    try {
      const nextState = await action(submission, new FormData(form));
      setSubmission(nextState);
    } catch {
      setSubmission({
        status: "error",
        message:
          "Não foi possível enviar sua solicitação agora. Tente novamente em alguns instantes.",
      });
    }
  };

  const statusColor =
    submission.status === "success"
      ? "text-positive"
      : submission.status === "error"
        ? "text-rose-300"
        : "text-copy";

  return (
    <form
      onSubmit={handleSubmit(submit, () =>
        setSubmission({
          status: "error",
          message: "Revise os campos destacados.",
        }),
      )}
      onChange={() => {
        if (submission.status !== "idle") setSubmission(initialSupportState);
      }}
      className="relative rounded-[18px] border border-line bg-panel p-6 sm:p-9"
      noValidate
    >
      <input ref={startedAtRef} type="hidden" name="startedAt" />

      <div
        className="absolute -left-[10000px] h-px w-px overflow-hidden"
        aria-hidden="true"
      >
        <label htmlFor="website">Não preencha este campo</label>
        <input
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-[18px] sm:grid-cols-2">
        <Field label="Nome" name="name" error={error("name")}>
          <input
            id="name"
            minLength={2}
            maxLength={80}
            required
            placeholder="Digite o nome"
            aria-describedby={error("name") ? "name-error" : undefined}
            aria-invalid={Boolean(error("name"))}
            className={controlClassName}
            {...register("name")}
          />
        </Field>

        <Field label="E-mail" name="email" error={error("email")}>
          <input
            id="email"
            type="email"
            maxLength={254}
            required
            placeholder="Digite o e-mail"
            aria-describedby={error("email") ? "email-error" : undefined}
            aria-invalid={Boolean(error("email"))}
            className={controlClassName}
            {...register("email")}
          />
        </Field>
      </div>

      <Field label="Assunto" name="subject" error={error("subject")}>
        <input
          id="subject"
          minLength={5}
          maxLength={120}
          required
          placeholder="Digite o assunto"
          aria-describedby={error("subject") ? "subject-error" : undefined}
          aria-invalid={Boolean(error("subject"))}
          className={controlClassName}
          {...register("subject")}
        />
      </Field>

      <Field label="Categoria" name="category" error={error("category")}>
        <select
          id="category"
          defaultValue=""
          required
          aria-describedby={error("category") ? "category-error" : undefined}
          aria-invalid={Boolean(error("category"))}
          className={controlClassName}
          {...register("category")}
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
          rows={6}
          minLength={20}
          maxLength={5_000}
          required
          placeholder="Digite aqui a mensagem"
          aria-describedby={error("message") ? "message-error" : undefined}
          aria-invalid={Boolean(error("message"))}
          className={`${controlClassName} min-h-[150px] resize-y`}
          {...register("message")}
        />
      </Field>

      <p className="m-0 text-xs leading-[1.6] text-[#708095]">
        Os dados informados serão usados somente para responder a esta
        solicitação.
      </p>

      <div className="mt-[18px] flex min-h-[62px] flex-col items-stretch gap-5 sm:flex-row sm:items-end sm:justify-between">
        <p
          role="status"
          aria-live="polite"
          className={`m-0 min-h-5 text-[0.8125rem] leading-[1.55] ${statusColor}`}
        >
          {submission.message}
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-accent bg-accent px-[18px] font-bold text-[#031014] shadow-[0_10px_36px_rgb(34_211_238_/_13%)] transition hover:-translate-y-px hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-[0.58] disabled:hover:translate-y-0"
        >
          {isSubmitting ? "Enviando…" : "Enviar solicitação"}
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
    <div className="mb-5">
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-bold text-[#d8e1eb]"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p
          id={`${name}-error`}
          className="mb-0 mt-[7px] text-[0.8125rem] text-rose-300"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
