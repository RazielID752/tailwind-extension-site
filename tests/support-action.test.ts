import { beforeEach, describe, expect, it, vi } from "vitest";

import { submitSupportRequest } from "@/app/actions/support";
import { handleSupportSubmission } from "@/app/support/handle-submission";
import { initialSupportState } from "@/app/support/support-state";

vi.mock("@/app/support/handle-submission", () => ({
  handleSupportSubmission: vi.fn(),
}));

describe("submitSupportRequest", () => {
  beforeEach(() => {
    vi.mocked(handleSupportSubmission).mockReset();
  });

  it("delega o FormData e retorna somente o estado seguro", async () => {
    const formData = new FormData();
    vi.mocked(handleSupportSubmission).mockResolvedValue({
      status: "success",
      message: "Enviada.",
    });

    await expect(
      submitSupportRequest(initialSupportState, formData),
    ).resolves.toEqual({ status: "success", message: "Enviada." });
    expect(handleSupportSubmission).toHaveBeenCalledWith(formData);
  });
});
