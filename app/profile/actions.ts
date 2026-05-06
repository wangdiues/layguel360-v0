"use server";

import { revalidatePath } from "next/cache";

import { fail, type ActionResult } from "@/lib/actions/result";
import { createClient } from "@/lib/supabase/server";

const NAME_MAX = 120;
const ROLE_MAX = 80;
const DEPARTMENT_MAX = 120;
const BIO_MAX = 1000;

function readString(formData: FormData, key: string): string {
  const raw = formData.get(key);
  return typeof raw === "string" ? raw.trim() : "";
}

export async function updateProfile(formData: FormData): Promise<ActionResult> {
  const name = readString(formData, "full_name");
  const role = readString(formData, "role");
  const department = readString(formData, "department");
  const bio = readString(formData, "bio");

  const fieldErrors: Record<string, string[]> = {};
  if (!name) fieldErrors.full_name = ["Name is required."];
  else if (name.length > NAME_MAX)
    fieldErrors.full_name = [`Name must be ${NAME_MAX} characters or fewer.`];
  if (role.length > ROLE_MAX)
    fieldErrors.role = [`Role must be ${ROLE_MAX} characters or fewer.`];
  if (department.length > DEPARTMENT_MAX)
    fieldErrors.department = [`Department must be ${DEPARTMENT_MAX} characters or fewer.`];
  if (bio.length > BIO_MAX)
    fieldErrors.bio = [`Bio must be ${BIO_MAX} characters or fewer.`];

  if (Object.keys(fieldErrors).length > 0) {
    return fail("Please fix the highlighted fields.", fieldErrors);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return fail("You must be signed in to update your profile.");

  // Upsert: insert if no row exists yet (profiles_insert_self policy),
  // otherwise update the existing row (profiles_update_self policy).
  const { error } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      email: user.email ?? "",
      name,
      role: role || null,
      department: department || null,
      bio: bio || null,
    },
    { onConflict: "id" },
  );

  if (error) return fail(error.message);

  revalidatePath("/profile");
  return { ok: true };
}
