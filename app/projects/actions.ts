"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { fail, type ActionResult } from "@/lib/actions/result";
import { createClient } from "@/lib/supabase/server";

const PROJECT_STATUSES = ["Planning", "Active", "On Hold", "Completed"] as const;
const PROJECT_PRIORITIES = ["Low", "Medium", "High", "Critical"] as const;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function readString(formData: FormData, key: string): string {
  const raw = formData.get(key);
  return typeof raw === "string" ? raw.trim() : "";
}

function validateProjectFields(
  title: string,
  status: string,
  priority: string,
  startDate: string,
  endDate: string,
): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};
  if (!title) fieldErrors.title = ["Title is required."];
  if (title.length > 200) (fieldErrors.title ??= []).push("Title must be 200 characters or fewer.");
  if (!PROJECT_STATUSES.includes(status as (typeof PROJECT_STATUSES)[number]))
    fieldErrors.status = ["Invalid status."];
  if (!PROJECT_PRIORITIES.includes(priority as (typeof PROJECT_PRIORITIES)[number]))
    fieldErrors.priority = ["Invalid priority."];
  if (startDate && !ISO_DATE_RE.test(startDate)) fieldErrors.start_date = ["Invalid date."];
  if (endDate && !ISO_DATE_RE.test(endDate)) fieldErrors.end_date = ["Invalid date."];
  if (startDate && endDate && startDate > endDate)
    fieldErrors.end_date = ["End date must be on or after start date."];
  return fieldErrors;
}

export async function createProject(formData: FormData): Promise<ActionResult> {
  const title = readString(formData, "title");
  const description = readString(formData, "description");
  const status = readString(formData, "status") || "Planning";
  const priority = readString(formData, "priority") || "Medium";
  const startDate = readString(formData, "start_date");
  const endDate = readString(formData, "end_date");
  const department = readString(formData, "department");

  const fieldErrors = validateProjectFields(title, status, priority, startDate, endDate);
  if (Object.keys(fieldErrors).length > 0) return fail("Please fix the highlighted fields.", fieldErrors);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return fail("You must be signed in to create a project.");

  const { error } = await supabase.from("projects").insert({
    title,
    description: description || null,
    status,
    priority,
    start_date: startDate || null,
    end_date: endDate || null,
    department: department || null,
    created_by: user.id,
  });

  if (error) return fail(error.message);

  revalidatePath("/projects");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function updateProject(id: string, formData: FormData): Promise<ActionResult> {
  if (!UUID_RE.test(id)) return fail("Invalid project ID.");

  const title = readString(formData, "title");
  const description = readString(formData, "description");
  const status = readString(formData, "status") || "Planning";
  const priority = readString(formData, "priority") || "Medium";
  const startDate = readString(formData, "start_date");
  const endDate = readString(formData, "end_date");
  const department = readString(formData, "department");
  const manager = readString(formData, "manager");

  const fieldErrors = validateProjectFields(title, status, priority, startDate, endDate);
  if (Object.keys(fieldErrors).length > 0) return fail("Please fix the highlighted fields.", fieldErrors);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return fail("You must be signed in.");

  const { data, error } = await supabase
    .from("projects")
    .update({
      title,
      description: description || null,
      status,
      priority,
      start_date: startDate || null,
      end_date: endDate || null,
      department: department || null,
      manager: manager || null,
    })
    .eq("id", id)
    .select("id")
    .single();

  if (error || !data) return fail("Project not found or you don't have permission to edit it.");

  revalidatePath(`/projects/${id}`);
  revalidatePath("/projects");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function deleteProject(id: string): Promise<ActionResult> {
  if (!UUID_RE.test(id)) return fail("Invalid project ID.");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return fail("You must be signed in.");

  const { data, error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id)
    .select("id")
    .single();

  if (error || !data) return fail("Project not found or you don't have permission to delete it.");

  revalidatePath("/projects");
  revalidatePath("/dashboard");
  redirect("/projects");
}
