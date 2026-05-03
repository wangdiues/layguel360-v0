import Link from "next/link";
import { notFound } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { CommentList } from "@/components/comments/CommentList";
import { AttachmentList } from "@/components/uploads/AttachmentList";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  CalendarDays,
  ChevronRight,
  FolderKanban,
  User,
  Pencil,
  Hash,
} from "lucide-react";
import {
  getTask,
  getProject,
  getComments,
  getAttachments,
  Comment,
  Attachment,
  Task,
  Project,
} from "@/lib/supabase/data";

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) {
  const { taskId } = await params;

  let task: Task | null = null;
  let project: Project | null = null;
  let comments: Comment[] = [];
  let attachments: Attachment[] = [];

  try {
    [task, comments, attachments] = await Promise.all([
      getTask(taskId),
      getComments(taskId),
      getAttachments(taskId),
    ]);
    if (task) {
      project = await getProject(task.project_id);
    }
  } catch {
    // graceful fallback
  }

  if (!task) notFound();

  const created = new Date(task.created_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const detailRows = [
    { label: "Status",        content: <StatusBadge value={task.status} type="status" /> },
    { label: "Priority",      content: <StatusBadge value={task.priority} type="priority" /> },
    { label: "Due Date",      content: <span className="text-sm font-medium text-foreground">{task.due_date || "—"}</span> },
    { label: "Project",       content: <span className="text-sm font-medium text-foreground">{project?.title ?? "—"}</span> },
    { label: "Assignee",      content: <span className="text-sm font-medium text-foreground">{task.assignee || "—"}</span> },
    { label: "Created",       content: <span className="text-sm text-muted-foreground">{created}</span> },
  ];

  return (
    <div className="min-h-screen">
      <Sidebar />

      <main className="min-h-screen lg:pl-72">
        <Topbar />

        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5">
            <Link
              href="/tasks"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Tasks
            </Link>
            {project && (
              <>
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <Link
                  href={`/projects/${project.id}`}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {project.title}
                </Link>
              </>
            )}
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="max-w-xs truncate text-sm font-medium text-foreground">
              {task.title}
            </span>
          </nav>

          {/* Hero card */}
          <div className="flex flex-col justify-between gap-4 rounded-xl border border-white/[0.08] bg-white/[0.05] backdrop-blur-md p-6 md:flex-row md:items-start">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge value={task.status} type="status" />
                <StatusBadge value={task.priority} type="priority" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                  {task.title}
                </h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                  {task.description || "No description provided."}
                </p>
              </div>
            </div>
            <Button variant="outline" className="gap-2 shrink-0">
              <Pencil className="h-3.5 w-3.5" />
              Edit Task
            </Button>
          </div>

          {/* Main grid */}
          <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
            <div className="space-y-6">
              {/* Detail table */}
              <Card className="rounded-xl shadow-sm">
                <CardHeader className="border-b border-border pb-4">
                  <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    <Hash className="h-4 w-4 text-primary" />
                    Task Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {detailRows.map((row) => (
                      <div
                        key={row.label}
                        className="flex items-center gap-4 px-5 py-3"
                      >
                        <span className="w-36 shrink-0 text-sm text-muted-foreground">
                          {row.label}
                        </span>
                        {row.content}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <CommentList initialComments={comments} />
              <AttachmentList initialAttachments={attachments} />
            </div>

            {/* Summary sidebar */}
            <div className="space-y-4">
              <Card className="rounded-xl shadow-sm">
                <CardHeader className="border-b border-border pb-4">
                  <CardTitle className="text-base font-semibold">Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-5">
                  <div className="flex items-start gap-3">
                    <CalendarDays className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Due Date
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-foreground">
                        {task.due_date || "—"}
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <FolderKanban className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Project
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-foreground">
                        {project?.title ?? "—"}
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Assignee
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-foreground">
                        {task.assignee || "—"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
