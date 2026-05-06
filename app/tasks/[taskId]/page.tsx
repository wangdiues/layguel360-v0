import Link from "next/link";
import { notFound } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { CommentList } from "@/components/comments/CommentList";
import { AttachmentList } from "@/components/uploads/AttachmentList";
import { StatusBadge } from "@/components/ui/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  CalendarDays,
  ChevronRight,
  FolderKanban,
  User,
  Hash,
} from "lucide-react";
import {
  getAttachments,
  getComments,
  getProject,
  getTask,
} from "@/lib/supabase/queries.server";
import { EditTaskDialog } from "@/components/tasks/EditTaskDialog";

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) {
  const { taskId } = await params;

  const task = await getTask(taskId);
  if (!task) notFound();

  const [project, comments, attachments] = await Promise.all([
    task.project_id ? getProject(task.project_id) : Promise.resolve(null),
    getComments(taskId),
    getAttachments(taskId),
  ]);

  const created = new Date(task.created_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const detailRows = [
    { label: "Status",   content: <StatusBadge value={task.status} type="status" /> },
    { label: "Priority", content: <StatusBadge value={task.priority} type="priority" /> },
    { label: "Due Date", content: <span className="text-sm font-medium text-foreground">{task.due_date || "—"}</span> },
    { label: "Project",  content: <span className="text-sm font-medium text-foreground">{project?.title ?? "—"}</span> },
    { label: "Assignee", content: <span className="text-sm font-medium text-foreground">{task.assignee || "—"}</span> },
    { label: "Created",  content: <span className="text-sm text-muted-foreground">{created}</span> },
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
            <EditTaskDialog task={task} />
          </div>

          {/* Main grid */}
          <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
            <div className="space-y-6">
              {/* Detail table */}
              <Card>
                <CardHeader className="border-b border-white/[0.08] pb-4">
                  <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    <Hash className="h-4 w-4 text-primary" />
                    Task Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-white/[0.06]">
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

              <CommentList taskId={task.id} initialComments={comments} />
              <AttachmentList taskId={task.id} initialAttachments={attachments} />
            </div>

            {/* Summary sidebar */}
            <div className="space-y-4">
              <Card>
                <CardHeader className="border-b border-white/[0.08] pb-4">
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
                  <Separator className="bg-white/[0.08]" />
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
                  <Separator className="bg-white/[0.08]" />
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
