"use server";

import { handleSupportSubmission } from "@/app/support/handle-submission";
import type { SupportActionState } from "@/app/support/support-state";

export async function submitSupportRequest(
  _previousState: SupportActionState,
  formData: FormData,
): Promise<SupportActionState> {
  return handleSupportSubmission(formData);
}
