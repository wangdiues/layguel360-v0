import Link from "next/link";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { mockProjects, mockTasks } from "@/lib/mock-data";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  FolderKanban,
  TrendingUp,
  Plus,
} from "lucide-react";

export default function DashboardPage() {
  const projects = mockProjects;
  const tasks = mockTasks;

  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter((p) => p.status === "Active").length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter((t) => t.status === "Completed").length,
    inProgressTasks: tasks.filter((t) => t.status === "In Progress").length,
  };

  const recentProjects = projects.slice(0, 5);
  const activeTasks = tasks.filter((t) => t.status !== "Completed").slice(0, 5);
  const pendingTasks =
    stats.totalTasks - stats.completedTasks - stats.inProgressTasks;

  const statCards = [
    {
      title: "Total Projects",
      value: stats.totalProjects,
      sub: `${stats.activeProjects} active`,
      icon: FolderKanban,
      iconColor: "text-primary",
      iconBg: "bg-primary/10",
      border: "border-l-primary",
    },
    {
      title: "Active Projects",
      value: stats.activeProjects,
      sub: "Running now",
      icon: TrendingUp,
      iconColor: "text-sky-400",
      iconBg: "bg-sky-500/10",
      border: "border-l-sky-500",
    },
    {
      title: "Pending Tasks",
      value: pendingTasks,
      sub: "Needs attention",
      icon: Clock,
      iconColor: "text-amber-400",
      iconBg: "bg-amber-500/10",
      border: "border-l-amber-500",
    },
    {
      title: "Completed Tasks",
      value: stats.completedTasks,
      sub: "All time",
      icon: CheckCircle2,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/10",
      border: "border-l-emerald-500",
    },
  ];

  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="lg:pl-72">
        <Topbar />
        <main className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Hey, Karma 👋
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Here&apos;s what&apos;s happening across your projects today.
              </p>
            </div>
            <Link href="/projects">
              <Button className="w-fit gap-2">
                <Plus className="h-4 w-4" />
                New Project
              </Button>
            </Link>
          </div>

          {/* Stat Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={stat.title}
                  className={`border-l-4 ${stat.border}`}
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
                        <p className="mt-1.5 text-xs text-muted-foreground">
                          {stat.sub}
                        </p>
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

          {/* Main Grid */}
          <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
            {/* Recent Projects */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between border-b border-white/[0.08] pb-4">
                <CardTitle className="text-base font-semibold">
                  Recent Projects
                </CardTitle>
                <Link
                  href="/projects"
                  className="flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80"
                >
                  View all <ArrowUpRight className="h-3 w-3" />
                </Link>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-white/[0.06]">
                      <TableHead className="pl-6 text-[11px] font-semibold uppercase tracking-wide">
                        Project
                      </TableHead>
                      <TableHead className="text-[11px] font-semibold uppercase tracking-wide">
                        Status
                      </TableHead>
                      <TableHead className="pr-6 text-[11px] font-semibold uppercase tracking-wide">
                        Due
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentProjects.map((project) => (
                      <TableRow key={project.id} className="border-white/[0.06]">
                        <TableCell className="pl-6">
                          <Link
                            href={`/projects/${project.id}`}
                            className="font-medium text-foreground transition-colors hover:text-primary"
                          >
                            {project.title}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <StatusBadge value={project.status} type="status" />
                        </TableCell>
                        <TableCell className="pr-6 text-sm text-muted-foreground">
                          {project.end_date || "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Active Tasks */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between border-b border-white/[0.08] pb-4">
                <CardTitle className="text-base font-semibold">
                  Active Tasks
                </CardTitle>
                <Link
                  href="/tasks"
                  className="flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80"
                >
                  View all <ArrowUpRight className="h-3 w-3" />
                </Link>
              </CardHeader>
              <CardContent className="divide-y divide-white/[0.06] p-0">
                {activeTasks.map((task) => (
                  <Link key={task.id} href={`/tasks/${task.id}`} className="block">
                    <div className="flex items-start gap-3 px-5 py-4 transition-colors hover:bg-white/[0.04]">
                      <div className="mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 border-primary/30" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {task.title}
                        </p>
                        <div className="mt-1.5 flex items-center gap-2">
                          <StatusBadge value={task.priority} type="priority" />
                          <span className="text-xs text-muted-foreground">
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
