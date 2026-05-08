"use server";

import { fail, type ActionResult } from "@/lib/actions/result";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

// Derives the canonical site URL for email redirect links.
// NEXT_PUBLIC_SITE_URL should be set to your Vercel production domain,
// e.g. https://layguel360.vercel.app — without a trailing slash.
function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  // VERCEL_URL is set automatically by Vercel but lacks the https:// scheme.
  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) return `https://${vercelUrl}`;
  return "http://localhost:3000";
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_MAX = 120;
const PASSWORD_MIN = 8;

type SignUpResult = {
  needsConfirmation: boolean;
  redirectTo: string;
};

function readString(formData: FormData, key: string): string {
  const raw = formData.get(key);
  return typeof raw === "string" ? raw.trim() : "";
}

export async function signUp(formData: FormData): Promise<ActionResult<SignUpResult>> {
  const name = readString(formData, "name");
  const email = readString(formData, "email").toLowerCase();
  const password = formData.get("password");
  const confirm = formData.get("confirm_password");

  const fieldErrors: Record<string, string[]> = {};
  if (!name) fieldErrors.name = ["Name is required."];
  else if (name.length > NAME_MAX)
    fieldErrors.name = [`Name must be ${NAME_MAX} characters or fewer.`];
  if (!email) fieldErrors.email = ["Email is required."];
  else if (!EMAIL_RE.test(email)) fieldErrors.email = ["Enter a valid email."];
  if (typeof password !== "string" || password.length < PASSWORD_MIN)
    fieldErrors.password = [`Password must be at least ${PASSWORD_MIN} characters.`];
  if (password !== confirm) fieldErrors.confirm_password = ["Passwords do not match."];

  if (Object.keys(fieldErrors).length > 0) {
    return fail("Please fix the highlighted fields.", fieldErrors);
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password: password as string,
      options: {
        data: { name },
        // Tells Supabase where to redirect after the user clicks the
        // confirmation link in their inbox. Must be a URL allowed in
        // Supabase Dashboard → Auth → URL Configuration → Redirect URLs.
        emailRedirectTo: `${getSiteUrl()}/auth/confirm`,
      },
    });

    if (error) return fail(error.message);
    if (!data.user) return fail("Sign-up failed. Please try again.");

    // Insert the matching profiles row via the admin client. The user's
    // session may not have propagated to this request yet, which would make
    // the RLS WITH CHECK (auth.uid() = id) fail; admin bypasses RLS safely
    // here because we just minted the user id ourselves.
    const admin = createAdminClient();
    const { error: profileError } = await admin.from("profiles").insert({
      id: data.user.id,
      email,
      name,
    });

    // Don't fatal on duplicate-profile (re-signup case) — only on real errors.
    if (profileError && profileError.code !== "23505") {
      console.error("[signUp] profile insert failed:", profileError);
      return fail(profileError.message);
    }

    // If Supabase email-confirmation is enabled, signUp returns no session.
    // The user must confirm their email before they can sign in.
    const needsConfirmation = !data.session;

    return {
      ok: true,
      data: {
        needsConfirmation,
        redirectTo: needsConfirmation ? "/login" : "/dashboard",
      },
    };
  } catch (err) {
    console.error("[signUp] unexpected error:", err);
    return fail(
      err instanceof Error ? err.message : "Registration failed. Please try again.",
    );
  }
}
