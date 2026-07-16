import type { SupportRequest } from "./support-schema";

export type SupportField = keyof Pick<
  SupportRequest,
  "name" | "email" | "subject" | "category" | "message"
>;

export type SupportActionState = {
  status: "idle" | "error" | "success";
  message: string;
  fieldErrors?: Partial<Record<SupportField, string[]>>;
};

export const initialSupportState: SupportActionState = {
  status: "idle",
  message: "",
};
