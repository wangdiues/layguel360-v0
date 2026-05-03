import { createClient } from "@/lib/supabase/client";

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
  created_at: string;
  updated_at: string;
};

export type Comment = {
  id: string;
  task_id: string;
  text: string;
  author: string;
  created_at: string;
};

export type Attachment = {
  id: string;
  task_id: string;
  filename: string;
  file_type: string | null;
  file_size: string | null;
  created_at: string;
};

export async function getProjects(): Promise<Project[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function getProject(id: string): Promise<Project | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();
  
  if (error) throw error;
  return data;
}

export async function getTasks(projectId?: string): Promise<Task[]> {
  const supabase = createClient();
  let query = supabase.from("tasks").select("*").order("created_at", { ascending: false });
  
  if (projectId) {
    query = query.eq("project_id", projectId);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getTask(id: string): Promise<Task | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", id)
    .single();
  
  if (error) throw error;
  return data;
}

export async function getComments(taskId: string): Promise<Comment[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("task_id", taskId)
    .order("created_at", { ascending: true });
  
  if (error) throw error;
  return data || [];
}

export async function getAttachments(taskId: string): Promise<Attachment[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("attachments")
    .select("*")
    .eq("task_id", taskId)
    .order("created_at", { ascending: true });
  
  if (error) throw error;
  return data || [];
}

export async function createProject(project: Partial<Project>): Promise<Project> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .insert(project)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function createTask(task: Partial<Task>): Promise<Task> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("tasks")
    .insert(task)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function addComment(taskId: string, text: string, author: string): Promise<Comment> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("comments")
    .insert({ task_id: taskId, text, author })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getDashboardStats() {
  const supabase = createClient();
  
  const [projectsRes, tasksRes] = await Promise.all([
    supabase.from("projects").select("id, status"),
    supabase.from("tasks").select("id, status"),
  ]);
  
  const projects = projectsRes.data || [];
  const tasks = tasksRes.data || [];
  
  return {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === "Active").length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === "Completed").length,
    inProgressTasks: tasks.filter(t => t.status === "In Progress").length,
  };
}