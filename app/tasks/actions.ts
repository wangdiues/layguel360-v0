"use server";

import { revalidatePath } from "next/cache";

import { fail, type ActionResult } from "@/lib/actions/result";
import { createClient } from "@/lib/supabase/server";

const TASK_STATUSES = ["Pending", "In Progress", "Review", "Completed"] as const;
const TASK_PRIORITIES = ["Low", "Medium", "High", "Critical"] as const;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function readString(formData: FormData, key: string): string {
  const raw = formData.get(key);
  return typeof raw === "string" ? raw.trim() : "";
}

export async function createTask(formData: FormData): Promise<ActionResult> {
  const title = readString(formData, "title");
  const description = readString(formData, "description");
  const projectId = readString(formData, "project_id");
  const status = readString(formData, "status") || "Pending";
  const priority = readString(formData, "priority") || "Medium";
  const dueDate = readString(formData, "due_date");

  const fieldErrors: Record<string, string[]> = {};
  if (!title) fieldErrors.title = ["Title is required."];
  if (title.length > 200) (fieldErrors.title ??= []).push("Title must be 200 characters or fewer.");
  if (!projectId) fieldErrors.project_id = ["Project is required."];
  else if (!UUID_RE.test(projectId)) fieldErrors.project_id = ["Invalid project."];
  if (!TASK_STATUSES.includes(status as (typeof TASK_STATUSES)[number]))
    fieldErrors.status = ["Invalid status."];
  if (!TASK_PRIORITIES.includes(priority as (typeof TASK_PRIORITIES)[number]))
    fieldErrors.priority = ["Invalid priority."];
  if (dueDate && !ISO_DATE_RE.test(dueDate)) fieldErrors.due_date = ["Invalid date."];

  if (Object.keys(fieldErrors).length > 0) {
    return fail("Please fix the highlighted fields.", fieldErrors);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return fail("You must be signed in to create a task.");

  const { error } = await supabase.from("tasks").insert({
    project_id: projectId,
    title,
    description: description || null,
    status,
    priority,
    due_date: dueDate || null,
    created_by: user.id,
  });

  if (error) return fail(error.message);

  revalidatePath("/tasks");
  revalidatePath(`/projects/${projectId}`);
  return { ok: true };
}
