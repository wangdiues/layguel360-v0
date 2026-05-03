import Link from "next/link";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { getProjects, getTasks, getDashboardStats, Project, Task } from "@/lib/supabase/data";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  FolderKanban,
  TrendingUp,
  Plus,
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
      iconColor: "text-primary",
      iconBg: "bg-primary/10",
    },
    {
      title: "Active Projects",
      value: stats.activeProjects,
      sub: "Running now",
      icon: TrendingUp,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-500/10",
    },
    {
      title: "Pending Tasks",
      value: stats.totalTasks - stats.completedTasks - stats.inProgressTasks,
      sub: "Needs attention",
      icon: Clock,
      iconColor: "text-amber-500",
      iconBg: "bg-amber-500/10",
    },
    {
      title: "Completed Tasks",
      value: stats.completedTasks,
      sub: "Well done",
      icon: CheckCircle2,
      iconColor: "text-emerald-500",
      iconBg: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <div className="lg:pl-72">
        <Topbar />

        <main className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Hey Karma 👋
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Here's what's happening across your projects today.
              </p>
            </div>
            <Button className="w-fit gap-2">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </div>

          {/* Stat Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={stat.title}
                  className="rounded-xl border-border bg-card shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-muted-foreground">
                          {stat.title}
                        </p>
                        <p className="mt-1.5 text-4xl font-bold tracking-tight text-foreground">
                          {stat.value}
                        </p>
                        <p className="mt-1.5 text-xs text-muted-foreground">{stat.sub}</p>
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

          {/* Main Content Grid */}
          <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
            {/* Recent Projects */}
            <Card className="rounded-xl border-border bg-card shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-4">
                <CardTitle className="text-base font-semibold text-foreground">
                  Recent Projects
                </CardTitle>
                <Link
                  href="/projects"
                  className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  View all <ArrowUpRight className="h-3 w-3" />
                </Link>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border hover:bg-transparent">
                        <TableHead className="pl-6 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                          Project
                        </TableHead>
                        <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                          Status
                        </TableHead>
                        <TableHead className="pr-6 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                          Due
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentProjects.length > 0 ? (
                        recentProjects.map((project) => (
                          <TableRow
                            key={project.id}
                            className="border-border hover:bg-muted/50 transition-colors"
                          >
                            <TableCell className="pl-6">
                              <Link
                                href={`/projects/${project.id}`}
                                className="font-medium text-foreground transition-colors hover:text-primary"
                              >
                                {project.title}
                              </Link>
                            </TableCell>
                            <TableCell>
                              <Badge variant={project.status.toLowerCase() as any} className="capitalize">
                                {project.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="pr-6 text-sm text-muted-foreground">
                              {project.end_date || "—"}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                            No recent projects found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Active Tasks */}
            <Card className="rounded-xl border-border bg-card shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-4">
                <CardTitle className="text-base font-semibold text-foreground">
                  Active Tasks
                </CardTitle>
                <Link
                  href="/tasks"
                  className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  View all <ArrowUpRight className="h-3 w-3" />
                </Link>
              </CardHeader>
              <CardContent className="divide-y divide-border p-0">
                {activeTasks.length > 0 ? (
                  activeTasks.map((task) => (
                    <Link key={task.id} href={`/tasks/${task.id}`} className="block">
                      <div className="flex items-start gap-3 px-5 py-4 transition-colors hover:bg-muted/50">
                        <div className="mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 border-primary/30" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-foreground">
                            {task.title}
                          </p>
                          <div className="mt-1.5 flex items-center gap-2">
                            <Badge variant={task.priority.toLowerCase() as any} className="capitalize">
                              {task.priority}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              Due {task.due_date || "—"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="px-5 py-8 text-center text-muted-foreground text-sm">
                    No active tasks found.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
