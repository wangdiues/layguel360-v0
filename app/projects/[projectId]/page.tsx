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
} from "lucide-react";
import { mockProjects, mockTasks } from "@/lib/mock-data";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  const project = mockProjects.find((p) => p.id === projectId);
  if (!project) notFound();

  const tasks = mockTasks.filter((t) => t.project_id === projectId);
  const tasksTotal = tasks.length;
  const tasksCompleted = tasks.filter((t) => t.status === "Completed").length;
  const progress =
    tasksTotal > 0 ? Math.round((tasksCompleted / tasksTotal) * 100) : 0;

  return (
    <div className="min-h-screen bg-muted/30">
      <Sidebar />

      <main className="min-h-screen lg:pl-72">
        <Topbar />

        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5">
            <Link
              href="/projects"
              className="text-sm text-muted-foreground hover:text-slate-900"
            >
              Projects
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="max-w-xs truncate text-sm font-medium text-slate-900">
              {project.title}
            </span>
          </nav>

          <div className="flex flex-col justify-between gap-4 rounded-2xl border bg-background p-6 shadow-sm md:flex-row md:items-start">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge value={project.status} type="status" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                  {project.title}
                </h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                  {project.description}
                </p>
              </div>
            </div>
            <Button variant="outline">Edit Project</Button>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
            <div className="space-y-6">
              <Card className="rounded-2xl shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FolderKanban className="h-4 w-4" />
                    Tasks
                  </CardTitle>
                  <span className="text-sm text-muted-foreground">
                    {tasksCompleted} of {tasksTotal} completed
                  </span>
                </CardHeader>
                <CardContent className="space-y-3">
                  {tasks.length === 0 && (
                    <p className="py-6 text-center text-sm text-muted-foreground">
                      No tasks yet.
                    </p>
                  )}
                  {tasks.map((task) => (
                    <Link key={task.id} href={`/tasks/${task.id}`}>
                      <div className="flex flex-col gap-3 rounded-2xl border bg-background p-4 transition-colors hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-3">
                          {task.status === "Completed" ? (
                            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
                          ) : (
                            <Circle className="mt-0.5 h-5 w-5 shrink-0 text-slate-300" />
                          )}
                          <div>
                            <p className="font-medium">{task.title}</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {task.assignee} · Due {task.due_date}
                            </p>
                          </div>
                        </div>
                        <StatusBadge value={task.status} type="status" />
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="rounded-2xl shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">Project Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-indigo-600"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Start Date</p>
                      <p className="font-medium">{project.start_date}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">End Date</p>
                      <p className="font-medium">{project.end_date}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Project Manager</p>
                      <p className="font-medium">{project.manager}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">Department</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {project.department}
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
