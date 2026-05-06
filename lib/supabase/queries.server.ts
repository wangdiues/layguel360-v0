import "server-only";

import { createClient } from "@/lib/supabase/server";

// ───────────────────────────────────────────────────────────────────────────
// Server-only Supabase query helpers.
//
// Each helper opens a request-scoped server client (the one in `server.ts`
// that reads/writes Next.js cookies) so RLS sees the caller's session. RSC
// pages and server actions should import from here exclusively. Client
// components MUST import from `queries.client.ts` instead — the
// `import "server-only"` above will throw at build time if this module is
// pulled into a client bundle.
// ───────────────────────────────────────────────────────────────────────────

export type Project = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  start_date: string | null;
  end_date: string | null;
  department: string | null;
  manager: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type Task = {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  due_date: string | null;
  assignee: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type Comment = {
  id: string;
  task_id: string;
  author_id: string | null;
  author: string;
  text: string;
  created_at: string;
};

export type Attachment = {
  id: string;
  task_id: string;
  uploader_id: string | null;
  filename: string;
  file_type: string | null;
  file_size: string | null;
  storage_path: string | null;
  created_at: string;
};

export type Profile = {
  id: string;
  name: string;
  email: string;
  role: string | null;
  department: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
};

export type DashboardStats = {
  totalProjects: number;
  activeProjects: number;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
};

// ── Projects ───────────────────────────────────────────────────────────────

export async function getProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Project[];
}

export async function getProject(id: string): Promise<Project | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();

  if (error) throw error;
  return (data ?? null) as Project | null;
}

// ── Tasks ──────────────────────────────────────────────────────────────────

export async function getTasks(projectId?: string): Promise<Task[]> {
  const supabase = await createClient();
  let query = supabase.from("tasks").select("*").order("created_at", { ascending: false });

  if (projectId) query = query.eq("project_id", projectId);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Task[];
}

export async function getTask(id: string): Promise<Task | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("tasks").select("*").eq("id", id).maybeSingle();

  if (error) throw error;
  return (data ?? null) as Task | null;
}

// ── Comments ───────────────────────────────────────────────────────────────

export async function getComments(taskId: string): Promise<Comment[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("task_id", taskId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Comment[];
}

// ── Attachments ────────────────────────────────────────────────────────────

export async function getAttachments(taskId: string): Promise<Attachment[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("attachments")
    .select("*")
    .eq("task_id", taskId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Attachment[];
}

// ── Profile ────────────────────────────────────────────────────────────────

export type CurrentUserDisplay = {
  name: string;
  role: string;
  email: string;
  initials: string;
};

export async function getCurrentUserDisplay(): Promise<CurrentUserDisplay | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, role")
    .eq("id", user.id)
    .maybeSingle();

  const name: string = profile?.name ?? user.email ?? "Account";
  const role: string = profile?.role ?? "Member";
  const email = user.email ?? "";
  const initials =
    name
      .split(/\s+/)
      .filter((part: string) => part.length > 0)
      .map((part: string) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";

  return { name, role, email, initials };
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  return (data ?? null) as Profile | null;
}

// ── Dashboard ──────────────────────────────────────────────────────────────

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();

  const [projectsRes, tasksRes] = await Promise.all([
    supabase.from("projects").select("id, status"),
    supabase.from("tasks").select("id, status"),
  ]);

  if (projectsRes.error) throw projectsRes.error;
  if (tasksRes.error) throw tasksRes.error;

  const projects = projectsRes.data ?? [];
  const tasks = tasksRes.data ?? [];

  return {
    totalProjects: projects.length,
    activeProjects: projects.filter((p) => p.status === "Active").length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter((t) => t.status === "Completed").length,
    inProgressTasks: tasks.filter((t) => t.status === "In Progress").length,
    pendingTasks: tasks.filter((t) => t.status === "Pending").length,
  };
}
