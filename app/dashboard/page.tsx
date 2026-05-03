import Link from "next/link";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getProjects, getTasks, getDashboardStats, Project, Task } from "@/lib/supabase/data";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  FolderKanban,
  TrendingUp,
} from "lucide-react";

export default async function DashboardPage() {
  let projects: Project[] = [];
  let tasks: Task[] = [];
  let stats = { totalProjects: 0, activeProjects: 0, totalTasks: 0, completedTasks: 0, inProgressTasks: 0 };

  try {
    [projects, tasks, stats] = await Promise.all([getProjects(), getTasks(), getDashboardStats()]);
  } catch (e) {
    console.error("Failed to fetch data:", e);
  }

  const recentProjects = projects.slice(0, 5);
  const activeTasks = tasks.filter((t) => t.status !== "Completed").slice(0, 5);

  const statCards = [
    {
      title: "Total Projects",
      value: stats.totalProjects,
      sub: `${stats.activeProjects} currently active`,
      icon: FolderKanban,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
      border: "border-l-indigo-500",
    },
    {
      title: "Active Projects",
      value: stats.activeProjects,
      sub: "Running now",
      icon: TrendingUp,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      border: "border-l-blue-500",
    },
    {
      title: "Pending Tasks",
      value: stats.totalTasks - stats.completedTasks - stats.inProgressTasks,
      sub: "Needs attention",
      icon: Clock,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      border: "border-l-amber-500",
    },
    {
      title: "Completed Tasks",
      value: stats.completedTasks,
      sub: "Well done",
      icon: CheckCircle2,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      border: "border-l-emerald-500",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="lg:pl-72">
        <Topbar />

        <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Good morning, Karma 👋
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Here&apos;s what&apos;s happening across your projects today.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={stat.title}
                  className={`rounded-2xl border-slate-100 border-l-4 shadow-sm ${stat.border}`}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-500">
                          {stat.title}
                        </p>
                        <p className="mt-1.5 text-4xl font-bold tracking-tight text-slate-900">
                          {stat.value}
                        </p>
                        <p className="mt-1.5 text-xs text-slate-400">{stat.sub}</p>
                      </div>
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${stat.iconBg}`}
                      >
                        <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid gap-6 xl:grid-cols-[3fr_2fr]">
            <Card className="rounded-2xl border-slate-100 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-4">
                <CardTitle className="text-base font-semibold text-slate-900">
                  Recent Projects
                </CardTitle>
                <Link
                  href="/projects"
                  className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700"
                >
                  View all <ArrowUpRight className="h-3 w-3" />
                </Link>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-50 hover:bg-transparent">
                      <TableHead className="pl-6 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                        Project
                      </TableHead>
                      <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                        Status
                      </TableHead>
                      <TableHead className="pr-6 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                        Due
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentProjects.map((project) => (
                      <TableRow
                        key={project.id}
                        className="border-slate-50 hover:bg-slate-50/60"
                      >
                        <TableCell className="pl-6">
                          <Link
                            href={`/projects/${project.id}`}
                            className="font-medium text-slate-800 transition-colors hover:text-indigo-600"
                          >
                            {project.title}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <StatusBadge value={project.status} type="status" />
                        </TableCell>
                        <TableCell className="pr-6 text-sm text-slate-500">
                          {project.end_date || "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-slate-100 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-4">
                <CardTitle className="text-base font-semibold text-slate-900">
                  Active Tasks
                </CardTitle>
                <Link
                  href="/tasks"
                  className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700"
                >
                  View all <ArrowUpRight className="h-3 w-3" />
                </Link>
              </CardHeader>
              <CardContent className="divide-y divide-slate-50 p-0">
                {activeTasks.map((task) => (
                  <Link key={task.id} href={`/tasks/${task.id}`}>
                    <div className="flex items-start gap-3 px-5 py-4 transition-colors hover:bg-slate-50/60">
                      <div className="mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 border-slate-200" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-800">
                          {task.title}
                        </p>
                        <div className="mt-1.5 flex items-center gap-2">
                          <StatusBadge value={task.priority} type="priority" />
                          <span className="text-xs text-slate-400">
                            Due {task.due_date || "—"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}