"use server";

import type { ActionResult } from "@/lib/actions/result";

// Stub — fully wired in P4.7. Returns a success Result so the dialog
// closes optimistically; real validation + insert + revalidatePath land
// next.
export async function createProject(_formData: FormData): Promise<ActionResult> {
  return { ok: true };
}
