import Link from "next/link";
import { notFound } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Circle,
  FolderKanban,
  User,
  Pencil,
} from "lucide-react";
import { getProject, getTasks, Task } from "@/lib/supabase/data";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  let project = null;
  let tasks: Task[] = [];

  try {
    [project, tasks] = await Promise.all([getProject(projectId), getTasks(projectId)]);
  } catch {
    // graceful fallback
  }

  if (!project) notFound();

  const projectTasks = tasks.filter((t) => t.project_id === projectId);
  const tasksTotal = projectTasks.length;
  const tasksCompleted = projectTasks.filter((t) => t.status === "Completed").length;
  const progress = tasksTotal > 0 ? Math.round((tasksCompleted / tasksTotal) * 100) : 0;

  return (
    <div className="min-h-screen">
      <Sidebar />

      <main className="min-h-screen lg:pl-72">
        <Topbar />

        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5">
            <Link
              href="/projects"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Projects
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="max-w-xs truncate text-sm font-medium text-foreground">
              {project.title}
            </span>
          </nav>

          {/* Hero card */}
          <div className="flex flex-col justify-between gap-4 rounded-xl border border-white/[0.08] bg-white/[0.05] backdrop-blur-md p-6 md:flex-row md:items-start">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge value={project.status} type="status" />
                {project.priority && (
                  <StatusBadge value={project.priority} type="priority" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                  {project.title}
                </h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                  {project.description || "No description provided."}
                </p>
              </div>
            </div>
            <Button variant="outline" className="gap-2 shrink-0">
              <Pencil className="h-3.5 w-3.5" />
              Edit Project
            </Button>
          </div>

          {/* Main grid */}
          <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
            {/* Tasks list */}
            <Card className="rounded-xl shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 border-b border-border pb-4">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <FolderKanban className="h-4 w-4 text-primary" />
                  Tasks
                </CardTitle>
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                  {tasksCompleted}/{tasksTotal} completed
                </span>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                {projectTasks.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    No tasks yet.
                  </p>
                ) : (
                  projectTasks.map((task) => (
                    <Link key={task.id} href={`/tasks/${task.id}`}>
                      <div className="flex flex-col gap-3 rounded-xl border border-white/[0.07] bg-white/[0.04] p-4 transition-colors hover:bg-white/[0.07] sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-3">
                          {task.status === "Completed" ? (
                            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                          ) : (
                            <Circle className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground/40" />
                          )}
                          <div>
                            <p className="font-medium text-foreground">{task.title}</p>
                            <p className="mt-0.5 text-sm text-muted-foreground">
                              {task.assignee || "Unassigned"} · Due {task.due_date || "—"}
                            </p>
                          </div>
                        </div>
                        <StatusBadge value={task.status} type="status" />
                      </div>
                    </Link>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Sidebar details */}
            <div className="space-y-4">
              <Card className="rounded-xl shadow-sm">
                <CardHeader className="border-b border-border pb-4">
                  <CardTitle className="text-base font-semibold">
                    Project Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-5">
                  {/* Progress */}
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold text-foreground">{progress}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-start gap-3">
                    <CalendarDays className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Start Date
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-foreground">
                        {project.start_date || "—"}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-start gap-3">
                    <CalendarDays className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        End Date
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-foreground">
                        {project.end_date || "—"}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-start gap-3">
                    <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Project Manager
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-foreground">
                        {project.manager || "—"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-xl shadow-sm">
                <CardHeader className="border-b border-border pb-4">
                  <CardTitle className="text-base font-semibold">Department</CardTitle>
                </CardHeader>
                <CardContent className="p-5">
                  <p className="text-sm text-foreground">
                    {project.department || "—"}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
