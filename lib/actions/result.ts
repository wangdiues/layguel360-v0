// Shared Result shape returned by every server action so client components
// can `if (result.ok === false)` without throwing across the action boundary.
//
// Conventions:
//   - { ok: true, data?: T } — success; data is whatever the action returns.
//   - { ok: false, error: string, fieldErrors?: Record<string, string[]> } —
//     failure; `error` is a user-facing message, `fieldErrors` is the zod
//     `flatten().fieldErrors` shape so forms can render per-field errors.

export type ActionSuccess<T = void> = T extends void ? { ok: true } : { ok: true; data: T };

export type ActionFailure = {
  ok: false;
  error: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export type ActionResult<T = void> = ActionSuccess<T> | ActionFailure;

export function fail(error: string, fieldErrors?: ActionFailure["fieldErrors"]): ActionFailure {
  return { ok: false, error, fieldErrors };
}
