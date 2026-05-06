"use server";

import { redirect } from "next/navigation";

import { fail, type ActionResult } from "@/lib/actions/result";
import { createClient } from "@/lib/supabase/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readString(formData: FormData, key: string): string {
  const raw = formData.get(key);
  return typeof raw === "string" ? raw.trim() : "";
}

// Only allow same-origin paths (open-redirect guard).
function safeRedirectTarget(next: string): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/dashboard";
  return next;
}

export async function signIn(formData: FormData): Promise<ActionResult<{ redirectTo: string }>> {
  const email = readString(formData, "email").toLowerCase();
  const password = formData.get("password");
  const next = readString(formData, "next");

  const fieldErrors: Record<string, string[]> = {};
  if (!email) fieldErrors.email = ["Email is required."];
  else if (!EMAIL_RE.test(email)) fieldErrors.email = ["Enter a valid email."];
  if (typeof password !== "string" || password.length === 0)
    fieldErrors.password = ["Password is required."];

  if (Object.keys(fieldErrors).length > 0) {
    return fail("Please fix the highlighted fields.", fieldErrors);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: password as string,
  });

  if (error) {
    return fail(error.message);
  }

  return { ok: true, data: { redirectTo: safeRedirectTarget(next) } };
}

export async function signOut(): Promise<never> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
