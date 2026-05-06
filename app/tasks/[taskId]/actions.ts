"use server";

import { revalidatePath } from "next/cache";

import { fail, type ActionResult } from "@/lib/actions/result";
import { createClient } from "@/lib/supabase/server";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const COMMENT_MAX_LENGTH = 5000;
const TASK_STATUSES = ["Pending", "In Progress", "Review", "Completed"] as const;
const TASK_PRIORITIES = ["Low", "Medium", "High", "Critical"] as const;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function readString(formData: FormData, key: string): string {
  const raw = formData.get(key);
  return typeof raw === "string" ? raw.trim() : "";
}

export async function postComment(taskId: string, text: string): Promise<ActionResult> {
  const trimmed = (text ?? "").trim();

  if (!UUID_RE.test(taskId)) return fail("Invalid task.");
  if (!trimmed) return fail("Comment cannot be empty.", { text: ["Comment cannot be empty."] });
  if (trimmed.length > COMMENT_MAX_LENGTH)
    return fail("Comment is too long.", {
      text: [`Comment must be ${COMMENT_MAX_LENGTH} characters or fewer.`],
    });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return fail("You must be signed in to comment.");

  const { data: profile } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", user.id)
    .maybeSingle();

  const author = profile?.name ?? user.email ?? "Unknown";

  const { error } = await supabase.from("comments").insert({
    task_id: taskId,
    author_id: user.id,
    author,
    text: trimmed,
  });

  if (error) return fail(error.message);

  revalidatePath(`/tasks/${taskId}`);
  return { ok: true };
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
  "text/csv",
]);

type AttachmentData = {
  id: string;
  filename: string;
  file_type: string | null;
  file_size: string | null;
  created_at: string;
};

export async function uploadAttachment(
  taskId: string,
  formData: FormData,
): Promise<ActionResult<AttachmentData>> {
  if (!UUID_RE.test(taskId)) return fail("Invalid task.");

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return fail("No file selected.");
  if (file.size > MAX_FILE_SIZE) return fail("File is too large. Maximum size is 10 MB.");
  if (!ALLOWED_MIME_TYPES.has(file.type)) return fail("File type not allowed.");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return fail("You must be signed in to upload files.");

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePath = `${taskId}/${Date.now()}-${safeName}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const { error: storageError } = await supabase.storage
    .from("task-attachments")
    .upload(storagePath, buffer, { contentType: file.type, upsert: false });

  if (storageError) return fail(storageError.message);

  const fileSize =
    file.size < 1024 * 1024
      ? `${(file.size / 1024).toFixed(0)} KB`
      : `${(file.size / 1024 / 1024).toFixed(1)} MB`;

  const { data, error: dbError } = await supabase
    .from("attachments")
    .insert({
      task_id: taskId,
      uploader_id: user.id,
      filename: file.name,
      file_type: file.type || null,
      file_size: fileSize,
      storage_path: storagePath,
    })
    .select("id, filename, file_type, file_size, created_at")
    .single();

  if (dbError) {
    await supabase.storage.from("task-attachments").remove([storagePath]);
    return fail(dbError.message);
  }

  revalidatePath(`/tasks/${taskId}`);
  return { ok: true, data };
}

export async function updateTask(id: string, formData: FormData): Promise<ActionResult> {
  if (!UUID_RE.test(id)) return fail("Invalid task ID.");

  const title = readString(formData, "title");
  const description = readString(formData, "description");
  const status = readString(formData, "status");
  const priority = readString(formData, "priority");
  const dueDate = readString(formData, "due_date");
  const assignee = readString(formData, "assignee");

  const fieldErrors: Record<string, string[]> = {};
  if (!title) fieldErrors.title = ["Title is required."];
  if (title.length > 200) (fieldErrors.title ??= []).push("Title must be 200 characters or fewer.");
  if (!TASK_STATUSES.includes(status as (typeof TASK_STATUSES)[number]))
    fieldErrors.status = ["Invalid status."];
  if (!TASK_PRIORITIES.includes(priority as (typeof TASK_PRIORITIES)[number]))
    fieldErrors.priority = ["Invalid priority."];
  if (dueDate && !ISO_DATE_RE.test(dueDate)) fieldErrors.due_date = ["Invalid date."];

  if (Object.keys(fieldErrors).length > 0) return fail("Please fix the highlighted fields.", fieldErrors);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return fail("You must be signed in.");

  const { data, error } = await supabase
    .from("tasks")
    .update({
      title,
      description: description || null,
      status,
      priority,
      due_date: dueDate || null,
      assignee: assignee || null,
    })
    .eq("id", id)
    .select("id, project_id")
    .single();

  if (error || !data) return fail("Task not found or you don't have permission to edit it.");

  revalidatePath(`/tasks/${id}`);
  revalidatePath("/tasks");
  if (data.project_id) revalidatePath(`/projects/${data.project_id}`);
  return { ok: true };
}
