"use client";

import { createClient } from "@/lib/supabase/client";
import type { Comment, Task } from "@/lib/supabase/queries.server";

// ───────────────────────────────────────────────────────────────────────────
// Browser-only Supabase helpers.
//
// Use this module from client components for actions that genuinely need
// to run in the browser (Realtime subscriptions, client-side prefetch).
// Mutations should generally go through server actions, not these helpers.
// Re-exports the shared row types from `queries.server` to keep the type
// surface single-sourced; no schema duplication.
// ───────────────────────────────────────────────────────────────────────────

export type { Project, Task, Comment, Attachment, DashboardStats } from "@/lib/supabase/queries.server";

/** Subscribe to inserts on `comments` for a task. Returns an unsubscribe fn. */
export function subscribeToTaskComments(
  taskId: string,
  onInsert: (comment: Comment) => void
): () => void {
  const supabase = createClient();
  const channel = supabase
    .channel(`comments:task=${taskId}`)
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "comments", filter: `task_id=eq.${taskId}` },
      (payload) => onInsert(payload.new as Comment)
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}

/** Subscribe to UPDATE events on a single task row. Returns an unsubscribe fn. */
export function subscribeToTask(taskId: string, onUpdate: (task: Task) => void): () => void {
  const supabase = createClient();
  const channel = supabase
    .channel(`task:${taskId}`)
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "tasks", filter: `id=eq.${taskId}` },
      (payload) => onUpdate(payload.new as Task)
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}
